// eslint-disable-next-line no-unused-vars
import React from "react";

import { icons } from "../icons";

import { modals } from "./modals";

const pageButtonOptions = [
  {
    page: "customers",
    pageButtonOptions: [
      {
        label: "Empresa",
        icon: <icons.ApartmentIcon />,
        modal: modals["Customer"],
      },
      {
        label: "Pessoa Física",
        icon: <icons.PersonIcon />,
        modal: modals["Client"],
      },
      {
        label: "Importar Contatos",
        icon: <icons.UploadFileIcon />,
        modal: modals["ImportCustomers"],
      },
    ],
  },
  {
    page: "requests",
    pageButtonOptions: [
      {
        label: "Job",
        icon: <icons.EngineeringIcon />,
        modal: modals["Job"],
      },
      {
        label: "Venda",
        icon: <icons.SellIcon />,
        modal: modals["Sale"],
      },
    ],
  },
  {
    page: "users",
    pageButtonOptions: [
      {
        label: "Colaborador",
        icon: <icons.PersonIcon />,
        modal: modals["User"],
      },
      {
        label: "Gerente",
        icon: <icons.Person4Icon />,
        modal: modals["Manager"],
      },
    ],
  },
  {
    page: "departments",
    pageButtonOptions: [
      {
        label: "Departamento",
        icon: <icons.LanIcon />,
        modal: modals["Department"],
      },
      {
        label: "Grupo",
        icon: <icons.GroupsIcon />,
        modal: modals["Group"],
      },
    ],
  },
  {
    page: "services",
    pageButtonOptions: [
      {
        label: "Serviço",
        icon: <icons.BuildIcon />,
        modal: modals["Service"],
      },
      {
        label: "Plano de Serviços",
        icon: <icons.HubIcon />,
        modal: modals["ServicePlan"],
      },
    ],
  },
  {
    page: "stock",
    pageButtonOptions: [
      {
        label: "Entrada de Estoque",
        icon: <icons.Inventory2Icon />,
        modal: modals["StockEntry"],
      },
    ],
  },
  {
    page: "products",
    pageButtonOptions: [
      {
        label: "Produto",
        icon: <icons.SellIcon />,
        modal: modals["Product"],
      },
    ],
  },
  {
    page: "chat",
    pageButtonOptions: [
      { label: "Mensagem", icon: <icons.ApartmentIcon />, modal: "oneday" },
    ],
  },
  {
    page: "security",
    pageButtonOptions: [
      {
        label: "Operador",
        icon: <icons.ManageAccountsIcon />,
        modal: modals["Operator"],
      },
      {
        label: "Cargo",
        icon: <icons.AssignmentIndIcon />,
        modal: modals["Position"],
      },
      {
        label: "Perfil de Acesso",
        icon: <icons.AdminPanelSettingsIcon />,
        modal: modals["Role"],
      },
    ],
  },
];

export default pageButtonOptions;
