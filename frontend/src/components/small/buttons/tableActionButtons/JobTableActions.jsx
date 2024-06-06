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
  MenuItem,
  Typography,
} from "@mui/material";

import ArchiveIcon from "@mui/icons-material/Archive";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckIcon from "@mui/icons-material/Check";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import MenuIcon from "@mui/icons-material/Menu";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SettingsIcon from "@mui/icons-material/Settings";
import UpgradeIcon from "@mui/icons-material/Upgrade";

import GenericDeleteForm from "../../../../forms/delete/GenericDeleteForm";
import GenericActivateForm from "../../../../forms/misc/GenericActivateForm";
import ResolveJobForm from "../../../../forms/misc/ResolveJobForm";
import ChangeStatusForm from "../../../../forms/misc/ChangeStatusForm";

export default function JobTableActions(props) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openStatusDialog, setOpenStatusDialog] = React.useState(false);
  const [openActivate, setOpenActivate] = React.useState(false);
  const [openResolve, setOpenResolve] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(props.selectedItem);
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const openSubMenu = Boolean(subMenuAnchorEl);

  const handleClick = (event) => {
    setSubMenuAnchorEl(null);
    setAnchorEl(event.currentTarget);
    setSelectedItem(selectedItem);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
  };

  const handleConfirmDelete = () => {
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleStatusChange = () => {
    setOpenStatusDialog(true);
    setAnchorEl(null);
  };

  const handleConfirmActivate = () => {
    setOpenActivate(true);
    setAnchorEl(null);
  };

  const handleConfirmResolve = () => {
    setOpenResolve(true);
    setAnchorEl(null);
  };

  const handleSubMenuClick = (event) => {
    setSubMenuAnchorEl(event.currentTarget);
  };

  const handleSubMenuClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
  };

  console.log(
    "props.requestsApproverManagerId",
    props.requestsApproverManagerId
  );

  return (
    <div>
      <Button size="small" onClick={handleClick}>
        <MenuIcon sx={{ color: "#888", pr: props.fromCard ? 0 : 3 }} />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <List sx={{ width: 210 }}>
          <ListItemButton
            disabled={props.job.status === "Concluido"}
            onClick={(item) => {
              props.handleOpenAddJobInteraction(item), setAnchorEl(null);
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

          {props.userId === props.requestsApproverManagerId &&
            props.job.status === "Aprovação Solicitada" && (
              <ListItemButton
                disabled={props.job.status === "Concluido"}
                onClick={(item) => {
                  props.handleManagerApproval(item), setAnchorEl(null);
                }}
              >
                <ListItemIcon>
                  <CheckIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14 }}>Aprovar Job</Typography>
                  }
                  sx={{ ml: -3 }}
                />
              </ListItemButton>
            )}

          {props.job.status === "Aprovado" &&
            props.userId !== props.requestsApproverManagerId && (
              <ListItemButton
                onClick={(item) => {
                  handleConfirmResolve(item), setAnchorEl(null);
                }}
              >
                <ListItemIcon>
                  <DoneOutlineIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14 }}>Resolver Job</Typography>
                  }
                  sx={{ ml: -3 }}
                />
              </ListItemButton>
            )}

          {props.job.status !== "Concluido" &&
            props.job.status !== "Aprovado" &&
            props.userRole.name !== "Gerente" && (
              <ListItemButton
                onClick={(item) => {
                  props.handleRequestApproval(item), setAnchorEl(null);
                }}
                disabled={
                  !props.job.manager ||
                  props.job.status === "Aprovação Solicitada"
                }
              >
                <ListItemIcon>
                  <CheckIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14 }}>
                      Solicitar Aprovação
                    </Typography>
                  }
                  secondary={
                    !props.job.manager && (
                      <Typography sx={{ fontSize: 10, fontWeight: "bold" }}>
                        Departamento não possui Gerente
                      </Typography>
                    )
                  }
                  sx={{ ml: -3 }}
                />
              </ListItemButton>
            )}

          <ListItemButton
            disabled={props.job.status === "Concluido"}
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
            onClick={handleSubMenuClick}
            disabled={props.job.status === "Concluido"}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={{ fontSize: 14 }}>Opções</Typography>}
              sx={{ ml: -3 }}
            />
          </ListItemButton>

          <Menu
            anchorEl={subMenuAnchorEl}
            open={openSubMenu}
            onClose={handleSubMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <List sx={{ width: 170 }}>
              <ListItemButton
                onClick={(item) => {
                  handleStatusChange(item), setAnchorEl(null);
                }}
              >
                <ListItemIcon>
                  <AutorenewIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14 }}>
                      Alterar Status
                    </Typography>
                  }
                  sx={{ ml: -3 }}
                />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  props.handleOpenEdit(props.selectedItem),
                    setSubMenuAnchorEl(null);
                }}
              >
                <ListItemIcon>
                  <ModeEditIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14 }}>Editar Job</Typography>
                  }
                  sx={{ ml: -3 }}
                />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  handleConfirmActivate(props.selectedItem),
                    setSubMenuAnchorEl(null);
                }}
              >
                <ListItemIcon>
                  {props.job.status === "Arquivado" ? (
                    <UpgradeIcon />
                  ) : (
                    <ArchiveIcon />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14 }}>
                      {props.job.status === "Arquivado"
                        ? "Reativar"
                        : "Arquivar"}{" "}
                      Job
                    </Typography>
                  }
                  sx={{ ml: -3 }}
                />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  handleConfirmDelete(props.selectedItem),
                    setSubMenuAnchorEl(null);
                }}
                sx={{ color: "red" }}
              >
                <ListItemIcon>
                  <DeleteIcon sx={{ color: "red" }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14 }}>Deletar Job</Typography>
                  }
                  sx={{ ml: -3 }}
                />
              </ListItemButton>
            </List>
          </Menu>
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
            endpoint="jobs"
            usePageNotEndpoint
            page="requests"
            successMessage={`${
              props.selectedItem.title && props.selectedItem.title
            } Deletado com Sucesso`}
            warning={props.selectedItem.attachments.length !== 0}
            warningMessage={`${
              props.selectedItem.attachments.length !== 0 &&
              props.selectedItem.attachments.length
            } arquivos serão excluidos DEFINITIVAMENTE`}
          />
        </Dialog>
      )}
      {openActivate && (
        <Dialog
          open={openActivate}
          onClose={() => setOpenActivate(!openActivate)}
        >
          <GenericActivateForm
            selectedItem={props.selectedItem}
            openDialog={openActivate}
            setOpenDialog={setOpenActivate}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            toast={toast}
            model="Job"
            successMessage={`${
              props.selectedItem.title && props.selectedItem.title
            } ${
              props.selectedItem.isActive ? "Arquivado" : "Reativado"
            } com Sucesso`}
          />
        </Dialog>
      )}
      {openResolve && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openResolve}
          onClose={() => setOpenResolve(!openResolve)}
        >
          <ResolveJobForm
            userName={props.userName}
            userId={props.userId}
            selectedItem={props.selectedItem}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            openDialog={openResolve}
            setOpenDialog={setOpenResolve}
            toast={toast}
            successMessage="Job Resolvido"
          />
        </Dialog>
      )}
      {openStatusDialog && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={openStatusDialog}
          onClose={() => setOpenStatusDialog(!openStatusDialog)}
          slotProps={{
            backdrop: {
              sx: {
                backgroundColor: "transparent",
              },
            },
          }}
        >
          <ChangeStatusForm
            selectedItem={props.job}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            openDialog={openStatusDialog}
            setOpenDialog={setOpenStatusDialog}
            toast={toast}
            endpoint="jobs"
          />
        </Dialog>
      )}
    </div>
  );
}
