// eslint-disable-next-line no-unused-vars
import React from "react";

import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import GradingIcon from "@mui/icons-material/Grading";
import GroupIcon from "@mui/icons-material/Group";
import LanIcon from "@mui/icons-material/Lan";
import BuildIcon from "@mui/icons-material/Build";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import SellIcon from "@mui/icons-material/Sell";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SettingsIcon from "@mui/icons-material/Settings";

export const permissionOptions = [
  {
    tooltip: "Dashboard",
    label: "dashboard",
    icon: <DashboardIcon sx={{ fontSize: 26 }} />,
  },
  {
    tooltip: "Clientes",
    label: "customers",
    icon: <WorkIcon sx={{ fontSize: 26 }} />,
  },
  {
    tooltip: "Solicitações",
    label: "requests",
    icon: <GradingIcon sx={{ fontSize: 26 }} />,
  },
  {
    tooltip: "Colaboradores",
    label: "users",
    icon: <GroupIcon sx={{ fontSize: 26 }} />,
  },
  {
    tooltip: "Departamentos",
    label: "departments",
    icon: <LanIcon sx={{ fontSize: 26 }} />,
  },
  {
    tooltip: "Serviços",
    label: "services",
    icon: <BuildIcon sx={{ fontSize: 26 }} />,
  },
  {
    tooltip: "Orçamentos",
    label: "quotes",
    icon: <RequestQuoteIcon sx={{ fontSize: 26 }} />,
  },
  {
    tooltip: "Estoque",
    label: "stock",
    icon: <WarehouseIcon sx={{ fontSize: 26 }} />,
  },
  {
    tooltip: "Produtos",
    label: "products",
    icon: <SellIcon sx={{ fontSize: 26 }} />,
  },
  {
    tooltip: "Financeiro",
    label: "finance",
    icon: <AttachMoneyIcon sx={{ fontSize: 26 }} />,
  },
  {
    tooltip: "Relatórios",
    label: "reports",
    icon: <AssessmentIcon sx={{ fontSize: 26 }} />,
  },
  {
    tooltip: "Acessos",
    label: "security",
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 26 }} />,
  },
  {
    tooltip: "Arquivos",
    label: "files",
    icon: <InsertDriveFileIcon sx={{ fontSize: 26 }} />,
  },
  {
    tooltip: "Configurações",
    label: "config",
    icon: <SettingsIcon sx={{ fontSize: 26 }} />,
  },
];
