/* eslint-disable no-unused-vars */
import React from "react";

import AddIcon from "@mui/icons-material/Add";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import DeleteIcon from "@mui/icons-material/Delete";
import EngineeringIcon from "@mui/icons-material/Engineering";
import LanIcon from "@mui/icons-material/Lan";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SellIcon from "@mui/icons-material/Sell";
import SettingsIcon from "@mui/icons-material/Settings";

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
];

export default rowButtonOptions;
