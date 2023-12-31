const express = require("express");
const WebSocket = require("ws");
const connection_handler = require("./ws_connection_handler.js");
const path = require("path");
const https = require('https');
const fs = require('fs');
const app = express();
const port = 80;

// Serve the static HTML page
//app.use(express.static("../client/build"));
app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // '*' allows any origin, replace with specific domains in production
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const server = app.listen(port, () => {
  console.log(`Server started on http://parkit.cc:${port}`);
});

// const privateKeyPath = '/etc/letsencrypt/live/parkit.cc/fullchain.pem';
// const certificatePath = '/etc/letsencrypt/live/parkit.cc/privkey.pem';

// if (fs.existsSync(privateKeyPath) && fs.existsSync(certificatePath)) {
//   const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
//   const certificate = fs.readFileSync(certificatePath, 'utf8');
//   const credentials = { key: privateKey, cert: certificate };

//   const httpsServer = https.createServer(credentials, app);

//   httpsServer.listen(portHTTPS, () => {
//     console.log(`HTTPS server listening on port ${portHTTPS}`);
//   });
// } else {
//   console.log('HTTPS server not started. Key or certificate file missing.');
// }

// WebSocket server
const wss = new WebSocket.Server({ server });

const STATE_CODE_EMPTY = 0;
const STATE_CODE_FULL = 1;
const STATE_CODE_RESERVED = 3;

let cellCount = 10;

const stateTemplate = {
  state: STATE_CODE_EMPTY, 
  plate: "", 
  device: false, 
  deviceId: null,
  bookedUntil: "21:00",
  taken: false
}

let cellStates = Array(cellCount).fill(null).map(() => ({ ...stateTemplate }));

let devices = [
  { name: "Test Device", id: "35253252523532", connected: false, known: true},
  { name: "Virtual ParkSense Pro", id: "34234234324", connected: false, known: false, device: {id: 'test'}},
];

let deviceSockets = {};

app.get("/api/devicelist", (req, res) => {
  res.send({ devices: devices });
});

app.post("/api/dereg", (req, res) => {
    // Access JSON data from the request body
    const jsonData = req.body;

    // Process jsonData as needed
    console.log(jsonData);
  
    unknownDevices.push(jsonData);
  
    // Send a response
    res.json({ message: "Data received successfully!" });
});

app.get("/api/spotcount", (req, res) => {
  res.send({ count: cellCount });
});

app.post("/api/stat", (req, res) => {
    // Access JSON data from the request body
    const jsonData = req.body;
    console.log(`A device stat request was made: ${JSON.stringify(jsonData)}`)
    const foundDevice = devices.find(device => device.id === jsonData.id);
    if (foundDevice && foundDevice.stat) {
        console.log(`Requested states for ${jsonData.id}: ${JSON.stringify(foundDevice.stat)}`)
        res.json(foundDevice.stat);
    } else {
        res.json(null);
    }
    
  });

  app.post("/api/reboot", (req, res) => {
    // Access JSON data from the request body
    const jsonData = req.body;
    console.log(`Attempting to reboot device with data: ${JSON.stringify(jsonData)}`)

    if (deviceSockets[jsonData["id"]]) {
        deviceSockets[jsonData["id"]].send(JSON.stringify({"type": "reboot"}))
        console.log("Reboot request sent")
    }
  });


  app.post("/api/shutdown", (req, res) => {
    // Access JSON data from the request body
    const jsonData = req.body;
    console.log(`Attempting to shutdown device with data: ${JSON.stringify(jsonData)}`)

    if (deviceSockets[jsonData["id"]]) {
        deviceSockets[jsonData["id"]].send(JSON.stringify({"type": "shutdown"}))
        console.log("shutdown request sent")
    }
  });


  app.post("/api/sendsignal", (req, res) => {
    // Access JSON data from the request body
    const jsonData = req.body;
    console.log(`Attempting to forward signal to device with data: ${JSON.stringify(jsonData)}`)

    if (deviceSockets[jsonData["id"]]) {
        deviceSockets[jsonData["id"]].send(JSON.stringify({"type": "signal", "body": jsonData.data}))
        console.log("Signal forwarded to device.")
    }
  });

  app.post("/api/disconnect", (req, res) => {
    // Access JSON data from the request body
    const jsonData = req.body;
    console.log(`Attempting to disconnect device with data: ${JSON.stringify(jsonData)}`)

    if (deviceSockets[jsonData["id"]]) {
        deviceSockets[jsonData["id"]].close()
        deviceSockets[jsonData["id"]] = null
        console.log("disconnect request sent")
    }
  });

app.post("/api/registerdevice", (req, res) => {
  // Access JSON data from the request body
  const jsonData = req.body;

  // Process jsonData as needed
  console.log(jsonData);

  devices.push(jsonData);

  // Send a response
  res.json({ message: "Data received successfully!" });
});

app.post("/api/config/assoc", (req, res) => {
  // Access JSON data from the request body
  console.log(cellStates);
  const jsonData = req.body;
  const { id, park_id } = jsonData;
  console.log(`Association Made, ID: ${id}, ParkID: ${park_id}`);

  cellStates.filter((item) => (item.deviceId == id)).map((item) => {item.device = false; item.deviceId = null; item.taken = false})
  
  const spot = {...cellStates[park_id]};
  console.log(spot)
  if (cellStates[park_id]) {
    spot.device = true;
    spot.deviceId = id;
    cellStates[park_id] = spot;
  } else {
    console.log(`park_id ${park_id} not found in cellStates.`);
  }


  deviceSockets[id].send(JSON.stringify({"type": "RESERVE", state: cellStates[park_id].state == 1 ? true : false}))
 
  wss.clients.forEach((ws) => {
    sendStateUpdate(ws, cellStates)
  });
  console.log(cellStates);

  // Send a response
  res.json({ message: "Data received successfully!" });
});

