const { Server } = require("socket.io");
const Admin = require("../models/models/Admin");
const User = require("../models/models/User");
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

    socket.on("notificationToList", async (data) => {
      for (const roleId of data.receivers) {
        try {
          let emitterId = data.emitterId;

          if (typeof emitterId === "string" && !ObjectId.isValid(emitterId)) {
            const admin = await Admin.findOne({ name: emitterId });
            if (admin) {
              emitterId = admin._id;
            } else {
              console.error("Admin não encontrado");
              continue;
            }
          }

          if (!ObjectId.isValid(emitterId)) {
            continue; 
          }
          emitterId = new ObjectId(emitterId);
          const users = await User.find({
            role: roleId,
            _id: { $ne: emitterId },
          });

          let parsedBodyMainString;
          let parsedTitleString;

          switch (data.method) {
            case "add":
              parsedBodyMainString = `${data.isFemale ? "Uma" : "Um"} ${
                data.isFemale ? "nova" : "novo"
              } ${data.label} foi ${data.isFemale ? "criada" : "criado"}: ${
                data.item ? data.item.name : ""
              }`;

              parsedTitleString = `${data.isFemale ? "Nova" : "Novo"} ${
                data.label
              } ${data.isFemale ? "Criada" : "Criado"}`;
              break;
            case "edit":
              parsedBodyMainString = `${data.isFemale ? "Uma" : "Um"} ${
                data.label
              } foi ${data.isFemale ? "editada" : "editado"}: "${
                data.finalTarget
              }".`;
              parsedTitleString = `${data.label} ${
                data.isFemale ? "Editada" : "Editado"
              }`;
              break;
            case "delete":
              parsedBodyMainString = `${data.isFemale ? "A" : "O"} ${
                data.label
              } "${data.finalTarget}" foi ${
                data.isFemale ? "deletada" : "deletado"
              }.`;
              parsedTitleString = `${data.label} ${
                data.isFemale ? "Deletada" : "Deletado"
              }`;
              break;
            default:
              break;
          }

          // Adiciona a notificação para cada usuário encontrado
          for (const user of users) {
            user.notifications.push({
              read: false,
              title: parsedTitleString,
              body: parsedBodyMainString,
              createdAt: new Date().toISOString(),
            });

            await user.save();
          }
        } catch (err) {
          console.error("Erro ao adicionar notificação", err);
        }
      }

      io.emit("newNotificationToList", data);
    });

    socket.on("notifyAssignee", async (data) => {
      try {
        let user;
        user = await User.findById(data.receiver);

        const parsedTitleString = `${
          data.label === "Job"
            ? "Novo Job atribuido a Você"
            : "Nova Venda atribuida a Você"
        } `;
        const notificationBody = `Olá, ${data.receiver}! ${
          data.label === "Job"
            ? "Um novo Job foi atribuído"
            : "Uma nova Venda foi atribuída"
        } a Você ${data.label === "Job" ? `: "${data.target.title}"` : ""} ${
          data.label === "Job" ? `Serviço: ${data.target.service}` : ""
        }
        Cliente: ${data.target.customer}
        Para: ${data.target.scheduledTo}
        ${
          data.target.scheduleTime
            ? ` Horário: ${data.target.scheduleTime}`
            : ""
        }
        `;

        if (user) {
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

      io.emit("newNotificationToIndividual", data);
    });

    socket.on("notifyAdmin", async (data) => {
      if (data.isAdmin === false) {
        // create conditional 'shouldNotifyAdmin' (based on Config) in the future
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
      }

      io.emit("newNotificationToAdmin", data);
    });

    socket.on("notifyApproverManager", async (data) => {
      try {
        let user;
        user = await User.findById(data.receiver);

        const parsedTitleString = `${
          data.model === "StockEntry"
            ? "Entrada de Estoque"
            : data.model === "Job"
            ? "Job"
            : "Venda"
        } Aguardando Aprovação`;
        const notificationBody = `Olá, ${data.receiver}! 
        ${
          data.model === "StockEntry"
            ? "A Entrada de Estoque"
            : data.model === "Job"
            ? "O Job"
            : "A Venda"
        } ${data.title}
        está aguardando por sua aprovação. \nSolicitado por: ${data.source}.
        `;

        if (user) {
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

      io.emit("newNotificationToIndividual", data);
    });

    socket.on("notifyNewConfiguredUser", async (data) => {
      try {
        let configuration;
        switch (data.configuration) {
          case "requestApprover":
            configuration = "Agora você é o Gerente Aprovador de Solicitações!";
            break;
          case "requestAlternate":
            configuration =
              "Agora você é o Suplente do Aprovador de Solicitações!";
          case "stockApprover":
            configuration =
              "Agora você é o Gerente Aprovador de Entradas de Estoque!";
            break;
          case "stockAlternate":
            configuration =
              "Agora você é o Suplente do Aprovador de Entradas de Estoque!";
            break;
          default:
            configuration = "";
        }

        let explanation;
        switch (data.configuration) {
          case "requestApprover":
            explanation =
              "As solicitações de Aprovação de Jobs e Vendas serão enviadas a você e, se configurado, também ao suplente.";
            break;
          case "requestAlternate":
            explanation =
              "Como Suplente do Gerente Aprovador de Solicitações (Jobs e Vendas), agora você também pode Aprovar as solicitações dos colaboradores.";
            break;
          case "stockApprover":
            explanation =
              "As solicitações de Aprovação de Entradas de Estoque serão enviadas a você e, se configurado, também ao suplente.";
            break;
          case "stockAlternate":
            explanation =
              "Como Suplente do Gerente Aprovador de Entradas de Estoque, agora você também pode Aprovar as solicitações dos colaboradores.";
            break;
          default:
            explanation = "";
        }

        let user;
        user = data.receiver
          ? data.receiver === "none"
            ? ""
            : await User.findById(data.receiver)
          : "";

        const parsedTitleString = "Nova Configuração Atribuida";
        const notificationBody = `Olá, ${data.receiver}! 
        Você recebeu uma nova configuração em seu usuário: ${configuration} ${explanation}`;

        if (user) {
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

      io.emit("newNotificationToIndividual", data);
    });

    socket.on("notifyRequester", async (data) => {
      try {
        let user;
        user = await User.findById(data.receiver);

        const parsedTitleString = "Solicitação de Aprovação Respondida";
        const notificationBody = `Olá, ${
          data.receiver
        }! Sua solicitação para aprovação para 
        ${
          data.model === "StockEntry"
            ? "Entrada de Estoque"
            : data.model === "Sale"
            ? "Venda"
            : data.model
        } ${data.target} foi respondida por ${data.manager}.`;

        if (user) {
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

      io.emit("newNotificationToIndividual", data);
    });

    socket.on("notifyStockManagerToBuyProduct", async (data) => {
      try {
        let user;
        user = await User.findById(data.receiver);

        const parsedTitleString = "Nova Solicitação de Compra";
        const notificationBody = `Olá, ${data.receiver}! 
        ${
          data.requester
            ? `${data.requester} está solicitando a compra de `
            : "Solicitada compra de "
        } ${data.product.quantity} ${data.product.name}, 
        no total de R$${data.product.finalPrice}.`;

        if (user) {
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

      io.emit("newNotificationToIndividual", data);
    });

    socket.on("disconnect", () => {
      // console.log("User disconnected");
    });
  });
};

module.exports = initSocket;
