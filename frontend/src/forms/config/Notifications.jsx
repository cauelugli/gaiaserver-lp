/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

import {
  Button,
  DialogActions,
  DialogTitle,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import NotificationsConfigTransferList from "../../components/small/NotificationsConfigTransferList";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Notifications({ onClose }) {
  const [configData, setConfigData] = useState({});
  const [booleans, setBooleans] = useState({});
  const [roles, setRoles] = useState([]);
  const [selectedLists, setSelectedLists] = useState({});
  // IMPORTANT: THESE TITLES MUST BE IN ORDER WITH THE MODEL 'CONFIG' !
  const title = ["Novo Usuário Criado"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        const roles = await api.get("/roles");
        setConfigData(config.data[0].notifications);
        setBooleans(config.data[0].notificationsBooleans);
        setRoles(roles.data);

        const initialState = {};
        Object.keys(config.data[0].notifications).forEach((key) => {
          initialState[key] = {
            selected: config.data[0].notifications[key],
            options: config.data[0].notifications[key],
            title: title[key],
          };
        });

        setSelectedLists(initialState);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectedChange = (key, selected, options, title) => {
    setSelectedLists((prevLists) => ({
      ...prevLists,
      [key]: {
        selected,
        options,
        title,
      },
    }));
  };

  const handleSwitchChange = (key, state) => {
    setBooleans((prevBooleans) => ({
      ...prevBooleans,
      [key]: state,
    }));
  };

  const handleChangeNotificationsConfig = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        notifications: {},
        notificationsBooleans: booleans,
      };

      Object.keys(selectedLists).forEach((key) => {
        payload.notifications[key] = selectedLists[key].selected;
      });

      // Remova chaves não booleanas do objeto notificationsBooleans
      Object.keys(payload.notificationsBooleans).forEach((key) => {
        if (typeof payload.notificationsBooleans[key] !== "boolean") {
          delete payload.notificationsBooleans[key];
        }
      });

      const res = await api.put("/config/notifications", payload);

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

  return (
    <form onSubmit={handleChangeNotificationsConfig}>
      <DialogTitle
        sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
      >
        Configurações de Notificações
      </DialogTitle>

      <Grid container direction="row" sx={{ mb: -2 }}>
        <Grid item sx={{ ml: 45 }}>
          <Typography>
            <VisibilityOffIcon sx={{ fontSize: 40, color: "#D00000" }} />
          </Typography>
        </Grid>
        <Grid item sx={{ ml: 33 }}>
          <Typography>
            <VisibilityIcon sx={{ fontSize: 40, color: "#417505" }} />
          </Typography>
        </Grid>
      </Grid>
      {Object.keys(configData).map((key, index) => (
        <NotificationsConfigTransferList
          key={key}
          title={title[index]}
          options={roles}
          booleans={booleans[key]}
          selectedList={selectedLists[key].selected || []}
          onSelectedChange={(selected, options) =>
            handleSelectedChange(key, selected, options)
          }
          switchState={booleans[key]}
          onSwitchChange={(state) => handleSwitchChange(key, state)}
        />
      ))}

      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
      </DialogActions>
    </form>
  );
}
