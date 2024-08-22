/* eslint-disable no-unused-vars */
import React from "react";

import MenuIcon from "@mui/icons-material/Menu";

const rowButtonOptions = [
  {
    page: "customers",
    menus: {
      0: [
        { label: "Editar", action: "edit", icon: <MenuIcon /> },
        { label: "Deletar", action: "delete", icon: <MenuIcon /> },
        {
          label: "Mais Opções",
          icon: <MenuIcon />,
          submenu: [
            { label: "Duplicar", action: "duplicate", icon: <MenuIcon /> },
            { label: "Imprimir", action: "print", icon: <MenuIcon /> },
          ],
        },
      ],
      1: [
        { label: "Visualizar", action: "view", icon: <MenuIcon /> },
        { label: "Enviar Email", action: "email", icon: <MenuIcon /> },
        {
          label: "Ações Avançadas",
          icon: <MenuIcon />,
          submenu: [
            { label: "Arquivar", action: "archive", icon: <MenuIcon /> },
            { label: "Compartilhar", action: "share", icon: <MenuIcon /> },
          ],
        },
      ],
    },
  },
];

export default rowButtonOptions;
