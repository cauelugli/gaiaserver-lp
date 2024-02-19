/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Button,
  DialogActions,
  DialogContent,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import ServicePlanList from "../../components/small/ServicePlanList";
import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function AddServicePlanForm({
  openAdd,
  setOpenAdd,
  refreshData,
  setRefreshData,
  configCustomization,
  toast,
}) {
  const [name, setName] = React.useState("");
  const [services, setServices] = React.useState([]);
  const [value, setValue] = React.useState(0);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/servicePlans", {
        name,
        services,
        value,
      });
      if (res.data) {
        toast.success("Plano de Serviços Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenAdd(!openAdd);
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

  const handleSelectedServicesChange = (selectedServices) => {
    setServices(selectedServices);
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogHeader title="Plano de Serviço" femaleGender={false} />
      <DialogContent>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Typography>Nome do Plano</Typography>
            <TextField
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ width: 350, mr:1 }}
            />
          </Grid>
          <Grid item>
            <Typography>Valor Mensal</Typography>
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

          <Grid container alignItems="center" sx={{ mt: 2 }}>
            <ServicePlanList
              onSelectedServicesChange={handleSelectedServicesChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <FormEndLineTenant configCustomization={configCustomization}/>
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
  );
}
