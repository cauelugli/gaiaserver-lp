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
      userSocketMap[userId] = socket.id;
    });

    socket.on("test", () => {
      console.log("\nWebsocket Test OK!\n");
    });

    socket.on("whenUserIsCreated", async (data) => {
      try {
        const usersToNotify = await Promise.all(
          data.list.map(async (role) => {
            if (role.name.startsWith("Gerente")) {
              return await Manager.findOne({ "role.name": role.name });
            } else {
              return await User.findOne({ "role.name": role.name });
            }
          })
        );

        for (const user of usersToNotify) {
          if (!user) {
            continue;
          }

          const newNotification = {
            id: Date.now(),
            type: "Novo Usuário",
            noteBody: `Usuário ${data.createdUser} criado por ${data.sender} em ${data.date}.`,
            sender: data.sender,
            status: "Não Lida",
          };

          let updatedUser;

          if (user instanceof User) {
            await User.updateOne(
              { _id: user._id },
              { $set: { [`notifications.${Date.now()}`]: newNotification } }
            );
            updatedUser = await User.findById(user._id);
          } else if (user instanceof Manager) {
            await Manager.updateOne(
              { _id: user._id },
              { $set: { [`notifications.${Date.now()}`]: newNotification } }
            );
            updatedUser = await Manager.findById(user._id);
          }

          const receiverSocketId = userSocketMap[user._id];
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("notificationsUpdate", {
              notifications: updatedUser.notifications,
            });
          }
        }
      } catch (error) {
        console.error("Error processing whenUserIsCreated:", error);
      }
    });

    socket.on("requestApproval", async (data) => {
      try {
        const receiverSocketId = userSocketMap[data.receiver.id];

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
