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
  Grid,
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
