/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import {
  // Button,
  Grid,
  Tooltip,
  Typography,
  Popover,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
} from "@mui/material";

import { icons } from "../../../icons";

import DeleteMultipleFormModel from "../../../forms/delete/DeleteMultipleFormModel";

const MultipleSelectorButton = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {props.multiple && (
        <Grid
          sx={{
            mr: 1,
            backgroundColor: props.multiple ? `${props.mainColor}B3` : "none",
            borderRadius: 3,
            "&:hover": { backgroundColor: "none" },
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ p: 0.75 }}
          >
            <Tooltip
              title={props.selectedMultipleItems
                .map(
                  (item, index) =>
                    `${item.name}${
                      index === props.selectedMultipleItems.length - 1
                        ? ""
                        : ", "
                    }`
                )
                .join("")}
            >
              <Typography sx={{ fontSize: 13, mt: 0.25 }}>
                Selecionados: {props.selectedMultipleItems.length}
              </Typography>
            </Tooltip>
            <icons.MoreVertIcon
              sx={{
                fontSize: 16,
                ml: 1,
                p: 0.25,
                borderRadius: 3,
                color:
                  props.selectedMultipleItems.length <= 1 ? "grey" : "inherit",
                "&:hover": {
                  cursor:
                    props.selectedMultipleItems.length <= 1
                      ? "default"
                      : "pointer",
                  backgroundColor:
                    props.selectedMultipleItems.length <= 1
                      ? "none"
                      : `${props.mainColor}90`,
                },
              }}
              onClick={
                props.selectedMultipleItems.length <= 1
                  ? null
                  : handlePopoverOpen
              }
            />
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Grid sx={{ my: 2 }}>
                <MenuItem
                  disabled
                  onClick={() => console.log("Editar em Massa")}
                >
                  <ListItemIcon>
                    <icons.ModeEditIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Editar em Massa" />
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setOpenDeleteDialog(true);
                    handlePopoverClose();
                  }}
                >
                  <ListItemIcon>
                    <icons.DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Deletar Todos" />
                </MenuItem>
              </Grid>
            </Popover>
          </Grid>
        </Grid>
      )}
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{
          mr: 1,
          cursor: "pointer",
          width: 50,
          border: `0.5px solid ${
            props.mainColor ? props.mainColor : "#32aacd"
          }`,
          borderRadius: 3,
        }}
        onClick={() => props.setMultiple(!props.multiple)}
      >
        {props.multiple ? (
          <icons.CheckBoxIcon
            sx={{
              p: 0.5,
              color: props.mainColor ? props.mainColor : "#32aacd",
            }}
          />
        ) : (
          <icons.CheckBoxOutlineBlankIcon
            sx={{
              p: 0.5,
              color: props.mainColor ? props.mainColor : "#32aacd",
            }}
          />
        )}
      </Grid>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DeleteMultipleFormModel
          userId={props.userId}
          model={props.model}
          page={props.page}
          refreshData={props.refreshData}
          setRefreshData={props.setRefreshData}
          selectedItems={props.selectedMultipleItems}
          setSelectedMultipleItems={props.setSelectedMultipleItems}
          openDialog={openDeleteDialog}
          setOpenDialog={setOpenDeleteDialog}
        />
      </Dialog>
    </>
  );
};

export default MultipleSelectorButton;
