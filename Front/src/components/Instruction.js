import React, { useState, useEffect } from "react";

const Instruction = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [dataType, setDataType] = useState("instructions"); // State to track data type
  const token = localStorage.getItem('authToken')

  // Fetch data based on the selected dataType (instructions or signals)
  useEffect(() => {
    const fetchData = async () => {
      const endpoint = `http://localhost:8080/api/${dataType}`;
      try {
        const response = await fetch(endpoint, {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });
        const data = await response.json();
        setEvents(data); // Assuming your API returns an array of events/instructions/signals
      } catch (error) {
        console.error(`Error fetching ${dataType}:`, error);
      }
    };

    fetchData();
  }, [dataType]); // Fetch data whenever dataType changes

  const handleEventClick = async (eventId) => {
    setSelectedEvent(eventId);

    try {
      const response = await fetch(`http://localhost:8080/api/${dataType}/${eventId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      const data = await response.json();
      setEventDetails(data.description); // Assuming both instructions and signals have 'description'
    } catch (error) {
      console.error(`Error fetching ${dataType} details:`, error);
    }
  };

  // Filter events/signals based on the search term
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="instructions-wrapper">
      <div className="toggle-switch">
        <button
          onClick={() => setDataType("instructions")}
          className={`toggle-button ${dataType === "instructions" ? "active" : ""}`}
        >
          Інструкції
        </button>
        <button
          onClick={() => setDataType("signals")}
          className={`toggle-button ${dataType === "signals" ? "active" : ""}`}
        >
          Сигнали
        </button>
      </div>


      <div className="search-input-container">
        <input
          type="text"
          placeholder={`Пошук ${dataType === "instructions" ? "інструкції" : "сигналу"}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <h2>{dataType === "instructions" ? "Інструкції" : "Сигнали"}</h2>
      </div>

      <div className="instructions-container">
        <div className="instructions">
          <ul>
            {filteredEvents.map((event) => (
              <li key={event.id} onClick={() => handleEventClick(event.id)}>
                {event.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="instructions-description">
          {eventDetails ? (
            <p>{eventDetails}</p>
          ) : (
            <p>Оберіть {dataType === "instructions" ? "інструкцію" : "сигнал"}.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Instruction;
