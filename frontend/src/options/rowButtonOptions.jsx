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
        { label: "Editar", action: "edit", icon: <ModeEditIcon /> },
        { label: "Deletar", action: "delete", icon: <DeleteIcon /> },
        {
          label: "Novo",
          icon: <AddIcon />,
          submenu: [
            { label: "Job", action: "addJob", icon: <EngineeringIcon /> },
            { label: "Venda", action: "addSale", icon: <SellIcon /> },
          ],
        },
      ],
      1: [
        { label: "Editar", action: "edit", icon: <ModeEditIcon /> },
        { label: "Deletar", action: "delete", icon: <DeleteIcon /> },
        {
          label: "Novo",
          icon: <AddIcon />,
          submenu: [
            { label: "Job", action: "addJob", icon: <EngineeringIcon /> },
            { label: "Venda", action: "addSale", icon: <SellIcon /> },
          ],
        },
      ],
    },
  },
];

export default rowButtonOptions;
