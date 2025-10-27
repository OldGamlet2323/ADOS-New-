import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {

  const navigate = useNavigate(); // Ініціалізуємо useNavigate
  const [dataType, setDataType] = useState("events"); // Default to managing events
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState({
    id: "",
    name: "",
    description: "",
    eventName: "",
    eventTime: "",
    toWhom: "",
    reportName: ""
  });
  const [error, setError] = useState(null);

  const token = localStorage.getItem('authToken')

  // Fetch the data based on selected dataType
  useEffect(() => {
    const fetchData = async () => {
      setError(null); // Clear previous errors
      try {
        const response = await fetch(`http://localhost:8080/api/${dataType}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError("Error fetching data");
      }
    };

    fetchData();
  }, [dataType]);

  // Function to generate a random ID
  const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000); // Generates a random number between 0 and 999999
  };

  const handleAddData = async () => {
    // Check for required fields based on dataType
    let requiredFields;
    switch (dataType) {
      case "events":
        requiredFields = ["eventName", "eventTime"];
        break;
      case "instructions":
      case "signals":
        requiredFields = ["name", "description"];
        break;
      case "reports":
        requiredFields = ["toWhom", "reportName", "description"];
        break;
      default:
        return;
    }

    // Check if all required fields are filled
    if (requiredFields.some((field) => !newData[field])) {
      setError("Please fill in all required fields");
      return;
    }

    // Remove the `id` field to let the backend auto-generate it
    const { id, ...entryWithoutId } = newData; // This is correct


    console.log("Attempting to add new entry:", entryWithoutId); // Debug log for the new entry without ID

    try {
      const response = await fetch(`http://localhost:8080/api/${dataType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(entryWithoutId), // Send data without an ID field
      });

      console.log("Response status:", response.status); // Debug log for the response status

      if (response.ok) {
        const updatedData = await response.json();
        setData((prevData) => [...prevData, updatedData]); // Add the new item
        setNewData({
          id: "",
          name: "",
          description: "",
          eventName: "",
          eventTime: "",
          toWhom: "",
          reportName: ""
        }); // Clear input fields
      } else {
        const errorText = await response.text();
        console.error("Failed to add data:", errorText); // Log error details
        setError(`Failed to add data: ${errorText}`);
      }
    } catch (error) {
      console.error("Error adding new data:", error); // Log network or parsing errors
      setError(`Error adding new data: ${error.message}`);
    }
  };


  // Function to delete an entry
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/${dataType}/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.ok) {
        setData((prevData) => prevData.filter((item) => item.id !== id)); // Remove the item from state
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      setError("Error deleting item");
    }
  };
  const getHeaderText = (dataType) => {
    const typeMap = {
      instructions: "Інструкції",
      events: "Елемент розпорядку",
      reports: "Доповідь",
      signals: "Сигнал"
    };

    return typeMap[dataType] || dataType.charAt(0).toUpperCase() + dataType.slice(1);
  };

  const headerText = getHeaderText(dataType);

  const handleExitAdminPanel = () => {
    navigate('/сommandantOfficer'); // Або інший шлях до головного меню
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-panel">
        <h1>Панель Керування</h1>

        <div className="admin-controls">
          <button className={`toggle-button ${dataType === "events" ? "active" : ""}`} onClick={() => setDataType("events")}>
            Керування Розпорядком
          </button>
          <button className={`toggle-button ${dataType === "instructions" ? "active" : ""}`} onClick={() => setDataType("instructions")}>
            Керування Інструкціями
          </button>
          <button className={`toggle-button ${dataType === "signals" ? "active" : ""}`} onClick={() => setDataType("signals")}>
            Керування Сигналами
          </button>
          <button className={`toggle-button ${dataType === "reports" ? "active" : ""}`} onClick={() => setDataType("reports")}>
            Керування Доповідями
          </button>
          <button onClick={handleExitAdminPanel} className="btn btn-outline-secondary"> {/* Кнопка Bootstrap */}
            Вихід до меню
          </button>
        </div>

        <h2>{headerText}</h2>
        {error && <p>{error}</p>}

        <div className="data-wrapper">
          <div className="data-list">
            <ul>
              {data.map((item) =>
                dataType === "events" ? (
                  <li key={item.id}>
                    {item.eventName} - {item.eventTime}
                    <button className="delete-button" onClick={() => handleDelete(item.id)}>
                      Видалити
                    </button>
                  </li>
                ) : dataType === "reports" ? (
                  <li key={item.id}>
                    {item.reportName} - {item.description}
                    <button className="delete-button" onClick={() => handleDelete(item.id)}>
                      Видалити
                    </button>
                  </li>
                ) : (
                  <li key={item.id}>
                    {item.name} - {item.description}
                    <button className="delete-button" onClick={() => handleDelete(item.id)}>
                      Видалити
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="add-data">
            <h3>Додати {headerText}</h3>

            {/* Conditional rendering of input fields based on dataType */}
            {dataType === "events" && (
              <>
                <input
                  type="text"
                  placeholder="Назва події"
                  className="input-field"
                  value={newData.eventName}
                  onChange={(e) => setNewData({ ...newData, eventName: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Час події"
                  className="input-field"
                  value={newData.eventTime}
                  onChange={(e) => setNewData({ ...newData, eventTime: e.target.value })}
                />
              </>
            )}
            {(dataType === "instructions" || dataType === "signals") && (
              <>
                <input
                  type="text"
                  placeholder="Назва інструкції"
                  className="input-field"
                  value={newData.name}
                  onChange={(e) => setNewData({ ...newData, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Опис інструкції"
                  className="input-field"
                  value={newData.description}
                  onChange={(e) => setNewData({ ...newData, description: e.target.value })}
                />
              </>
            )}
            {dataType === "reports" && (
              <>
                <input
                  type="text"
                  placeholder="Назва доповіді"
                  className="input-field"
                  value={newData.reportName}
                  onChange={(e) => setNewData({ ...newData, reportName: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Кому доповідь"
                  className="input-field"
                  value={newData.toWhom}
                  onChange={(e) => setNewData({ ...newData, toWhom: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Опис доповіді"
                  className="input-field"
                  value={newData.description}
                  onChange={(e) => setNewData({ ...newData, description: e.target.value })}
                />
              </>
            )}

            <button className="add-button" onClick={handleAddData}>
              Додати
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;