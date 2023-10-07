const express = require("express");
const WebSocket = require("ws");
const connection_handler = require("./ws_connection_handler.js");
const path = require("path");
const app = express();
const port = 80;

// Serve the static HTML page
app.use(express.static("../client/build"));

const server = app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

// WebSocket server
const wss = new WebSocket.Server({ server });

const STATE_CODE_EMPTY = 0;
const STATE_CODE_FULL = 1;
const STATE_CODE_RESERVED = 3;

let cellCount = 10
let cellStates = Array(cellCount).fill({ state: STATE_CODE_EMPTY, plate: "" });
let knownDevices = [];

let sendStateUpdate = (ws, cell_states) => {
  ws.send(JSON.stringify({ type: "STATE_UPDATE", data: cell_states }));
};

let sendConnectionCount = () => {
  wss.clients.forEach((ws) => {
    ws.send(JSON.stringify({ type: "CONNECTION_COUNT", data: wss.clients.size }));
  });
};

wss.on("connection", (ws, req) => {
  // Send the current state to the newly connected client
  ws.send(JSON.stringify({ type: "DB_SIZE_RESPONSE", data: {count: cellCount, cells: cellStates}}));

  const clientIP = req.connection.remoteAddress;
  console.log(
    `Client connected from IP: ${clientIP}. Client was sent INITIAL_STATE package. Now there are ${wss.clients.size} connected clients`
  );

  sendConnectionCount();

  // Handle messages from clients
  ws.on("message", (message) => {
    const { type, cell_id, body } = JSON.parse(message);

    console.log(message.toString());

    if (type === "UPDATE_CELL_REQUEST") {
      const cellIndex = parseInt(cell_id);

      const { cell_state, plateNumber } = body;

      if (cellIndex >= 0 && cellIndex < cellStates.length) {
        console.log(`Park ${cellIndex} updated with state ${cell_state}`);

        if (cellStates[cellIndex].plate && cellStates[cellIndex].plate != plateNumber) {
          return;
        }

        cellStates[cellIndex] = { state: cell_state, plate: plateNumber };

        // Broadcast the updated state to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            sendStateUpdate(client, cellStates);
          }
        });
      }
    } else if (type === "POLL_STATE") {
      ws.send(JSON.stringify({ type: "STATE_UPDATE", cells: cellStates }));
    } else if (type == "RESET_STATE") {
      cellStates = Array(cellCount).fill({ state: STATE_CODE_EMPTY, plate: "" });;
        // Broadcast the updated state to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            sendStateUpdate(client, cellStates);
          }
        });
    } else if (type == "DB_RESIZE_EVENT") {
      const {count} = body;

      if (count > cellCount) {
        cellStates.push(...Array(count - cellCount).fill({ state: STATE_CODE_EMPTY, plate: "" }));
      } else if (count < cellCount) {
        cellStates = cellStates.slice(start=0, end=count)
      }

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "DB_SIZE_RESPONSE", data: {count: cellStates.length, cells: cellStates}}));
        }
      });

      cellCount = count

    } else if (type == "ESTABLISH_DEVICE_CONNECTION") {
      const { device_name } = body;
      knownDevices.push({ device: device_name });
      console.log("New Device Registered: " + device_name);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "NEW_DEVICE_EVENT",
              data: {
                deviceName: device_name,
              },
            })
          );
        }
      });
    } else if (type == "REQUEST_DEVICE_LIST") {
    } else if (type == "REQUEST_DB_SIZE") {
      ws.send(JSON.stringify({ type: "DB_SIZE_RESPONSE", data: cellStates.length }));
    }
  });

  ws.on("close", () => {
    console.log(`Client Disconnected. Now there are ${wss.clients.size} remaining clients`);
    wss.clients.forEach((ws) => {
      ws.send(JSON.stringify({ type: "CONNECTION_COUNT", data: wss.clients.size }));
    });
  });
});
