export const options = {
  Client: [
    { label: "Telefone", value: "phone" },
    { label: "E-mail", value: "email" },
    { label: "Endereço", value: "addressHome" },
  ],
  Customer: [
    { label: "Telefone", value: "phone" },
    { label: "Contato Principal", value: "mainContactName" },
    { label: "E-mail", value: "mainContactEmail" },
    { label: "Endereço", value: "address" },
  ],
  Job: [
    { label: "Cliente", value: "customer" },
    { label: "Agendado para", value: "scheduledTo" },
    { label: "Valor", value: "price" },
    { label: "Status", value: "status" },
  ],
  Sale: [
    { label: "Cliente", value: "customer" },
    { label: "Valor", value: "price" },
    { label: "Status", value: "status" },
  ],
  Service: [
    { label: "Tipo", value: "type" },
    { label: "Valor", value: "price" },
    { label: "Produtos", value: "products" },
  ],
  ServicePlan: [
    { label: "Período", value: "period" },
    { label: "Dia de Renovação", value: "renewDay" },
    { label: "Valor", value: "price" },
    { label: "Serviços", value: "services" },
  ],
  StockEntry: [
    { label: "Produtos", value: "items" },
    { label: "Valor", value: "price" },
    { label: "Criado em", value: "createdAt" },
    { label: "Status", value: "status" },
  ],
};
