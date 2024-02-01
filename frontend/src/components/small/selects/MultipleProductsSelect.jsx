/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";

import {
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  MenuItem,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
} from "@mui/material";

import SellIcon from "@mui/icons-material/Sell";

export default function MultipleProductsSelect({
  products,
  allocatedProductsForTask,
  setNewTaskProducts,
}) {
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    setSelectedProducts(allocatedProductsForTask || []);
  }, [allocatedProductsForTask]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedProducts(value);
    setNewTaskProducts(value);
  };

  return (
    <div>
      <Tooltip
        title={<Typography sx={{ fontSize: 12 }}>Designados</Typography>}
      >
        <Badge
          key
          color={selectedProducts.length === 0 ? "error" : "success"}
          overlap="circular"
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          variant="dot"
        >
          <Avatar sx={{ my: "auto", ml: 1 }}>
            <IconButton onClick={(event) => handleClickProducts(event, index)}>
              <SellIcon sx={{ color: "white" }} />
            </IconButton>
            <Popover
              elevation={0}
              open={
                openedPopoverProductsIndex === index &&
                anchorElProductsArray[index] !== undefined
              }
              anchorEl={anchorElArray[index]}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "center",
                horizontal: "left",
              }}
              disableRestoreFocus
            >
              <Grid sx={{ p: 2 }}>
                <MaterialList
                  stockItems={products}
                  materials={newTaskProducts}
                  materialsEditCost={""}
                  setMaterials={setNewTaskProducts}
                  setMaterialsFinalCost={setMaterialsCost}
                />
              </Grid>
            </Popover>
          </Avatar>

          <IconButton onClick={(event) => handleClick(event, index)}>
            <Avatar sx={{ width: 32, height: 32 }} />
          </IconButton>
        </Badge>
      </Tooltip>
    </div>
  );
}
