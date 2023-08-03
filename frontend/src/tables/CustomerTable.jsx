import * as React from "react";
import axios from "axios";

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditOffIcon from "@mui/icons-material/EditOff";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function CustomerTable() {
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState("");


  const [customers, setCustomers] = React.useState([]);

  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [mainContactName, setMainContactName] = React.useState("");
  const [mainContactEmail, setMainContactEmail] = React.useState("");
  const [mainContactPosition, setMainContactPosition] = React.useState("");
  const [domain, setDomain] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [cnpj, setCnpj] = React.useState("");
  const [segment, setSegment] = React.useState("");
  const [employees, setEmployees] = React.useState("");
  const [managerName, setManagerName] = React.useState("");
  const [managerEmail, setManagerEmail] = React.useState("");
  const [managerPhone, setManagerPhone] = React.useState("");
  const [showAdditionalOptions, setShowAdditionalOptions] =
    React.useState(false);
  const handleCheckboxChange = (event) => {
    setShowAdditionalOptions(event.target.checked);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/customers", {
        name,
        address,
        phone,
        mainContactName,
        mainContactEmail,
        mainContactPosition,
        domain,
        website,
        cnpj,
        segment,
        employees,
      });
      res.data && alert("Cliente Adicionado!");
      setOpenAdd(!openAdd);
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
    try {
      const response = await api.get("/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/customers", {
        customer: "selectedCustomer._id",
        name,
        address,
        phone,
        mainContactName,
        mainContactEmail,
        mainContactPosition,
        segment,
        domain,
        employees,
        website,
        cnpj,
      });
      res.data && alert("Editado com sucesso!");
      setOpenEdit(!openEdit);
    } catch (err) {
      alert("Vish, editei não...");
      console.log(err);
    }
  };

  const handleConfirmDelete = (customer) => {
    setOpenDelete(!openDelete);
    setSelectedCustomer(customer);
  };

  const handleDelete = async (selectedCustomer) => {
    try {
      const res = await api.delete(`/customers/${selectedCustomer._id}`);
      res.status === 200 && alert("Cliente deletado com sucesso!");
      setOpenDelete(!openDelete);
    } catch (err) {
      alert("Vish, deletou não..");
      console.log(err);
    }
  };

  return (
    <>
      <Button onClick={() => setOpenAdd(true)}>
        <Typography variant="h6" color="grey">
          + Novo Cliente
        </Typography>
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell align="right">Editar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow
                key={customer._id}
                sx={{ "&:hover": { backgroundColor: "#ccc " } }}
              >
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpenDetail(!openDetail, "selecteduser")}
                >
                  {openDetail ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                <TableCell cursor="pointer" align="left">
                  {customer.name}
                </TableCell>
                <TableCell cursor="pointer" align="right">
                  <ModeEditIcon
                    cursor="pointer"
                    // onClick={() =>
                    //   handleOpen(user, setOption("view", setEditing(true)))
                    // }
                    sx={{ color: "#555" }}
                  />
                  <DeleteIcon
                    cursor="pointer"
                    option="delete"
                    onClick={() => handleConfirmDelete(customer)}
                    sx={{ color: "#ff4444" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {openEdit && (
        <Dialog open={openEdit} onClose={() => setOpenEdit(!openEdit)}>
          <form onSubmit={handleEdit}>edit me</form>
        </Dialog>
      )}
      {openAdd && (
        <Dialog open={openAdd} onClose={() => setOpenAdd(!openAdd)}>
          <DialogTitle>Novo Usuário - {"selectedCustomer.name"}</DialogTitle>
          <form onSubmit={handleAdd}>
            <DialogContent>
              <Typography sx={{ my: 1 }}>Geral</Typography>
              <TextField
                label="Nome da Empresa"
                margin="dense"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                variant="outlined"
                sx={{ mr: 1, width: 700 }}
              />
              <TextField
                sx={{ mr: 1, width: 700 }}
                margin="dense"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                variant="outlined"
                label="Endereço"
              />
              <TextField
                label="Telefone"
                margin="dense"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                variant="outlined"
                sx={{ mr: 1, width: 160 }}
              />
              <TextField
                margin="dense"
                variant="outlined"
                label="CNPJ"
                value={cnpj}
                required
                onChange={(e) => setCnpj(e.target.value)}
                sx={{ mr: 1, width: 240 }}
              />
              <TextField
                margin="dense"
                variant="outlined"
                label="Segmento"
                value={segment}
                required
                onChange={(e) => setSegment(e.target.value)}
                sx={{ mr: 1, width: 285 }}
              />
              <Divider sx={{ my: 2 }} />
              <Typography>Contato Principal</Typography>
              <TextField
                label="Nome"
                margin="dense"
                id="mainContactName"
                value={mainContactName}
                onChange={(e) => setMainContactName(e.target.value)}
                required
                variant="outlined"
                sx={{ mr: 1, width: 270 }}
              />
              <TextField
                label="Email"
                margin="dense"
                id="mainContactEmail"
                value={mainContactEmail}
                onChange={(e) => setMainContactEmail(e.target.value)}
                required
                variant="outlined"
                sx={{ mr: 1, width: 270 }}
              />

              <FormControl sx={{ my: 1, width: 145 }}>
                <InputLabel>Posição</InputLabel>
                <Select
                  id="mainContactPosition"
                  value={mainContactPosition}
                  onChange={(e) => setMainContactPosition(e.target.value)}
                  label="Posição"
                  required
                >
                  <MenuItem value={"Supervisor"}>Supervisor</MenuItem>
                  <MenuItem value={"Diretor"}>Diretor</MenuItem>
                  <MenuItem value={"Proprietário"}>Proprietário</MenuItem>
                </Select>
              </FormControl>

              <Divider sx={{ my: 2 }} />
              <Typography>Gerente</Typography>
              <TextField
                margin="dense"
                variant="outlined"
                label="Nome do Gerente"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                sx={{ mr: 1, width: 300 }}
              />
              <TextField
                margin="dense"
                variant="outlined"
                label="E-mail"
                value={managerEmail}
                onChange={(e) => setManagerEmail(e.target.value)}
                sx={{ mr: 1, width: 300 }}
              />
              <TextField
                margin="dense"
                variant="outlined"
                label="Telefone"
                value={managerPhone}
                onChange={(e) => setManagerPhone(e.target.value)}
                sx={{ mr: 1, width: 300 }}
              />

              <Divider sx={{ my: 2 }} />
              <Checkbox
                checked={showAdditionalOptions}
                onChange={handleCheckboxChange}
              />
              <label>Dados Completos</label>
              {showAdditionalOptions && (
                <Box>
                  <TextField
                    margin="dense"
                    variant="outlined"
                    label="Website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    sx={{ mr: 1, width: 300 }}
                  />
                  <TextField
                    margin="dense"
                    variant="outlined"
                    label="Domínio"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    sx={{ mr: 1, width: 300 }}
                  />

                  <FormControl sx={{ mt: 1, width: 160 }}>
                    <InputLabel>👥 Funcionários</InputLabel>
                    <Select
                      value={employees}
                      onChange={(e) => setEmployees(e.target.value)}
                      label="👥 Funcionários"
                    >
                      <MenuItem value={"1-9"}>1 à 9</MenuItem>
                      <MenuItem value={"10-50"}>10 à 50</MenuItem>
                      <MenuItem value={"51-100"}>51 à 100</MenuItem>
                      <MenuItem value={"101-200"}>100 à 200</MenuItem>
                      <MenuItem value={"+201"}>201 ou mais</MenuItem>
                    </Select>
                  </FormControl>
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
                onClick={() => setOpenAdd(!openAdd)}
              >
                X
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
      {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
          <DialogTitle>{`Deletar Usuário ${selectedCustomer.name} ?`}</DialogTitle>
          <DialogContent>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ my: 4 }}
            >
              <Button
                variant="contained"
                color="success"
                onClick={() => handleDelete(selectedCustomer)}
                sx={{ mr: 2 }}
              >
                OK
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => openDelete(!openDelete)}
              >
                X
              </Button>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
