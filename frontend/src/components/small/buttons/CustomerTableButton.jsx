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

import PersonIcon from "@mui/icons-material/Person";
import Person4Icon from "@mui/icons-material/Person4";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";


export default function CustomerTableButton({
  anchorEl,
  openAddButton,
  handleClickAddButton,
  handleCloseAddButton,
  setOpenAddUser,
  setOpenAddManager,
  setOpenAddOperator,
  setOpenAddRole
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
        <MenuList sx={{ width: 190 }}>
          <MenuItem onClick={() => setOpenAddUser(true)}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText>Colaborador</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setOpenAddManager(true)}>
            <ListItemIcon>
              <Person4Icon />
            </ListItemIcon>
            <ListItemText>Gerente</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setOpenAddOperator(true)}>
            <ListItemIcon>
              <ManageAccountsIcon />
            </ListItemIcon>
            <ListItemText>Operador</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setOpenAddRole(true)}>
            <ListItemIcon>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText>Perfil de Acesso</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}
