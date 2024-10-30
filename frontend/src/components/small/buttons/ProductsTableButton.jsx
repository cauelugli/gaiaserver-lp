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

import AddProductForm from "../../../forms/add/AddProductForm";

export default function ProductsTableButton(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState({});

  const open = Boolean(anchorEl);

  const handleMenuItemClick = (product) => {
    setSelectedProduct(product);
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
          {props.baseProducts.map((product, index) => (
            <ListItemButton
              key={index}
              onClick={() => handleMenuItemClick(product)}
            >
              <ListItemIcon>
                <SellIcon />
              </ListItemIcon>
              <ListItemText primary={product.type} sx={{ ml: -2 }} />
            </ListItemButton>
          ))}
        </List>
      </Menu>

      {openAdd && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openAdd}
          onClose={() => setOpenAdd(!openAdd)}
        >
          <AddProductForm
            fromProducts
            buttonProps={props}
            baseProduct={selectedProduct}
            userName={props.userName}
            userId={props.userId}
            configAgenda={props.configAgenda}
            configCustomization={props.configCustomization}
            configNotifications={props.configNotifications}
            openAdd={openAdd}
            setOpenAdd={setOpenAdd}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            selectedItem={props.selectedItem}
            onClose={() => setOpenAdd(!openAdd)}
          />
        </Dialog>
      )}
    </div>
  );
}
