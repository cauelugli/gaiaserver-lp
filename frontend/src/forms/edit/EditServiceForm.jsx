/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import MaterialList from "../../components/small/MaterialList";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function EditServiceForm({
  selectedService,
  openEdit,
  setOpenEdit,
  departments,
  stockItems,
  refreshData,
  setRefreshData,
  toast,
}) {
  const previousData = selectedService;
  const [name, setName] = React.useState(selectedService.name);
  const [department, setDepartment] = React.useState(
    selectedService.department
  );
  const [value, setValue] = React.useState(selectedService.value);
  const [previousMaterials, setPreviousMaterials] = React.useState(
    selectedService.materials
  );
  const [materials, setMaterials] = React.useState(selectedService.materials);
  const [materialsEditCost, setMaterialsEditCost] = React.useState(
    selectedService.materialsCost
  );
  const [executionTime, setExecutionTime] = React.useState(
    selectedService.executionTime
  );

  const [showUsesMaterials, setUsesMaterials] = React.useState(
    selectedService.materials.length >= 1
  );
  const handleUsesMaterials = (event) => {
    setUsesMaterials(event.target.checked);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/services", {
        serviceId: selectedService._id || selectedService.id,
        previousData,
        name,
        department: {
          id: department._id || department.id,
          name: department.name,
          phone: department.phone,
          email: department.email,
          color: department.color,
        },
        value,
        previousMaterials,
        materials,
        materialsCost: materialsEditCost,
        executionTime,
        isSupport: value === 0 ? true : false,
      });
      if (res.data) {
        toast.success("Serviço Editado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenEdit(!openEdit);
      setRefreshData(!refreshData);
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
    <form onSubmit={handleEdit}>
      <DialogTitle>Editando Serviço - {selectedService.name}</DialogTitle>
      <DialogContent>
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
              sx={{ width: 200 }}
            />
          </Grid>
          <Grid item sx={{ mx: 2 }}>
            <Typography>Departamento</Typography>
            <Select
              onChange={(e) => setDepartment(e.target.value)}
              value={department}
              renderValue={(selected) => (
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
              )}
              size="small"
              sx={{ minWidth: 200 }}
            >
              {departments
                .filter((department) => department.type === "Serviços")
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
          <Grid item sx={{ mr: 2 }}>
            <Typography>Valor</Typography>
            <TextField
              type="number"
              size="small"
              value={value}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    R$
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue >= 0) {
                  setValue(inputValue);
                }
              }}
              required
              variant="outlined"
              sx={{ width: 120 }}
            />
          </Grid>
          <Grid item>
            <Typography>Tempo de Execução</Typography>
            <Select
              value={executionTime}
              size="small"
              required
              onChange={(e) => setExecutionTime(e.target.value)}
              sx={{ width: 120 }}
            >
              <MenuItem value={0.5}>30 min</MenuItem>
              <MenuItem value={1}>01:00h</MenuItem>
              <MenuItem value={1.5}>01:30h</MenuItem>
              <MenuItem value={2}>02:00h</MenuItem>
              <MenuItem value={2.5}>02:30h</MenuItem>
              <MenuItem value={3}>03:00h</MenuItem>
              <MenuItem value={4}>+03:00h</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item sx={{ mt: 4 }}>
            <label>Uso de Materiais?</label>
            <Checkbox
              checked={showUsesMaterials}
              onChange={handleUsesMaterials}
            />

            {showUsesMaterials && (
              <Box sx={{ mt: 3 }}>
                <MaterialList
                  stockItems={stockItems}
                  materials={materials}
                  materialsEditCost={materialsEditCost}
                  setMaterials={setMaterials}
                  setMaterialsFinalCost={setMaterialsEditCost}
                />
              </Box>
            )}
          </Grid>
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
}
