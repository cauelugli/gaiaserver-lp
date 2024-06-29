/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Button,
  Checkbox,
  DialogActions,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BuildIcon from "@mui/icons-material/Build";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GradingIcon from "@mui/icons-material/Grading";
import GroupIcon from "@mui/icons-material/Group";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LanIcon from "@mui/icons-material/Lan";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SettingsIcon from "@mui/icons-material/Settings";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import SellIcon from "@mui/icons-material/Sell";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WorkIcon from "@mui/icons-material/Work";

export default function Permissions({ onClose }) {
  const [configData, setConfigData] = useState({});
  const [roles, setRoles] = useState([]);

  const options = [
    {
      tooltip: "Dashboard",
      label: "dashboard",
      icon: <DashboardIcon fontSize="inherit" />,
    },
    {
      tooltip: "Clientes",
      label: "customers",
      icon: <WorkIcon fontSize="inherit" />,
    },
    {
      tooltip: "Solicitações",
      label: "requests",
      icon: <GradingIcon fontSize="inherit" />,
    },
    {
      tooltip: "Colaboradorees",
      label: "users",
      icon: <GroupIcon fontSize="inherit" />,
    },
    {
      tooltip: "Departamentos",
      label: "departments",
      icon: <LanIcon fontSize="inherit" />,
    },
    {
      tooltip: "Serviços",
      label: "services",
      icon: <BuildIcon fontSize="inherit" />,
    },
    {
      tooltip: "Orçamentos",
      label: "quotes",
      icon: <RequestQuoteIcon fontSize="inherit" />,
    },
    {
      tooltip: "Estoque",
      label: "stock",
      icon: <WarehouseIcon fontSize="inherit" />,
    },
    {
      tooltip: "Produtos",
      label: "products",
      icon: <SellIcon fontSize="inherit" />,
    },
    {
      tooltip: "Materiais",
      label: "materials",
      icon: <Inventory2Icon fontSize="inherit" />,
    },
    {
      tooltip: "Projetos",
      label: "projects",
      icon: <RocketLaunchIcon fontSize="inherit" />,
    },
    {
      tooltip: "Financeiro",
      label: "finance",
      icon: <AttachMoneyIcon fontSize="inherit" />,
    },
    {
      tooltip: "Relatórios",
      label: "reports",
      icon: <AssessmentIcon fontSize="inherit" />,
    },
    {
      tooltip: "Acessos",
      label: "security",
      icon: <AdminPanelSettingsIcon fontSize="inherit" />,
    },
    {
      tooltip: "Arquivos",
      label: "files",
      icon: <InsertDriveFileIcon fontSize="inherit" />,
    },
    {
      tooltip: "Configurações",
      label: "config",
      icon: <SettingsIcon fontSize="inherit" />,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        const roles = await api.get("/roles");
        setConfigData(config.data[0].permissions);
        setRoles(roles.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangePermissionsConfig = async (e) => {
    e.preventDefault();
    try {
      const payload = configData;
      const res = await api.put("/config/permissions", payload);

      if (res.data) {
        toast.success("Configuração Alterada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      onClose();
      socket.emit("forceRefresh");
    } catch (err) {
      console.log("erro", err);
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  const handleCheckboxChange = (roleId, permission) => {
    setConfigData((prevConfigData) => {
      const updatedPermissions = { ...prevConfigData };
      if (!updatedPermissions[permission]) {
        updatedPermissions[permission] = [];
      }
      if (updatedPermissions[permission].includes(roleId)) {
        updatedPermissions[permission] = updatedPermissions[permission].filter(
          (r) => r !== roleId
        );
      } else {
        updatedPermissions[permission].push(roleId);
      }
      return updatedPermissions;
    });
  };

  return (
    <form onSubmit={handleChangePermissionsConfig}>
      <>
        <DialogTitle
          sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
        >
          Permissões de Perfis{" "}
          <Tooltip
            title={
              <Typography sx={{ fontSize: 12 }}>
                Nesta sessão escolha o os Perfis de Acesso que podem visualizar
                os recursos do aplicativo.
              </Typography>
            }
          >
            <Button
              size="small"
              sx={{
                backgroundColor: "white",
                color: "#32aacd",
                "&:hover": {
                  backgroundColor: "white",
                },
              }}
            >
              ?
            </Button>
          </Tooltip>
        </DialogTitle>
      </>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                Perfil
              </Typography>
            </TableCell>
            {options.map((item, index) => (
              <TableCell key={index} sx={{ maxWidth: 2 }}>
                <Tooltip title={item.tooltip}>
                  <IconButton sx={{ cursor: "auto", ml: 1 }} size="small">
                    {item.icon}
                  </IconButton>
                </Tooltip>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Admin</TableCell>
            {options.map((item, index) => (
              <TableCell key={index} sx={{ maxWidth: 2 }}>
                <Checkbox size="small" disabled checked />
              </TableCell>
            ))}
          </TableRow>
          {roles.map((role, roleIndex) => (
            <TableRow key={roleIndex}>
              <TableCell>{role.name}</TableCell>
              {options.map((option, optionIndex) => (
                <TableCell key={optionIndex} sx={{ maxWidth: 2 }}>
                  <Checkbox
                    size="small"
                    checked={
                      configData[option.label]?.includes(role._id) || false
                    }
                    onChange={() =>
                      handleCheckboxChange(role._id, option.label)
                    }
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
      </DialogActions>
    </form>
  );
}
