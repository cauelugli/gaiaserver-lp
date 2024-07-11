/* eslint-disable no-unused-vars */
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
import RecyclingIcon from "@mui/icons-material/Recycling";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SellIcon from "@mui/icons-material/Sell";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const pageButtonOptions = [
  {
    page: "dashboard",
    label: "Dashboard",
  },
  {
    page: "customers",
    pageButtonOptions: [
      { label: "Empresa", icon: <ApartmentIcon />, modal: "AddCustomer" },
      { label: "Pessoa Física", icon: <PersonIcon />, modal: "AddClient" },
      {
        label: "Importar Contatos",
        icon: <UploadFileIcon />,
        modal: "ImportContacts",
      },
    ],
  },
  {
    page: "requests",
    pageButtonOptions: [
      {
        label: "Job / Atendimento",
        icon: <EngineeringIcon />,
        modal: "AddJob",
      },
      { label: "Venda", icon: <SellIcon />, modal: "AddSale" },
    ],
  },
  {
    page: "users",
    pageButtonOptions: [
      { label: "Colaborador", icon: <PersonIcon />, modal: "AddUser" },
      { label: "Gerente", icon: <Person4Icon />, modal: "AddManager" },
    ],
  },
  {
    page: "departments",
    pageButtonOptions: [
      { label: "Departamento", icon: <LanIcon />, modal: "AddDepartment" },
      { label: "Grupo", icon: <GroupsIcon />, modal: "AddGroup" },
    ],
  },
  {
    page: "services",
    pageButtonOptions: [
      { label: "Serviço", icon: <BuildIcon />, modal: "AddService" },
      {
        label: "Plano de Serviços",
        icon: <HubIcon />,
        modal: "AddServicePlan",
      },
    ],
  },
  {
    page: "quotes",
    pageButtonOptions: [
      { label: "Empresa", icon: <ApartmentIcon />, modal: "" },
      { label: "Empresa", icon: <ApartmentIcon />, modal: "" },
      { label: "Empresa", icon: <ApartmentIcon />, modal: "" },
    ],
  },
  {
    // TO-DO
    page: "stock",
    pageButtonOptions: [
      {
        label: "Entrada de Estoque",
        icon: <Inventory2Icon />,
        modal: "AddStockEntry",
      },
    ],
  },
  {
    // TO-DO
    page: "products",
    pageButtonOptions: [
      { label: "Produto", icon: <SellIcon />, modal: "AddPRoduct" },
    ],
  },
  {
    // TO-DO
    page: "materials",
    pageButtonOptions: [{ label: "XXX", icon: <RecyclingIcon />, modal: "" }],
  },
  {
    page: "chat",
    pageButtonOptions: [
      { label: "Mensagem", icon: <ApartmentIcon />, modal: "AddChat" },
    ],
  },
  {
    page: "projects",
    pageButtonOptions: [
      { label: "Projeto", icon: <RocketLaunchIcon />, modal: "AddProject" },
      {
        label: "Projeto Recorrente",
        icon: <RecyclingIcon />,
        modal: "AddRecurrentProject",
      },
    ],
  },
  {
    page: "finance",
    pageButtonOptions: [
      { label: "Receita", icon: <ApartmentIcon />, modal: "AddFinanceIncome" },
      { label: "Despesa", icon: <ApartmentIcon />, modal: "AddFinanceOutcome" },
    ],
  },
  {
    page: "reports",
    pageButtonOptions: [],
  },
  {
    page: "security",
    pageButtonOptions: [
      { label: "Operador", icon: <ManageAccountsIcon />, modal: "AddOperator" },
      { label: "Cargo", icon: <AssignmentIndIcon />, modal: "AddPosition" },
      { label: "Perfil de Acesso", icon: <AdminPanelSettingsIcon />, modal: "AddRole" },
    ],
  },
];

export default pageButtonOptions;
