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
import DeleteIcon from "@mui/icons-material/Delete";
import EngineeringIcon from "@mui/icons-material/Engineering";
import HistoryIcon from "@mui/icons-material/History";
import MenuIcon from "@mui/icons-material/Menu";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SellIcon from "@mui/icons-material/Sell";
import UpgradeIcon from "@mui/icons-material/Upgrade";

import GenericDeleteForm from "../../../../forms/delete/GenericDeleteForm";
import GenericActivateForm from "../../../../forms/misc/GenericActivateForm";
import AddJobForm from "../../../../forms/add/AddJobForm";
import AddSaleForm from "../../../../forms/add/AddSaleForm";

export default function CustomerTableActions(props) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openAddJob, setOpenAddJob] = React.useState(false);
  const [openAddSale, setOpenAddSale] = React.useState(false);
  const [openActivate, setOpenActivate] = React.useState(false);
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

  return (
    <div>
      <Button size="small" onClick={handleClick}>
        <MenuIcon sx={{ color: "#888", pr: props.fromCard ? 0 : 3 }} />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <List sx={{ width: 200 }}>
          <ListItemButton
            onClick={() => {
              setOpenAddJob(true), setAnchorEl(null);
            }}
            disabled={!props.selectedItem.isActive}
          >
            <ListItemIcon>
              <EngineeringIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={{ fontSize: 14 }}>Novo Job</Typography>}
              sx={{ ml: -3 }}
            />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              setOpenAddSale(true), setAnchorEl(null);
            }}
            disabled={!props.selectedItem.isActive}
          >
            <ListItemIcon>
              <SellIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>Nova Venda</Typography>
              }
              sx={{ ml: -3 }}
            />
          </ListItemButton>

          <ListItemButton
            onClick={() => {
              props.setOpenViewDialog(true), setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>Ver Histórico</Typography>
              }
              sx={{ ml: -3 }}
            />
          </ListItemButton>

          <ListItemButton
            onClick={() => {
              props.setOpenEdit(true), setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <ModeEditIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>Editar Cliente</Typography>
              }
              sx={{ ml: -3 }}
            />
          </ListItemButton>

          <ListItemButton onClick={(item) => handleConfirmActivate(item)}>
            <ListItemIcon>
              {props.customer.isActive ? <ArchiveIcon /> : <UpgradeIcon />}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>
                  {props.customer.isActive ? "Arquivar" : "Reativar"} Cliente
                </Typography>
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
                <Typography sx={{ fontSize: 14 }}>Deletar Cliente</Typography>
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
            endpoint={props.selectedItem.cpf ? "clients" : "customers"}
            usePageNotEndpoint
            page="customers"
            successMessage={`${
              props.selectedItem.name && props.selectedItem.name
            } Deletado com Sucesso`}
          />
        </Dialog>
      )}
      {openAddJob && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openAddJob}
          onClose={() => setOpenAddJob(!openAddJob)}
        >
          <AddJobForm
            userName={props.userName}
            userId={props.userId}
            configAgenda={props.configAgenda}
            configNotifications={props.configNotifications}
            configNotificationsBooleans={props.configNotificationsBooleans}
            openAddJob={openAddJob}
            setOpenAddJob={setOpenAddJob}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            selectedItem={props.selectedItem}
            toast={toast}
          />
        </Dialog>
      )}
      {openAddSale && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddSale}
          onClose={() => setOpenAddSale(!openAddSale)}
        >
          <AddSaleForm
            userName={props.userName}
            userId={props.userId}
            openAddSale={openAddSale}
            setOpenAddSale={setOpenAddSale}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            selectedItem={props.selectedItem}
            toast={toast}
            configNotifications={props.configNotifications}
            configNotificationsBooleans={props.configNotificationsBooleans}          />
        </Dialog>
      )}
      {openActivate && (
        <Dialog
          open={openActivate}
          onClose={() => setOpenActivate(!openActivate)}
        >
          <GenericActivateForm
            selectedItem={props.selectedItem}
            userId={props.userId}
            openDialog={openActivate}
            setOpenDialog={setOpenActivate}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            toast={toast}
            model={props.selectedItem.cpf ? "Client" : "Customer"}
            successMessage={`${
              props.selectedItem.name && props.selectedItem.name
            } ${
              props.selectedItem.isActive ? "Arquivado" : "Reativado"
            } com Sucesso`}
          />
        </Dialog>
      )}
    </div>
  );
}
