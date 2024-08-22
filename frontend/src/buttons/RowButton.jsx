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
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import rowButtonOptions from "../options/rowButtonOptions";

const RowButton = ({ item, page, tabIndex }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");

  const currentOption = rowButtonOptions.find((option) => option.page === page);
  const menuItems = currentOption?.menus[tabIndex] || [];
  const model = currentOption?.models[tabIndex] || "";

  const handleMenuItemClick = (menuItem) => {
    if (!menuItem.submenu) {
      setDialogContent(
        `Item: ${item._id}, Action: ${menuItem.action}, Model: ${model}`
      );
      setDialogOpen(true);
      setAnchorEl(null);
    }
  };

  const handleSubmenuClick = (event, menuItem) => {
    setSubmenuAnchorEl(event.currentTarget);
  };

  const handleSubmenuItemClick = (subItem) => {
    setDialogContent(
      `Item: ${item._id}, Action: ${subItem.action}, Model: ${model}`
    );
    setDialogOpen(true);
    handleSubmenuClose();
    setAnchorEl(null);
  };

  const handleSubmenuClose = () => {
    setSubmenuAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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
                  onClose={handleSubmenuClose}
                >
                  {menuItem.submenu.map((subItem, subIndex) => (
                    <MenuItem
                      sx={{ minWidth: 150 }}
                      key={subIndex}
                      onClick={() => handleSubmenuItemClick(subItem)}
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
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Menu Item Selected</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RowButton;
