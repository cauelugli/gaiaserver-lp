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
  Grid,
} from "@mui/material";

import LanIcon from "@mui/icons-material/Lan";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import GroupsIcon from "@mui/icons-material/Groups";

export default function DepartmentTableButton({
  configCustomization,
  anchorEl,
  openAddButton,
  handleClickAddButton,
  handleCloseAddButton,
  setOpenAddDepartment,
  setOpenAddPosition,
  setOpenAddGroup,
}) {
  return (
    <div>
      <Button
        onClick={handleClickAddButton}
        size="small"
        sx={{
          color: configCustomization.mainColor || "#32aacd",
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
          <MenuItem onClick={() => setOpenAddGroup(true)}>
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText>Grupo</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}
