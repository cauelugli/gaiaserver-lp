/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AutoFixNormalIcon from "@mui/icons-material/AutoFixNormal";
import BuildIcon from "@mui/icons-material/Build";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GradingIcon from "@mui/icons-material/Grading";
import GroupIcon from "@mui/icons-material/Group";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LanIcon from "@mui/icons-material/Lan";
import LockIcon from "@mui/icons-material/Lock";
import NotificationsIcon from "@mui/icons-material/Notifications";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SellIcon from "@mui/icons-material/Sell";
import TableViewIcon from "@mui/icons-material/TableView";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import WorkIcon from "@mui/icons-material/Work";

import AgendaModal from "../forms/config/Agenda";
import CustomersModal from "../forms/config/Customers";
import CustomizationModal from "../forms/config/Customization";
import DashboardModal from "../forms/config/Dashboard";
import DepartmentsModal from "../forms/config/Departments";
import FilesModal from "../forms/config/Files";
import FinanceModal from "../forms/config/Finance";
import MaterialsModal from "../forms/config/Materials";
import NotificationsModal from "../forms/config/Notifications";
import PermissionsModal from "../forms/config/Permissions";
import ProductsModal from "../forms/config/Products";
import ProjectsModal from "../forms/config/Projects";
import QuotesModal from "../forms/config/Quotes";
import RequestsModal from "../forms/config/Requests";
import SecurityModal from "../forms/config/Security";
import ServicesModal from "../forms/config/Services";
import StockModal from "../forms/config/Stock";
import TablesModal from "../forms/config/Tables";
import UsersModal from "../forms/config/Users";

export default function Config({
  topBar,
  userId,
  userName,
  refreshData,
  setRefreshData,
  configCustomization,
}) {
  const [isLoading, setIsLoading] = React.useState(true);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const [configData, setConfigData] = useState([]);
  const [chosenModal, setChosenModal] = useState("");

  const [products, setProducts] = useState([]);

  const options = [
    {
      icon: <DashboardIcon sx={{ fontSize: 48 }} />,
      text: "Dashboard",
      modal: <DashboardModal />,
    },
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
      text: "Solicitações",
      modal: <RequestsModal />,
    },
    {
      icon: <RocketLaunchIcon sx={{ fontSize: 48 }} />,
      text: "Projetos",
      modal: <ProjectsModal />,
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
      icon: <SellIcon sx={{ fontSize: 48 }} />,
      text: "Produtos",
      modal: (
        <ProductsModal
          here
          userName={userName}
          userId={userId}
          configCustomization={configCustomization}
          products={products}
        />
      ),
    },
    {
      icon: <Inventory2Icon sx={{ fontSize: 48 }} />,
      text: "Materiais",
      modal: <MaterialsModal />,
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 48 }} />,
      text: "Relatórios",
      modal: <RequestsModal />,
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
    {
      icon: <AutoFixNormalIcon sx={{ fontSize: 48 }} />,
      text: "Personalização",
      modal: <CustomizationModal />,
    },
    {
      icon: <LockIcon sx={{ fontSize: 48 }} />,
      text: "Segurança",
      modal: <SecurityModal />,
    },
    {
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 48 }} />,
      text: "Permissões",
      modal: <PermissionsModal />,
    },

    {
      icon: <NotificationsIcon sx={{ fontSize: 48 }} />,
      text: "Notificações",
      modal: <NotificationsModal />,
    },
    {
      icon: <TableViewIcon sx={{ fontSize: 48 }} />,
      text: "Tabelas",
      modal: <TablesModal />,
    },
    {
      icon: <CalendarMonthIcon sx={{ fontSize: 48 }} />,
      text: "Agenda",
      modal: <AgendaModal />,
    },
  ];

  const handleItemClick = (modal) => {
    setOpenModal(modal);
    setChosenModal(modal.type.name);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data[0]);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const config = await api.get("/config");
      setConfigData(config.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCreateInitialConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/config");
      if (res.data) {
        toast.success("Configuração Inicial Criada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        fetchData();
      }
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: topBar ? "105%" : "100%", minHeight: "50vw" }}>
      <Typography sx={{ fontSize: 25, m: 2, fontWeight: "bold" }}>
        Configurações
      </Typography>
      {configData ? (
        <Grid container rowSpacing={3} columnSpacing={{ md: 1.8, lg: 1.8 }}>
          {options.map((config, index) => (
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
      ) : (
        <>
          <Typography>Crie a Configuração Inicial</Typography>
          <Button
            type="submit"
            variant="contained"
            color="success"
            onClick={handleCreateInitialConfig}
          >
            Criar
          </Button>
        </>
      )}

      <Dialog
        open={!!openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth={
          chosenModal === "Permissions"
            ? "lg"
            : chosenModal === "Tables"
            ? "sm"
            : "md"
        }
      >
        <DialogContent>
          {openModal &&
            React.cloneElement(openModal, {
              onClose: () => setOpenModal(null),
            })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
