// import the base node js server
import { createServer } from "http";

// Import web socket server constructor
import { WebSocketServer } from "ws";

// Create our HTTP server
let server = createServer();

// Set up a port variable
let port = process.env.PORT ?? 3000;

// Set up websocket server
let wsServer = new WebSocketServer({ server });

// Listen for connections from clients
wsServer.addListener("connection", (socket) => {
  // If a connection was received
  console.log("Received connection");

  // As a test, we can send a message to the client
  // We're sending this as JSON, but it can be other
  // types of data
  socket.send(JSON.stringify("Hello from the server!"));

  // Set up an event listener for receiving messages
  socket.addListener("message", (rawData) => {
    try {
      // If your message is JSON, then parse it
      let data = JSON.parse(rawData);

      console.log("Received message:");
      console.log(data);
    } catch (error) {
      console.log(error);
      return;
    }
  });

  // Set up an event listener for determining if a client disconnected
  socket.addListener("close", () => {
    // Handle disconnect if necessary
    console.log("Client disconnected");
  });
});

// Start the server listening for requests at the port
server.listen(port);
