import ContentBox from "../layout/ContentBox";
import ParkingSpotList from "../parkingspot/ParkingSpotList"
import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

function Home({ websocket }) {
  const [messageHistory, setMessageHistory] = useState([]);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [connectionCount, setConnectionCount] = useState(0);
  const [parkingSpaceCount, setParkingSpaceCount] = useState(10);

  useEffect(() => {
    if (websocket.lastMessage !== null) {
      const { type, data } = JSON.parse(websocket.lastMessage.data);
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

        case "DB_SIZE_RESPONSE":
          setParkingSpaceCount(data);
          break;

        default:
          console.warn(`Unhandled message type: ${type}`);
          break;
      }
    }
  }, [websocket.lastMessage, setMessageHistory]);

  const handleClickSendMessage = useCallback(
    (id) =>
      websocket.sendMessage(
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
      websocket.sendMessage(
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
  }[websocket.readyState];
  return (
    <>
      <ContentBox>
        <p>
          <b>Please Select from the available slots:</b>
        </p>
        <ParkingSpotList
          numberOfSpots={parkingSpaceCount}
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
    </>
  );
}

export default Home;