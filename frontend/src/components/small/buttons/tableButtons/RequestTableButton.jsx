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
  Grid,
} from "@mui/material";

import EngineeringIcon from "@mui/icons-material/Engineering";
import SellIcon from "@mui/icons-material/Sell";

export default function RequestTableButton({
  anchorEl,
  openAddButton,
  handleClickAddButton,
  handleCloseAddButton,
  setOpenAddSale,
  setOpenAddJob,
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
        <MenuList sx={{ width: 200 }}>
          <MenuItem onClick={() => setOpenAddJob(true)}>
            <ListItemIcon>
              <EngineeringIcon />
            </ListItemIcon>
            <ListItemText>Job / Atendimento</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setOpenAddSale(true)}>
            <ListItemIcon>
              <SellIcon />
            </ListItemIcon>
            <ListItemText>Venda</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}
