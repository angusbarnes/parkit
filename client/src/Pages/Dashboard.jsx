import DeviceListing from "../devicelisting/DeviceListing";
import ContentBox from "../layout/ContentBox";
import Button from "../layout/Button";
import { useEffect, useState } from "react";

function Dashboard({ websocket }) {

  const [spotCount, setSpotCount] = useState(10);
  useEffect(() => {
    if (websocket.lastMessage !== null) {
      const { type, data } = JSON.parse(websocket.lastMessage.data);
      console.log(`Message Received: ${type} with ${data}`);
    }
  }, [websocket.lastMessage]);

  const devicesIcons = {
    server: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        style={{ height: 35, verticalAlign: "bottom" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
        />
      </svg>
    ),
    cloud: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        style={{ height: 35, verticalAlign: "bottom" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
        />
      </svg>
    ),
    gateway: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        style={{ height: 35, verticalAlign: "bottom" }}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M3 13m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
        <path d="M17 17l0 .01"></path>
        <path d="M13 17l0 .01"></path>
        <path d="M15 13l0 -2"></path>
        <path d="M11.75 8.75a4 4 0 0 1 6.5 0"></path>
        <path d="M8.5 6.5a8 8 0 0 1 13 0"></path>
      </svg>
    ),
    parkitpro: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 16 16"
        style={{ height: 35, verticalAlign: "bottom" }}
      >
        <path d="M0 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H9.269c.144.162.33.324.531.475a6.785 6.785 0 0 0 .907.57l.014.006.003.002A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.224-.947l.003-.002.014-.007a4.473 4.473 0 0 0 .268-.148 6.75 6.75 0 0 0 .639-.421c.2-.15.387-.313.531-.475H2a2 2 0 0 1-2-2V6Zm2-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H2Z" />
        <path d="M8 6.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm7 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
      </svg>
    ),
  };
  return (
    <>
      <ContentBox>
        <h3>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="bi bi-database-check"
              style={{ height: 30, verticalAlign: "-8px" }}
            >
              <path d="M6 9a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 6 9zM3.854 4.146a.5.5 0 1 0-.708.708L4.793 6.5 3.146 8.146a.5.5 0 1 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2z" />
              <path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h12z" />
            </svg>
          </span>
          <span style={{ fontSize: 20 }}> Admin Dashboard:</span>
        </h3>
        <div className="button-group">
          <Button
            label={"Reset State"}
            onClick={() => {
              websocket.sendMessage(JSON.stringify({ type: "RESET_STATE" }));
            }}
            color={"lightcoral"}
          ></Button>
          <Button label={"Restart Server"} color={"skyblue"}></Button>
          <input type="number" min="1" max="100" style={{width: 50}} onChange={(e) => setSpotCount(e.target.value)}></input>
          <Button label={"Update Spot Allocation"} color={"slategrey"} onClick={()=>{
            websocket.sendMessage(JSON.stringify({"type": "DB_RESIZE_EVENT", "body" : { "count": spotCount}}))
          }}></Button>
        </div>
      </ContentBox>
      <ContentBox>
        <h3>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="bi bi-database-check"
              style={{ height: 30, verticalAlign: "-5px" }}
            >
              <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514Z" />
              <path d="M12.096 6.223A4.92 4.92 0 0 0 13 5.698V7c0 .289-.213.654-.753 1.007a4.493 4.493 0 0 1 1.753.25V4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16c.536 0 1.058-.034 1.555-.097a4.525 4.525 0 0 1-.813-.927C8.5 14.992 8.252 15 8 15c-1.464 0-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13h.027a4.552 4.552 0 0 1 0-1H8c-1.464 0-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10c.262 0 .52-.008.774-.024a4.525 4.525 0 0 1 1.102-1.132C9.298 8.944 8.666 9 8 9c-1.464 0-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777ZM3 4c0-.374.356-.875 1.318-1.313C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4Z" />
            </svg>
          </span>
          <span style={{ fontSize: 20 }}> Registered Devices:</span>
        </h3>
        <p>List of currently registered devices for configuration</p>
        <DeviceListing
          deviceName="Parking Server V0.1.2"
          deviceIP="ws://parkit.cc"
          deviceIcon={devicesIcons.server}
          onlineStatus="online"
        ></DeviceListing>

        <DeviceListing
          deviceName="ParkIT Cloud Relay"
          deviceIP="cloud.partkit.cc"
          deviceIcon={devicesIcons.cloud}
          onlineStatus="online"
        ></DeviceListing>
        <DeviceListing
          deviceName="ParkIT LAN Gateway"
          deviceIP="192.168.0.200"
          deviceIcon={devicesIcons.gateway}
          onlineStatus={false}
        ></DeviceListing>
      </ContentBox>
      <ContentBox>
        <h3>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="bi bi-database-x"
              viewBox="0 0 16 16"
              style={{ height: 30, verticalAlign: "-5px" }}
            >
              <path d="M12.096 6.223A4.92 4.92 0 0 0 13 5.698V7c0 .289-.213.654-.753 1.007a4.493 4.493 0 0 1 1.753.25V4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16c.536 0 1.058-.034 1.555-.097a4.525 4.525 0 0 1-.813-.927C8.5 14.992 8.252 15 8 15c-1.464 0-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13h.027a4.552 4.552 0 0 1 0-1H8c-1.464 0-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10c.262 0 .52-.008.774-.024a4.525 4.525 0 0 1 1.102-1.132C9.298 8.944 8.666 9 8 9c-1.464 0-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777ZM3 4c0-.374.356-.875 1.318-1.313C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4Z" />
              <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-.646-4.854.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708Z" />
            </svg>
          </span>
          <span style={{ fontSize: 20 }}> Unknown Devices:</span>
        </h3>
        <p>New devices will show up here for assignment</p>
        <DeviceListing
          deviceName="SmartPark Pro"
          deviceIP="Cloud Relay Enabled"
          deviceIcon={devicesIcons.parkitpro}
          onlineStatus="online"
        ></DeviceListing>
      </ContentBox>
    </>
  );
}

export default Dashboard;
