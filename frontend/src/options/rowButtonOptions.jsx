/* eslint-disable no-unused-vars */
import React from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EngineeringIcon from "@mui/icons-material/Engineering";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SellIcon from "@mui/icons-material/Sell";

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
];

export default rowButtonOptions;
