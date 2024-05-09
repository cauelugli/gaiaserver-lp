/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { toast } from "react-toastify";

import {
  Button,
  Dialog,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import MenuIcon from "@mui/icons-material/Menu";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import GenericDeleteForm from "../../../../forms/delete/GenericDeleteForm";

export default function GroupTableActions(props) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(props.selectedItem);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(selectedItem);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleConfirmDelete = () => {
    setOpenDialog(true);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        size="small"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ "&:hover": { borderColor: "#eee" } }}
      >
        <MenuIcon sx={{ color: "#888" }} />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <List sx={{ width: 210 }}>
          <ListItemButton
            onClick={() => {
              props.setRename(true), setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <ModeEditIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>Renomear Grupo</Typography>
              }
              sx={{ ml: -3 }}
            />
          </ListItemButton>

          <ListItemButton
            onClick={() => {
              props.setOpenEditMembers(true), setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>Editar Membros</Typography>
              }
              sx={{ ml: -3 }}
            />
          </ListItemButton>
          <ListItemButton
            onClick={(item) => handleConfirmDelete(item)}
            sx={{ color: "red" }}
          >
            <ListItemIcon>
              <DeleteIcon sx={{ color: "red" }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>Deletar Grupo</Typography>
              }
              sx={{ ml: -3 }}
            />
          </ListItemButton>
        </List>
      </Menu>
      {openDialog && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(!openDialog)}>
          <GenericDeleteForm
            userId={props.userId}
            selectedItem={props.selectedItem}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            toast={toast}
            endpoint="groups"
            usePageNotEndpoint
            page="departments"
            successMessage={`${
              props.selectedItem.name && props.selectedItem.name
            } Deletado com Sucesso`}
          />
        </Dialog>
      )}
    </div>
  );
}
