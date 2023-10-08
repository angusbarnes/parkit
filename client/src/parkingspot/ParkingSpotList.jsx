import GridContainer from "../layout/GridContainer";
import React, { useState, useCallback, useEffect } from "react";
import Park from "./Park";

function ParkingSpotList({ numberOfSpots, parkingStateHandler, available, parkingState }) {
  // Create an array of parking spot IDs based on the numberOfSpots configuration
  const parkingSpotIds = Array.from({ length: parkingState.count }, (_, index) => index);

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
          state={parkingState.states[id]["state"] == 1 ? false : true}
        />
      ))}
    </GridContainer>
  );
}

export default ParkingSpotList;
