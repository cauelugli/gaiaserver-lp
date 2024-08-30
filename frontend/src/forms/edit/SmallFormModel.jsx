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
    <form
      onSubmit={handleSubmit}
      style={{ backgroundColor: `${props.configCustomization.mainColor}B3` }}
    >
      <Grid
        sx={{ width: 250, height: 240, px: 2, mt: -1 }}
        container
        direction="column"
        alignItems="center"
      >
        <Typography sx={{ color: "white", fontWeight: "bold", pt: 1 }}>
          Alterando {options.targetLabel}
        </Typography>
        <Grid item>
          <Typography sx={{ fontSize: 12, mt: 2, color: "white" }}>
            Atual
          </Typography>
          <TextField
            size="small"
            sx={{ width: 200, backgroundColor: "white" }}
            InputProps={{
              readOnly: true,
            }}
            // Exibe o nome do departamento atual
            value={currentDepartment ? currentDepartment.name : "Desconhecido"}
          />
        </Grid>
        <Grid item>
          <Typography sx={{ fontSize: 12, mt: 2, color: "white" }}>
            Novo
          </Typography>
          <Select
            size="small"
            sx={{ width: 200, backgroundColor: "white" }}
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
        sx={{ mb: -1, pb: 2 }}
      >
        <Button
          type="submit"
          color="success"
          variant="contained"
          sx={{ mr: 1 }}
        >
          OK
        </Button>
        <Button variant="contained" color="error" onClick={handleCancel}>
          Cancelar
        </Button>
      </Grid>
    </form>
  );
};

export default SmallFormModel;
