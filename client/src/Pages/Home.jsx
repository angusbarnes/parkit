import ContentBox from "../layout/ContentBox";
import ParkingSpotList from "../parkingspot/ParkingSpotList";
import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

function Home({ websocket }) {
  const [availabilityData, setAvailabilityData] = useState(Array(10).fill({ state: 0, plate: "" }));
  const [connectionCount, setConnectionCount] = useState(0);
  const [parkingSpaceCount, setParkingSpaceCount] = useState(10);

  const [parkingState, setParkingState] = useState({ count: 0, states: [] });

  useEffect(() => {
    if (websocket.lastMessage !== null) {
      const { type, data } = JSON.parse(websocket.lastMessage.data);
      console.log(`Message Received: ${type} with ${data}`);

      switch (type) {
        case "STATE_UPDATE":
          const { count, cells } = data;
          setParkingState({ count: count, states: cells });
          console.log(`New States Received: Count: ${count}, ${cells}`);
          break;

        case "CONNECTION_COUNT":
          setConnectionCount(data);
          break;

        default:
          console.warn(`Unhandled message type: ${type}`);
          break;
      }
    }
  }, [websocket.lastMessage, setParkingState, setConnectionCount]);

  useEffect(() => {
    websocket.sendMessage(JSON.stringify({ type: "POLL_STATE" }));
  }, []);

  const handleParkingSpotInteraction = useCallback(
    (id, value, plate) =>
      websocket.sendMessage(
        JSON.stringify({
          type: "UPDATE_CELL_REQUEST",
          cell_id: id,
          body: { cell_state: value ? 1 : 0, plateNumber: plate },
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

  if (parkingState.count == 0) {
    return (
      <ContentBox>
        <h3>There are currently no parks configured for this car park</h3>
      </ContentBox>
    );
  }

  return (
    <>
      <ContentBox>
        <p>
          <b>Please Select from the available slots:</b>
        </p>
        <ParkingSpotList
          numberOfSpots={parkingState.count}
          parkingStateHandler={handleParkingSpotInteraction}
          available={parkingState.states}
          parkingState={parkingState}
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
