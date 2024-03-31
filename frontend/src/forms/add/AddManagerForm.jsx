/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  Divider,
  FormHelperText,
  Grid,
  InputLabel,
  ListSubheader,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

import { IMaskInput } from "react-imask";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";
import dayjs from "dayjs";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddManagerForm = ({
  user,
  setOpenAdd,
  refreshData,
  setRefreshData,
  toast,
  configCustomization,
  addFromShortcut,
}) => {
  const [departments, setDepartments] = React.useState([]);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [birthdate, setBirthdate] = React.useState(dayjs("11/02/2014"));
  const [gender, setGender] = React.useState("m");
  const [department, setDepartment] = React.useState("");
  const [image, setImage] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const departments = await api.get("/departments");
        setDepartments(departments.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    try {
      const uploadResponse = await api.post("/uploads/singleProduct", formData);
      const imagePath = uploadResponse.data.imagePath;
      const res = await api.post("/managers", {
        name,
        email,
        phone,
        birthdate,
        gender,
        image: imagePath,
        department: {
          id: department._id,
          name: department.name,
          phone: department.phone,
          email: department.email,
          color: department.color,
        },
      });

      if (res.data) {
        toast.success("Gerente Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });

        await api.post("/recentActivity", {
          activity: `Colaborador ${
            user.name
          } criou um Novo Gerente: "${name}" ${
            department && `para o departamento ${department.name}`
          }`,
          createdAt: dayjs().format("DD/MM/YYYY HH:mm:ss"),
        });
        socket.emit("recentActivityRefresh");
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
      <DialogHeader title="Gerente" femaleGender={false} />
      <DialogContent>
        <Grid container direction="column">
          <Grid item>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                style={{ display: "none" }}
                onChange={(e) => {
                  const selectedImage = e.target.files[0];
                  setImage(selectedImage);
                }}
              />
              <label htmlFor="fileInput">
                <Avatar
                  alt="Imagem do Usuário"
                  value={image}
                  sx={{ width: 160, height: 160, cursor: "pointer" }}
                  onClick={handleImageClick}
                >
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Prévia da Imagem"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : null}
                </Avatar>
              </label>
              {image && (
                <FormHelperText>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => setImage("")}
                    sx={{ mt: 1 }}
                  >
                    Remover
                  </Button>
                </FormHelperText>
              )}
            </Grid>
          </Grid>
          <Grid item sx={{ mt: 1 }}>
            <Grid container>
              <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                Informações Pessoais
              </Typography>
              <CheckCircleOutlineOutlinedIcon
                sx={{
                  color:
                    name && birthdate && gender && phone
                      ? "#50C878"
                      : "lightgrey",
                  ml: 1,
                }}
              />
            </Grid>
            <Grid
              container
              sx={{ mt: 1 }}
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item>
                <InputLabel>Nome</InputLabel>
                <TextField
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  sx={{ width: 250 }}
                />
              </Grid>
              {name && (
                <Grid item sx={{ ml: 2, mr: 4 }}>
                  <InputLabel>Telefone</InputLabel>
                  <IMaskInput
                    style={{
                      padding: "10%",
                      marginRight: "4%",
                      marginTop: "1%",
                      borderColor: "#eee",
                      borderRadius: 4,
                    }}
                    mask="(00) 00000-0000"
                    definitions={{
                      "#": /[1-9]/,
                    }}
                    onAccept={(value) => setPhone(value)}
                    overwrite
                    value={phone}
                  />
                </Grid>
              )}

              {phone && (
                <Grid item sx={{ mx: 2, mt: 1 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        value={birthdate}
                        format="DD/MM/YYYY"
                        onChange={(newValue) => setBirthdate(newValue)}
                        label="Data de Nascimento"
                        sx={{ width: 80 }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
              )}

              {phone && (
                <Grid item sx={{ mb: 1 }}>
                  <InputLabel>Gênero</InputLabel>
                  <Select
                    value={gender}
                    sx={{ width: 120 }}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <MenuItem value={"m"}>Masculino</MenuItem>
                    <MenuItem value={"f"}>Feminino</MenuItem>
                    <MenuItem value={"0"}>Não Informar</MenuItem>
                  </Select>
                </Grid>
              )}
            </Grid>
          </Grid>

          {name && birthdate && gender && phone && (
            <Grid item>
              <Divider sx={{ my: 2 }} />
              <Grid container>
                <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                  Dados Internos
                </Typography>
                <CheckCircleOutlineOutlinedIcon
                  sx={{
                    color: email ? "#50C878" : "lightgrey",
                    ml: 1,
                  }}
                />
              </Grid>

              <Grid
                container
                sx={{ mt: 1 }}
                direction="row"
                justifyContent="space-around"
              >
                <Grid item>
                  <Typography>Email</Typography>
                  <TextField
                    value={email}
                    size="small"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ width: 230 }}
                  />
                </Grid>

                <Grid item sx={{ opacity: email ? 1 : 0 }}>
                  <Typography>Departamento</Typography>

                  <Select
                    onChange={(e) => setDepartment(e.target.value)}
                    value={department}
                    renderValue={(selected) => selected.name}
                    size="small"
                    sx={{ minWidth: 200 }}
                  >
                    <ListSubheader sx={{ color: "green", m: -1 }}>
                      Disponíveis
                    </ListSubheader>
                    {departments
                      .filter((department) => !department.manager)
                      .map((department) => (
                        <MenuItem
                          value={department}
                          key={department._id}
                          sx={{ fontSize: "100%" }}
                        >
                          <Grid container direction="row">
                            <Paper
                              elevation={0}
                              sx={{
                                mr: 1,
                                mt: 0.5,
                                width: 15,
                                height: 15,
                                borderRadius: 50,
                                backgroundColor: department.color,
                              }}
                            />
                            <Typography>{department.name}</Typography>
                          </Grid>
                        </MenuItem>
                      ))}
                    <ListSubheader sx={{ color: "red", m: -1, mt: 0 }}>
                      Gerenciados
                    </ListSubheader>
                    {departments
                      .filter((department) => department.manager)
                      .map((department) => (
                        <MenuItem
                          disabled
                          value={department}
                          key={department._id}
                          sx={{ fontSize: "100%" }}
                        >
                          <Grid container direction="row">
                            <Paper
                              elevation={0}
                              sx={{
                                mr: 1,
                                mt: 0.5,
                                width: 15,
                                height: 15,
                                borderRadius: 50,
                                backgroundColor: department.color,
                              }}
                            />
                            <Typography>{department.name}</Typography>
                          </Grid>{" "}
                        </MenuItem>
                      ))}
                  </Select>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      {/* <DialogContent>
        <Grid container direction="row" justifyContent="space-around">
          <Grid item>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                style={{ display: "none" }}
                onChange={(e) => {
                  const selectedImage = e.target.files[0];
                  setImage(selectedImage);
                }}
              />
              <label htmlFor="fileInput">
                <Avatar
                  alt="Imagem do Usuário"
                  value={image}
                  sx={{ width: 100, height: 100, cursor: "pointer" }}
                  onClick={handleImageClick}
                >
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Prévia da Imagem"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : null}
                </Avatar>
              </label>
              {image && (
                <FormHelperText>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => setImage("")}
                    sx={{ mt: 1 }}
                  >
                    Remover
                  </Button>
                </FormHelperText>
              )}
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              container
              sx={{ mt: 2 }}
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item>
                <Typography>Nome</Typography>
                <TextField
                  size="small"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  sx={{ mr: 1, width: 200 }}
                />
              </Grid>
              <Grid item>
                <Typography>Email</Typography>
                <TextField
                  value={email}
                  size="small"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mr: 1, width: 185 }}
                />
              </Grid>
              <Grid item sx={{ mr: 1 }}>
                <Typography>Departamento</Typography>
                
              </Grid>
              <Grid item>
                <Typography>Telefone</Typography>
                <IMaskInput
                  style={{
                    padding: "5%",
                    marginRight: "4%",
                    marginTop: "1%",
                    borderColor: "#eee",
                    borderRadius: 4,
                  }}
                  mask="(00) 00000-0000"
                  definitions={{
                    "#": /[1-9]/,
                  }}
                  onAccept={(value) => setPhone(value)}
                  overwrite
                  value={phone}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent> */}
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

export default AddManagerForm;
