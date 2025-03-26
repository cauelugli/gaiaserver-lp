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

import AddFormModel from "../../../forms/add/AddFormModel";

import pageButtonOptions from "../../../options/pageButtonOptions";

export default function PageButtonModel(props) {
  const currentPageOptions = pageButtonOptions.find(
    (option) => option.page === props.page
  ).pageButtonOptions;

  const [anchorEl, setAnchorEl] = useState(null);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState("");
  const [selectedOptionMaxWidth, setSelectedOptionMaxWidth] =
    React.useState("xs");

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
          {currentPageOptions.map((option, index) => (
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
          maxWidth={
            selectedOptionMaxWidth.startsWith("custom")
              ? false
              : selectedOptionMaxWidth
          }
          open={openAdd}
          onClose={() => setOpenAdd(!openAdd)}
          sx={
            selectedOptionMaxWidth.startsWith("custom")
              ? {
                  "& .MuiDialog-paper": {
                    width: `${selectedOptionMaxWidth.match(/\d+/)[0]}px`,
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
          <AddFormModel
            api={props.api}
            socket={props.socket}
            mainColor={props.configCustomization.mainColor}
            page={props.page}
            buttonProps={props}
            options={currentPageOptions}
            selectedOptionLabel={selectedOption.label}
            userId={props.userId}
            isAdmin={props.isAdmin}
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
