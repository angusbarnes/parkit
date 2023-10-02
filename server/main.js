const express = require("express");
const WebSocket = require("ws");
const connection_handler = require("./ws_connection_handler.js");

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

let cellStates = Array(10).fill(STATE_CODE_EMPTY);

wss.on("connection", (ws, req) => {
    // Send the current state to the newly connected client
    ws.send(JSON.stringify({ type: "INITIAL_STATE", data: cellStates }));

    const clientIP = req.connection.remoteAddress;
    console.log(`Client connected from IP: ${clientIP}. Client was sent INITIAL_STATE package. Now there are ${wss.clients.size} connected clients`);

    wss.clients.forEach((ws) => {
        ws.send(
            JSON.stringify({ type: "CONNECTION_COUNT", data: wss.clients.size })
        );
    })

    // Handle messages from clients
    ws.on("message", (message) => {
        const { type, cell_id, body } = JSON.parse(message);

        console.log(message.toString());

        if (type === "UPDATE_CELL_REQUEST") {
            const cellIndex = parseInt(cell_id);

            const { cell_state } = body;

            if (cellIndex >= 0 && cellIndex < cellStates.length) {
                console.log(`Park ${cellIndex} updated with state ${cell_state}`);
                cellStates[cellIndex] = cell_state;
                // Broadcast the updated state to all connected clients
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(
                            JSON.stringify({ type: "STATE_UPDATE", data: cellStates })
                        );
                    }
                });
            }
        } 
        else if (type === "POLL_STATE") {
            ws.send(
                JSON.stringify({ type: "STATE_UPDATE", cells: cellStates })
            );
        } 
        else if (type == "RESET_STATE") {
            cellStates = Array(10).fill(STATE_CODE_EMPTY);
            ws.send(
                JSON.stringify({ type: "STATE_UPDATE", cells: cellStates })
            );
        }
    });

    ws.on("close", () => {
        console.log(`Client Disconnected. Now there are ${wss.clients.size} remaining clients`);
        wss.clients.forEach((ws) => {
            ws.send(
                JSON.stringify({ type: "CONNECTION_COUNT", data: wss.clients.size })
            );
        });
    })
});

