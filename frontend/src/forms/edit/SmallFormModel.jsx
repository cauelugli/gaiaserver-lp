/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const SmallFormModel = (props) => {
  const source = props.source;
  const options = props.smallmenuOptions;
  const [fetchedOptions, setFetchedOptions] = React.useState([]);
  const [selectedOption, setSelectedOption] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resModel = await api.get("/get", {
          params: { model: options.targetModel },
        });
        setFetchedOptions(resModel.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [options.targetModel]);

  // Encontra o nome do departamento atual do usuário
  const currentDepartmentId =
    source[
      options.targetModel.charAt(0).toLowerCase() + options.targetModel.slice(1)
    ];
  const currentDepartment = fetchedOptions.find(
    (dept) => dept._id === currentDepartmentId
  );

  // Função de submit para simular a chamada à API
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Dados a serem enviados
    const updatedData = {
      userId: source._id,
      newDepartmentId: selectedOption,
    };

    try {
      console.log("Simulating API call with data:", updatedData);
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  const handleCancel = () => {
    setSelectedOption("");
    props.setSmallmenuAnchorEl(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid
        sx={{ width: 250, height: 250, p: 2 }}
        container
        direction="column"
        alignItems="center"
      >
        <Typography> Alterando {options.targetLabel}</Typography>
        <Grid item>
          <Typography sx={{ fontSize: 12, mt: 2 }}>Atual</Typography>
          <TextField
            size="small"
            sx={{ width: 200 }}
            InputProps={{
              readOnly: true,
            }}
            // Exibe o nome do departamento atual
            value={currentDepartment ? currentDepartment.name : "Desconhecido"}
          />
        </Grid>
        <Grid item>
          <Typography sx={{ fontSize: 12, mt: 2 }}>Novo</Typography>
          <Select
            size="small"
            sx={{ width: 200 }}
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            {fetchedOptions.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ my: 1 }}
      >
        <Button type="submit" variant="contained" sx={{ mr: 1 }}>
          OK
        </Button>
        <Button variant="outlined" onClick={handleCancel}>
          Cancelar
        </Button>
      </Grid>
    </form>
  );
};

export default SmallFormModel;
