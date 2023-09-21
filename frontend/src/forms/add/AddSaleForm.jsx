/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
// import MaterialList from "../../components/small/MaterialList";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddSaleForm = ({ openAddJob, setOpenAddJob, fetchData1, toast }) => {
  const [customer, setCustomer] = React.useState("");
  const [customerType, setCustomerType] = React.useState("Empresa");
  const [requester, setRequester] = React.useState("");
  const [seller, setSeller] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [cost, setCost] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [deliveryAddress, setDeliveryAddress] = React.useState("");
  const [deliveryScheduledTo, setDeliveryScheduledTo] = React.useState(dayjs());

  const [customers, setCustomers] = React.useState([]);
  const [clients, setClients] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  // const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const customers = await api.get("/customers");
        const clients = await api.get("/clients");
        const departments = await api.get("/departments");
        // const products = await api.get("/products");
        setCustomers(customers.data);
        setClients(clients.data);
        setDepartments(
          departments.data.filter((department) => !department.isInternal)
        );
        // setProducts(products.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const [showAdditionalOptions, setShowAdditionalOptions] =
    React.useState(false);

  const handleCheckboxChange = (event) => {
    setShowAdditionalOptions(event.target.checked);
  };

  const handleCustomerTypeChange = (type) => {
    setCustomerType(type);
    setCustomer("");
    setRequester("");
    setDeliveryAddress("");
  };

  const handleCustomerChange = (customer) => {
    setCustomer(customer);
    setRequester(customer.mainContactName || customer.name);
    setDeliveryAddress(customer.address || customer.addressHome);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/jobs", {
        customer: {
          id: customer._id,
          name: customer.name,
          cnpj: customer.cnpj || "",
        },
        requester,
        department: {
          id: department._id,
          name: department.name,
          phone: department.phone,
          color: department.color,
        },
        seller,
        manager: department.manager,
        status: "Aberto",
        price,
        cost,
        deliveryAddress,
        deliveryScheduledTo,
      });
      if (res.data) {
        toast.success(`Pedido Adicionado! Orçamento #${res.data.quoteNumber}`, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenAddJob(!openAddJob);
      fetchData1;
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <Grid container sx={{ mt: 1 }}>
        <DialogTitle>Nova Venda</DialogTitle>
      </Grid>

      <DialogContent>
        <Typography sx={{ mb: 1, fontSize: 18, fontWeight: "bold" }}>
          Informações do Cliente
        </Typography>
        <Grid container sx={{ mt: 2 }}>
          <Grid item sx={{ my: 1 }}>
            <FormControl>
              <FormLabel sx={{ color: "black" }}>Tipo de Cliente</FormLabel>
              <RadioGroup
                row
                value={customerType}
                onChange={(e) => handleCustomerTypeChange(e.target.value)}
              >
                <FormControlLabel
                  value="Empresa"
                  control={<Radio />}
                  label="Empresa"
                />
                <FormControlLabel
                  value="Pessoa Física"
                  control={<Radio />}
                  label="Pessoa Física"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item sx={{ my: 2 }}>
            {customerType && (
              <Grid item>
                <FormControl>
                  <Select
                    onChange={(e) => {
                      handleCustomerChange(e.target.value);
                    }}
                    value={customer}
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <Typography>Selecione um Cliente</Typography>;
                      }

                      return selected.name;
                    }}
                    sx={{ width: 390 }}
                  >
                    <MenuItem disabled value="">
                      {customerType === "Empresa"
                        ? "Empresas"
                        : "Clientes Pessoa Física"}
                    </MenuItem>

                    {customerType === "Empresa"
                      ? customers.map((item) => (
                          <MenuItem value={item} key={item._id}>
                            {item.name}
                          </MenuItem>
                        ))
                      : clients.map((item) => (
                          <MenuItem value={item} key={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>

          <Grid item>
            {customer && (
              <TextField
                label="Solicitante"
                value={requester}
                onChange={(e) => setRequester(e.target.value)}
                required
                variant="outlined"
                sx={{ width: 390 }}
              />
            )}
          </Grid>
        </Grid>

        <Divider sx={{ mt: 2 }} />
        <Typography sx={{ my: 2, fontSize: 18, fontWeight: "bold" }}>
          Departamento
        </Typography>
        <Grid container>
          <Grid item>
            <Select
              onChange={(e) => {
                setDepartment(e.target.value), setSeller("");
              }}
              value={department}
              size="small"
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography>Departamento</Typography>;
                } else {
                  return <Typography>{selected.name}</Typography>;
                }
              }}
              sx={{ width: 390 }}
            >
              {departments.map((item) => (
                <MenuItem
                  value={item}
                  key={item.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: item.color,
                      color: "white",
                    },
                  }}
                >
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          {department && (
            <Grid item>
              <Typography sx={{ mt: 2, mb: 1 }}>Vendedor</Typography>
              <Select
                onChange={(e) => setSeller(e.target.value)}
                value={seller}
                size="small"
                sx={{ width: 390 }}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <Typography>Vendedor</Typography>;
                  }

                  return <Typography>{selected.name}</Typography>;
                }}
              >
                {department.members.map((item) => (
                  <MenuItem value={item} key={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Typography sx={{ my: 2, fontSize: 18, fontWeight: "bold" }}>
          Entrega
        </Typography>
        <Grid container sx={{ mt: 2 }}>
          <Grid item>
            <TextField
              label="Local de Entrega"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 390, mb: 1 }}
            />
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  value={deliveryScheduledTo}
                  format="DD/MM/YYYY"
                  onChange={(newValue) => setDeliveryScheduledTo(newValue)}
                  label="Entregar em"
                  sx={{ width: 390 }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2, mt: 4 }} />
        <Checkbox
          checked={showAdditionalOptions}
          onChange={handleCheckboxChange}
        />
        <label>Observações</label>

        {showAdditionalOptions && (
          <Box>
            <Divider sx={{ my: 2 }} />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenAddJob(!openAddJob)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddSaleForm;
