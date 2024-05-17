/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  Grid,
  ListSubheader,
  MenuItem,
  Paper,
  Popover,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import { IMaskInput } from "react-imask";
import Members from "../../components/small/Members";
import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";
import { SketchPicker } from "react-color";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddDepartmentForm = ({
  userId,
  configData,
  users,
  managers,
  setOpenAdd,
  refreshData,
  setRefreshData,
  configCustomization,
  toast,
  addFromShortcut,
}) => {
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState("Serviços");
  const [description, setDescription] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [manager, setManager] = React.useState(null);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [color, setColor] = React.useState("#ffffff");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (configData.departmentsNeedManager && !manager)
      return toast.warning("É necessário um Gerente para o Novo Departamento", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    try {
      const membersData = selectedUsers.map((user) => ({
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        image: user.image,
        position: user.position,
      }));

      const res = await api.post("/departments", {
        name,
        type,
        description,
        phone,
        email,
        color,
        manager,
        members: membersData,
      });
      if (res.data) {
        toast.success("Departamento Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        socket.emit("newDataRefreshButton", {
          page: "departments",
          userId: userId,
        });
      }
      setOpenAdd(false);
      if (!addFromShortcut) {
        setRefreshData(!refreshData);
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        toast.error(err.response.data.error, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      } else {
        toast.error("Houve algum erro...", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogHeader title="Departamento" femaleGender={false} />
      <DialogContent>
        <>
          <Grid container sx={{ mb: 1 }}>
            <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
              Informações
            </Typography>
            <CheckCircleOutlineOutlinedIcon
              sx={{
                color:
                  name && email && phone && description
                    ? "#50C878"
                    : "lightgrey",
                ml: 1,
              }}
            />
          </Grid>
          <Grid container direction="row">
            <Grid item sx={{ mt: 1 }}>
              <TextField
                size="small"
                label="Nome do Departamento"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={{ width: 320 }}
              />
            </Grid>
            <Grid item sx={{ m: 1, opacity: name ? 1 : 0 }}>
              <TextField
                value={email}
                size="small"
                label="E-mail do Departamento"
                required
                onChange={(e) => setEmail(e.target.value)}
                sx={{ width: 300 }}
              />
            </Grid>
            <Grid item sx={{ mt: 1, opacity: email ? 1 : 0 }}>
              <IMaskInput
                style={{
                  padding: "6%",
                  borderColor: "#eee",
                  borderRadius: 4,
                }}
                mask="(00) 0000-0000"
                placeholder="Telefone: (00) 0000-0000"
                definitions={{
                  "#": /[1-9]/,
                }}
                onAccept={(value) => setPhone(value)}
                overwrite
                value={phone}
              />
            </Grid>
          </Grid>
          <Grid item sx={{ opacity: phone ? 1 : 0 }}>
            <TextField
              value={description}
              size="small"
              label="Descrição"
              onChange={(e) => setDescription(e.target.value)}
              sx={{ my: 2, width: "100%" }}
            />
          </Grid>
        </>

        {name && email && phone && description && (
          <Grid sx={{ mt: 2 }}>
            <Grid container>
              <Typography sx={{ my: 1, fontSize: 18, fontWeight: "bold" }}>
                Tipo de Departamento
              </Typography>
              <CheckCircleOutlineOutlinedIcon sx={{ color: "#50C878", m: 1 }} />
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="center"
              sx={{ py: 1 }}
            >
              <FormControl>
                <RadioGroup
                  row
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  sx={{ alignItems: "center" }}
                >
                  <Grid item>
                    <Grid container direction="column" alignItems="center">
                      <FormControlLabel
                        value="Serviços"
                        control={<Radio />}
                        label="Serviços"
                      />
                      <Typography sx={{ fontSize: 10 }}>
                        Prestadores de Serviços e Atendimentos
                      </Typography>
                      <Typography sx={{ fontSize: 10, fontWeight: "bold" }}>
                        Não realizam Vendas
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item sx={{ mx: 6 }}>
                    <Grid container direction="column" alignItems="center">
                      <FormControlLabel
                        value="Vendas"
                        control={<Radio />}
                        label="Vendas"
                      />
                      <Typography sx={{ fontSize: 10 }}>
                        Setor de Vendas
                      </Typography>
                      <Typography sx={{ fontSize: 10, fontWeight: "bold" }}>
                        Não realizam Serviços
                      </Typography>{" "}
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container direction="column" alignItems="center">
                      <FormControlLabel
                        value="Interno"
                        control={<Radio />}
                        label="Interno"
                      />
                      <Typography sx={{ fontSize: 10 }}>
                        Administração da Empresa
                      </Typography>
                      <Typography sx={{ fontSize: 10, fontWeight: "bold" }}>
                        Não realizam Serviços nem Vendas
                      </Typography>{" "}
                    </Grid>
                  </Grid>
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        )}

        {name && email && phone && description && (
          <Grid sx={{ mt: 2 }}>
            <Grid container>
              <Typography sx={{ my: 1, fontSize: 18, fontWeight: "bold" }}>
                Membros
              </Typography>
              <CheckCircleOutlineOutlinedIcon
                sx={{
                  color: selectedUsers.length > 0 ? "#50C878" : "lightgrey",
                  m: 1,
                }}
              />
            </Grid>
            <Members
              users={users.filter((user) => !user.department)}
              value={selectedUsers}
              onChange={setSelectedUsers}
              option="department"
            />
          </Grid>
        )}

        {name && email && phone && description && (
          <Grid sx={{ my: 3 }}>
            <Grid container>
              <Typography sx={{ my: 1, fontSize: 18, fontWeight: "bold" }}>
                Gerência
              </Typography>
              <CheckCircleOutlineOutlinedIcon
                sx={{
                  color: selectedUsers.length > 0 ? "#50C878" : "lightgrey",
                  m: 1,
                }}
              />
            </Grid>
            <Grid item>
              <Select
                size="small"
                onChange={(e) => setManager(e.target.value)}
                value={manager}
                renderValue={(selected) => {
                  if (!selected) {
                    return <Typography>Selecione um Gerente</Typography>;
                  }
                  return selected.name;
                }}
              >
                <ListSubheader sx={{ color: "green", m: -1 }}>
                  Disponíveis
                </ListSubheader>
                {managers
                  .filter((manager) => !manager.department)
                  .map((manager) => (
                    <MenuItem
                      value={manager}
                      key={manager._id}
                      sx={{ fontSize: "100%" }}
                    >
                      {manager.name}
                    </MenuItem>
                  ))}
                <ListSubheader sx={{ color: "red", m: -1, mt: 0 }}>
                  Alocados
                </ListSubheader>
                {managers
                  .filter((manager) => manager.department)
                  .map((manager) => (
                    <MenuItem
                      disabled
                      value={manager}
                      key={manager._id}
                      sx={{ fontSize: "100%" }}
                    >
                      {manager.name}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
          </Grid>
        )}

        {name && email && phone && description && (
          <Grid sx={{ mt: 2 }}>
            <Grid container>
              <Typography sx={{ my: 1, fontSize: 18, fontWeight: "bold" }}>
                Personalização
              </Typography>
              <CheckCircleOutlineOutlinedIcon
                sx={{
                  color: color !== "#ffffff" ? "#50C878" : "lightgrey",
                  m: 1,
                }}
              />
            </Grid>
            <Grid container direction="row" justifyContent="center">
              <Grid item>
                <>
                  <Paper
                    sx={{
                      width: 64,
                      height: 64,
                      backgroundColor: color,
                      borderRadius: 40,
                    }}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                  />
                  <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                      vertical: "center",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "center",
                      horizontal: "left",
                    }}
                  >
                    <SketchPicker
                      color={"white"}
                      onChange={(color) => setColor(color.hex)}
                      disableAlpha
                    />
                  </Popover>
                </>
              </Grid>
            </Grid>
          </Grid>
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
          onClick={() => setOpenAdd(false)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddDepartmentForm;
