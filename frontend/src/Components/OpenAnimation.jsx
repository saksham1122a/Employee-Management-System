import React, { useEffect, useState } from "react";
import "./OpenAnimation.css";

const OpenAnimation = ({ onFinish }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Start animation after mount
    setTimeout(() => {
      setAnimate(true);
    }, 500);

    // Finish after 2.6 seconds
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 2600);
  }, [onFinish]);

  return (
    <div className="open-animation-container">
      <div className={`logo-container ${animate ? "animate" : ""}`}>
        {/* Main Logo */}
        <img src="./src/assets/icon.png" alt="TEAMBUDDY" className="main-logo" />
        
        {/* Particle Effects */}
        <div className="particles">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
        
        {/* Ring Effects */}
        <div className="rings">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="ring ring-3"></div>
        </div>
        
        {/* Text Reveal */}
        <div className="brand-text">
          <span className="brand-name">TEAMBUDDY</span>
          <span className="tagline">Empower Your Workforce</span>
        </div>
      </div>
    </div>
  );
};

export default OpenAnimation;