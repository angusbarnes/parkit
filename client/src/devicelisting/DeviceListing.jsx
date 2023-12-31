import React, { useState } from "react";
import "./device-listing.css";
import Button from "../layout/Button";
import Modal from "../modal/Modal";
import { useModal } from "../modal/useModal";
import { useEffect } from "react";
import { host } from "../ipspec";

const DeviceListing = ({
  deviceName,
  deviceIP,
  deviceIcon,
  onlineStatus,
  device = null,
  known = true,
  spotCount = 10,
}) => {
  const settingsModal = useModal();
  const assignModal = useModal();
  const [deviceStats, setDeviceStats] = useState(null);

  useEffect(() => {
    if (device) {
      const body = { id: device.id };
      const fetchData = async () => {
        try {
          const response = await fetch(`http://${host}:80/api/stat`, {
            method: "post",
            headers: {
              Accept: "application.json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            cache: "default",
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const result = await response.json();
          console.log(`Device List Request Succeeded: ${JSON.stringify(result)}`);
          if (result) {
            setDeviceStats(result);
          }
        } catch (error) {
          //setError(error);
        } finally {
          //setLoading(false);
        }
      };

      fetchData();

      // Set up periodic fetch using setInterval
      const intervalId = setInterval(() => {
        fetchData();
      }, 1000); // Adjust the interval as needed (e.g., fetch every 5 seconds)

      // Cleanup function to clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [setDeviceStats]);



  function SendAssignment(parkId) {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://${host}:80/api/config/assoc`, {
          method: "post",
          headers: {
            Accept: "application.json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({id:device.id, park_id: parkId}),
          cache: "default",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        console.log(`Device List Request Succeeded: ${JSON.stringify(result)}`);
        if (result) {
          setDeviceStats(result);
        }
      } catch (error) {
        //setError(error);
      } finally {
        //setLoading(false);
      }
    };

    fetchData();
  }


  const onlineIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="icon"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  );

  const offlineIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="icon"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z"
      />
    </svg>
  );

  const settingsIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="icon-large"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  return (
    <div className="device-listing">
      <Modal modalState={assignModal}>
        {Array.from({ length: spotCount }, (_, index) => (
          <Button 
            key={index} 
            label={`Assign to Park ID: ${index}`} 
            color={"DarkSeaGreen"}
            onClick={() => { 
              assignModal.close();
              device && SendAssignment(index);
              console.log(`Fired Association Request: ${index}`)
            }}
          />
        ))}
      </Modal>
      <Modal modalState={settingsModal}>
        <h2 style={{ marginBottom: 0 }}>Settings</h2>
        <span style={{ color: "grey", margin: 0, padding: 0, fontFamily: "monospace" }}>
          <i>{device && device.id}</i>
        </span>
        {!deviceStats ? null : (
          <>
            <span style={{ display: "block" }}>
              <b>Device Ram: </b>
              {Math.round(deviceStats.ram * 100) / 100}%
            </span>
            <span style={{ display: "block" }}>
              <b>Device CPU: </b>
              {Math.round(deviceStats.cpu * 100) / 100}%
            </span>
            <span style={{ display: "block" }}>
              <b>Device Temp: </b>
              {Math.round(deviceStats.temp * 100) / 100}°
            </span>
            <span style={{ display: "block" }}>
              <b>Current State: </b>
              {deviceStats.state}
            </span>
            <span style={{ display: "block" }}>
              <b>Last Distance: </b>
              {Math.round(deviceStats.dist * 100) / 100}
            </span>
            <span style={{ display: "block" }}>
              <b>Presence: </b>
              {deviceStats.parked ? "Taken" : "Free"}
            </span>
            <p></p>
            <div className="button-group">
              <Button
                color={"Tomato"}
                label={"Reboot"}
                onClick={async () => {
                  console.log("Reboot clicked");
                  try {
                    const response = await fetch(`http://${host}:80/api/reboot`, {
                      method: "post",
                      headers: {
                        Accept: "application.json",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ id: device.id }),
                      cache: "default",
                    });

                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                  } catch (error) {
                    console.log(error);
                  } finally {
                    //setLoading(false);
                  }
                }}
              ></Button>
              <Button
                label={"Disconnect"}
                color={"red"}
                onClick={async () => {
                  console.log("disconnect clicked");
                  try {
                    const response = await fetch(`http://${host}:80/api/disconnect`, {
                      method: "post",
                      headers: {
                        Accept: "application.json",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ id: device.id }),
                      cache: "default",
                    });

                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                  } catch (error) {
                    console.log(error);
                  } finally {
                    //setLoading(false);
                  }
                }}
              ></Button>              <Button
              label={"Shutdown"}
              color={"red"}
              onClick={async () => {
                console.log("disconnect clicked");
                try {
                  const response = await fetch(`http://${host}:80/api/shutdown`, {
                    method: "post",
                    headers: {
                      Accept: "application.json",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: device.id }),
                    cache: "default",
                  });

                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                } catch (error) {
                  console.log(error);
                } finally {
                  //setLoading(false);
                }
              }}
            ></Button>

            </div>
            <div className="button-group">
            <Button
                label={"G"}
                color={"orange"}
                onClick={async () => {
                  console.log("Clock clicked");
                  try {
                    const response = await fetch(`http://${host}:80/api/sendsignal`, {
                      method: "post",
                      headers: {
                        Accept: "application.json",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ id: device.id, data : {signal: 'gamma'}}),
                      cache: "default",
                    });

                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                  } catch (error) {
                    console.log(error);
                  } finally {
                    //setLoading(false);
                  }
                }}
              />
            <Button
                label={"A"}
                color={"red"}
                onClick={async () => {
                  console.log("Clock clicked");
                  try {
                    const response = await fetch(`http://${host}:80/api/sendsignal`, {
                      method: "post",
                      headers: {
                        Accept: "application.json",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ id: device.id, data : {signal: 'alpha'}}),
                      cache: "default",
                    });

                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                  } catch (error) {
                    console.log(error);
                  } finally {
                    //setLoading(false);
                  }
                }}
              />
              <Button
                label={"B"}
                color={"blue"}
                onClick={async () => {
                  console.log("Clock clicked");
                  try {
                    const response = await fetch(`http://${host}:80/api/sendsignal`, {
                      method: "post",
                      headers: {
                        Accept: "application.json",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ id: device.id, data : {signal: 'beta'}}),
                      cache: "default",
                    });

                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                  } catch (error) {
                    console.log(error);
                  } finally {
                    //setLoading(false);
                  }
                }}
              />
              <Button
                label={"0"}
                color={"black"}
                onClick={async () => {
                  console.log("Clock clicked");
                  try {
                    const response = await fetch(`http://${host}:80/api/sendsignal`, {
                      method: "post",
                      headers: {
                        Accept: "application.json",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ id: device.id, data : {signal: 'noop'}}),
                      cache: "default",
                    });

                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                  } catch (error) {
                    console.log(error);
                  } finally {
                    //setLoading(false);
                  }
                }}
              />
              <Button
                label={"Clock"}
                color={"grey"}
                onClick={async () => {
                  console.log("Clock clicked");
                  try {
                    const response = await fetch(`http://${host}:80/api/sendsignal`, {
                      method: "post",
                      headers: {
                        Accept: "application.json",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ id: device.id, data : {signal: 'clock'}}),
                      cache: "default",
                    });

                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                  } catch (error) {
                    console.log(error);
                  } finally {
                    //setLoading(false);
                  }
                }}
              />
            </div>
          </>
        )}
      </Modal>
      <div className="settings-icon">{deviceIcon}</div>
      <div className="device-info container">
        <div className="left-half">
          <p className="device-name">
            {deviceName}
            <span className={`online-status ${onlineStatus ? "online" : "offline"}`}>
              {onlineStatus ? onlineIcon : offlineIcon}
              {onlineStatus ? "Connected" : "Offline"}
            </span>
          </p>
          <p className="device-ip">
            URI: <a href="#">{deviceIP}</a>
          </p>
        </div>
        <div className="right-half">
          <div className="buttons-parent">
            <button
              onClick={() => {
                settingsModal.open();
              }}
            >
              <span>{settingsIcon}</span>
            </button>
            <Button
              color={known ? "Tomato" : "DarkSeaGreen"}
              label={known ? "Remove" : "Assign"}
              onClick={() => {
                assignModal.open();
              }}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceListing;
