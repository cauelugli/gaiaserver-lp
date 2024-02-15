/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";

import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import StarIcon from "@mui/icons-material/Star";
import RecyclingIcon from "@mui/icons-material/Recycling";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function ProjectsButton(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (menuIndex) => {
    handleClose();
    props.openModal(menuIndex);
  };

  const [openSubmenu, setOpenSubmenu] = useState(false);

  const handleClickSubmenu = () => {
    setOpenSubmenu(!openSubmenu);
  };

  return (
    <div>
      <Button
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        size="small"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          borderRadius: 3,
          "&:hover": { borderColor: "#eee" },
        }}
      >
        <Typography variant="h6">+</Typography>
        <Typography sx={{ fontSize: 16, mt: 0.5, ml: 0.5 }}>Novo</Typography>
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <List sx={{ width: 230 }}>
          <ListItemButton onClick={handleClickSubmenu}>
            <ListItemIcon>
              <RocketLaunchIcon />
            </ListItemIcon>
            <ListItemText primary="Criar Projeto" sx={{ ml: -2 }} />
            {openSubmenu ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openSubmenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                onClick={() => {
                  props.setOpenAddProject(true), setAnchorEl(null);
                }}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText primary="Novo Projeto" sx={{ ml: -2 }} />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  props.setOpenAddTemplate(true), setAnchorEl(null);
                }}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <RecyclingIcon />
                </ListItemIcon>
                <ListItemText primary="Projeto Recorrente" sx={{ ml: -2 }} />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Menu>
    </div>
  );
}
