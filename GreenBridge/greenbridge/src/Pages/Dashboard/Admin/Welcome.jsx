import React from 'react';
// import './welcome.css';

function Welcome() {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <div className="welcome-container">
      <div className="welcome-message">
        Welcome, <span>{user?.email}</span>!
      </div>
    </div>
  );
}

export default Welcome;