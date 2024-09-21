/* eslint-disable no-unused-vars */
import React from "react";

import AddIcon from "@mui/icons-material/Add";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import EngineeringIcon from "@mui/icons-material/Engineering";
import GroupIcon from "@mui/icons-material/Group";
import LanIcon from "@mui/icons-material/Lan";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Person4Icon from "@mui/icons-material/Person4";
import SellIcon from "@mui/icons-material/Sell";
import SettingsIcon from "@mui/icons-material/Settings";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import { status } from "./staticListOptions";

const rowButtonOptions = [
  {
    page: "customers",
    models: ["Customer", "Customer"],
    menus: {
      0: [
        {
          label: "Editar",
          action: "edit",
          modal: "Customer",
          icon: <ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "Customer",
          icon: <DeleteIcon />,
        },
        {
          label: "Novo",
          icon: <AddIcon />,
          action: "add",
          submenu: [
            {
              label: "Job",
              modal: "Job",
              targeted: true,
              icon: <EngineeringIcon />,
            },
            {
              label: "Venda",
              modal: "Sale",
              targeted: true,
              icon: <SellIcon />,
            },
          ],
        },
      ],
      1: [
        {
          label: "Editar",
          action: "edit",
          modal: "Client",
          icon: <ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "Client",
          icon: <DeleteIcon />,
        },
        {
          label: "Novo",
          icon: <AddIcon />,
          action: "add",
          submenu: [
            {
              label: "Job",
              modal: "Client",
              targeted: true,
              icon: <EngineeringIcon />,
            },
            {
              label: "Venda",
              modal: "Client",
              targeted: true,
              icon: <SellIcon />,
            },
          ],
        },
      ],
    },
  },
  {
    page: "users",
    models: ["User", "User"],
    menus: {
      0: [
        {
          label: "Editar",
          action: "edit",
          modal: "User",
          icon: <ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "User",
          icon: <DeleteIcon />,
        },
        {
          label: "Alterar",
          icon: <SettingsIcon />,
          action: "dynamicChange",
          submenu: [
            {
              modal: "small",
              sourceModel: "User",
              targetModel: "Department",
              targetLabel: "Departamento",
              icon: <LanIcon />,
            },
            {
              modal: "small",
              sourceModel: "User",
              targetModel: "Position",
              targetLabel: "Posição",
              icon: <AssignmentIndIcon />,
            },
          ],
        },
      ],
      1: [
        {
          label: "Editar",
          action: "edit",
          modal: "User",
          icon: <ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "User",
          icon: <DeleteIcon />,
        },
        {
          label: "Alterar",
          icon: <SettingsIcon />,
          action: "dynamicChange",
          submenu: [
            {
              modal: "small",
              sourceModel: "User",
              targetModel: "Department",
              targetLabel: "Departamento",
              icon: <LanIcon />,
            },
            {
              modal: "small",
              sourceModel: "User",
              targetModel: "Position",
              targetLabel: "Posição",
              icon: <AssignmentIndIcon />,
            },
          ],
        },
      ],
    },
  },
  {
    page: "requests",
    models: ["Job", "Sale"],
    menus: {
      0: [
        {
          label: "Resolver",
          action: "resolve",
          modal: "Job",
          icon: <CheckIcon />,
        },
        {
          label: "Editar",
          action: "edit",
          modal: "Job",
          icon: <ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "Job",
          icon: <DeleteIcon />,
        },
        {
          label: "Alterar",
          icon: <SettingsIcon />,
          action: "dynamicChange",
          submenu: [
            {
              modal: "small",
              sourceModel: "Job",
              targetModel: "Static",
              targetLabel: "Status",
              icon: <TimelapseIcon />,
              staticAttribute: "status",
              staticList: status,
            },
          ],
        },
      ],
      1: [
        {
          label: "Resolver",
          action: "resolve",
          modal: "Sale",
          icon: <CheckIcon />,
        },
        {
          label: "Editar",
          action: "edit",
          modal: "Sale",
          icon: <ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "Sale",
          icon: <DeleteIcon />,
        },
        {
          label: "Alterar",
          icon: <SettingsIcon />,
          action: "dynamicChange",
          submenu: [
            {
              modal: "small",
              sourceModel: "Sale",
              targetModel: "Static",
              targetLabel: "Status",
              icon: <TimelapseIcon />,
              staticAttribute: "status",
              staticList: status,
            },
          ],
        },
      ],
    },
  },
  {
    page: "departments",
    models: ["Department", "Group"],
    menus: {
      0: [
        {
          label: "Editar",
          action: "edit",
          modal: "Department",
          icon: <ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "Department",
          icon: <DeleteIcon />,
        },
        {
          label: "Alterar",
          icon: <SettingsIcon />,
          action: "dynamicChange",
          submenu: [
            {
              modal: "small",
              sourceModel: "Department",
              targetModel: "User",
              targetLabel: "Membros",
              targetFlag: "members",
              icon: <GroupIcon />,
            },
            {
              modal: "small",
              sourceModel: "Department",
              targetModel: "User",
              targetLabel: "Gerência",
              targetFlag: "manager",
              icon: <Person4Icon />,
            },
          ],
        },
      ],
      1: [
        {
          label: "Editar",
          action: "edit",
          modal: "Group",
          icon: <ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "Group",
          icon: <DeleteIcon />,
        },
        {
          label: "Alterar",
          icon: <SettingsIcon />,
          action: "dynamicChange",
          submenu: [
            {
              modal: "small",
              sourceModel: "Department",
              targetModel: "User",
              targetLabel: "Membros",
              targetFlag: "members",
              icon: <GroupIcon />,
            },
          ],
        },
      ],
    },
  },
];

export default rowButtonOptions;
