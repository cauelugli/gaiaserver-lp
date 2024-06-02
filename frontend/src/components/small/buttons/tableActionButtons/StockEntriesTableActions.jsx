/* eslint-disable react/prop-types */
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Typography,
} from "@mui/material";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MenuIcon from "@mui/icons-material/Menu";
import CheckIcon from "@mui/icons-material/Check";

export default function StockEntriesTableActions(props) {
  const [selectedItem, setSelectedItem] = React.useState(props.selectedItem);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(selectedItem);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // console.log("props.dispatcherManager", props.dispatcherManager);

  const handleRequestApproval = async () => {
    try {
      const res = await api.put("/stock/requestApproval", {
        entryId: selectedItem._id,
      });
      if (res.data) {
        setAnchorEl(null);
        toast.success("Aprovação Solicitada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        socket.emit("requestApproval", {
          sender: props.userName,
          receiver: props.dispatcherManager,
          receiverId: props.dispatcherManager.id,
          job: "",
          type: "Estoque",
          date: dayjs(Date.now()).format("DD/MM/YYYY"),
        });
        props.setRefreshData(!props.refreshData);
      }
    } catch (err) {
      setAnchorEl(null);
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  const handleSendToFinance = async () => {
    try {
      const res = await api.put("/stock/sendToFinance", {
        // entryId: selectedItem._id,
        entry: selectedItem,
      });
      if (res.data) {
        setAnchorEl(null);
        toast.success("Enviado ao Financeiro!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        // need to create confif to set the Finance department, like the stock approver department
        // socket.emit("sendToFinance", {
        //   sender: props.userName,
        //   receiver: props.dispatcherManager,
        //   receiverId: props.dispatcherManager.id,
        //   type: "Estoque",
        //   date: dayjs(Date.now()).format("DD/MM/YYYY"),
        // });
        props.setRefreshData(!props.refreshData);
      }
    } catch (err) {
      setAnchorEl(null);
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  return (
    <div>
      <Button
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        size="small"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ "&:hover": { borderColor: "#eee" } }}
      >
        <MenuIcon sx={{ color: "#888" }} />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <List sx={{ width: 210 }}>
          {props.selectedItem.status === "Aprovado" ? (
            <ListItemButton onClick={handleSendToFinance}>
              <ListItemIcon>
                <AttachMoneyIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: 14 }}>
                    Enviar ao Financeiro
                  </Typography>
                }
                sx={{ ml: -3 }}
              />
            </ListItemButton>
          ) : (
            <ListItemButton
              disabled={
                props.selectedItem.status === "Aprovação Solicitada" ||
                props.selectedItem.status === "Enviado ao Financeiro"
              }
              onClick={handleRequestApproval}
            >
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: 14 }}>
                    Solicitar Aprovação
                  </Typography>
                }
                sx={{ ml: -3 }}
              />
            </ListItemButton>
          )}
        </List>
      </Menu>
    </div>
  );
}
