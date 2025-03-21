import React from "react";

import { icons } from "../icons";

import AgendaModal from "../forms/config/Agenda";
import CustomersModal from "../forms/config/Customers";
import CustomizationModal from "../forms/config/Customization";
import ReportsModal from "../forms/config/Reports";
import DepartmentsModal from "../forms/config/Departments";
import FilesModal from "../forms/config/Files";
import FinanceModal from "../forms/config/Finance";
import NotificationsModal from "../forms/config/Notifications";
import PermissionsModal from "../forms/config/Permissions";
import ProductsModal from "../forms/config/Products";
import RequestsModal from "../forms/config/Requests";
import SecurityModal from "../forms/config/Security";
import ServicesModal from "../forms/config/Services";
import StockModal from "../forms/config/Stock";
import TablesModal from "../forms/config/Tables";
import UsersModal from "../forms/config/Users";

export const configModalOptions = (userName, userId, configCustomization) => [
  {
    icon: React.createElement(icons.CalendarMonthIcon, { sx: { fontSize: "4vw" } }),
    text: "Agenda",
    modal: React.createElement(AgendaModal),
    isBasic: false,
  },
  {
    icon: React.createElement(icons.InsertDriveFileIcon, { sx: { fontSize: "4vw" } }),
    text: "Arquivos",
    modal: React.createElement(FilesModal),
    isBasic: false,
  },
  {
    icon: React.createElement(icons.WorkIcon, { sx: { fontSize: "4vw" } }),
    text: "Clientes",
    modal: React.createElement(CustomersModal),
    isBasic: true,
  },
  {
    icon: React.createElement(icons.GroupIcon, { sx: { fontSize: "4vw" } }),
    text: "Colaboradores",
    modal: React.createElement(UsersModal),
    isBasic: true,
  },
  {
    icon: React.createElement(icons.LanIcon, { sx: { fontSize: "4vw" } }),
    text: "Departamentos",
    modal: React.createElement(DepartmentsModal),
    isBasic: true,
  },
  {
    icon: React.createElement(icons.WarehouseIcon, { sx: { fontSize: "4vw" } }),
    text: "Estoque",
    modal: React.createElement(StockModal),
    isBasic: true,
  },
  {
    icon: React.createElement(icons.AttachMoneyIcon, { sx: { fontSize: "4vw" } }),
    text: "Financeiro",
    modal: React.createElement(FinanceModal),
    isBasic: true,
  },
  {
    icon: React.createElement(icons.NotificationsIcon, { sx: { fontSize: "4vw" } }),
    text: "Notificações",
    modal: React.createElement(NotificationsModal),
    isBasic: false,
  },
  {
    icon: React.createElement(icons.AdminPanelSettingsIcon, { sx: { fontSize: "4vw" } }),
    text: "Permissões",
    modal: React.createElement(PermissionsModal),
    isBasic: true,
  },{
    icon: React.createElement(icons.BarChartIcon, { sx: { fontSize: "4vw" } }),
    text: "Relatórios",
    modal: React.createElement(ReportsModal),
    isBasic: true,
  },
  {
    icon: React.createElement(icons.AutoFixNormalIcon, { sx: { fontSize: "4vw" } }),
    text: "Personalização",
    modal: React.createElement(CustomizationModal),
    isBasic: false,
  },{
    icon: React.createElement(icons.AutoFixNormalIcon, { sx: { fontSize: "4vw" } }),
    text: "Personalização",
    modal: React.createElement(CustomizationModal),
    isBasic: false,
  },
  {
    icon: React.createElement(icons.SellIcon, { sx: { fontSize: "4vw" } }),
    text: "Produtos",
    modal: React.createElement(ProductsModal, {
      userName,
      userId,
      configCustomization,
    }),
    isBasic: true,
  },
  {
    icon: React.createElement(icons.AssessmentIcon, { sx: { fontSize: "4vw" } }),
    text: "Relatórios",
    modal: React.createElement(RequestsModal),
    isBasic: false,
  },
  {
    icon: React.createElement(icons.LockIcon, { sx: { fontSize: "4vw" } }),
    text: "Segurança",
    modal: React.createElement(SecurityModal),
    isBasic: false,
  },
  {
    icon: React.createElement(icons.BuildIcon, { sx: { fontSize: "4vw" } }),
    text: "Serviços",
    modal: React.createElement(ServicesModal),
    isBasic: true,
  },
  {
    icon: React.createElement(icons.GradingIcon, { sx: { fontSize: "4vw" } }),
    text: "Solicitações",
    modal: React.createElement(RequestsModal),
    isBasic: true,
  },
  {
    icon: React.createElement(icons.TableViewIcon, { sx: { fontSize: "4vw" } }),
    text: "Tabelas",
    modal: React.createElement(TablesModal),
    isBasic: false,
  },
];
