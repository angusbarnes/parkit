import logo from "./Parkit.png";
import "./App.css";
import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

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
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
      <button onClick={handleButtonClick} style={{backgroundColor: color}}>
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

const Navbar = ({resetButtonCallback}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <a href="/">
            <img src={logo}></img>
          </a>
        </div>
        <div className={`navbar-links ${isNavOpen ? "open" : ""}`}>
          <a href="/">Home</a>
          <a href="/" onClick={resetButtonCallback}>Reset</a>
          <a href="/contact">Contact</a>
        </div>
        <div className="navbar-toggle" onClick={toggleNav}>
          <div className={`bar ${isNavOpen ? "open" : ""}`}></div>
          <div className={`bar ${isNavOpen ? "open" : ""}`}></div>
          <div className={`bar ${isNavOpen ? "open" : ""}`}></div>
        </div>
      </div>
    </nav>
  );
};

function ParkingSpotList({ numberOfSpots, handleParkingSpotClick, available }) {
  // Create an array of parking spot IDs based on the numberOfSpots configuration
  const parkingSpotIds = Array.from(
    { length: numberOfSpots },
    (_, index) => index
  );

  console.log(`Array: ${available}`)
  return (
    <div>
      {parkingSpotIds.map((id) => (
        <ParkingSpotButton
          key={id}
          parkingId={id}
          onClickHandler={handleParkingSpotClick}
          color={available[id] == 1 ? "#ff0000" : "#0000ff"}
        />
      ))}
    </div>
  );
}

const Content = ({ children, color = "" }) => {
  return <div className={`content-container${color}`}>{children}</div>;
};

function App() {
  const [socketUrl, setSocketUrl] = useState("ws://webtest.astr0.net:80");
  const [messageHistory, setMessageHistory] = useState([]);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [connectionCount, setConnectionCount] = useState(0)
  let cellStates = Array(10).fill(0);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
      const {type, data} = JSON.parse(lastMessage.data);
      console.log(`Message Recieved: ${type} with ${data}`)
      if (type == "STATE_UPDATE" || type == "INITIAL_STATE") {
        setAvailabilityData(data)
        console.log(`availabilityData updated on parent. Should now be: $`)
      } else if (type == "CONNECTION_COUNT") {
        setConnectionCount(data);
      }
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickSendMessage = useCallback(
    (id) =>
      sendMessage(
        JSON.stringify({
          type: "UPDATE_CELL_REQUEST",
          cell_id: id,
          body: { cell_state: 1 },
        })
      ),
    []
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div>
      <Navbar resetButtonCallback={() => {sendMessage(JSON.stringify({type: "RESET_STATE"}))}}></Navbar>
      <Content>
        <p>
          <b>Please Select from the available slots:</b>
        </p>
        <ParkingSpotList
          numberOfSpots={10}
          handleParkingSpotClick={handleClickSendMessage}
          available={availabilityData}
        />
        {/* <ul>
          {messageHistory.map((message, idx) => (
            <p key={idx}>{message ? message.data : null}</p>
          ))}
        </ul> */}
      </Content>
      <Content color="-dark">
        <p>
          {connectionStatus == "Open"
            ? "🟢 Connected to Parking Server. "
            : "🔴 Parking Server could not be reached. "}
            There are currently {connectionCount} connected clients.
        </p> 
        
      </Content>
    </div>
  );
}

export default App;
