// eslint-disable-next-line no-unused-vars
import React from "react";

const pageOptions = [
  {
    page: "customers",
    label: "Clientes",
    models: ["Customer", "Client"],
    tabs: ["Empresas", "Pessoa Física"],
    tableColumns: [
      // CUSTOMER TABLE
      [
        {
          id: "image",
          label: "📷",
        },
        {
          id: "name",
          label: "Nome",
        },
        {
          id: "phone",
          label: "Telefone",
        },
        {
          id: "mainContactName",
          label: "Contato Principal",
        },
        {
          id: "address",
          label: "Endereço",
        },
      ],
      // CLIENT TABLE
      [
        {
          id: "image",
          label: "📷",
        },
        {
          id: "name",
          label: "Nome",
        },
        {
          id: "cellphone",
          label: "Telefone",
        },
        {
          id: "email",
          label: "E-mail",
        },
        {
          id: "addressHome",
          label: "Endereço",
        },
      ],
    ],
  },
  {
    page: "requests",
    models: ["Job", "Sale"],
    label: "Solicitações",
    tabs: ["Jobs", "Vendas"],
    tableColumns: [
      // JOB TABLE
      [
        {
          id: "number",
          label: "#",
        },
        {
          id: "title",
          label: "Título",
        },
        {
          id: "customer",
          label: "Cliente",
        },
        {
          id: "scheduledTo",
          label: "Agendado para",
        },
        {
          id: "scheduleTime",
          label: "Horário",
        },
        {
          id: "price",
          label: "Valor",
        },
        {
          id: "status",
          label: "Status",
        },
      ],
      // SALE TABLE
      [
        {
          id: "number",
          label: "#",
        },
        {
          id: "customer",
          label: "Cliente",
        },
        {
          id: "products",
          label: "Itens",
        },
        {
          id: "price",
          label: "Valor Total",
        },
        {
          id: "deliveryScheduledTo",
          label: "Entregar em",
        },
        {
          id: "status",
          label: "Status",
        },
      ],
    ],
  },
  {
    page: "services",
    models: ["Service", "ServicePlan"],
    label: "Serviços",
    tabs: ["Setores", "Planos"],
    tableColumns: [
      // SERVICE TABLE
      [
        {
          id: "name",
          label: "Nome",
        },
        {
          id: "type",
          label: "Tipo",
        },
        {
          id: "products",
          label: "Produtos",
        },
        {
          id: "price",
          label: "Valor",
        },
      ],
      // SERVICE PLANS TABLE
      [
        {
          id: "name",
          label: "Nome",
        },
        {
          id: "period",
          label: "Período de Vigência",
        },
        {
          id: "renewDay",
          label: "Dia de Renovação",
        },
        {
          id: "services",
          label: "Serviços",
        },
        {
          id: "price",
          label: "Valor",
        },
      ],
    ],
  },
  {
    page: "stock",
    label: "Estoque",
    models: ["StockEntry"],
    tabs: ["Entradas"],
    tableColumns: [
      // STOCK ENTRIES TABLE
      [
        {
          id: "number",
          label: "#",
        },
        {
          id: "items",
          label: "Itens",
        },
        {
          id: "price",
          label: "Valor Total",
        },
        {
          id: "status",
          label: "Status",
        },
        {
          id: "createdAt",
          label: "Adicionado em",
        },
      ],
    ],
  },
  {
    page: "products",
    label: "Produtos",
    models: ["Product"],
    tabs: [],
  },
  {
    page: "finance",
    label: "Financeiro",
    tabs: ["A Receber", "A Pagar"],
    models: ["FinanceIncome", "FinanceOutcome"],
    tableColumns: [
      [
        {
          id: "number",
          label: "#",
        },
        {
          id: "typeIncome",
          label: "Tipo",
        },
        {
          id: "customer",
          label: "Cliente",
        },
        {
          id: "items",
          label: "Itens",
        },
        {
          id: "price",
          label: "Valor",
        },
        {
          id: "status",
          label: "Status",
        },
        {
          id: "createdAt",
          label: "Criado em",
        },
      ],
      [
        {
          id: "number",
          label: "#",
        },
        {
          id: "typeOutcome",
          label: "Tipo",
        },
        {
          id: "items",
          label: "Itens",
        },
        {
          id: "price",
          label: "Valor",
        },
        {
          id: "status",
          label: "Status",
        },
        {
          id: "createdAt",
          label: "Criado em",
        },
      ],
    ],
  },
  {
    page: "reports",
    label: "Relatórios",
    tabs: [],
    tableColumns: [],
  },
];

export default pageOptions;
