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

import AttachFileIcon from "@mui/icons-material/AttachFile";
import ChatIcon from "@mui/icons-material/Chat";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import GenericDeleteForm from "../../../../forms/delete/GenericDeleteForm";
import AddInteractionForm from "../../../../forms/misc/AddInteractionForm";

export default function ProjectsTableActions(props) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(props.selectedItem);
  const [openAddInteraction, setOpenAddInteraction] = React.useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(selectedItem);
  };

  const handleConfirmDelete = () => {
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const addInteractionToProject = (updatedProject) => {
    setSelectedItem(updatedProject);
    props.setRefreshData(!props.refreshData);
  };

  const updateSelectedProjectInteractions = (updatedInteractions) => {
    setSelectedItem((currentSelectedProject) => ({
      ...currentSelectedProject,
      interactions: updatedInteractions,
    }));
  };

  return (
    <div>
      <Button size="small" onClick={handleClick} sx={{ borderRadius: 3 }}>
        <MenuIcon sx={{ color: "#888" }} />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <List sx={{ width: 200 }}>
          <ListItemButton disabled>
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>Enviar Comunicado</Typography>
              }
              sx={{ ml: -3 }}
            />
          </ListItemButton>
          <ListItemButton disabled>
            <ListItemIcon>
              <ModeEditIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>Editar Projeto</Typography>
              }
              sx={{ ml: -3 }}
            />
          </ListItemButton>

          <ListItemButton
            onClick={(item) => {
              setOpenAddInteraction(true);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <CommentIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>Atividades</Typography>
              }
              sx={{ ml: -3 }}
            />
          </ListItemButton>

          <ListItemButton
            onClick={(item) => {
              props.handleOpenAddAttachment(item), setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <AttachFileIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>Anexar Arquivo</Typography>
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
                <Typography sx={{ fontSize: 14 }}>Deletar Projeto</Typography>
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
            selectedItem={selectedItem}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            toast={toast}
            endpoint="projects"
            successMessage={`${
              selectedItem.name && selectedItem.name
            } Deletado com Sucesso`}
            warning={props.selectedItem.attachments.length !== 0}
            warningMessage={`${
              props.selectedItem.attachments.length !== 0 &&
              props.selectedItem.attachments.length
            } arquivos serão excluidos DEFINITIVAMENTE`}
          />
        </Dialog>
      )}
      {openAddInteraction && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openAddInteraction}
          onClose={() => setOpenAddInteraction(!openAddInteraction)}
        >
          <AddInteractionForm
            fromProjects
            fromProjectsGeneral
            userId={props.userId}
            userName={props.userName}
            openEditJob={openAddInteraction}
            addInteraction={addInteractionToProject}
            selectedJob={selectedItem}
            setOpenEditJob={setOpenAddInteraction}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            updateSelectedProjectInteractions={
              updateSelectedProjectInteractions
            }
            toast={toast}
          />
        </Dialog>
      )}
    </div>
  );
}
