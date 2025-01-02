const axios = require("axios"); // CommonJS
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

async function createMessageTitleAndBody(data) {
  const ids = await api.get("/idIndexList").then((res) => res.data);

  const parsedTitleString = `${
    data.method === "Adicionad" ? (data.isFemaleGender ? "Nova" : "Novo") : ""
  } ${data.model} ${data.method}${data.isFemaleGender ? "a" : "o"}`;

  let notificationBody;
  if (data.target) {
    notificationBody = `Olá, Admin! ${
      data.method === "Adicionad"
        ? data.isFemaleGender
          ? "Uma nova"
          : "Um novo"
        : data.isFemaleGender
        ? "A"
        : "O"
    } ${data.model} 
      ${typeof data.target === "string" ? data.target : ""}
      ${data.target.type ? ` do tipo ${data.target.type} ` : ""}
      ${data.target.name ? `"${data.target.name}"` : ""}
       foi ${data.method}${data.isFemaleGender ? "a" : "o"}
       ${
         data.sourceId
           ? `por ${ids?.find((item) => item.id === data.sourceId)?.name || ""}`
           : ""
       }
  
      ${
        data.target.customer
          ? `Cliente: ${
              ids?.find((item) => item.id === data.target.customer)?.name || ""
            }`
          : ""
      }
      ${data.target.scheduledTo ? `Para: ${data.target.scheduledTo}` : ""}
      ${
        data.target.deliveryScheduledTo
          ? `Para: ${data.target.deliveryScheduledTo}`
          : ""
      }
      ${
        data.target.worker
          ? `Colaborador Designado: ${
              ids?.find((item) => item.id === data.target.worker)?.name || ""
            }`
          : ""
      }
      ${
        data.target.seller
          ? `Vendedor: ${
              ids?.find((item) => item.id === data.target.seller)?.name || ""
            }`
          : ""
      }
      ${data.target.scheduleTime ? `Horário: ${data.target.scheduleTime}` : ""}
      `;
  } else {
    notificationBody = "";
  }

  return { title: parsedTitleString, body: notificationBody };
}

module.exports = { createMessageTitleAndBody };
