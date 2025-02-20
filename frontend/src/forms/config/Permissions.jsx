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
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import { permissionOptions } from "../../options/configOptions";

export default function Permissions({ onClose }) {
  const [configData, setConfigData] = useState({});
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        const roles = await api.get("/get", {
          params: { model: "Role" },
        });
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
      <Tooltip
        title={
          <Typography sx={{ fontSize: 12, color: "white" }}>
            Nesta sessão escolha os Perfis de Acesso que podem visualizar os
            recursos do aplicativo.
          </Typography>
        }
      >
        <DialogTitle
          sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
        >
          Permissões de Perfis
        </DialogTitle>
      </Tooltip>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                Perfil
              </Typography>
            </TableCell>
            {permissionOptions.map((item, index) => (
              <TableCell key={index} align="center">
                <Grid2
                  container
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  {item.icon}
                  <Typography sx={{ fontSize: 9 }}>{item.tooltip}</Typography>
                </Grid2>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Admin</TableCell>
            {permissionOptions.map((item, index) => (
              <TableCell key={index} align="center">
                <Checkbox size="small" disabled checked />
              </TableCell>
            ))}
          </TableRow>
          {roles.map((role, roleIndex) => (
            <TableRow key={roleIndex}>
              <TableCell>{role.name}</TableCell>
              {permissionOptions.map((option, optionIndex) => (
                <TableCell
                  key={optionIndex}
                  sx={{ maxWidth: 2 }}
                  align="center"
                >
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
