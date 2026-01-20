import React from "react";
import "../../styles/heartbeat.css";

const HeartLoader = () => {
  // Heart shape path
  const heartPath =
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

  return (
    <div className="heartloader-screen">
      <div className="heartloader-container">
        {/* Heart Shape */}
        <svg viewBox="0 0 24 24" className="heart-svg">
          <path d={heartPath} className="heart-border" />
        </svg>

        {/* Heartbeat line */}
        <svg viewBox="0 0 100 50" className="heartbeat-svg">
          <polyline
            className="heartbeat-line"
            points="0,25 10,25 15,25 20,25 25,10 30,40 35,25 45,25 50,25 55,15 60,35 65,25 75,25 80,25 90,25 100,25"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeartLoader;
