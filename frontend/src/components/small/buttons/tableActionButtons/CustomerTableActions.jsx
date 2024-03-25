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
        <MenuIcon sx={{ color: "#888", mr: 3 }} />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <List sx={{ width: 200 }}>
          <ListItemButton
            onClick={() => {
              setOpenAddJob(true), setAnchorEl(null);
            }}
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
            {props.sale.status === "Arquivado" ? <UpgradeIcon /> : <ArchiveIcon />}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>
                  {selectedItem.isActive ? "Arquivar" : "Reativar"} Cliente
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
            selectedItem={props.selectedItem}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            toast={toast}
            endpoint={props.selectedItem.cpf ? "clients" : "customers"}
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
            user={props.user}
            configAgenda={props.configAgenda}
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
            user={props.user}
            openAddSale={openAddSale}
            setOpenAddSale={setOpenAddSale}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            selectedItem={props.selectedItem}
            toast={toast}
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
            endpoint={
              props.selectedItem.cpf ? "clients/activate" : "customers/activate"
            }
            successMessage={`${
              props.selectedItem.name && props.selectedItem.name
            } Arquivado com Sucesso`}
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
            endpoint={
              props.selectedItem.cpf ? "clients/activate" : "customers/activate"
            }
            successMessage={`${
              props.selectedItem.name && props.selectedItem.name
            } Arquivado com Sucesso`}
          />
        </Dialog>
      )}
    </div>
  );
}
