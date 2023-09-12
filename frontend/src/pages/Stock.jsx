/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Box,
  Button,
  Dialog,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import AddBoxIcon from "@mui/icons-material/AddBox";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import StockTable from "../tables/StockTable";
import AddStockItemForm from "../forms/add/AddStockItemForm";
import AddStockForm from "../forms/add/AddStockForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

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

export default function Stock() {
  const [value, setValue] = React.useState(0);

  const [stockItems, setStockItems] = React.useState([]);

  const [openAddNewStockItem, setOpenAddNewStockItem] = React.useState(false);
  const [openAddStock, setOpenAddStock] = React.useState(false);
  

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAddButton = Boolean(anchorEl);
  const handleClickAddButton = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAddButton = () => {
    setAnchorEl(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const stockItems = await api.get("/stockItems");
        setStockItems(stockItems.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const stockItems = await api.get("/stockItems");
      setStockItems(stockItems.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box sx={{ minWidth: "120%" }}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Typography
          sx={{ fontSize: 23, mt: 0.5, ml: 1, mr: 2, fontWeight: "bold" }}
        >
          Estoque
        </Typography>
        <div>
          <Button
            id="basic-button"
            aria-controls={openAddButton ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openAddButton ? "true" : undefined}
            onClick={handleClickAddButton}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 3,
              bottom: 3,
              "&:hover": { borderColor: "#eee" },
            }}
          >
            <Typography variant="h6">+</Typography>
            <Typography sx={{ fontSize: 16, mt: 0.5, ml: 0.5 }}>
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
            <MenuList sx={{ width: 240 }}>
              <MenuItem onClick={() => setOpenAddNewStockItem(true)}>
                <ListItemIcon>
                  <AddBoxIcon />
                </ListItemIcon>
                <ListItemText>Item de Estoque</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => setOpenAddStock(true)}>
                <ListItemIcon>
                  <LocalShippingIcon />
                </ListItemIcon>
                <ListItemText>Entrada de Mercadorias</ListItemText>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          <Tab
            label={<Typography sx={{ fontSize: 14 }}>Itens</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <StockTable stockItems={stockItems} />
      </CustomTabPanel>
      {openAddNewStockItem && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddNewStockItem}
          onClose={() => setOpenAddNewStockItem(!openAddNewStockItem)}
        >
          <AddStockItemForm
            openAdd={openAddNewStockItem}
            setOpenAdd={setOpenAddNewStockItem}
            fetchData={fetchData}
          />
        </Dialog>
      )}
      {openAddStock && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddStock}
          onClose={() => setOpenAddStock(!openAddStock)}
        >
          <AddStockForm
            openAdd={openAddStock}
            stockItems={stockItems}
            setOpenAdd={setOpenAddStock}
            fetchData={fetchData}
          />
        </Dialog>
      )}
    </Box>
  );
}
