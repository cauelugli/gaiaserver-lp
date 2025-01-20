async function createMessageTitleAndBody(data) {
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
       ${`por ${data.sourceId}`}
  
      ${data.target.customer}
      ${data.target.scheduledTo ? `Para: ${data.target.scheduledTo}` : ""}
      ${
        data.target.deliveryScheduledTo
          ? `Para: ${data.target.deliveryScheduledTo}`
          : ""
      }
      ${data.target.worker || ""}
      ${data.target.seller || ""}
      ${data.target.scheduleTime ? `Horário: ${data.target.scheduleTime}` : ""}
      `;
  } else {
    notificationBody = "";
  }

  return { title: parsedTitleString, body: notificationBody };
}

module.exports = { createMessageTitleAndBody };
