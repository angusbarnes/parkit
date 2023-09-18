import logo from './logo.svg';
import './App.css';
import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

function ParkingModal({ isOpen, onClose, onSubmit }) {
    const [name, setName] = useState('');
    const [reservationDate, setReservationDate] = useState('');

    const handleSubmit = () => {
        // Perform the booking or reservation logic here
        onSubmit(name, reservationDate);
        onClose();
    };

    return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
        <div className="modal-content">
        <h2>Book/Reserve Parking Spot</h2>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <label>Reservation Date:</label>
        <input
            type="date"
            value={reservationDate}
            onChange={(e) => setReservationDate(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Close</button>
        </div>
    </div>
    );
}

function ParkingSpotButton({ parkingId, onClickHandler }) {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleButtonClick = () => {
      setIsModalOpen(true);
    };
  
    const handleModalClose = () => {
      setIsModalOpen(false);
    };
  
    return (
        <div>
        <button onClick={handleButtonClick}>Book/Reserve Parking Spot {parkingId}</button>
        <ParkingModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={(name, reservationDate) => {
            // Handle booking/reservation logic here and pass data to your parent component or API
            console.log(`Booking for Parking Spot ${parkingId}: Name - ${name}, Date - ${reservationDate}`);
            onClickHandler(parkingId)
          }}
        />
      </div>
    );
  }
  
  function ParkingSpotList({ numberOfSpots, handleParkingSpotClick }) {
    // Create an array of parking spot IDs based on the numberOfSpots configuration
    const parkingSpotIds = Array.from({ length: numberOfSpots }, (_, index) => index);
  
    return (
      <div>
        {parkingSpotIds.map((id) => (
          <ParkingSpotButton
            key={id}
            parkingId={id}
            onClickHandler={handleParkingSpotClick}
          />
        ))}
      </div>
    );
  }

function App() {
    const [socketUrl, setSocketUrl] = useState('ws://localhost:80');
    const [messageHistory, setMessageHistory] = useState([]);
    let cellStates = Array(10).fill(0);
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

        useEffect(() => {
            if (lastMessage !== null) {
                setMessageHistory((prev) => prev.concat(lastMessage));
            }
        }, [lastMessage, setMessageHistory]);

        const handleClickSendMessage = useCallback((id) => sendMessage(
            JSON.stringify({type: "UPDATE_CELL_REQUEST", cell_id: id, body: {cell_state: 1}})
        ), []);

        const connectionStatus = {
            [ReadyState.CONNECTING]: 'Connecting',
            [ReadyState.OPEN]: 'Open',
            [ReadyState.CLOSING]: 'Closing',
            [ReadyState.CLOSED]: 'Closed',
            [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
        }[readyState];

    return (
        <div className="App-header">
            <div>
                <p></p>
                <p></p>
                <span>The WebSocket is currently {connectionStatus}</span>
                <ParkingSpotList numberOfSpots={10} handleParkingSpotClick={handleClickSendMessage}/>
                <ul>
                    {
                    messageHistory.map((message, idx) => (
                        <p key={idx}>{message ? message.data : null}</p>
                    ))
                    }
                </ul>
            </div>
        </div>
    );
}

export default App;
