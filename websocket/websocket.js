const { Server } = require("socket.io");
const User = require("../models/models/User");
const dotenv = require("dotenv");
const { mongoose } = require("mongoose");

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

    socket.on("forceRefresh", () => {
      io.emit("forceRefresh");
    });

    socket.on("addRoutine", async (data) => {
      for (const roleId of data.receivers) {
        try {
          const users = await User.find({
            role: roleId,
            // !emitterId
            _id: { $ne: data.emitterId },
          });

          for (const user of users) {
            const notificationBody =
              `Olá! Um novo ${data.label} foi criado: "${data.userName}".` +
              (data.department ? ` No departamento ${data.department}.` : "") +
              (data.position ? ` No cargo ${data.position}.` : "");

            user.notifications.push({
              read: false,
              title: `Novo ${data.label} Criado`,
              body: notificationBody,
              createdAt: new Date().toISOString(),
            });

            await user.save();
          }
        } catch (err) {
          console.error("Erro ao adicionar notificação", err);
        }
      }

      io.emit("newNotification", data);
    });

    socket.on("editRoutine", async (data) => {
      for (const roleId of data.receivers) {
        try {
          const users = await User.find({
            role: roleId,
            // !emitterId
            _id: { $ne: data.emitterId },
          });

          for (const user of users) {
            const notificationBody = `Olá! Um ${data.label} foi editado: "${data.userName}".`;

            user.notifications.push({
              read: false,
              title: `${data.label} Editado`,
              body: notificationBody,
              createdAt: new Date().toISOString(),
            });

            await user.save();
          }
        } catch (err) {
          console.error("Erro ao adicionar notificação", err);
        }
      }

      io.emit("newNotification", data);
    });

    socket.on("deleteRoutine", async (data) => {
      for (const roleId of data.receivers) {
        try {
          const users = await User.find({
            role: roleId,
            // !emitterId
            _id: { $ne: data.emitterId },
          });

          for (const user of users) {
            const notificationBody = `Olá! O ${data.label} "${data.userName}" foi deletado.`;

            user.notifications.push({
              read: false,
              title: `${data.label} Deletado`,
              body: notificationBody,
              createdAt: new Date().toISOString(),
            });

            await user.save();
          }
        } catch (err) {
          console.error("Erro ao adicionar notificação", err);
        }
      }

      io.emit("newNotification", data);
    });

    socket.on("disconnect", () => {
      // console.log("User disconnected");
    });
  });
};

module.exports = initSocket;
