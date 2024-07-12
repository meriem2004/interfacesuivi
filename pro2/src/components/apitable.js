import React from 'react';
import PropTypes from 'prop-types';
import './ApiTable.css'
const ApiTable = ({ apiStatuses }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>API Name</th>
            <th>Status</th>
            <th>Address</th>
            <th>Port</th>
            <th>Last Down Time</th>
            <th>Last Activate Time</th>
            <th>Last Checked</th>
          </tr>
        </thead>
        <tbody>
          {apiStatuses.map((api) => (
            <tr key={api.name}>
              <td>{api.name}</td>
              <td>
                {api.status ? (
                  <span style={{ color: 'green' }}>&#x25CF; Running</span>
                ) : (
                  <span style={{ color: 'red' }}>&#x25CF; Down</span>
                )}
              </td>
              <td>{api.address}</td>
              <td>{api.port}</td>
              <td>{api.last_down_time || 'N/A'}</td>
              <td>{api.last_activate_time || 'N/A'}</td>
              <td>{api.last_checked}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ApiTable.propTypes = {
  apiStatuses: PropTypes.array.isRequired,
};

export default ApiTable;
