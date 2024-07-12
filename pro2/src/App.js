import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiTable from './components/apitable';
import DowntimeChart from './components/downtime';
import NotificationButton from './components/notification-button';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';
const API_URL = 'http://localhost:5000/check';

const App = () => {
  const [apiStatuses, setApiStatuses] = useState([]);
  const [downtimeData, setDowntimeData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        setApiStatuses(response.data.api_statuses);
        setDowntimeData(JSON.parse(response.data.downtime_data));
      } catch (error) {
        console.error('Error fetching API data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds  

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleNotificationClick = () => {
    alert('Notifications clicked!');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const filteredApiStatuses = apiStatuses.filter((api) => {
    if (filter === 'all') return true;
    return filter === 'running' ? api.status : !api.status;
  });

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <h2>PROCHECK API Monitoring Dashboard</h2>
      <div>Test Div</div>
      <NotificationButton onClick={handleNotificationClick} />
      <button className="theme-toggle-button" onClick={toggleDarkMode}>
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
      <div className="filter-container">
        <label htmlFor="filter">Filter: </label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="running">Running</option>
          <option value="down">Down</option>
        </select>
      </div>
      <TransitionGroup>
        <CSSTransition key="apiTable" timeout={500} classNames="fade">
          <ApiTable apiStatuses={filteredApiStatuses} />
        </CSSTransition>
        <CSSTransition key="downtimeChart" timeout={500} classNames="fade">
          <DowntimeChart downtimeData={downtimeData} />
        </CSSTransition>
      </TransitionGroup>
      <footer>Data updates every 5 seconds</footer>
    </div>
  );
};

export default App;
