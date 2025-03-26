/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  Typography,
} from "@mui/material";

import { icons } from "../../../icons";
import EditFormModel from "../../../forms/edit/EditFormModel";

import { modals } from "../../../options/modals";
import rowButtonOptions from "../../../options/rowButtonOptions";

import DeleteFormModel from "../../../forms/delete/DeleteFormModel";
import SmallFormModel from "../../../forms/edit/SmallFormModel";
import ResolveForm from "../../../forms/misc/ResolveForm";
import RequestBuyForm from "../../../forms/misc/RequestBuyForm";
import ArchiveItemForm from "../../../forms/misc/ArchiveItemForm";

const RowButton = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [smallmenuAnchorEl, setSmallmenuAnchorEl] = useState(null);
  const [smallmenuOptions, setSmallmenuAOptions] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedModal, setSelectedModal] = useState({});
  const [selectedAction, setSelectedAction] = useState("");

  const options = rowButtonOptions(props);

  const currentOption = options.find((option) => option.page === props.page);

  const menuItems =
    currentOption?.page === "products"
      ? currentOption?.menus[0]
      : currentOption?.menus[props.tabIndex] || [];

  const handleMenuItemClick = (menuItem, index) => {
    if (menuItem.modal === "small") {
      setSmallmenuAOptions(menuItem);
      setSmallmenuAnchorEl(submenuAnchorEl);
    } else {
      setSelectedModal(modals[menuItem.modal]);
      setOpenDialog(true);
      closeAllMenus();
      setSelectedAction(
        currentOption?.menus[
          currentOption?.page === "products" ? 0 : props.tabIndex
        ][index].action
      );
    }
  };

  const closeAllMenus = () => {
    setAnchorEl(null);
    setSubmenuAnchorEl(null);
    setSmallmenuAnchorEl(null);
  };

  let formComponent;

  switch (selectedAction) {
    // action ===
    case "edit":
      formComponent = (
        <EditFormModel
          palette={props.palette}
          mainColor={props.mainColor}
          buttonProps={props}
          options={selectedModal}
          productFields={
            currentOption?.page === "products" ? props.item.fields : ""
          }
          userName={props.userName}
          userId={props.userId}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          refreshData={props.refreshData}
          setRefreshData={props.setRefreshData}
          target={props.item}
          currentOption={currentOption}
          tabIndex={props.tabIndex}
        />
      );
      break;

    case "add":
      formComponent = "add targeted";
      break;

    case "archive":
      formComponent = (
        <ArchiveItemForm
          userId={props.userId}
          label={selectedModal.label}
          selectedItem={props.item}
          model={selectedModal.model}
          refreshData={props.refreshData}
          setRefreshData={props.setRefreshData}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          page={currentOption.page}
        />
      );
      break;

    case "resolve":
      formComponent = (
        <ResolveForm
          userId={props.userId}
          label={selectedModal.label}
          selectedItemId={props.item._id || props.item.id}
          selectedItemName={
            props.item.name || props.item.title || props.item.number
          }
          selectedItemPrice={props.item.price}
          model={selectedModal.model}
          refreshData={props.refreshData}
          setRefreshData={props.setRefreshData}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          page={currentOption.page}
        />
      );
      break;

    case "requestBuy":
      formComponent = (
        <RequestBuyForm
          userId={props.userId}
          label={selectedModal.label}
          selectedItem={props.item}
          refreshData={props.refreshData}
          setRefreshData={props.setRefreshData}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          page={currentOption.page}
        />
      );
      break;

    case "delete":
      formComponent = (
        <DeleteFormModel
          userId={props.userId}
          selectedItem={props.item}
          model={selectedModal.model}
          label={selectedModal.label}
          refreshData={props.refreshData}
          setRefreshData={props.setRefreshData}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          page={currentOption.page}
        />
      );
      break;

    default:
      "";
  }

  return (
    <>
      <IconButton
        onClick={(e) => (props.multiple ? "" : setAnchorEl(e.currentTarget))}
        disabled={props.multiple || props.item.status === "Resolvido"}
        sx={{
          "&:hover": {
            backgroundColor: props.fromCard ? "transparent" : "",
          },
        }}
      >
        <icons.MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {menuItems.map((menuItem, index) => (
          <div key={index}>
            {menuItem.submenu ? (
              <>
                <MenuItem
                  onClick={(e) =>
                    menuItem.modal === "small"
                      ? setSmallmenuAnchorEl(e.currentTarget)
                      : setSubmenuAnchorEl(e.currentTarget)
                  }
                  sx={{ minWidth: 150 }}
                >
                  <ListItemIcon>{menuItem.icon}</ListItemIcon>
                  <ListItemText>{menuItem.label}</ListItemText>
                </MenuItem>

                <Menu
                  anchorEl={submenuAnchorEl}
                  open={Boolean(submenuAnchorEl)}
                  onClose={() => setSubmenuAnchorEl(null)}
                >
                  {menuItem.submenu.map((subItem, subIndex) => (
                    <MenuItem
                      sx={{ minWidth: 150 }}
                      key={subIndex}
                      onClick={() => handleMenuItemClick(subItem, index)}
                    >
                      <ListItemIcon>{subItem.icon}</ListItemIcon>
                      <ListItemText>
                        {subItem.targetLabel || subItem.label}
                      </ListItemText>
                    </MenuItem>
                  ))}
                </Menu>

                <Menu
                  anchorEl={smallmenuAnchorEl}
                  open={Boolean(smallmenuAnchorEl)}
                  onClose={() => setSmallmenuAnchorEl(null)}
                >
                  <SmallFormModel
                    source={props.item}
                    label={selectedModal.label}
                    menuItem={menuItem.submenu}
                    smallmenuOptions={smallmenuOptions}
                    setSmallmenuAnchorEl={setSmallmenuAnchorEl}
                    mainColor={props.mainColor}
                    closeAllMenus={closeAllMenus}
                    refreshData={props.refreshData}
                    setRefreshData={props.setRefreshData}
                  />
                </Menu>
              </>
            ) : (
              <MenuItem
                onClick={() => handleMenuItemClick(menuItem, index)}
                sx={{
                  minWidth: 150,
                  backgroundColor: menuItem.label.startsWith("Deletar")
                    ? "#e42528"
                    : "",
                  "&:hover": {
                    backgroundColor: menuItem.label.startsWith("Deletar")
                      ? "#b12427"
                      : "",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: menuItem.label.startsWith("Deletar") ? "white" : "",
                  }}
                >
                  {menuItem.icon}
                </ListItemIcon>
                <ListItemText>
                  <Typography
                    sx={{
                      color: menuItem.label === "Deletar" ? "white" : "",
                    }}
                  >
                    {menuItem.label}
                  </Typography>
                </ListItemText>
              </MenuItem>
            )}
          </div>
        ))}
      </Menu>

      {openDialog && (
        <Dialog
          fullWidth
          maxWidth={
            selectedModal.maxWidth.startsWith("custom")
              ? false
              : selectedModal.maxWidth
          }
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          slotProps={{
            backdrop: {
              style: { backgroundColor: "transparent" },
            },
          }}
          sx={
            selectedModal.maxWidth.startsWith("custom")
              ? {
                  "& .MuiDialog-paper": {
                    width: `${selectedModal.maxWidth.match(/\d+/)[0]}px`,
                    maxWidth: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "auto",
                  },
                }
              : {}
          }
        >
          {formComponent}
        </Dialog>
      )}
    </>
  );
};

export default RowButton;
