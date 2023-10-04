import logo from "./Parkit.png";
import "./App.css";
import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Navbar from "./navbar/Navbar";
import ContentBox from "./layout/ContentBox";
import GridContainer from "./layout/GridContainer";
import Park from "./parkingspot/Park";

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

function App() {
    const [socketUrl, setSocketUrl] = useState("ws://www.parkit.cc");
    const [messageHistory, setMessageHistory] = useState([]);
    const [availabilityData, setAvailabilityData] = useState([]);
    const [connectionCount, setConnectionCount] = useState(0);

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    useEffect(() => {
        if (lastMessage !== null) {
            const { type, data } = JSON.parse(lastMessage.data);
            console.log(`Message Received: ${type} with ${data}`);
            
            switch (type) {
              case "STATE_UPDATE":
              case "INITIAL_STATE":
                setAvailabilityData(data);
                console.log("availabilityData updated on parent.");
                break;
            
              case "CONNECTION_COUNT":
                setConnectionCount(data);
                break;
            
              default:
                console.warn(`Unhandled message type: ${type}`);
                break;
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

    const handleParkingSpotInteraction = useCallback(
        (id, value) =>
            sendMessage(
                JSON.stringify({
                    type: "UPDATE_CELL_REQUEST",
                    cell_id: id,
                    body: { cell_state: value ? 1 : 0 },
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
            <Navbar
                logo={logo}
                resetButtonCallback={() => {
                    sendMessage(JSON.stringify({ type: "RESET_STATE" }));
                }}
            ></Navbar>
            <ContentBox>
                <p>
                    <b>Please Select from the available slots:</b>
                </p>
                <ParkingSpotList
                    numberOfSpots={10}
                    parkingStateHandler={handleParkingSpotInteraction}
                    available={availabilityData}
                />
            </ContentBox>
            <ContentBox color="-dark">
                <p>
                    {connectionStatus == "Open"
                        ? "🟢 Connected to Parking Server. "
                        : "🔴 Parking Server could not be reached. "}
                    There are currently {connectionCount} connected clients.
                </p>
            </ContentBox>
        </div>
    );
}

export default App;
