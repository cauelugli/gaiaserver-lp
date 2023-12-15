/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";

import { Grid, Typography } from "@mui/material";

// Importando os ícones necessários
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BuildIcon from "@mui/icons-material/Build";
import GradingIcon from "@mui/icons-material/Grading";
import GroupIcon from "@mui/icons-material/Group";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LanIcon from "@mui/icons-material/Lan";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import WorkIcon from "@mui/icons-material/Work";

// Array de configurações
const configData = [
  { icon: <WorkIcon sx={{ fontSize: 48 }} />, text: "Clientes" },
  { icon: <GroupIcon sx={{ fontSize: 48 }} />, text: "Colaboradores" },
  { icon: <LanIcon sx={{ fontSize: 48 }} />, text: "Departamentos" },
  { icon: <GradingIcon sx={{ fontSize: 48 }} />, text: "Pedidos" },
  { icon: <RequestQuoteIcon sx={{ fontSize: 48 }} />, text: "Orçamentos" },
  { icon: <BuildIcon sx={{ fontSize: 48 }} />, text: "Serviços" },
  { icon: <WarehouseIcon sx={{ fontSize: 48 }} />, text: "Estoque" },
  { icon: <AttachMoneyIcon sx={{ fontSize: 48 }} />, text: "Financeiro" },
  { icon: <InsertDriveFileIcon sx={{ fontSize: 48 }} />, text: "Arquivos" },
];

export default function Config({ user }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleItemClick = (text) => {
    alert(text);
  };

  return (
    <>
      <Typography
        sx={{ fontSize: 23, mt: 0.5, ml: 1, mr: 2, mb: 2, fontWeight: "bold" }}
      >
        Configurações
      </Typography>
      <Grid container rowSpacing={2} columnSpacing={{ md: 4, lg: 4 }}>
        {configData.map((config, index) => (
          <Grid
            item
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleItemClick(config.text)}
          >
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 150,
                p: "20px", 
                border: "1px solid #ccc",
                borderRadius: 2,
                transition: "background-color 0.3s, color 0.3s",
                backgroundColor: hoveredIndex === index ? "#777" : "initial",
                color: hoveredIndex === index ? "white" : "#777",
                cursor: "pointer",
              }}
            >
              {config.icon}
              <Typography sx={{ mt: 1 }}>{config.text}</Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
