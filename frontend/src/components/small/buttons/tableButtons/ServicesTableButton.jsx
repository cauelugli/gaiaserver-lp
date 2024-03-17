/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import {
  Button,
  Menu,
  ListItemIcon,
  ListItemText,
  Typography,
  Grid,
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
        onClick={handleClickAddButton}
        size="small"
        sx={{
          "&:hover": { borderColor: "#eee" },
          color: configCustomization.mainColor || "#32aacd",
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
