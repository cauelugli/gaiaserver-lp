const socketIo = require("socket.io");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const User = require("./models/User");
const Manager = require("./models/Manager");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("test", () => {
      console.log("\nWebsocket Test OK!\n");
    });

    socket.on("requestApproval", async (data) => {
      try {
        const receiver = await Manager.findById(data.receiver.id);

        if (receiver) {
          const newNotification = {
            id: Date.now(),
            type: "Aprovação",
            noteBody: `Olá ${receiver.name}! ${data.sender.name} está solicitando aprovação para o job "${data.job.title}" em ${data.date}.`,
            sender: data.sender.name,
            status: "Não Lida"
          };

          await Manager.updateOne(
            { _id: data.receiver.id },
            { $set: { [`notifications.${Date.now()}`]: newNotification } }
          );

          const updatedReceiver = await Manager.findById(data.receiver.id);

          io.to(receiver._id).emit("notificationsUpdate", {
            notifications: updatedReceiver.notifications,
          });
        } else {
          console.log("Receiver not found");
        }
      } catch (error) {
        console.error("Error processing requestApproval:", error);
      }
    });

    socket.on("disconnect", () => {
      // console.log("User disconnected");
    });
  });
};

module.exports = initSocket;
