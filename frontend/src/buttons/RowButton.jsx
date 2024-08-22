/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import rowButtonOptions from "../options/rowButtonOptions";

const RowButton = ({ item, page, tabIndex }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);

  const currentOption = rowButtonOptions.find((option) => option.page === page);
  const menuItems = currentOption?.menus[tabIndex] || [];

  const handleMenuItemClick = (menuItem) => {
    if (!menuItem.submenu) {
      console.log("Selected action:", menuItem.action);
      setAnchorEl(null);
    }
  };

  const handleSubmenuClick = (event, menuItem) => {
    setSubmenuAnchorEl(event.currentTarget);
  };

  const handleSubmenuClose = () => {
    setSubmenuAnchorEl(null);
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
                      onClick={() => {
                        console.log("Selected action:", subItem.action);
                        handleSubmenuClose();
                        setAnchorEl(null);
                      }}
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
    </>
  );
};

export default RowButton;
