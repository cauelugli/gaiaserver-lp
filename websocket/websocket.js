const { Server } = require("socket.io");
const Admin = require("../models/models/Admin");
const dotenv = require("dotenv");
const { mongoose } = require("mongoose");
const { ObjectId } = mongoose.Types;

const {
  createMessageTitleAndBody,
} = require("../controllers/functions/websocketFunctions");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    serverSelectionTimeoutMS: 300000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://gaiaserver",
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  const userSocketMap = {};

  io.on("connection", (socket) => {
    socket.on("userId", (userId) => {
      userSocketMap[userId] = socket.id;
    });

    socket.on("test", () => {
      console.log("\nWebsocket Test OK!\n");
    });

    socket.on("newDataRefreshButton", (data) => {
      io.emit("newDataRefreshButton", data);
    });

    socket.on("forceRefresh", () => {
      io.emit("forceRefresh");
    });

    socket.on("refreshIdIndexList", () => {
      io.emit("refreshIdIndexList");
    });

    socket.on("forceIndividualRefresh", (userId) => {
      io.emit("forceIndividualRefresh", userId);
    });

    socket.on("notifyAdmin", async (data) => {
      try {
        let admin = await Admin.findOne();
        const { title, body } = await createMessageTitleAndBody(data);

        if (admin._id) {
          admin.notifications.push({
            read: false,
            title,
            body,
            createdAt: new Date().toISOString(),
          });

          await admin.save();
        }
      } catch (err) {
        console.error("Erro ao adicionar notificação ao Admin");
      }

      io.emit("newNotificationToAdmin", data);
    });

    socket.on("disconnect", () => {
      // console.log("User disconnected");
    });
  });
};

module.exports = initSocket;
