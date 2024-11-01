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

    socket.on("notificationToList", async (data) => {
      for (const roleId of data.receivers) {
        try {
          const users = await User.find({
            role: roleId,
            // !emitterId
            _id: { $ne: data.emitterId },
          });

          let parsedBodyMainString;
          let parsedTitleString;

          switch (data.method) {
            case "add":
              parsedBodyMainString = `Um novo ${data.label} foi criado: "${data.userName}".`;
              parsedTitleString = `Novo ${data.label} Criado`;
              break;
            case "edit":
              parsedBodyMainString = `Um ${data.label} foi editado: "${data.userName}".`;
              parsedTitleString = `${data.label} Editado`;
              break;
            case "delete":
              parsedBodyMainString = `O ${data.label} "${data.userName}" foi deletado.`;
              parsedTitleString = `${data.label} Deletado`;
              break;
            default:
              break;
          }

          for (const user of users) {
            const notificationBody =
              parsedBodyMainString +
              (data.item.department
                ? ` Departamento: ${data.item.department}.`
                : "") +
              (data.item.position ? ` Cargo: ${data.item.position}.` : "");

            user.notifications.push({
              read: false,
              title: parsedTitleString,
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
