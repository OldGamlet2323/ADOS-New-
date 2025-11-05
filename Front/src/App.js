import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPanel from './components/LoginPanel';
import AdminPanel from './components/AdminPanel';
import './App.css';
import { useState, useEffect } from "react";
import MainLayout from './components/MainLayout';
import DutyLayout from './components/DutyLayout';
import CommandantPage from './components/CommandantPage';
import StaffPage from './components/StaffPage';
import AlertsMapPage from './components/AlertsMapPage'
import Checkpoint from './components/Checkpoint';
import PersonnelTable from "./components/PersonnelTable";

function App() {
  const [events, setEvents] = useState([]);
  // Видаляємо стани, які переїхали в хук
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/events", {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    if (token) {
      fetchEvents();
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route
          path="/dutyOfficer"
          element={<DutyLayout events={events} />}
        />
        <Route
          path="/checkpointOfficer"
          element={<Checkpoint />}
        />
        <Route
          path="/alerts-map"
          element={<AlertsMapPage />}
        />
        <Route
          path="/staffOfficer"
          element={<StaffPage events={events} />}
        />
        <Route
          path="/сommandantOfficer"
          element={<CommandantPage events={events} />}
        />
        <Route path="/admin" element={<LoginPanel />} />
        <Route path="/adminPanel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;