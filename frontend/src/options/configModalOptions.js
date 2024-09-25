import React from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import WorkIcon from "@mui/icons-material/Work";
import GroupIcon from "@mui/icons-material/Group";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LanIcon from "@mui/icons-material/Lan";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import NotificationsIcon from "@mui/icons-material/Notifications";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AutoFixNormalIcon from "@mui/icons-material/AutoFixNormal";
import SellIcon from "@mui/icons-material/Sell";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LockIcon from "@mui/icons-material/Lock";
import BuildIcon from "@mui/icons-material/Build";
import GradingIcon from "@mui/icons-material/Grading";
import TableViewIcon from "@mui/icons-material/TableView";

import AgendaModal from "../forms/config/Agenda";
import CustomersModal from "../forms/config/Customers";
import CustomizationModal from "../forms/config/Customization";
import DashboardModal from "../forms/config/Dashboard";
import DepartmentsModal from "../forms/config/Departments";
import FilesModal from "../forms/config/Files";
import FinanceModal from "../forms/config/Finance";
import NotificationsModal from "../forms/config/Notifications";
import PermissionsModal from "../forms/config/Permissions";
import ProductsModal from "../forms/config/Products";
import QuotesModal from "../forms/config/Quotes";
import RequestsModal from "../forms/config/Requests";
import SecurityModal from "../forms/config/Security";
import ServicesModal from "../forms/config/Services";
import StockModal from "../forms/config/Stock";
import TablesModal from "../forms/config/Tables";
import UsersModal from "../forms/config/Users";

export const configModalOptions = (userName, userId, configCustomization) => [
  {
    icon: React.createElement(CalendarMonthIcon, { sx: { fontSize: 48 } }),
    text: "Agenda",
    modal: React.createElement(AgendaModal),
    isBasic: false,
  },
  {
    icon: React.createElement(InsertDriveFileIcon, { sx: { fontSize: 48 } }),
    text: "Arquivos",
    modal: React.createElement(FilesModal),
    isBasic: false,
  },
  {
    icon: React.createElement(WorkIcon, { sx: { fontSize: 48 } }),
    text: "Clientes",
    modal: React.createElement(CustomersModal),
    isBasic: true,
  },
  {
    icon: React.createElement(GroupIcon, { sx: { fontSize: 48 } }),
    text: "Colaboradores",
    modal: React.createElement(UsersModal),
    isBasic: true,
  },
  {
    icon: React.createElement(DashboardIcon, { sx: { fontSize: 48 } }),
    text: "Dashboard",
    modal: React.createElement(DashboardModal),
    isBasic: false,
  },
  {
    icon: React.createElement(LanIcon, { sx: { fontSize: 48 } }),
    text: "Departamentos",
    modal: React.createElement(DepartmentsModal),
    isBasic: true,
  },
  {
    icon: React.createElement(WarehouseIcon, { sx: { fontSize: 48 } }),
    text: "Estoque",
    modal: React.createElement(StockModal, {
      userName,
      userId,
      configCustomization,
    }),
    isBasic: true,
  },
  {
    icon: React.createElement(AttachMoneyIcon, { sx: { fontSize: 48 } }),
    text: "Financeiro",
    modal: React.createElement(FinanceModal),
    isBasic: true,
  },
  {
    icon: React.createElement(NotificationsIcon, { sx: { fontSize: 48 } }),
    text: "Notificações",
    modal: React.createElement(NotificationsModal),
    isBasic: false,
  },
  {
    icon: React.createElement(RequestQuoteIcon, { sx: { fontSize: 48 } }),
    text: "Orçamentos",
    modal: React.createElement(QuotesModal),
    isBasic: true,
  },
  {
    icon: React.createElement(AdminPanelSettingsIcon, { sx: { fontSize: 48 } }),
    text: "Permissões",
    modal: React.createElement(PermissionsModal),
    isBasic: false,
  },
  {
    icon: React.createElement(AutoFixNormalIcon, { sx: { fontSize: 48 } }),
    text: "Personalização",
    modal: React.createElement(CustomizationModal),
    isBasic: false,
  },
  {
    icon: React.createElement(SellIcon, { sx: { fontSize: 48 } }),
    text: "Produtos",
    modal: React.createElement(ProductsModal, {
      userName,
      userId,
      configCustomization,
    }),
    isBasic: true,
  },
  {
    icon: React.createElement(AssessmentIcon, { sx: { fontSize: 48 } }),
    text: "Relatórios",
    modal: React.createElement(RequestsModal),
    isBasic: false,
  },
  {
    icon: React.createElement(LockIcon, { sx: { fontSize: 48 } }),
    text: "Segurança",
    modal: React.createElement(SecurityModal),
    isBasic: false,
  },
  {
    icon: React.createElement(BuildIcon, { sx: { fontSize: 48 } }),
    text: "Serviços",
    modal: React.createElement(ServicesModal),
    isBasic: true,
  },
  {
    icon: React.createElement(GradingIcon, { sx: { fontSize: 48 } }),
    text: "Solicitações",
    modal: React.createElement(RequestsModal),
    isBasic: true,
  },
  {
    icon: React.createElement(TableViewIcon, { sx: { fontSize: 48 } }),
    text: "Tabelas",
    modal: React.createElement(TablesModal),
    isBasic: false,
  },
];
