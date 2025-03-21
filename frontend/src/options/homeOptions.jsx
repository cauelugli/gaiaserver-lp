// eslint-disable-next-line no-unused-vars
import React from "react";

import { icons } from "../icons";

export const optionsMainblocks = [
  {
    icon: <icons.WorkIcon sx={{ fontSize: 52 }} />,
    text: "Clientes",
    link: "/customers",
    permissionLabel: "customers",
  },
  {
    icon: <icons.GradingIcon sx={{ fontSize: 52 }} />,
    text: "Solicitações",
    link: "/requests",
    permissionLabel: "requests",
  },
  {
    icon: <icons.GroupIcon sx={{ fontSize: 52 }} />,
    text: "Colaboradores",
    link: "/users",
    permissionLabel: "users",
  },
  {
    icon: <icons.LanIcon sx={{ fontSize: 52 }} />,
    text: "Departamentos",
    link: "/departments",
    permissionLabel: "departments",
  },
  {
    icon: <icons.SellIcon sx={{ fontSize: 52 }} />,
    text: "Produtos",
    link: "/products",
    permissionLabel: "products",
  },
  {
    icon: <icons.WarehouseIcon sx={{ fontSize: 52 }} />,
    text: "Estoque",
    link: "/stock",
    permissionLabel: "stock",
  },
  {
    icon: <icons.BuildIcon sx={{ fontSize: 52 }} />,
    text: "Serviços",
    link: "/services",
    permissionLabel: "services",
  },
  {
    icon: <icons.AttachMoneyIcon sx={{ fontSize: 52 }} />,
    text: "Financeiro",
    link: "/finance",
    permissionLabel: "finance",
  },
  {
    icon: <icons.AssessmentIcon sx={{ fontSize: 52 }} />,
    text: "Relatórios",
    link: "/reports",
    permissionLabel: "reports",
  },
  {
    icon: <icons.AdminPanelSettingsIcon sx={{ fontSize: 52 }} />,
    text: "Acessos",
    link: "/security",
    permissionLabel: "security",
  },
  {
    icon: <icons.ChatIcon sx={{ fontSize: 52 }} />,
    text: "Chat",
    link: "/chat",
    permissionLabel: "chat",
  },
  {
    icon: <icons.SettingsIcon sx={{ fontSize: 52 }} />,
    text: "Configurações",
    link: "/config",
    permissionLabel: "config",
  },
];
