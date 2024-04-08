const http = require("http");
const { Server } = require("socket.io");
const User = require("./models/User");
const Manager = require("./models/Manager");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://gaiaserver"],
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

    socket.on("forceRefresh", () => {
      io.emit("forceRefresh");
    });

    socket.on("recentActivityRefresh", () => {
      io.emit("recentActivityRefresh");
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

    socket.on("whenJobIsCreated", async (data) => {
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
            type: "Novo Job",
            noteBody: `Novo Job ${data.title} criado por ${data.sender} em ${data.date}.`,
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
        console.error("Error processing whenJobIsCreated:", error);
      }
    });

    socket.on("whenSaleIsCreated", async (data) => {
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
            type: "Nova Venda",
            noteBody: `Nova Venda criada por ${data.sender} em ${data.date}.`,
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
        console.error("Error processing whenJobIsCreated:", error);
      }
    });

    socket.on("requestApproval", async (data) => {
      try {
        const receiverSocketId =
          userSocketMap[data.receiver.id || data.receiver._id];

        const newNotification = {
          id: Date.now(),
          type: "Aprovação",
          noteBody: `Olá ${data.receiver}! ${
            data.sender
          } está solicitando aprovação para ${
            data.type ? "Entrada de Estoque" : "o Job"
          } "${!data.type && data.job.title}" em ${data.date}.`,
          sender: data.sender,
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

    socket.on("whenProjectIsCreated", async (data) => {
      try {
        const usersToNotify = await Promise.all(
          data.list.map(async (userId) => {
            let user = await User.findById(userId);
            if (!user) {
              user = await Manager.findById(userId);
            }
            return user;
          })
        );

        for (const user of usersToNotify) {
          if (!user) {
            continue;
          }

          const newNotification = {
            id: Date.now(),
            type: "Novo Projeto",
            noteBody: `Olá! Você foi incluido no projeto ${data.projectName} criado por ${data.sender} em ${data.date}.`,
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
        console.error("Error processing whenProjectIsCreated:", error);
      }
    });

    socket.on("notifyTaskAssignees", async (data) => {
      try {
        const usersToNotify = await Promise.all(
          data.list.map(async (userId) => {
            let user = await User.findById(userId);
            if (!user) {
              user = await Manager.findById(userId);
            }
            return user;
          })
        );

        for (const user of usersToNotify) {
          if (!user) {
            continue;
          }

          const newNotification = {
            id: Date.now(),
            type: "Nova Interação em Tarefa",
            noteBody: `Olá! Há um novo comentário de ${data.sender} em uma tarefa em que você é Designado, no projeto ${data.projectName}.`,
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
        console.error("Error processing whenProjectIsCreated:", error);
      }
    });

    socket.on("resolvedTask", async (data) => {
      try {
        const usersToNotify = await Promise.all(
          data.list.map(async (userId) => {
            let user = await User.findById(userId);
            if (!user) {
              user = await Manager.findById(userId);
            }
            return user;
          })
        );

        for (const user of usersToNotify) {
          if (!user) {
            continue;
          }

          const newNotification = {
            id: Date.now(),
            type: "Tarefa Resolvida",
            noteBody: `Olá! O colaborador ${data.sender} resolveu uma tarefa em que você é Designado no projeto ${data.projectName}.`,
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
        console.error("Error processing resolvedTask:", error);
      }
    });

    socket.on("resolvedProject", async (data) => {
      try {
        const usersToNotify = await Promise.all(
          data.list.map(async (userId) => {
            let user = await User.findById(userId);
            if (!user) {
              user = await Manager.findById(userId);
            }
            return user;
          })
        );

        for (const user of usersToNotify) {
          if (!user) {
            continue;
          }

          const newNotification = {
            id: Date.now(),
            type: "Projeto Concluído",
            noteBody: `Olá! O colaborador ${data.sender} resolveu a última tarefa no projeto ${data.projectName} em que você participa.`,
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
        console.error("Error processing resolvedTask:", error);
      }
    });

    socket.on("disconnect", () => {
      // console.log("User disconnected");
    });
  });
};

module.exports = initSocket;
