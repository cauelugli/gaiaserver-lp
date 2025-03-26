/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});
import { toast } from "react-toastify";

import {
  Avatar,
  Menu,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
} from "@mui/material";

import { icons } from "../../../icons";

export default function UserButton({ user }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    sessionStorage.clear();
    toast.info("Realizando Logout", {
      closeOnClick: true,
      pauseOnHover: false,
      theme: "colored",
      autoClose: 800,
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <Box>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
        <Avatar src={`http://localhost:8080/static${user.image}`} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <List sx={{ width: 130 }}>
          <Link
            to={"/account"}
            style={{
              textDecoration: "none",
              color: "black",
            }}
            onClick={() => setAnchorEl(null)}
          >
            <ListItemButton>
              <ListItemIcon>
                <icons.PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Perfil" sx={{ ml: -3 }} />
            </ListItemButton>
          </Link>

          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <icons.LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ ml: -3 }} />
          </ListItemButton>
        </List>
      </Menu>
    </Box>
  );
}
