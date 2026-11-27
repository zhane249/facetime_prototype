// Here's a basic React-based project
import { createRoot } from "react-dom/client";

import { useState, useEffect } from "react";
import {sketch} from "./face";
let serverURL;

if (import.meta.env.DEV) {
  serverURL = "ws://127.0.0.1:3000/";
} else {
  // REPLACE THIS WITH THE URL YOU GET FROM RENDER
  serverURL = "wss://facetime-prototype.onrender.com";
}

let root = createRoot(document.getElementById("app"));

root.render(<App />);

let roomCode = "";
// Component for defining the app
function App() {
  let [socket, setSocket] = useState(null);

  // Stores whether the socket is connecting or connected
  let [state, setState] = useState("disconnected");

  // Demo state for storing last message from server
  let [message, setMessage] = useState(null);

  //roomcode
  let [code, setCode] = useState("");
  let [joined, setJoined] = useState(false);
  useEffect(() => {
    let newSocket = new WebSocket(serverURL);

    setSocket(newSocket);
    setState("connecting");

    newSocket.addEventListener("open", () => {
      setState("connected");
    });

    newSocket.addEventListener("message", (event) => {
      // If your message is JSON, then parse it
      let data = JSON.parse(event.data);

      // As a demo, display the last message as a JSON string
      setMessage(JSON.stringify(data));
    });

    newSocket.addEventListener("close", () => {
      setState("disconnected");
    });
  }, []);
  function joinCall() {
    if (code.trim() != "" && !joined) {
      roomCode = code.trim();
      setJoined(true);
      new p5((p)=> sketch(p, roomCode));
    }
  }

  return (
    <>
      <h1>Fafil Prototype</h1>

      {joined == false && (
        <div className="joinScreen">
          <p>Enter your custom call code</p>

          <input
            type="text"
            placeholder="Call code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />

          <button onClick={joinCall}>
            Join Call
          </button>
        </div>
      )}

      {joined == true && (
        <p>Call code: {code}</p>
      )}
    </>
  );
}