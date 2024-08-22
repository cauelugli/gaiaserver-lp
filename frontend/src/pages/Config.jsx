/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";

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
import HardwareIcon from "@mui/icons-material/Hardware";
import LanIcon from "@mui/icons-material/Lan";
import LockIcon from "@mui/icons-material/Lock";
import NotificationsIcon from "@mui/icons-material/Notifications";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
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
  configCustomization,
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const [configData, setConfigData] = useState([]);
  const [chosenModal, setChosenModal] = useState("");

  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);

  const options = [
    {
      icon: <CalendarMonthIcon sx={{ fontSize: 48 }} />,
      text: "Agenda",
      modal: <AgendaModal />,
      isBasic: false,
    },
    {
      icon: <InsertDriveFileIcon sx={{ fontSize: 48 }} />,
      text: "Arquivos",
      modal: <FilesModal />,
      isBasic: false,
    },
    {
      icon: <WorkIcon sx={{ fontSize: 48 }} />,
      text: "Clientes",
      modal: <CustomersModal />,
      isBasic: true,
    },
    {
      icon: <GroupIcon sx={{ fontSize: 48 }} />,
      text: "Colaboradores",
      modal: <UsersModal />,
      isBasic: true,
    },
    {
      icon: <DashboardIcon sx={{ fontSize: 48 }} />,
      text: "Dashboard",
      modal: <DashboardModal />,
      isBasic: false,
    },
    {
      icon: <LanIcon sx={{ fontSize: 48 }} />,
      text: "Departamentos",
      modal: <DepartmentsModal />,
      isBasic: true,
    },
    {
      icon: <WarehouseIcon sx={{ fontSize: 48 }} />,
      text: "Estoque",
      modal: <StockModal />,
      isBasic: true,
    },
    {
      icon: <AttachMoneyIcon sx={{ fontSize: 48 }} />,
      text: "Financeiro",
      modal: <FinanceModal />,
      isBasic: true,
    },
    {
      icon: <HardwareIcon sx={{ fontSize: 48 }} />,
      text: "Materiais",
      modal: (
        <MaterialsModal
          userName={userName}
          userId={userId}
          configCustomization={configCustomization}
        />
      ),
      isBasic: true,
    },
    {
      icon: <NotificationsIcon sx={{ fontSize: 48 }} />,
      text: "Notificações",
      modal: <NotificationsModal />,
      isBasic: false,
    },
    {
      icon: <RequestQuoteIcon sx={{ fontSize: 48 }} />,
      text: "Orçamentos",
      modal: <QuotesModal />,
      isBasic: true,
    },
    {
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 48 }} />,
      text: "Permissões",
      modal: <PermissionsModal />,
      isBasic: false,
    },
    {
      icon: <AutoFixNormalIcon sx={{ fontSize: 48 }} />,
      text: "Personalização",
      modal: <CustomizationModal />,
      isBasic: false,
    },
    {
      icon: <SellIcon sx={{ fontSize: 48 }} />,
      text: "Produtos",
      modal: (
        <ProductsModal
          userName={userName}
          userId={userId}
          configCustomization={configCustomization}
        />
      ),
      isBasic: true,
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 48 }} />,
      text: "Relatórios",
      modal: <RequestsModal />,
      isBasic: false,
    },
    {
      icon: <LockIcon sx={{ fontSize: 48 }} />,
      text: "Segurança",
      modal: <SecurityModal />,
      isBasic: false,
    },
    {
      icon: <BuildIcon sx={{ fontSize: 48 }} />,
      text: "Serviços",
      modal: <ServicesModal />,
      isBasic: true,
    },
    {
      icon: <GradingIcon sx={{ fontSize: 48 }} />,
      text: "Solicitações",
      modal: <RequestsModal />,
      isBasic: true,
    },
    {
      icon: <TableViewIcon sx={{ fontSize: 48 }} />,
      text: "Tabelas",
      modal: <TablesModal />,
      isBasic: false,
    },
  ];

  const handleItemClick = (modal) => {
    setOpenModal(modal);
    setChosenModal(modal.type.name);
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
      <Grid container direction="row" sx={{ mb: 2 }}>
        <Typography sx={{ fontSize: 25, ml: 2, mr: 1, fontWeight: "bold" }}>
          Configurações
        </Typography>
        <FormControlLabel
          value={showAdvancedConfig}
          control={
            <Switch
              checked={showAdvancedConfig}
              onChange={(e) => setShowAdvancedConfig(e.target.checked)}
            />
          }
          label={showAdvancedConfig ? "Avançadas" : "Básicas"}
          labelPlacement="start"
          sx={{ mb: 2 }}
        />
      </Grid>
      {configData ? (
        <Grid
          container
          rowSpacing={3}
          columnSpacing={2}
          justifyContent="center"
        >
          {options
            .filter((config) => showAdvancedConfig || config.isBasic)
            .map((config, index) => (
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
                    width: showAdvancedConfig ? 150 : 220,
                    // p: "20px",
                    p: showAdvancedConfig ? "15px" : "20px",
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    transition: "background-color 0.3s, color 0.3s",
                    backgroundColor:
                      hoveredIndex === index ? "#777" : "initial",
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
        onClose={() => setOpenModal(null)}
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
          <Button onClick={() => setOpenModal(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
