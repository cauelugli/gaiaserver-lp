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
  Dialog,
} from "@mui/material";

import SellIcon from "@mui/icons-material/Sell";

import AddFormModel from "../../../forms/AddFormModel";

import pageButtonOptions from "../../../pageButtonOptions";

export default function PageButtonModel(props) {
  const currentPageOptions = pageButtonOptions.find(
    (option) => option.page === props.page
  ).pageButtonOptions;

  const [anchorEl, setAnchorEl] = useState(null);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState("");
  const [selectedOptionMaxWidth, setSelectedOptionMaxWidth] = React.useState("xs");

  const open = Boolean(anchorEl);

  const handleMenuItemClick = (option) => {
    setSelectedOption(option);
    setSelectedOptionMaxWidth(option.modal.maxWidth);
    setAnchorEl(null);
    setOpenAdd(true);
  };

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
                  onClick={() => handleMenuItemClick(product)}
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
                  onClick={() => handleMenuItemClick(option)}
                >
                  <ListItemIcon>{option.icon}</ListItemIcon>
                  <ListItemText primary={option.label} sx={{ ml: -2 }} />
                </ListItemButton>
              ))}
        </List>
      </Menu>

      {openAdd && (
        <Dialog
          fullWidth
          maxWidth={selectedOptionMaxWidth}
          open={openAdd}
          onClose={() => setOpenAdd(!openAdd)}
        >
          <AddFormModel
            buttonProps={props}
            options={currentPageOptions}
            selectedOptionLabel={selectedOption.label}
            userName={props.userName}
            userId={props.userId}
            configAgenda={props.configAgenda}
            configCustomization={props.configCustomization}
            configNotifications={props.configNotifications}
            configNotificationsBooleans={props.configNotificationsBooleans}
            openAdd={openAdd}
            setOpenAdd={setOpenAdd}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            selectedItem={props.selectedItem}
          />
        </Dialog>
      )}
    </div>
  );
}
