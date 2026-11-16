// Here's a basic React-based project
import { createRoot } from "react-dom/client";

import { useState, useEffect } from "react";

let serverURL;

if (import.meta.env.DEV) {
  serverURL = "ws://127.0.0.1:3000/";
} else {
  // REPLACE THIS WITH THE URL YOU GET FROM RENDER
  serverURL = "";
}

let root = createRoot(document.getElementById("app"));

root.render(<App />);

// Component for defining the app
function App() {
  let [socket, setSocket] = useState(null);

  // Stores whether the socket is connecting or connected
  let [state, setState] = useState("disconnected");

  // Demo state for storing last message from server
  let [message, setMessage] = useState(null);

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

  return (
    <>
      <h1>Assignment 4 Demo</h1>
      <p>Server is {state}.</p>
      {message === null ? (
        <p>No messages received.</p>
      ) : (
        <>
          <p>Last message received:</p>
          <pre>{message}</pre>
        </>
      )}
    </>
  );
}
