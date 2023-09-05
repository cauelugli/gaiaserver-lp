/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Box,
  Button,
  Dialog,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import ServiceTable from "../tables/ServiceTable";
import AddServiceForm from "../forms/add/AddServiceForm";

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

export default function Services() {
  const [value, setValue] = React.useState(0);
  const [openAddService, setOpenAddService] = React.useState(false);

  const [services, setServices] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [stockItems, setStockItems] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const services = await api.get("/services");
        const departments = await api.get("/departments");
        const stockItems = await api.get("/stockItems");
        setServices(services.data);
        setDepartments(departments.data);
        setStockItems(stockItems.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [services]);

  const fetchData = async () => {
    try {
      const services = await api.get("/services");
      const departments = await api.get("/departments");
      const stockItems = await api.get("/stockItems");
      setServices(services.data);
      setDepartments(departments.data);
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
        <Typography variant="h4" sx={{ mr: 2 }}>
          Serviços
        </Typography>
        <Button
          onClick={() => setOpenAddService(true)}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 3,
            bottom: 3,
            "&:hover": { borderColor: "#eee" },
          }}
        >
          <Typography variant="h6">+</Typography>
          <Typography sx={{ fontSize: 16, mt: 0.5, ml: 0.5 }}>Novo</Typography>
        </Button>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
        <Tab
          label={<Typography sx={{ fontSize: 14 }}>Setores</Typography>}
          sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
        />
        <Tab
          label={<Typography sx={{ fontSize: 14 }}>Consultoria</Typography>}
          sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
        />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <ServiceTable />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {/* <ServiceTable /> */}<p>Coming Soon</p>
      </CustomTabPanel>
      {openAddService && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddService}
          onClose={() => setOpenAddService(!openAddService)}
        >
          <AddServiceForm
            openAdd={openAddService}
            setOpenAdd={setOpenAddService}
            departments={departments}
            stockItems={stockItems}
            fetchData={fetchData}
          />
        </Dialog>
      )}
    </Box>
  );
}
