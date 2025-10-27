import React from "react";

const Navbar = ({ events, currentEventIndex, timeLeft }) => {
  // ПЕРЕВІРКА: Переконуємося, що дані готові до відображення
  if (!events || events.length === 0 || !events[currentEventIndex]) {
    return (
      <div className="navbar">
        <div>Loading...</div>
      </div>
    );
  }

  // Якщо перевірка пройдена, ми можемо безпечно отримати доступ до даних
  const currentEvent = events[currentEventIndex];

  return (
    <div className="navbar">
      <div>
        <h2>{currentEvent.eventName}</h2>
        <div>
          {timeLeft.hours} год. {timeLeft.minutes} хв. {timeLeft.seconds} с.
        </div>
      </div>
    </div>
  );
};

export default Navbar;