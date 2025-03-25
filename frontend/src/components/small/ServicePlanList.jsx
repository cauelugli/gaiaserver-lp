/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";

import {
  Avatar,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid2,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function ServicePlanList({ onSelectedServicesChange }) {
  const [selectedItemId, setSelectedItemId] = React.useState(null);
  const [options, setOptions] = React.useState([]);
  const [selectedList, setSelectedList] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const services = await api.get("/services");
        setOptions(services.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchData();
  }, []);

  const handleChecked = (id) => {
    setSelectedItemId(id === selectedItemId ? null : id);
  };

  const handleAdd = () => {
    const selectedOption = options.find(
      (option) => option._id === selectedItemId
    );
    if (selectedOption) {
      const newOptions = options.filter(
        (option) => option._id !== selectedItemId
      );
      setOptions(newOptions);

      const updatedSelectedList = [...selectedList, { ...selectedOption }];
      setSelectedList(updatedSelectedList);

      // Chamar a propriedade onSelectedServicesChange com a lista atualizada
      onSelectedServicesChange(updatedSelectedList);
    }
  };

  const handleRemove = (itemId) => {
    const item = selectedList.find((item) => item._id === itemId);
    if (item) {
      // Atualizar a lista de selecionados
      const updatedSelectedList = selectedList.filter(
        (item) => item._id !== itemId
      );
      setSelectedList(updatedSelectedList);

      // Adicionar a opção de volta às opções
      setOptions([...options, { ...item }]);

      // Chamar a propriedade onSelectedServicesChange com a lista atualizada
      onSelectedServicesChange(updatedSelectedList);
    }
  };

  return (
    <Grid2 container sx={{ mt: 2 }}>
      <Grid2 item>
        <Grid2 container direction="row" justifyContent="flex-start">
          <Typography>Serviços Disponíveis:</Typography>
        </Grid2>

        <Paper sx={{ width: 400, height: 200, overflow: "auto" }}>
          <FormGroup sx={{ mt: 1 }}>
            {options.map((option) => (
              <FormControlLabel
                sx={{ ml: 1 }}
                key={option._id}
                control={
                  <Checkbox
                    size="small"
                    sx={{ mb: 0.5 }}
                    checked={option._id === selectedItemId}
                    onChange={() => handleChecked(option._id)}
                  />
                }
                label={
                  <Grid2>
                    <Grid2 container direction="row">
                      <Typography>
                        {option.name}
                        {"\u00A0"}
                      </Typography>

                      {option._id === selectedItemId && (
                        <IconButton
                          sx={{
                            ml: 1,
                            height: 18,
                            maxWidth: 18,
                            color: "white",
                            backgroundColor: "green",
                            borderRadius: 3,
                            "&:hover": {
                              color: "white",
                              backgroundColor: "green",
                            },
                          }}
                          onClick={handleAdd}
                        >
                          <Typography sx={{ fontWeight: "bold" }}>+</Typography>
                        </IconButton>
                      )}
                    </Grid2>
                  </Grid2>
                }
              />
            ))}
          </FormGroup>
        </Paper>
      </Grid2>

      <Grid2 item sx={{ ml: "50px" }}>
        <Typography>Selecionados:</Typography>
        <Paper
          sx={{
            width: 400,
            height: 200,
            overflow: "auto",
            position: "relative",
          }}
        >
          {selectedList.map((item) => (
            <li key={item._id}>
              <Grid2 container direction="row" sx={{ mt: 2, px: 0.5 }}>
                <IconButton
                  sx={{
                    ml: 1,
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
                  onClick={() => handleRemove(item._id || item.id)}
                >
                  <Typography sx={{ fontWeight: "bold" }}>-</Typography>
                </IconButton>
                <Typography sx={{ ml: 2 }}>{item.name}</Typography>
              </Grid2>
            </li>
          ))}
        </Paper>
      </Grid2>
    </Grid2>
  );
}
