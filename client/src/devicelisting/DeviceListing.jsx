import React from 'react';
import "./device-listing.css"

const DeviceListing = ({ deviceName, deviceIP, onlineStatus }) => {
  return (
    <div className="device-listing">
      <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {/* Your SVG paths go here */}
      </svg>
      <div className="device-info">
        <p className="device-name">{deviceName}</p>
        <p className="device-ip">{deviceIP}</p>
        <p className={`online-status ${onlineStatus ? 'online' : 'offline'}`}>
          {onlineStatus ? 'Online' : 'Offline'}
        </p>
      </div>
      <svg className="settings-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {/* Your settings icon SVG paths go here */}
      </svg>
    </div>
  );
};

export default DeviceListing;