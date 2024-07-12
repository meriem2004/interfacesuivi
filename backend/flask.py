import datetime
from flask import Flask, render_template,request,jsonify
import requests
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Define your API endpoints
API_ENDPOINTS = {
    #"Ompic_Typage_With_Simplifie": "http://10.1.23.10:8011/",
    #"Ompic_inference_passif": "http://10.1.23.10:8012/",
    # "highco_belg": "http://10.1.11.35:8017/",
    # "highco_france": "http://10.1.11.35:8016/",
    # ...
}

api_status_history = {name: {'last_down_time': None, 'last_activate_time': None} for name in API_ENDPOINTS}


JSONL_FILE = "downtime_data.jsonl"

@app.route('/')
def index():
    return 'Welcome to API Monitor!'

@app.route('/check')
def check_apis():
    api_statuses = {}
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    downtime_data = {name: [] for name in API_ENDPOINTS}  
    for name, url in API_ENDPOINTS.items():
        address_port_parts = url.split(':')
        address = address_port_parts[0]
        port = address_port_parts[1] if len(address_port_parts) > 1 else ''
        
        
        try:
            response = requests.get(url)
            if response.status_code == 200:
                api_statuses[name] = {
                    'status': True,
                    'address': address,
                    'port': port,
                    'last_checked': current_time,
                    'last_down_time': api_status_history[name]['last_down_time'],  
                    'last_activate_time': api_status_history[name]['last_activate_time']  
                }

                api_status_history[name]['last_activate_time'] = current_time
            else:
                api_statuses[name] = {
                    'status': False,
                    'address': address,
                    'port': port,
                    'last_checked': current_time,
                    'last_down_time': current_time,  # Record current time as last down time
                    'last_activate_time': api_status_history[name]['last_activate_time']  # Add last activate time
                }
                # If the API is down, update the last down time
                api_status_history[name]['last_down_time'] = current_time
                # Record downtime data
                downtime_data[name].append({'date': current_time, 'status': 'down'})
        except Exception as e:
            api_statuses[name] = {
                'status': False,
                'address': address,
                'port': port,
                'last_checked': current_time,
                'last_down_time': current_time,  # Record current time as last down time
                'last_activate_time': api_status_history[name]['last_activate_time']  # Add last activate time
            }
            # If there's an exception (API not reachable), update the last down time
            api_status_history[name]['last_down_time'] = current_time
            # Record downtime data
            downtime_data[name].append({'date': current_time, 'status': 'down'})

    downtime_json = json.dumps(downtime_data)
    return render_template('status.html', api_statuses=api_statuses, downtime_data=downtime_json)

@app.route('/filter', methods=['GET'])
def filter_apis():
    status_filter = request.args.get('status')
    if status_filter == 'all':
        return jsonify({'filtered_apis': list(API_ENDPOINTS.keys())})
    
    filtered_apis = [name for name, data in api_status_history.items() if 
                     (status_filter == 'active' and data['last_activate_time']) or 
                     (status_filter == 'inactive' and data['last_down_time'])]

    return jsonify({'filtered_apis': filtered_apis})  

def write_to_jsonl(data):
    """Write downtime data to a JSONL file."""
    with open(JSONL_FILE, 'a') as f:
        for api_name, entries in data.items():
            for entry in entries:
                json.dump({'api_name': api_name, 'date': entry['date'], 'status': entry['status']}, f)
                f.write('\n')


if __name__ == '__main__':
    if os.path.exists(JSONL_FILE):
        os.remove(JSONL_FILE)
    app.run(debug=True)
