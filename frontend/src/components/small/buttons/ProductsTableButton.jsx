/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";

import {
  Button,
  Grid2,
  Menu,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Dialog,
} from "@mui/material";

import { icons } from "../../../icons";

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
        <Grid2
          container
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          sx={{
            position: "relative",
            "&:hover .hover-text": {
              opacity: 1,
              marginLeft: "4px",
            },
          }}
        >
          <Typography variant="h6" sx={{ mb: 0.5, mr: 0.5 }}>
            +
          </Typography>
          <Typography
            className="hover-text"
            sx={{
              fontSize: 16,
              opacity: 0,
              transition: "opacity 0.3s, margin-left 0.3s",
            }}
          >
            Novo
          </Typography>
        </Grid2>
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <List sx={{ minWidth: 150, maxWidth: 220 }}>
          {props.baseProducts.map((product, index) => (
            <ListItemButton
              key={index}
              onClick={() => handleMenuItemClick(product)}
            >
              <ListItemIcon>
                <icons.SellIcon />
              </ListItemIcon>
              <ListItemText primary={product.type} sx={{ ml: -2 }} />
            </ListItemButton>
          ))}
        </List>
      </Menu>

      {openAdd && (
        <Dialog
          fullWidth
          maxWidth="xl"
          open={openAdd}
          onClose={() => setOpenAdd(!openAdd)}
        >
          <AddProductForm
            fromProducts
            mainColor={props.configCustomization.mainColor}
            buttonProps={props}
            baseProduct={selectedProduct}
            userId={props.userId}
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
