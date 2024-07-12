import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const DowntimeChart = ({ downtimeData }) => {
  if (!downtimeData || Object.keys(downtimeData).length === 0) {
    return <div>No downtime data available</div>;
  }
  const chartData = {
    datasets: Object.keys(downtimeData).map((apiName) => ({
      label: apiName,
      data: downtimeData[apiName].map((d) => ({ x: new Date(d.date), y: d.status === 'down' ? 1 : 0 })),
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      fill: false,
      steppedLine: true
    }))
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (value) => (value ? 'Down' : 'Up')
        }
      }
    }
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default DowntimeChart;
