import logo from "./logo_small.png";
import "./App.css";
import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Navbar from "./navbar/Navbar";
import { useModal } from "./modal/useModal";
import Modal from "./modal/Modal";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Home from "./Pages/Home"
import { host } from "./ipspec";


function App() {
  const [socketUrl, setSocketUrl] = useState(`ws://${host}:80`);

  // { sendMessage, lastMessage, readyState }
  const websocket = useWebSocket(socketUrl);

  //sendMessage(JSON.stringify({type: "REQUEST_DB_SIZE"}))

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigation websocket={websocket} />}>
          <Route index element={<Home websocket={websocket} />} />
          {/* <Route path="about" element={<About />} /> */}
          <Route path="dashboard" element={<Dashboard websocket={websocket}/>} />

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
