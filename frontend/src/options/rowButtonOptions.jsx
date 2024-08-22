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
        { label: "Editar", action: "editCustomer", icon: <ModeEditIcon /> },
        { label: "Deletar", action: "delete", icon: <DeleteIcon /> },
        {
          label: "Novo",
          icon: <AddIcon />,
          submenu: [
            { label: "Job", action: "addJobToCustomer", icon: <EngineeringIcon /> },
            { label: "Venda", action: "addSaleToCustomer", icon: <SellIcon /> },
          ],
        },
      ],
      1: [
        { label: "Editar", action: "editClient", icon: <ModeEditIcon /> },
        { label: "Deletar", action: "delete", icon: <DeleteIcon /> },
        {
          label: "Novo",
          icon: <AddIcon />,
          submenu: [
            { label: "Job", action: "addJobToClient", icon: <EngineeringIcon /> },
            { label: "Venda", action: "addSaleToClient", icon: <SellIcon /> },
          ],
        },
      ],
    },
  },
];

export default rowButtonOptions;
