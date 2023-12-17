/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BuildIcon from "@mui/icons-material/Build";
import GradingIcon from "@mui/icons-material/Grading";
import GroupIcon from "@mui/icons-material/Group";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LanIcon from "@mui/icons-material/Lan";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import WorkIcon from "@mui/icons-material/Work";

import CustomersModal from "../forms/config/Customers";
import UsersModal from "../forms/config/Users";
import DepartmentsModal from "../forms/config/Departments";
import RequestsModal from "../forms/config/Requests";
import QuotesModal from "../forms/config/Quotes";
import ServicesModal from "../forms/config/Services";
import StockModal from "../forms/config/Stock";
import FinanceModal from "../forms/config/Finance";
import FilesModal from "../forms/config/Files";

// Array de configurações
const configData = [
  {
    icon: <WorkIcon sx={{ fontSize: 48 }} />,
    text: "Clientes",
    modal: <CustomersModal />,
  },
  {
    icon: <GroupIcon sx={{ fontSize: 48 }} />,
    text: "Colaboradores",
    modal: <UsersModal />,
  },
  {
    icon: <LanIcon sx={{ fontSize: 48 }} />,
    text: "Departamentos",
    modal: <DepartmentsModal />,
  },
  {
    icon: <GradingIcon sx={{ fontSize: 48 }} />,
    text: "Pedidos",
    modal: <RequestsModal />,
  },
  {
    icon: <RequestQuoteIcon sx={{ fontSize: 48 }} />,
    text: "Orçamentos",
    modal: <QuotesModal />,
  },
  {
    icon: <BuildIcon sx={{ fontSize: 48 }} />,
    text: "Serviços",
    modal: <ServicesModal />,
  },
  {
    icon: <WarehouseIcon sx={{ fontSize: 48 }} />,
    text: "Estoque",
    modal: <StockModal />,
  },
  {
    icon: <AttachMoneyIcon sx={{ fontSize: 48 }} />,
    text: "Financeiro",
    modal: <FinanceModal />,
  },
  {
    icon: <InsertDriveFileIcon sx={{ fontSize: 48 }} />,
    text: "Arquivos",
    modal: <FilesModal />,
  },
];

export default function Config({ user }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [openModal, setOpenModal] = useState(null);

  const handleItemClick = (modal) => {
    setOpenModal(modal);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
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
            onClick={() => handleItemClick(config.modal)}
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

      {/* Dialog dinâmico com base no item selecionado */}
      <Dialog open={!!openModal} onClose={handleCloseModal}>
        <DialogTitle>Configurações</DialogTitle>
        <DialogContent>{openModal}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
