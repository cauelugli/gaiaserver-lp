/* eslint-disable react/prop-types */
import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import { Box, Dialog, Grid, Tab, Tabs, Typography } from "@mui/material";

import AddStockItemForm from "../forms/add/AddStockItemForm";
import AddStockProductForm from "../forms/add/AddStockProductForm";
import AddStockForm from "../forms/add/AddStockForm";
import AddProductForm from "../forms/add/AddProductForm";
import AddMultipleProductForm from "../forms/add/AddMultipleProductForm";

import StockTable from "../tables/StockTable";
import StockEntriesTable from "../tables/StockEntriesTable";
import ProductsTable from "../tables/ProductsTable";

import StockButton from "../components/small/buttons/StockButton";

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
  const [products, setProducts] = React.useState([]);

  const [openModals, setOpenModals] = React.useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const openModal = (modalIndex) => {
    const updatedModals = [...openModals];
    updatedModals[modalIndex] = true;
    setOpenModals(updatedModals);
  };

  const closeModal = (modalIndex) => {
    const updatedModals = [...openModals];
    updatedModals[modalIndex] = false;
    setOpenModals(updatedModals);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const stockItems = await api.get("/stockItems");
        const products = await api.get("/products");
        setStockItems(stockItems.data);
        setProducts(products.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [products]);

  const fetchData = async () => {
    try {
      const stockItems = await api.get("/stockItems");
      const products = await api.get("/products");
      setStockItems(stockItems.data);
      setProducts(products.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box>
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
        <StockButton openModal={openModal} />
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          <Tab
            label={<Typography sx={{ fontSize: 14 }}>Produtos</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 14 }}>Materiais</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 14 }}>Entradas</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <ProductsTable />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <StockTable stockItems={stockItems} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <StockEntriesTable />
      </CustomTabPanel>

      {openModals[0] && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openModals[0]}
          onClose={() => closeModal(0)}
        >
          <AddProductForm
            onClose={() => closeModal(0)}
            fetchData={fetchData}
            toast={toast}
          />
        </Dialog>
      )}

      {openModals[1] && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openModals[1]}
          onClose={() => closeModal(1)}
        >
          <AddMultipleProductForm
            onClose={() => closeModal(1)}
            fetchData={fetchData}
            toast={toast}
          />
        </Dialog>
      )}

      {openModals[2] && (
        <Dialog
          fullWidth
          maxWidth="sm"
          open={openModals[2]}
          onClose={() => closeModal(2)}
        >
          <AddStockItemForm
            onClose={() => closeModal(2)}
            fetchData={fetchData}
            toast={toast}
          />
        </Dialog>
      )}

      {openModals[3] && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openModals[3]}
          onClose={() => closeModal(3)}
        >
          <AddStockProductForm
            products={products}
            onClose={() => closeModal(3)}
            fetchData={fetchData}
            toast={toast}
          />
        </Dialog>
      )}

      {openModals[4] && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openModals[4]}
          onClose={() => closeModal(4)}
        >
          <AddStockForm
            stockItems={stockItems}
            onClose={() => closeModal(4)}
            fetchData={fetchData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
