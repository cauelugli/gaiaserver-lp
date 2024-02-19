/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import {
  Button,
  Menu,
  ListItemIcon,
  ListItemText,
  Typography,
  MenuItem,
  MenuList,
} from "@mui/material";

import BuildIcon from "@mui/icons-material/Build";
import HubIcon from "@mui/icons-material/Hub";

export default function ServicesTableButton({
  anchorEl,
  openAddButton,
  handleClickAddButton,
  handleCloseAddButton,
  setOpenAddService,
  setOpenAddServicePlan,
  configCustomization,
}) {
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={openAddButton ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={openAddButton ? "true" : undefined}
        onClick={handleClickAddButton}
        size="small"
        sx={{
          bottom: 3,
          "&:hover": { borderColor: "#eee" },
          color: configCustomization.mainColor || "#32aacd",
        }}
      >
        <Typography variant="h6">+</Typography>
        <Typography
          sx={{
            fontSize: 16,
            mt: 0.5,
            ml: 0.5,
            color: configCustomization.mainColor || "#32aacd",
          }}
        >
          Novo
        </Typography>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openAddButton}
        onClick={handleCloseAddButton}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuList sx={{ width: 195 }}>
          <MenuItem onClick={() => setOpenAddService(true)}>
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
            <ListItemText>Serviço</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setOpenAddServicePlan(true)}>
            <ListItemIcon>
              <HubIcon />
            </ListItemIcon>
            <ListItemText>Plano de Serviço</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}
