/* eslint-disable react/prop-types */
import * as React from "react";

import {
  Box,
  Button,
  Grid,
  ListItemIcon,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import EngineeringIcon from '@mui/icons-material/Engineering';
import SellIcon from '@mui/icons-material/Sell';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

import CustomerTable from "../tables/CustomerTable";

function CustomTabPanel(props) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Requests() {
  const [value, setValue] = React.useState(0);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ minWidth: "121%" }}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Typography variant="h4" sx={{ mr: 2 }}>
          Pedidos
        </Typography>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          onClick={handleClick}
          variant="outlined"
          sx={{
            borderColor: "#eee",
            borderRadius: 3,
            mb: 1,
            "&:hover": { borderColor: "#eee" },
          }}
        >
          <Typography variant="h6" color="#eee">
            + Novo
          </Typography>
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem>
            <ListItemIcon>
              <EngineeringIcon fontSize="small" />
              <Typography>Serviço</Typography>
            </ListItemIcon>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <SellIcon fontSize="small" />
              <Typography>Venda</Typography>
            </ListItemIcon>
          </MenuItem>
          <MenuItem onClick="">
            <ListItemIcon>
              <SupportAgentIcon fontSize="small" />
              <Typography>Suporte</Typography>
            </ListItemIcon>
          </MenuItem>
        </Menu>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          <Tab
            label="Geral"
            sx={{ color: "#eee", "&.Mui-selected": { color: "black" } }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <CustomerTable openAdd={openAdd} setOpenAdd={setOpenAdd} />
      </CustomTabPanel>
    </Box>
  );
}
