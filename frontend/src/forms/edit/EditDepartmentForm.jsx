/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  ListSubheader,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { IMaskInput } from "react-imask";
import ColorPicker from "../../components/small/ColorPicker";
import Members from "../../components/small/Members";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const EditDepartmentForm = ({
  openEdit,
  selectedDepartment,
  users,
  managers,
  setOpenEdit,
  fetchData,
  toast,
}) => {
  const previousData = selectedDepartment;
  const [name, setName] = React.useState(selectedDepartment.name);
  const [type, setType] = React.useState(selectedDepartment.type);
  const [description, setDescription] = React.useState(
    selectedDepartment.description
  );
  const [phone, setPhone] = React.useState(selectedDepartment.phone);
  const [email, setEmail] = React.useState(selectedDepartment.email);
  const previousManager = selectedDepartment.manager;
  const previousMembers = selectedDepartment.members;
  const [updatedMembers, setUpdatedMembers] = React.useState([]);
  const [removedMembers, setRemovedMembers] = React.useState([]);
  const [manager, setManager] = React.useState(previousManager);
  const [selectedUsers, setSelectedUsers] = React.useState(previousMembers);
  const [color, setColor] = React.useState(selectedDepartment.color);
  const [colorAnchorEl, setColorAnchorEl] = React.useState(null);
  const handleClickColor = (event) => {
    setColorAnchorEl(event.currentTarget);
  };

  const handleCloseColor = () => {
    setColorAnchorEl(null);
  };

  const handleChangeColor = (selectedColor) => {
    setColor(selectedColor.hex);
    handleCloseColor();
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const membersData = selectedUsers.map((user) => ({
        id: user._id || user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        image: user.image,
        position: user.position,
      }));

      const res = await api.put("/departments", {
        departmentId: selectedDepartment._id,
        name,
        type,
        description,
        phone,
        email,
        color,
        previousManager,
        manager,
        updatedMembers: membersData,
        removedMembers,
        previousData,
      });
      if (res.data) {
        toast.success("Departamento Editado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenEdit(!openEdit);
      fetchData();
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

  const handleUserSelectionChange = (newSelectedUsers) => {
    setSelectedUsers(newSelectedUsers);

    const previousMemberIds = previousMembers.map(
      (member) => member._id || member.id
    );
    const newSelectedUserIds = newSelectedUsers.map(
      (user) => user._id || user.id
    );

    const removedMemberIds = previousMemberIds.filter(
      (id) => !newSelectedUserIds.includes(id)
    );
    const updatedMembersData = newSelectedUsers.map((user) => {
      const previousMember = previousMembers.find(
        (member) => member.id === user._id
      );
      return previousMember ? { ...user, ...previousMember } : user;
    });

    const removedMembersData = previousMembers.filter((member) =>
      removedMemberIds.includes(member.id)
    );

    setUpdatedMembers(updatedMembersData);
    setRemovedMembers(removedMembersData);
  };

  return (
    <form onSubmit={handleEdit}>
      <DialogTitle>
        Editando Departamento - {selectedDepartment.name}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ my: 1, fontSize: 18, fontWeight: "bold" }}>
          Geral
        </Typography>
        <Grid container direction="row">
          <Grid item>
            <TextField
              size="small"
              label="Nome do Departamento"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ mr: 1, mt: 3, width: 300 }}
            />
          </Grid>
          <Grid item>
            <TextField
              value={email}
              size="small"
              label="E-mail Departamento"
              required
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mr: 1, mt: 3, width: 285 }}
            />
          </Grid>
          <Grid item>
            <Typography>Telefone</Typography>
            <IMaskInput
              style={{
                padding: "5%",
                marginRight: "4%",
                marginBottom: "1%",
                borderColor: "#eee",
                borderRadius: 4,
              }}
              mask="(00) 0000-0000"
              definitions={{
                "#": /[1-9]/,
              }}
              onAccept={(value) => setPhone(value)}
              overwrite
              value={phone}
            />
          </Grid>
        </Grid>
        <Grid item>
          <TextField
            value={description}
            size="small"
            label="Descrição"
            onChange={(e) => setDescription(e.target.value)}
            sx={{ my: 2, width: "100%" }}
          />
        </Grid>

        <Typography sx={{ my: 1, fontSize: 18, fontWeight: "bold" }}>
          Tipo de Departamento
        </Typography>
        <Grid container direction="row" justifyContent="center" sx={{ py: 1 }}>
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
                <Typography sx={{ fontSize: 10, color: "#777" }}>
                  Prestadores de Serviços e Atendimentos
                </Typography>
                <Typography
                  sx={{ fontSize: 10, fontWeight: "bold", color: "#777" }}
                >
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
                <Typography sx={{ fontSize: 10, color: "#777" }}>
                  Setor de Vendas
                </Typography>
                <Typography
                  sx={{ fontSize: 10, fontWeight: "bold", color: "#777" }}
                >
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
                <Typography sx={{ fontSize: 10, color: "#777" }}>
                  Administração da Empresa
                </Typography>
                <Typography
                  sx={{ fontSize: 10, fontWeight: "bold", color: "#777" }}
                >
                  Não realizam Serviços nem Vendas
                </Typography>{" "}
              </Grid>
            </Grid>
          </RadioGroup>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid item>
          <Typography sx={{ my: 1, fontSize: 18, fontWeight: "bold" }}>
            Membros
          </Typography>
          <Members
            users={users.filter(
              (user) =>
                !user.department ||
                user.department.name === selectedDepartment.name
            )}
            value={selectedUsers}
            onChange={handleUserSelectionChange}
          />
        </Grid>

        <Divider sx={{ mt: 2, mb: 1 }} />
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          width="50%"
        >
          <Grid item>
            <Typography sx={{ my: 1, fontSize: 18, fontWeight: "bold" }}>
              Gerência
            </Typography>
          </Grid>
          <Grid container direction="row">
            <Grid item>
              <Select
                size="small"
                onChange={(e) => setManager(e.target.value)}
                value={manager}
                renderValue={(selected) => selected.name}
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
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Typography sx={{ my: 1, fontSize: 18, fontWeight: "bold" }}>
          Customização
        </Typography>
        <Grid item sx={{ m: "1%" }}>
          <ColorPicker
            handleClickColor={handleClickColor}
            color={color}
            colorAnchorEl={colorAnchorEl}
            handleCloseColor={handleCloseColor}
            handleChangeColor={handleChangeColor}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenEdit(!openEdit)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
};

export default EditDepartmentForm;
