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

import EditFormModel from "../forms/edit/EditFormModel";

import { modals } from "../options/modals";
import rowButtonOptions from "../options/rowButtonOptions";
import DeleteFormModel from "../forms/delete/DeleteFormModel";

const RowButton = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedModal, setSelectedModal] = useState({});
  const [selectedAction, setSelectedAction] = useState("");

  const currentOption = rowButtonOptions.find(
    (option) => option.page === props.page
  );
  const menuItems = currentOption?.menus[props.tabIndex] || [];

  const handleMenuItemClick = (menuItem, index) => {
    setSelectedModal(modals[menuItem.modal]);
    setOpenDialog(true);
    setAnchorEl(null);
    setSubmenuAnchorEl(null);
    setSelectedAction(currentOption?.menus[props.tabIndex][index].action);
  };

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
                      onClick={() => handleMenuItemClick(subItem, index)}
                    >
                      <ListItemIcon>{subItem.icon}</ListItemIcon>
                      <ListItemText>{subItem.label}</ListItemText>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <MenuItem
                onClick={() => handleMenuItemClick(menuItem, index)}
                sx={{ minWidth: 150 }}
              >
                <ListItemIcon>{menuItem.icon}</ListItemIcon>
                <ListItemText>{menuItem.label}</ListItemText>
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
          {selectedAction === "edit" ? (
            <EditFormModel
              palette={props.palette}
              buttonProps={props}
              options={selectedModal}
              userName={props.userName}
              userId={props.userId}
              configAgenda={props.configAgenda}
              configCustomization={props.configCustomization}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              refreshData={props.refreshData}
              setRefreshData={props.setRefreshData}
              target={props.item}
            />
          ) : selectedAction === "add" ? (
            "add targeted"
          ) : selectedAction === "delete" ? (
            <DeleteFormModel
              userId={props.userId}
              selectedItem={props.item}
              model={selectedModal.model}
              refreshData={props.refreshData}
              setRefreshData={props.setRefreshData}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              page={currentOption.page}
            />
          ) : (
            ""
          )}
        </Dialog>
      )}
    </>
  );
};

export default RowButton;
