import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({ text = "Loading Glamour Haven..." }) {
  return (
    <div className="spinner-container">
      <div className="rose-spinner">
        <span className="spinner-petals">🌸</span>
      </div>
      <p className="spinner-text">{text}</p>
    </div>
  );
}
