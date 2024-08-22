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
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import rowButtonOptions from "../options/rowButtonOptions";
import { modals } from "../options/modals";
import EditFormModel from "../forms/edit/EditFormModel";

const RowButton = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState({});

  const currentOption = rowButtonOptions.find(
    (option) => option.page === props.page
  );
  const menuItems = currentOption?.menus[props.tabIndex] || [];

  const handleMenuItemClick = (menuItem) => {
    setSelectedModal(modals[menuItem.modal]);
    setDialogOpen(true);
    setAnchorEl(null);
    setSubmenuAnchorEl(null);
  };

  // selectedModal.endpoint &&
  //   console.log("selectedModal", selectedModal, "item", item);

  const handleSubmenuClick = (event, menuItem) => {
    setSubmenuAnchorEl(event.currentTarget);
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MenuIcon />
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
                  onClick={(e) => handleSubmenuClick(e, menuItem)}
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
                      onClick={() => handleMenuItemClick(subItem)}
                    >
                      <ListItemIcon>{subItem.icon}</ListItemIcon>
                      <ListItemText>{subItem.label}</ListItemText>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <MenuItem
                onClick={() => handleMenuItemClick(menuItem)}
                sx={{ minWidth: 150 }}
              >
                <ListItemIcon>{menuItem.icon}</ListItemIcon>
                <ListItemText>{menuItem.label}</ListItemText>
              </MenuItem>
            )}
          </div>
        ))}
      </Menu>

      {dialogOpen && (
        <Dialog
          fullWidth
          maxWidth={
            selectedModal.maxWidth.startsWith("custom")
              ? false
              : selectedModal.maxWidth
          }
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
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
          <EditFormModel
            palette={props.palette}
            buttonProps={props}
            options={selectedModal}
            selectedOptionLabel={"selectedOption.label"}
            userName={props.userName}
            userId={props.userId}
            configAgenda={props.configAgenda}
            configCustomization={props.configCustomization}
            configNotifications={props.configNotifications}
            configNotificationsBooleans={props.configNotificationsBooleans}
            openAdd={dialogOpen}
            setOpenAdd={setDialogOpen}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            selectedItem={props.item}
          />
        </Dialog>
      )}
    </>
  );
};

export default RowButton;
