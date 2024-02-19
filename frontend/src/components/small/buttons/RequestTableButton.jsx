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

import EngineeringIcon from "@mui/icons-material/Engineering";
import SellIcon from "@mui/icons-material/Sell";

export default function RequestTableButton({
  anchorEl,
  openAddButton,
  handleClickAddButton,
  handleCloseAddButton,
  setOpenAddSale,
  setOpenAddJob,
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
          borderRadius: 3,
          bottom: 3,
          "&:hover": { borderColor: "#eee" },
        }}
      >
        <Typography variant="h6">+</Typography>
        <Typography sx={{ fontSize: 16, mt: 0.5, ml: 0.5 }}>Novo</Typography>
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
