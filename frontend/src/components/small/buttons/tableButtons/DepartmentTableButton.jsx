/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import {
  Button,
  Menu,
  ListItemIcon,
  ListItemText,
  Typography,
  MenuItem,
  MenuList,
} from "@mui/material";

import LanIcon from "@mui/icons-material/Lan";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

export default function DepartmentTableButton({
  anchorEl,
  openAddButton,
  handleClickAddButton,
  handleCloseAddButton,
  setOpenAddDepartment,
  setOpenAddPosition,
  configCustomization,
}) {
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={openAddButton ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={openAddButton ? "true" : undefined}
        onClick={handleClickAddButton}
        size="small"
        sx={{
          color: configCustomization.mainColor || "#32aacd",
          bottom: 3,
          "&:hover": { borderColor: "#eee" },
        }}
      >
        <Typography variant="h6">+</Typography>
        <Typography
          sx={{
            fontSize: 16,
            mt: 0.5,
            ml: 0.5,
            color: configCustomization.mainColor || "#32aacd",
          }}
        >
          Novo
        </Typography>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openAddButton}
        onClick={handleCloseAddButton}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuList sx={{ width: 170 }}>
          <MenuItem onClick={() => setOpenAddDepartment(true)}>
            <ListItemIcon>
              <LanIcon />
            </ListItemIcon>
            <ListItemText>Departamento</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setOpenAddPosition(true)}>
            <ListItemIcon>
              <AssignmentIndIcon />
            </ListItemIcon>
            <ListItemText>Cargo</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}
