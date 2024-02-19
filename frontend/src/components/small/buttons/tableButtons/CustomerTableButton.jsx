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
  Divider,
} from "@mui/material";

import ApartmentIcon from "@mui/icons-material/Apartment";
import PersonIcon from "@mui/icons-material/Person";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function CustomerTableButton({
  anchorEl,
  openAddButton,
  handleClickAddButton,
  handleCloseAddButton,
  setOpenAddCustomer,
  setOpenAddClient,
  setOpenImportContacts,
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
          <MenuItem onClick={() => setOpenAddCustomer(true)}>
            <ListItemIcon>
              <ApartmentIcon />
            </ListItemIcon>
            <ListItemText>Empresa</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setOpenAddClient(true)}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText>Pessoa Física</ListItemText>
          </MenuItem>
          <Divider sx={{ mx: 2 }} />

          <MenuItem onClick={() => setOpenImportContacts(true)}>
            <ListItemIcon>
              <UploadFileIcon />
            </ListItemIcon>
            <ListItemText>Importar Contatos</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}
