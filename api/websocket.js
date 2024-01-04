const http = require("http");
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

  const userSocketMap = {};

  io.on("connection", (socket) => {
    // console.log(`Socket connected: ${socket.id}`);
    socket.on("userId", (userId) => {
      // console.log(`User connected: ${userId}`);
      // console.log("userSocketMap:", userSocketMap);

      userSocketMap[userId] = socket.id;
    });

    socket.on("test", () => {
      console.log("\nWebsocket Test OK!\n");
    });

    socket.on("requestApproval", async (data) => {
      try {
        // Obtém o ID do socket do usuário receptor
        const receiverSocketId = userSocketMap[data.receiver.id];

        // console.log("data.receiver.id:", data.receiver.id); // Adicione este log para depuração
        // console.log("receiverSocketId:", receiverSocketId); // Adicione este log para depuração

        const newNotification = {
          id: Date.now(),
          type: "Aprovação",
          noteBody: `Olá ${data.receiver.name}! ${data.sender.name} está solicitando aprovação para o job "${data.job.title}" em ${data.date}.`,
          sender: data.sender.name,
          status: "Não Lida",
        };
        
        // Sempre salve a notificação
        await Manager.updateOne(
          { _id: data.receiver.id },
          { $set: { [`notifications.${Date.now()}`]: newNotification } }
        );
        
        const updatedReceiver = await Manager.findById(data.receiver.id);
        
        if (receiverSocketId) {
          // Emita o evento apenas para o socket do receptor específico
          io.to(receiverSocketId).emit("notificationsUpdate", {
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
