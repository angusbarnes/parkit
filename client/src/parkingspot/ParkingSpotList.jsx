import GridContainer from "../layout/GridContainer";
import React, { useState, useCallback, useEffect } from "react";
import Park from "./Park";

function ParkingModal({ isOpen, onClose, onSubmit }) {
    const [name, setName] = useState("");
    const [reservationDate, setReservationDate] = useState("");
  
    const handleSubmit = () => {
      // Perform the booking or reservation logic here
      onSubmit(name, reservationDate);
      onClose();
    };
  
    return (
      <div className={`modal ${isOpen ? "open" : ""}`}>
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
  
  function ParkingSpotButton({ parkingId, onClickHandler, color }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const handleButtonClick = () => {
      setIsModalOpen(true);
    };
  
    const handleModalClose = () => {
      setIsModalOpen(false);
    };
  
    return (
      <div>
        <button onClick={handleButtonClick} style={{ backgroundColor: color }}>
          {color == "#ff0000" ? "Cancel" : "Book"} Parking Spot {parkingId + 1}
        </button>
        <ParkingModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={(name, reservationDate) => {
            // Handle booking/reservation logic here and pass data to your parent component or API
            console.log(
              `Booking for Parking Spot ${parkingId}: Name - ${name}, Date - ${reservationDate}`
            );
            onClickHandler(parkingId);
          }}
        />
      </div>
    );
  }
  
  function ParkingSpotList({ numberOfSpots, parkingStateHandler, available }) {
    // Create an array of parking spot IDs based on the numberOfSpots configuration
    const parkingSpotIds = Array.from({ length: numberOfSpots }, (_, index) => index);
  
    console.log(`Array: ${available}`);
    return (
      <GridContainer>
        {parkingSpotIds.map((id) => (
          // <ParkingSpotButton
          //     key={id}
          //     parkingId={id}
          //     onClickHandler={handleParkingSpotClick}
          //     color={available[id] == 1 ? "#ff0000" : "#0000ff"}
          // />
          <Park
            key={id}
            id={id}
            toggleStateFunction={parkingStateHandler}
            state={available[id] == 1 ? false : true}
          />
        ))}
      </GridContainer>
    );
  }

  export default ParkingSpotList;