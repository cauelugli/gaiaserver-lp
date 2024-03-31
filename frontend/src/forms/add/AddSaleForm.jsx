/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Paper,
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
import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";
import CustomerSelect from "../../components/small/selects/CustomerSelect";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddSaleForm = ({
  user,
  selectedItem,
  setOpenAddSale,
  refreshData,
  setRefreshData,
  toast,
  fromShortcut,
  addFromShortcut
}) => {
  const [config, setConfig] = React.useState([]);
  let selectedCustomer = {};
  if (selectedItem || fromShortcut) {
    selectedCustomer = selectedItem;
  }

  const [customerType, setCustomerType] = React.useState(
    selectedCustomer.cnpj
      ? "Empresa"
      : selectedCustomer.cpf
      ? "Pessoa Física"
      : ""
  );
  const [customer, setCustomer] = React.useState(
    selectedItem ? selectedCustomer : ""
  );
  const [requester, setRequester] = React.useState(
    selectedCustomer.mainContactName
      ? selectedCustomer.mainContactName
      : selectedCustomer.name
      ? selectedCustomer.name
      : ""
  );
  const [deliveryAddress, setDeliveryAddress] = React.useState(
    selectedCustomer.address
      ? selectedCustomer.address
      : selectedCustomer.addressHome
      ? selectedCustomer.addressHome
      : ""
  );
  const [deliveryReceiver, setDeliveryReceiver] = React.useState(
    selectedCustomer.mainContactName
      ? selectedCustomer.mainContactName
      : selectedCustomer.name
      ? selectedCustomer.name
      : ""
  );
  const [deliveryReceiverPhone, setDeliveryReceiverPhone] = React.useState(
    selectedCustomer.mainContactPhone
      ? selectedCustomer.mainContactPhone
      : selectedCustomer.phone
      ? selectedCustomer.phone
      : ""
  );

  const [seller, setSeller] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [productsDefined, setProductsDefined] = React.useState(false);
  const [materials, setMaterials] = React.useState([]);
  const [materialsCost, setMaterialsCost] = React.useState(0);
  const [deliveryScheduledTo, setDeliveryScheduledTo] = React.useState(dayjs());

  const [departments, setDepartments] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [configCustomization, setConfigCustomization] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const departments = await api.get("/departments");
        const products = await api.get("/products");
        const config = await api.get("/config/requests");
        const configCustomization = await api.get("/config");
        setConfig(config.data);
        setDepartments(
          departments.data.filter((department) => !department.isInternal)
        );
        setProducts(products.data);
        setConfigCustomization(configCustomization.data[0].customization);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
          image: customer.image,
          cnpj: customer.cnpj || "",
          type: customer.cnpj ? "Customer" : "Client",
        },
        requester,
        department: {
          id: department._id,
          name: department.name,
          phone: department.phone,
          color: department.color,
        },
        seller,
        manager: department.manager || "",
        status: config.requestsNeedApproval ? "Aberto" : "Aprovado",
        price: materialsCost,
        items: materials,
        deliveryAddress,
        deliveryReceiver,
        deliveryReceiverPhone,
        deliveryScheduledTo,
        createdBy: user.name,
      });
      if (res.data) {
        toast.success(
          `Venda Adicionada! Orçamento #${res.data.savedQuote.number}`,
          {
            closeOnClick: true,
            pauseOnHover: false,
            theme: "colored",
            autoClose: 1200,
          }
        );
        await api.post("/recentActivity", {
          activity: `Colaborador ${user.name} criou um Venda para ${customer.name}`,
          createdAt: dayjs().format("DD/MM/YYYY HH:mm:ss"),
        });
        socket.emit("recentActivityRefresh");
      }
      setOpenAddSale(false);
      if (!addFromShortcut) {
        setRefreshData(!refreshData);
      }
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogHeader title="Venda" femaleGender={true} />

      <DialogContent>
        <Grid container>
          <Typography sx={{ mb: 1, fontSize: 18, fontWeight: "bold" }}>
            Informações do Cliente
          </Typography>
          <CheckCircleOutlineOutlinedIcon
            sx={{
              color:
                customerType && customer && requester ? "#50C878" : "lightgrey",
              ml: 1,
            }}
          />
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
                disabled={selectedCustomer.isActive || fromShortcut}
                onChange={(e) => handleCustomerTypeChange(e.target.value)}
                value={customerType}
                displayEmpty
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <Typography>Tipo de Cliente</Typography>;
                  }

                  return selected;
                }}
                sx={{ width: 200 }}
              >
                <MenuItem disabled value="">
                  Tipo de Cliente
                </MenuItem>
                <MenuItem value={"Empresa"}>Empresa</MenuItem>
                <MenuItem value={"Pessoa Fisica"}>Pessoa Física</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {customerType && (
            <Grid item>
              <CustomerSelect
                marginAddJobForm
                sizeSmall
                selectedCustomer={selectedCustomer}
                handleCustomerChange={handleCustomerChange}
                setCustomer={setCustomer}
                customerType={customerType}
                fromShortcut={fromShortcut}
              />
            </Grid>
          )}

          <Grid item>
            <TextField
              label="Solicitante"
              value={requester}
              onChange={(e) => setRequester(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 250, opacity: customer ? 1 : 0 }}
            />
          </Grid>
        </Grid>

        {requester && (
          <>
            <Divider sx={{ mt: 2 }} />
            <Grid container>
              <Typography sx={{ my: 2, fontSize: 18, fontWeight: "bold" }}>
                Departamento
              </Typography>

              <CheckCircleOutlineOutlinedIcon
                sx={{
                  color: department && seller ? "#50C878" : "lightgrey",
                  ml: 1,
                  mt: 2,
                }}
              />
            </Grid>

            <Grid
              container
              justifyContent="space-between"
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
                      return (
                        <Grid container direction="row">
                          <Paper
                            elevation={0}
                            sx={{
                              mr: 1,
                              mt: 0.5,
                              width: 15,
                              height: 15,
                              borderRadius: 50,
                              backgroundColor: selected.color,
                            }}
                          />
                          <Typography>{selected.name}</Typography>
                        </Grid>
                      );
                    }
                  }}
                >
                  <MenuItem disabled value="">
                    Departamentos
                  </MenuItem>
                  {departments
                    .filter((department) => department.type === "Vendas")
                    .map((item) => (
                      <MenuItem value={item} key={item.id}>
                        <Grid container direction="row">
                          <Paper
                            elevation={0}
                            sx={{
                              mr: 1,
                              mt: 0.5,
                              width: 15,
                              height: 15,
                              borderRadius: 50,
                              backgroundColor: item.color,
                            }}
                          />
                          <Typography>{item.name}</Typography>
                        </Grid>
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
                    sx={{ width: 250 }}
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
          </>
        )}

        {seller && (
          <>
            <Divider sx={{ mt: 2 }} />
            <Grid container>
              <Typography sx={{ my: 2, fontSize: 18, fontWeight: "bold" }}>
                Produtos
              </Typography>

              <CheckCircleOutlineOutlinedIcon
                sx={{
                  color: productsDefined ? "#50C878" : "lightgrey",
                  ml: 1,
                  mt: 2,
                }}
              />
            </Grid>

            <Grid container>
              <Grid item>
                {products.length > 0 && (
                  <MaterialList
                    productsDefined={productsDefined}
                    stockItems={products}
                    materials={materials}
                    materialsEditCost={materialsCost}
                    setMaterials={setMaterials}
                    setMaterialsFinalCost={setMaterialsCost}
                  />
                )}
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="center"
              sx={{ mt: 1 }}
            >
              <Button
                variant="contained"
                color="success"
                onClick={() => setProductsDefined(true)}
                disabled={productsDefined || materials.length === 0}
              >
                Salvar e Prosseguir
              </Button>
            </Grid>
          </>
        )}

        {productsDefined && (
          <>
            <Divider sx={{ my: 2 }} />
            <Grid container>
              <Typography sx={{ my: 2, fontSize: 18, fontWeight: "bold" }}>
                Entrega
              </Typography>

              <CheckCircleOutlineOutlinedIcon
                sx={{
                  color:
                    deliveryAddress &&
                    deliveryReceiver &&
                    deliveryReceiverPhone &&
                    deliveryScheduledTo
                      ? "#50C878"
                      : "lightgrey",
                  ml: 1,
                  mt: 2,
                }}
              />
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
                  sx={{ width: 170, mx: 1 }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Contato"
                  value={deliveryReceiverPhone}
                  onChange={(e) => setDeliveryReceiverPhone(e.target.value)}
                  required
                  variant="outlined"
                  sx={{ width: 170, mr: 1 }}
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
          </>
        )}
      </DialogContent>
      <FormEndLineTenant configCustomization={configCustomization} />

      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenAddSale(false)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddSaleForm;
