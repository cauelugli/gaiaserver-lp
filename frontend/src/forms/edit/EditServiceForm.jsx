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
  fetchData,
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
  const [isSupport, setIsSupport] = React.useState(selectedService.isSupport);
  const handleIsSupport = (event) => {
    setIsSupport(event.target.checked);
  };
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
        value: isSupport ? 0 : value,
        previousMaterials,
        materials,
        materialsCost: materialsEditCost,
      });
      res.data && alert("Serviço editado com Sucesso!");
      setOpenEdit(!openEdit);
      fetchData();
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleEdit}>
      <DialogTitle>Editando Serviço - {selectedService.name}</DialogTitle>
      <DialogContent>
        <Grid
          container
          sx={{ pr: "4%", mt: 2 }}
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
              renderValue={(selected) => selected.name}
              size="small"
              sx={{ minWidth: 200 }}
            >
              {departments.map((item) => (
                <MenuItem
                  value={item}
                  key={item.id}
                  sx={{
                    backgroundColor: item.color,
                    color: "white",
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
          <Grid item>
            <Typography>Valor</Typography>
            <TextField
              type="number"
              size="small"
              value={value}
              disabled={isSupport}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
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
          <Grid item sx={{ pt: 2, ml: 2 }}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <label
                  style={{ fontSize: 14, fontFamily: "Verdana, sans-serif" }}
                >
                  Serviço de Consultoria?
                </label>

                <Checkbox
                  checked={isSupport}
                  onChange={handleIsSupport}
                  value={isSupport}
                />
              </Grid>
              <Grid item>
                <Typography
                  sx={{ fontSize: 12, fontFamily: "Verdana, sans-serif" , color: isSupport ? "green" : "#aaa" }}
                >
                  Sim, serviço sem custo
                </Typography>
              </Grid>
            </Grid>
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
              <Box sx={{ ml: 5 }}>
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
