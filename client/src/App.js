import logo from "./Parkit.png";
import "./App.css";
import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Navbar from "./navbar/Navbar";
import { useModal } from "./modal/useModal";
import Modal from "./modal/Modal";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Home from "./Pages/Home"

function App() {
  const [socketUrl, setSocketUrl] = useState("ws://parkit.cc:80");

  // { sendMessage, lastMessage, readyState }
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  let eventHandlers = {}

  const websocket = {
    send: (message) => {
      sendMessage(message);
    },
    status: readyState,
    on: (type, callback) => {
      eventHandlers[type].push(callback);
    }
  }

  //sendMessage(JSON.stringify({type: "REQUEST_DB_SIZE"}))

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigation websocket={websocket} />}>
          <Route index element={<Home websocket={websocket} />} />
          {/* <Route path="about" element={<About />} /> */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          {/* <Route path="*" element={<NoMatch />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

function Navigation({ websocket }) {
  const errorModal = useModal();
  return (
    <>
      <Navbar
        logo={logo}
        resetButtonCallback={() => {
          websocket.sendMessage(JSON.stringify({ type: "RESET_STATE" }));
        }}
      ></Navbar>
      <Modal modalState={errorModal} style={{ backgroundColor: "#F08080" }}>
        <h3 style={{ color: "white" }}>
          <b>ERROR</b>
        </h3>
      </Modal>
      <Outlet />
    </>
  );
}

export default App;