// Serve landing page assets
app.use('/', express.static(path.join(__dirname, 'src')));

// Serve the static files for the React app
app.use('/app', express.static(path.join(__dirname, '../client/build')));

// Define route for your landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/index.html'));
});

// Define route for your React app
app.get('/app/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Catch-all route for other routes
app.get('*', (req, res) => {
  res.status(404).send('Error 404: Page Not Found. Unlucky soldier, better luck next time.');
});

let sendStateUpdate = (ws, cell_states) => {
  ws.send(
    JSON.stringify({ type: "STATE_UPDATE", data: { count: cellStates.length, cells: cellStates } })
  );
};

let sendConnectionCount = () => {
  wss.clients.forEach((ws) => {
    ws.send(JSON.stringify({ type: "CONNECTION_COUNT", data: wss.clients.size }));
  });
};

setInterval(() => {
  console.log("Attempting to clear park")
  cellStates.map((spot) => {
    const now = new Date();
    const hours = String(now.getHours())
    const minutes = String(now.getMinutes())

    if (!spot.bookedUntil) return;
    const selectedHour = parseInt(spot.bookedUntil.split(':')[0])
    const selectedMinute = parseInt(spot.bookedUntil.split(':')[1])

    if ((selectedHour == hours && selectedMinute >= minutes) || (selectedHour >= hours)) {
      spot.state = 0;
      if(spot.device) {
        const foundSocket = deviceSockets[spot.deviceId]

        if (foundSocket) {
          foundSocket.send(JSON.stringify({"type": "RESERVE", state: spot.state == 1 ? true : false}))
        }
      }
    }
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        sendStateUpdate(client, cellStates);
      }
    });
  });

}, 1000 * 60)

wss.on("connection", (ws, req) => {
  // Send the current state to the newly connected client
  sendStateUpdate(ws, cellStates);

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

      const { cell_state, plateNumber, time } = body;

      if (cellIndex >= 0 && cellIndex < cellStates.length) {
        console.log(`Park ${cellIndex} updated with state ${cell_state}`);

        if (cellStates[cellIndex].plate && cellStates[cellIndex].plate != plateNumber) {
          return;
        }

        const spot = cellStates[cellIndex];
        spot.plate = plateNumber;
        spot.state = cell_state;
        spot.bookedUntil = time;

        if (spot.device) {
          const foundSocket = deviceSockets[spot.deviceId]

          if (foundSocket) {
            foundSocket.send(JSON.stringify({"type": "RESERVE", state: cell_state == 1 ? true : false}))
          }
        }

        // Broadcast the updated state to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            sendStateUpdate(client, cellStates);
          }
        });
      }
    } else if (type === "POLL_STATE") {
      sendStateUpdate(ws, cellStates);
    } else if (type == "RESET_STATE") {
      cellStates.map((spot) => {
        spot.plate = null;
        spot.bookedUntil = "22:00",
        spot.state = STATE_CODE_EMPTY
      });

      Object.entries(deviceSockets).map(([key, ws]) => {
        ws.send(JSON.stringify({"type": "RESERVE", state: false}))
      })
      // Broadcast the updated state to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          sendStateUpdate(client, cellStates);
        }
      });
    } else if (type == "DB_RESIZE_EVENT") {
      let { count } = body;
      count = parseInt(count);
      console.warn(`DB_RESIZE_EVENT: Current: ${cellCount}, New: ${count}`);
      if (count > cellCount) {
        cellStates.push(...Array(count - cellCount).fill(null).map(() => ({ ...stateTemplate })));
      } else if (count < cellCount) {
        cellStates = cellStates.slice((start = 0), (end = count));
      }

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "STATE_UPDATE",
              data: { count: cellStates.length, cells: cellStates },
            })
          );
        }
      });

      cellCount = count;
    } else if (type == "DEVICE_CONNECTED") {
      const {id, name="Unkown Device", type="Unkown"} = body;
      if (devices.some(device => device.id == id)) {
        const foundDevice = devices.find(device => device.id === id);
        if (foundDevice) {
          foundDevice.connected = true;
        }
      } else {
        devices.push({id: id, name: name, type: type, known: false, connected: true})
      }

      deviceSockets[id] = ws;
      ws.on("close", () => {
        const foundDevice = devices.find(device => device.id === id);
        if (foundDevice) {
          foundDevice.connected = false;
        }
        deviceSockets[id] = null;
      });
    } else if (type == "DEVICE_STAT") {
      const {id, temp, cpu, ram, CURRENT_DEVICE_STATE, dist, parked} = body;
      const foundDevice = devices.find(device => device.id === id);
      if (foundDevice) {
        foundDevice.stat = {temp, cpu, ram, state: CURRENT_DEVICE_STATE, dist, parked};
      }

      const foundSpot = cellStates.find(spot => spot.deviceId === id);
      if (foundSpot) {
          foundSpot.taken = parked;

          if (foundSpot.state == 0 && parked) {
            foundSpot.bookedUntil = "Unkown";
          }
      }

      wss.clients.forEach((client) => {

        if (client == ws) return; //Dont send to the device that gave us this stat

        if (client.readyState === WebSocket.OPEN) {
          sendStateUpdate(client, cellStates);
        }
      });
    }
  });

  ws.on("close", () => {
    console.log(`Client Disconnected. Now there are ${wss.clients.size} remaining clients`);
    wss.clients.forEach((ws) => {
      ws.send(JSON.stringify({ type: "CONNECTION_COUNT", data: wss.clients.size }));
    });
  });
});
