/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";

import {
  Button,
  Grid,
  Menu,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import SellIcon from "@mui/icons-material/Sell";

import pageButtonOptions from "../../../pageButtonOptions";

export default function PageButtonModel(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const currentPageOptions = pageButtonOptions.find(
    (option) => option.page === props.page
  ).pageButtonOptions;

  const handleMenuItemClick = (menuIndex) => {
    setAnchorEl(null);
    props.openModal(menuIndex);
  };

  console.log("props.baseProducts", props.baseProducts);

  return (
    <div>
      <Button
        size="small"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          color: props.configCustomization.mainColor || "#32aacd",
          "&:hover": { borderColor: "#eee" },
        }}
      >
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h6" sx={{ mb: 0.5, mr: 0.5 }}>
            +
          </Typography>
          <Typography sx={{ fontSize: 16 }}>Novo</Typography>
        </Grid>
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <List sx={{ minWidth: 150, maxWidth: 220 }}>
          {props.page === "products"
            ? props.baseProducts.map((product, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => handleMenuItemClick(product.name)}
                >
                  <ListItemIcon>
                    <SellIcon />
                  </ListItemIcon>
                  <ListItemText primary={product.type} sx={{ ml: -2 }} />
                </ListItemButton>
              ))
            : currentPageOptions.map((option, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => handleMenuItemClick(option.modal)}
                >
                  <ListItemIcon>{option.icon}</ListItemIcon>
                  <ListItemText primary={option.label} sx={{ ml: -2 }} />
                </ListItemButton>
              ))}
        </List>
      </Menu>
    </div>
  );
}
