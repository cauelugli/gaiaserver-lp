/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

import Members from "../../components/small/Members";
import ProjectStages from "../../components/small/ProjectStages";
import ProjectStageTasks from "../../components/small/ProjectStageTasks";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function AddProjectForm({
  user,
  openAdd,
  setOpenAdd,
  refreshData,
  setRefreshData,
  toast,
  customers,
  clients,
  departments,
}) {
  const [firstPartOK, setFirstPartOK] = React.useState(false);
  const [secondPartOK, setSecondPartOK] = React.useState(false);
  const [thirdPartOK, setThirdPartOK] = React.useState(false);
  const [type, setType] = React.useState("");
  const [customer, setCustomer] = React.useState("");
  const [customerType, setCustomerType] = React.useState("");
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState(0);
  const [mainDepartment, setMainDepartment] = React.useState("");
  const [selectedDepartments, setSelectedDepartments] = React.useState([]);
  const [members, setMembers] = React.useState([]);
  const [stages, setStages] = React.useState([]);
  const [stagesColorSchema, setStagesSchemaColor] = React.useState(0);
  const [definedStagesColors, setDefinedStagesColors] = React.useState([]);
  const [description, setDescription] = React.useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/projects", {
        name,
      });
      if (res.data) {
        toast.success("Projeto Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenAdd(!openAdd);
      setRefreshData(!refreshData);
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  const handleRemoveMember = (memberToRemove) => {
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member !== memberToRemove)
    );
  };

  React.useEffect(() => {
    const selectedMembers = selectedDepartments.reduce(
      (allMembers, department) => {
        const membersWithManager = department.members.concat(
          department.manager || []
        );
        return [...allMembers, ...membersWithManager];
      },
      []
    );

    const mainDepartmentMembers = mainDepartment
      ? mainDepartment.members.concat(mainDepartment.manager || [])
      : [];

    setMembers([...selectedMembers, ...mainDepartmentMembers]);
  }, [selectedDepartments, mainDepartment]);

  return (
    <form onSubmit={handleAdd} style={{ marginBottom: 10 }}>
      <DialogTitle
        sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold", my: 2 }}
      >
        {firstPartOK ? name : "Novo Projeto"}
      </DialogTitle>
      <DialogContent>
        {/* FIRST PART */}
        {!firstPartOK && (
          <>
            {/* FIRST LINE */}
            <Grid
              sx={{ mt: 2 }}
              container
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
            >
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                sx={{ mb: 2 }}
              >
                <Typography sx={{ my: "auto" }}>Criador: </Typography>
                <Typography
                  sx={{ color: "#777", fontWeight: "bold", mx: 1, my: "auto" }}
                >
                  {user.name}
                </Typography>
                <Avatar
                  src={`http://localhost:3000/static${user.image}`}
                  sx={{ width: 32, height: 32 }}
                />
                <FormControl sx={{ ml: 2, mt: -2 }}>
                  <FormLabel>
                    <Typography sx={{ fontSize: 13, color: "#777" }}>
                      Tipo de Cliente
                    </Typography>
                  </FormLabel>
                  <Select
                    onChange={(e) => setCustomerType(e.target.value)}
                    value={customerType}
                    required
                    size="small"
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <Typography>Tipo de Cliente</Typography>;
                      }

                      return selected;
                    }}
                    sx={{ width: 160 }}
                  >
                    <MenuItem disabled value="">
                      Tipo de Cliente
                    </MenuItem>
                    <MenuItem value={"Empresa"}>Empresa</MenuItem>
                    <MenuItem value={"Pessoa Fisica"}>Pessoa Física</MenuItem>
                  </Select>
                </FormControl>
                {customerType && (
                  <FormControl sx={{ ml: 1, mt: -2 }}>
                    <FormLabel sx={{ ml: 0 }}>
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Cliente
                      </Typography>
                    </FormLabel>
                    <Select
                      onChange={(e) => setCustomer(e.target.value)}
                      value={customer}
                      size="small"
                      displayEmpty
                      required
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <Typography>Selecione um Cliente</Typography>;
                        }

                        return selected.name;
                      }}
                      sx={{ width: 200 }}
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
                )}
                {customer && (
                  <FormControl sx={{ ml: 1, mt: -2 }}>
                    <FormLabel>
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Tipo de Projeto
                      </Typography>
                    </FormLabel>
                    <Select
                      onChange={(e) => setType(e.target.value)}
                      value={type}
                      required
                      size="small"
                      displayEmpty
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <Typography>Tipo de Projeto</Typography>;
                        }

                        return selected;
                      }}
                      sx={{ width: 150 }}
                    >
                      <MenuItem disabled value="">
                        Tipo de Projeto
                      </MenuItem>
                      <MenuItem value={"Melhorias"}>Melhorias</MenuItem>
                      <MenuItem value={"Expansão"}>Expansão</MenuItem>
                    </Select>
                  </FormControl>
                )}

                {customer && (
                  <FormControl sx={{ ml: 1, mt: -2 }}>
                    <FormLabel>
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Nome do Projeto
                      </Typography>
                    </FormLabel>
                    <TextField
                      size="small"
                      placeholder="Melhorias, Expansão, Integração, ..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      sx={{ width: 275 }}
                    />
                  </FormControl>
                )}
                {name.length > 0 && (
                  <FormControl sx={{ ml: 1, mt: -2 }}>
                    <FormLabel>
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Valor
                      </Typography>
                    </FormLabel>
                    <TextField
                      type="text"
                      size="small"
                      value={price}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ mr: 0 }}>
                            R$
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (/^\d*\.?\d*$/g.test(inputValue)) {
                          setPrice(inputValue);
                        }
                      }}
                      required
                      variant="outlined"
                      sx={{ width: 120 }}
                    />
                  </FormControl>
                )}
              </Grid>
            </Grid>
            {/* SECOND LINE */}
            <Grid container direction="row">
              <Grid item>
                {name.length > 0 && (
                  <FormControl sx={{ mt: 2 }}>
                    <FormLabel>
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Departamento Principal
                      </Typography>
                    </FormLabel>
                    <Select
                      onChange={(e) => setMainDepartment(e.target.value)}
                      value={mainDepartment}
                      required
                      size="small"
                      displayEmpty
                      sx={{ width: 190 }}
                    >
                      {departments.map((item) => (
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
                      ))}{" "}
                    </Select>
                  </FormControl>
                )}
              </Grid>
              <Grid item>
                {mainDepartment && (
                  <Grid container direction="row">
                    <Members
                      users={departments.filter(
                        (item) => item !== mainDepartment
                      )}
                      value={selectedDepartments}
                      onChange={setSelectedDepartments}
                      option="projectDepartments"
                      sx={{ mt: 2, width: 300 }}
                    />
                    <FormControl sx={{mt:2}}>
                      <FormLabel>
                        <Typography sx={{ fontSize: 13, color: "#444" }}>
                          Membros do Projeto
                        </Typography>
                      </FormLabel>
                      <Grid
                        container
                        sx={{
                          border: "1px solid #ddd",
                          borderRadius: 1,
                          width: 630,
                        }}
                      >
                        {members.map((member, index) => (
                          <Grid
                            key={index}
                            sx={{ m: 1 }}
                            sm={5}
                            md={5}
                            lg={5}
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="flex-start"
                          >
                            <Avatar
                              alt="Imagem do Colaborador"
                              src={`http://localhost:3000/static/${member.image}`}
                              sx={{ width: 28, height: 28 }}
                            />
                            <Typography sx={{ mx: 0.5, fontSize: 13 }}>
                              {member.name}
                            </Typography>
                            <IconButton
                              sx={{
                                height: 18,
                                maxWidth: 18,
                                color: "white",
                                backgroundColor: "red",
                                borderRadius: 3,
                                "&:hover": {
                                  color: "white",
                                  backgroundColor: "red",
                                },
                              }}
                              onClick={() => handleRemoveMember(member)}
                            >
                              <Typography sx={{ fontWeight: "bold" }}>
                                -
                              </Typography>
                            </IconButton>
                          </Grid>
                        ))}
                      </Grid>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* THIRD LINE */}
            {mainDepartment && (
              <FormControl fullWidth sx={{ mt: 1 }}>
                <FormLabel>
                  <Typography sx={{ fontSize: 13, color: "#777" }}>
                    Descrição
                  </Typography>
                </FormLabel>
                <TextField
                  size="small"
                  placeholder="Adicione uma breve descrição"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </FormControl>
            )}
          </>
        )}
        {/* FIRST PART */}

        {/* SECOND PART */}
        {firstPartOK && !secondPartOK && (
          <ProjectStages
            stages={stages}
            stagesColorSchema={stagesColorSchema}
            updateStages={(newStagesList) => setStages(newStagesList)}
            setStagesSchemaColor={setStagesSchemaColor}
            setDefinedStagesColors={setDefinedStagesColors}
          />
        )}
        {/* SECOND PART */}

        {/* THIRD PART */}
        {secondPartOK && (
          <ProjectStageTasks
            members={members}
            stages={stages}
            definedStagesColors={definedStagesColors}
          />
        )}
        {/* THIRD PART */}
      </DialogContent>
      <DialogActions>
        {mainDepartment && description.length > 0 && (
          <>
            {!firstPartOK && !secondPartOK && (
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                onClick={() => setFirstPartOK(Boolean(true))}
              >
                Prosseguir para "Etapas"
              </Button>
            )}
          </>
        )}
        {firstPartOK && !secondPartOK && (
          <>
            <Button
              variant="contained"
              color="warning"
              startIcon={<KeyboardReturnIcon />}
              onClick={() => setFirstPartOK(Boolean(false))}
            >
              Retornar para "Informações"
            </Button>
            <Button
              variant="contained"
              color="success"
              disabled={stages.length <= 1}
              startIcon={<CheckIcon />}
              onClick={() => setSecondPartOK(Boolean(true))}
            >
              Prosseguir para "Tarefas"
            </Button>
          </>
        )}
        {firstPartOK && secondPartOK && (
          <Button
            variant="contained"
            color="warning"
            startIcon={<KeyboardReturnIcon />}
            onClick={() => setSecondPartOK(Boolean(false))}
          >
            Retornar para "Etapas"
          </Button>
        )}
      </DialogActions>
      {thirdPartOK && (
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
      )}
    </form>
  );
}
