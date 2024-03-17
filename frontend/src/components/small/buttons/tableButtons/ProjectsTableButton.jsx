/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";

import {
  Button,
  Collapse,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Typography,
} from "@mui/material";

import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import StarIcon from "@mui/icons-material/Star";
import RecyclingIcon from "@mui/icons-material/Recycling";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function ProjectsTableButton(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openSubmenu, setOpenSubmenu] = useState(false);

  const handleClickSubmenu = () => {
    setOpenSubmenu(!openSubmenu);
  };

  return (
    <div>
      <Button
        size="small"
        onClick={handleClick}
        sx={{
          "&:hover": { borderColor: "#eee" },
          color: props.configCustomization.mainColor || "#32aacd",
        }}
      >
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h6" sx={{ mb: 0.5, mr: 0.5 }}>
            +
          </Typography>
          <Typography sx={{ fontSize: 16 }}>Novo</Typography>
        </Grid>
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
