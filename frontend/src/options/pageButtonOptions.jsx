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
];

export default pageButtonOptions;
