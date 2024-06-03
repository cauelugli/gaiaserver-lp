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

import ArchiveIcon from "@mui/icons-material/Archive";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import MenuIcon from "@mui/icons-material/Menu";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import UpgradeIcon from "@mui/icons-material/Upgrade";

import GenericDeleteForm from "../../../../forms/delete/GenericDeleteForm";
import GenericActivateForm from "../../../../forms/misc/GenericActivateForm";
import ResolveSaleForm from "../../../../forms/misc/ResolveSaleForm";

export default function SaleTableActions(props) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openActivate, setOpenActivate] = React.useState(false);
  const [openResolve, setOpenResolve] = React.useState(false);
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

  const handleConfirmActivate = () => {
    setOpenActivate(true);
    setAnchorEl(null);
  };

  const handleConfirmResolve = () => {
    setOpenResolve(true);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        size="small"
        onClick={handleClick}
        sx={{ "&:hover": { borderColor: "#eee" } }}
      >
        <MenuIcon sx={{ color: "#888", pr: props.fromCard ? 0 : 3 }} />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <List sx={{ width: 210 }}>
          {props.sale.status === "Aprovado" ||
            (props.sale.status === "Aberto" && (
              <ListItemButton onClick={(item) => handleConfirmResolve(item)}>
                <ListItemIcon>
                  <DoneOutlineIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14 }}>
                      Concluir Venda
                    </Typography>
                  }
                  sx={{ ml: -3 }}
                />
              </ListItemButton>
            ))}
          <ListItemButton
            disabled={props.sale.status === "Concluido"}
            onClick={(item) => {
              props.handleOpenEdit(item), setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <ModeEditIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>Editar Venda</Typography>
              }
              sx={{ ml: -3 }}
            />
          </ListItemButton>

          <ListItemButton
            disabled={props.sale.status === "Concluido"}
            onClick={(item) => {
              props.handleOpenAddSaleInteraction(item), setAnchorEl(null);
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
            disabled={props.sale.status === "Concluido"}
            onClick={(item) => handleConfirmActivate(item)}
          >
            <ListItemIcon>
              {props.sale.status === "Arquivado" ? (
                <UpgradeIcon />
              ) : (
                <ArchiveIcon />
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>
                  {props.sale.status === "Arquivado" ? "Reativar" : "Arquivar"}{" "}
                  Venda
                </Typography>
              }
              sx={{ ml: -3 }}
            />
          </ListItemButton>

          <ListItemButton
            disabled={props.sale.status === "Concluido"}
            onClick={(item) => handleConfirmDelete(item)}
            sx={{ color: "red" }}
          >
            <ListItemIcon>
              <DeleteIcon sx={{ color: "red" }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>Deletar Venda</Typography>
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
            endpoint="sales"
            usePageNotEndpoint
            page="requests"
            successMessage={`Venda #${
              props.selectedItem.number && props.selectedItem.number
            } Deletada com Sucesso`}
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
            model="Sale"
            successMessage={`Venda ${
              props.selectedItem.quoteNumber && props.selectedItem.quoteNumber
            } ${
              props.selectedItem.isActive ? "Arquivada" : "Reativada"
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
          <ResolveSaleForm
            userName={props.userName}
            userId={props.userId}
            selectedItem={props.selectedItem}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            openDialog={openResolve}
            setOpenDialog={setOpenResolve}
            toast={toast}
            successMessage="Venda Concluida"
          />
        </Dialog>
      )}
    </div>
  );
}
