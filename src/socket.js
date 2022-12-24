
import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import SyncProgress from "./pages/syncData/syncProgress";

const ENDPOINT = "http://localhost:1919";

function Socket() {
  const [response, setResponse] = useState("");
const [syncRunning, setSyncRunning] = useState(false);
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("startSync", data => {
        // console.log("START SYNC", data)
      setResponse(data);
      setSyncRunning(true);
    });
  }, []);

  return (
    <div>
      {/* {syncRunning && <SyncProgress />} */}
    </div>
  );
}

export default Socket;