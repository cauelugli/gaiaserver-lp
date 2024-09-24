// eslint-disable-next-line no-unused-vars
import React from "react";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BuildIcon from "@mui/icons-material/Build";
import EngineeringIcon from "@mui/icons-material/Engineering";
import GroupsIcon from "@mui/icons-material/Groups";
import HubIcon from "@mui/icons-material/Hub";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LanIcon from "@mui/icons-material/Lan";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonIcon from "@mui/icons-material/Person";
import Person4Icon from "@mui/icons-material/Person4";
import SellIcon from "@mui/icons-material/Sell";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { modals } from "./modals";

const pageButtonOptions = [
  {
    page: "dashboard",
    label: "Dashboard",
  },
  {
    page: "customers",
    pageButtonOptions: [
      {
        label: "Empresa",
        icon: <ApartmentIcon />,
        modal: modals["Customer"],
      },
      {
        label: "Pessoa Física",
        icon: <PersonIcon />,
        modal: modals["Client"],
      },
      {
        label: "Importar Contatos",
        icon: <UploadFileIcon />,
        modal: modals["ImportCustomers"],
      },
    ],
  },
  {
    page: "requests",
    pageButtonOptions: [
      {
        label: "Job",
        icon: <EngineeringIcon />,
        modal: modals["Job"],
      },
      {
        label: "Venda",
        icon: <SellIcon />,
        modal: modals["Sale"],
      },
    ],
  },
  {
    page: "users",
    pageButtonOptions: [
      {
        label: "Colaborador",
        icon: <PersonIcon />,
        modal: modals["User"],
      },
      {
        label: "Gerente",
        icon: <Person4Icon />,
        modal: modals["Manager"],
      },
    ],
  },
  {
    page: "departments",
    pageButtonOptions: [
      {
        label: "Departamento",
        icon: <LanIcon />,
        modal: modals["Department"],
      },
      {
        label: "Grupo",
        icon: <GroupsIcon />,
        modal: modals["Group"],
      },
    ],
  },
  {
    page: "services",
    pageButtonOptions: [
      {
        label: "Serviço",
        icon: <BuildIcon />,
        modal: modals["Service"],
      },
      {
        label: "Plano de Serviços",
        icon: <HubIcon />,
        modal: modals["ServicePlan"],
      },
    ],
  },
  {
    page: "quotes",
    pageButtonOptions: [""],
  },
  {
    page: "stock",
    pageButtonOptions: [
      {
        label: "Entrada de Estoque",
        icon: <Inventory2Icon />,
        modal: modals["StockEntry"],
      },
    ],
  },
  {
    page: "products",
    pageButtonOptions: [
      {
        label: "Produto",
        icon: <SellIcon />,
        modal: modals["Product"],
      },
    ],
  },
  {
    page: "chat",
    pageButtonOptions: [
      { label: "Mensagem", icon: <ApartmentIcon />, modal: "oneday" },
    ],
  },
  {
    page: "security",
    pageButtonOptions: [
      {
        label: "Operador",
        icon: <ManageAccountsIcon />,
        modal: modals["Operator"],
      },
      {
        label: "Cargo",
        icon: <AssignmentIndIcon />,
        modal: modals["Position"],
      },
      {
        label: "Perfil de Acesso",
        icon: <AdminPanelSettingsIcon />,
        modal: modals["Role"],
      },
    ],
  },
];

export default pageButtonOptions;
