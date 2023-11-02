/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";

import MaterialList from "../../components/small/MaterialList";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddSaleForm = ({ user, openAddSale, setOpenAddSale, fetchData1, toast }) => {
  const [customer, setCustomer] = React.useState("");
  const [customerType, setCustomerType] = React.useState("Empresa");
  const [requester, setRequester] = React.useState("");
  const [seller, setSeller] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [deliveryAddress, setDeliveryAddress] = React.useState("");
  const [deliveryReceiver, setDeliveryReceiver] = React.useState("");
  const [deliveryReceiverPhone, setDeliveryReceiverPhone] = React.useState("");
  const [deliveryScheduledTo, setDeliveryScheduledTo] = React.useState(dayjs());
  const [materials, setMaterials] = React.useState([]);
  const [materialsCost, setMaterialsCost] = React.useState(0);

  const [customers, setCustomers] = React.useState([]);
  const [clients, setClients] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const customers = await api.get("/customers");
        const clients = await api.get("/clients");
        const departments = await api.get("/departments");
        const products = await api.get("/products");
        setCustomers(customers.data);
        setClients(clients.data);
        setDepartments(
          departments.data.filter((department) => !department.isInternal)
        );
        setProducts(products.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [products]);

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
    setDeliveryReceiver("");
    setDeliveryReceiverPhone("");
  };

  const handleCustomerChange = (customer) => {
    setCustomer(customer);
    setRequester(customer.mainContactName || customer.name);
    setDeliveryAddress(customer.address || customer.addressHome);
    setDeliveryReceiver(customer.name);
    setDeliveryReceiverPhone(customer.phone);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/sales", {
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
        price: materialsCost,
        items: materials,
        deliveryAddress,
        deliveryReceiver,
        deliveryReceiverPhone,
        deliveryScheduledTo,
        createdBy: user.name
      });
      if (res.data) {
        toast.success(`Venda Adicionada! Orçamento #${res.data.quoteNumber}`, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenAddSale(!openAddSale);
      fetchData1();
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
        <Grid container>
          <Typography sx={{ mb: 1, fontSize: 18, fontWeight: "bold" }}>
            Informações do Cliente
          </Typography>
          {customerType && customer && requester && (
            <CheckCircleOutlineOutlinedIcon sx={{ color: "#50C878", ml: 1 }} />
          )}
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mt: 2 }}
        >
          <Grid item>
            <FormControl>
              <Select
                size="small"
                onChange={(e) => handleCustomerTypeChange(e.target.value)}
                value={customerType}
                displayEmpty
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <Typography>Tipo de Cliente</Typography>;
                  }

                  return selected;
                }}
                sx={{ width: 180 }}
              >
                <MenuItem disabled value="">
                  Tipo de Cliente
                </MenuItem>
                <MenuItem value={"Empresa"}>Empresa</MenuItem>
                <MenuItem value={"Pessoa Fisica"}>Pessoa Física</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            {customerType && (
              <Grid item>
                <FormControl>
                  <Select
                    size="small"
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
                    sx={{ width: 250 }}
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
            <TextField
              size="small"
              label="Solicitante"
              value={requester}
              onChange={(e) => setRequester(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 250 }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ mt: 2 }} />
        <Grid container>
          <Typography sx={{ my: 2, fontSize: 18, fontWeight: "bold" }}>
            Departamento
          </Typography>
          {department && seller && (
            <CheckCircleOutlineOutlinedIcon
              sx={{ color: "#50C878", ml: 1, mt: 2 }}
            />
          )}
        </Grid>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Grid item>
            <Select
              onChange={(e) => {
                setDepartment(e.target.value), setSeller("");
              }}
              value={department}
              size="small"
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography>Selecione o Departamento</Typography>;
                } else {
                  return <Typography>{selected.name}</Typography>;
                }
              }}
            >
              <MenuItem disabled value="">
                Departamentos
              </MenuItem>
              {departments
                .filter((department) => department.type === "Vendas")
                .map((item) => (
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
            <Grid item sx={{ ml: 10 }}>
              <Select
                onChange={(e) => setSeller(e.target.value)}
                value={seller}
                size="small"
                displayEmpty
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <Typography>Selecione o Vendedor</Typography>;
                  } else {
                    return (
                      <Grid container direction="row">
                        <Avatar
                          alt="Imagem do Colaborador"
                          src={`http://localhost:3000/static/${selected.image}`}
                          sx={{ width: 22, height: 22, mr: 1 }}
                        />
                        <Typography>{selected.name}</Typography>
                      </Grid>
                    );
                  }
                }}
              >
                <MenuItem disabled value="">
                  Vendedores
                </MenuItem>
                {department.members.map((item) => (
                  <MenuItem value={item} key={item.id}>
                    <Avatar
                      alt="Imagem do Colaborador"
                      src={`http://localhost:3000/static/${item.image}`}
                      sx={{ width: 22, height: 22, mr: 2 }}
                    />
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ mt: 2 }} />
        <Typography sx={{ my: 2, fontSize: 18, fontWeight: "bold" }}>
          Produtos
        </Typography>
        <Grid container>
          <Grid item>
            {products.length > 0 && (
              <MaterialList
                stockItems={products}
                materials={materials}
                materialsEditCost={materialsCost}
                setMaterials={setMaterials}
                setMaterialsFinalCost={setMaterialsCost}
              />
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container>
          <Typography sx={{ my: 2, fontSize: 18, fontWeight: "bold" }}>
            Entrega
          </Typography>
          {deliveryAddress &&
            deliveryReceiver &&
            deliveryReceiverPhone &&
            deliveryScheduledTo && (
              <CheckCircleOutlineOutlinedIcon
                sx={{ color: "#50C878", ml: 1, mt: 2 }}
              />
            )}
        </Grid>
        <Grid container sx={{ mt: 2 }}>
          <Grid item>
            <TextField
              label="Local de Entrega"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 250 }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Recebedor"
              value={deliveryReceiver}
              onChange={(e) => setDeliveryReceiver(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 160, mx: 1 }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Contato"
              value={deliveryReceiverPhone}
              onChange={(e) => setDeliveryReceiverPhone(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 140, mr: 1 }}
            />
          </Grid>
          <Grid item sx={{ mt: -1, width: "24%" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  value={deliveryScheduledTo}
                  format="DD/MM/YYYY"
                  onChange={(newValue) => setDeliveryScheduledTo(newValue)}
                  label="Entregar em"
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
          onClick={() => setOpenAddSale(!openAddSale)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddSaleForm;
