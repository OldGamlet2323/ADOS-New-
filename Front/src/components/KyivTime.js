// src/components/KyivTime.js
import React, { useEffect, useState } from "react";

const KyivTime = () => {
  const [kyivTime, setKyivTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: "Europe/Kyiv",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      setKyivTime(new Intl.DateTimeFormat("uk-UA", options).format(new Date()));
    };

    updateTime(); // Initial call to set time immediately
    const timer = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(timer); // Clean up on unmount
  }, []);

  return (
    <div className="kyiv-time-section">
          <div className="kyiv-time">
              <h2>Астрономічний час:</h2>
                <div>{kyivTime}</div>
      </div>
    </div>
  );
};

export default KyivTime;
