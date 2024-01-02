/* eslint-disable no-unused-vars */
import React from "react";
import { Button } from "@mui/material";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const TestWebSocketButton = () => {
  const handleTestWebSocket = () => {
    console.log("Enviando evento 'test' ao servidor...");
    const data = { someData: "some important data" };
    socket.emit("test", data);
  };

  return (
    <Button variant="contained" color="primary" onClick={handleTestWebSocket}>
      Testar WebSocket
    </Button>
  );
};

export default TestWebSocketButton;
