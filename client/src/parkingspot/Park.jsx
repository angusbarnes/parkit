import React, { useState, useEffect } from "react";
import "./park.css";
import Button from "../layout/Button";
import Modal from "../modal/Modal";
import { useModal } from "../modal/useModal";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

const Park = ({ id, toggleStateFunction, state }) => {
  const qrModal = useModal();
  const bookingModal = useModal();
  const cancelModal = useModal();

  const location = useLocation();
  const navigate = useNavigate();

  const [plate, setPlate] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const showModal = queryParams.get("id") == id;

    if (showModal) {
      // Do something with the modal, e.g., open it
      navigate(location.pathname);
      bookingModal.open();
    }
  }, [location, navigate]);

  const availableIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="green"
      class="pt-1 mr-3 w-10 h-10"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const reservedIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="orange"
      class="pt-1 mr-3 w-10 h-10"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );

  const takenIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="red"
      class="pt-1 mr-3 w-10 h-10"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002"
      />
    </svg>
  );

  function getRandomTime() {
    // Get the current date and time
    const now = new Date();

    // Set the maximum time limit to 5 hours from now
    const maxTime = new Date(now.getTime() + 5 * 60 * 60 * 1000);

    // Generate a random time within the given range
    const randomTime = new Date(now.getTime() + Math.floor(Math.random() * (maxTime - now)));

    // Round the minutes to the nearest 15-minute increment
    const roundedMinutes = Math.ceil(randomTime.getMinutes() / 15) * 15;
    randomTime.setMinutes(roundedMinutes);

    // Format the time as a string
    const formattedTime = randomTime.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return formattedTime;
  }

  return (
    <>
      <Modal modalState={qrModal}>
        <h4>Reserve Car Park #{id + 1}</h4>
        <p>Scan this code to reserve this spot!</p>
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={`http://parkit.cc/park?id=${id}`}
          viewBox={`0 0 256 256`}
        />
      </Modal>
      <Modal modalState={bookingModal}>
        <h3 style={{ width: 350 }}>Book Park #{id + 1}</h3>
        <label style={{ paddingTop: 20 }}>Please Enter your license plate number:</label>
        <input
          type="text"
          spellcheck="false"
          value={plate}
          onChange={(e) => setPlate(e.target.value.toUpperCase())}
        />
        <div className="container" style={{ padding: 15, paddingBottom: 0 }}>
          <Button
            color={"RoyalBlue"}
            label={"Book"}
            onClick={() => {
              if (!plate) return;
              bookingModal.close();
              toggleStateFunction(id, true, plate);
            }}
          />
        </div>
      </Modal>
      <Modal modalState={cancelModal}>
        <h3 style={{ width: 350 }}>Cancel this park</h3>
        <label style={{ paddingTop: 20 }}>Please Enter your license plate number:</label>
        <input
          type="text"
          spellcheck="false"
          value={plate}
          onChange={(e) => setPlate(e.target.value.toUpperCase())}
        />
        <div className="container" style={{ padding: 15, paddingBottom: 0 }}>
          <Button
            color={"Tomato"}
            label={"Cancel"}
            onClick={() => {
              if (!plate) return;
              cancelModal.close();
              toggleStateFunction(id, false, plate);
            }}
          />
        </div>
      </Modal>
      <div class="min-w-5xl">
        <div class="flex items-center justify-center">
          <div class="max-w-sm w-full  py-6 px-3">
            <div class="bg-white shadow-xl hover:shadow-2xl rounded-lg overflow-hidden">
              <div
                class="bg-cover bg-center h-40 p-4"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1543465077-db45d34b88a5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80)",
                }}
              >
                <div class="flex justify-end">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                </div>
                <div class="bg-white p-4 rounded flex justify-start w-min">
                  <QRCode
                    size={128}
                    style={{ height: "auto", width: "90px", margin: 0, padding: 0 }}
                    value={`http://parkit.cc/app?id=${id}`}
                    viewBox={`0 0 128 128`}
                  />
                </div>
              </div>
              <div class="p-4">
                <p class="uppercase tracking-wide text-sm font-bold text-gray-700">
                  Premium Park • #{id + 1}
                </p>
                <p class="text-3xl text-gray-900">$10.00/hr</p>
                <p class="text-gray-700">Reserved for business use.</p>
              </div>

              <div class="flex p-4 border-t border-gray-300 text-gray-700">
                <div class="flex items-center justify-between w-full">
                  <button
                    onClick={bookingModal.open}
                    class="flex items-center mx-auto  border-2 tw-border-solid text-green-500 hover:text-white border-green-500 hover:bg-green-500 rounded-lg p-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="mr-2 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>

                    <div class="text-left text-sm">
                      <p class="font-bold text-inherit">Book</p>
                      <p class="text-xs text-gray-700">Reservation</p>
                    </div>
                  </button>
                  <button
                    onClick={cancelModal.open}
                    class="flex items-center mx-auto border-2 tw-border-solid text-red-500 hover:text-white border-red-500 hover:bg-red-500 rounded-lg p-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="mr-2 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>

                    <div class="text-left text-sm">
                      <p class="font-bold text-inherit">Cancel</p>
                      <p class="text-xs text-gray-700">Reservation</p>
                    </div>
                  </button>
                </div>
              </div>
              <div class="px-4 pt-3 pb-4 border-t border-gray-300 bg-gray-100">
                <div class="text-xs uppercase font-bold text-gray-600 tracking-wide">
                  Current Status
                </div>
                <div class="flex items-center pt-2">
                  {state ? availableIcon : reservedIcon}
                  <div>
                    <p class="font-bold text-gray-900">{state ? "Available" : "Reserved"}</p>
                    <p class="text-sm text-gray-700">
                      {state ? `Free until ${getRandomTime()}` : "Next Available: 2 hours"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="grid-item">
      <div className="park">
        
        <h3>Park #{id + 1}</h3>
        <p>This is a park. Lorem Ipsum etc etc. Generic Text Field Here.</p>
        <h4>This spot is currently {state ? "🟢 Free" : "🔴 Taken"}</h4>
        <div className="container">
          <div className="button-group">
            <Button
              disabled={state}
              color={"RoyalBlue"}
              label={"Book"}
              onClick={() => {
                bookingModal.open();
              }}
            />
            <Button
              disabled={state}
              color={"Tomato"}
              label={"Cancel"}
              onClick={() => {
                cancelModal.open();
              }}
            />
            <button
              onClick={() => {
                qrModal.open();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                height={"auto"}
                className={"svg-icon"}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div> */}
    </>
  );
};

export default Park;
