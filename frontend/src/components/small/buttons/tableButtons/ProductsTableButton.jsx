/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { toast } from "react-toastify";

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

import GradeIcon from "@mui/icons-material/Grade";
import AddProductForm from "../../../../forms/add/AddProductForm";

export default function BasicMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAddProduct, setOpenAddProduct] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState(null);

  const open = Boolean(anchorEl);

  return (
    <div>
      <Button
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
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
        <List sx={{ width: 170 }}>
          {props.types.map((type, index) => (
            <ListItemButton
              key={index}
              onClick={() => {
                setSelectedType(type);
                setAnchorEl(null);
                setOpenAddProduct(true);
              }}
            >
              <ListItemIcon>
                <GradeIcon />
              </ListItemIcon>
              <ListItemText
                primary={<Typography sx={{ fontSize: 16 }}>{type}</Typography>}
                sx={{ ml: -3 }}
              />
            </ListItemButton>
          ))}
        </List>
      </Menu>
      {openAddProduct && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddProduct}
          onClose={() => setOpenAddProduct(!openAddProduct)}
        >
          <AddProductForm
            userName={props.userName}
            userId={props.userId}
            onClose={() => setOpenAddProduct(!openAddProduct)}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            configCustomization={props.configCustomization}
            toast={toast}
            type={selectedType}
          />
        </Dialog>
      )}
    </div>
  );
}
