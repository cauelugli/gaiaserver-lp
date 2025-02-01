/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { toast } from "react-toastify";
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
    if (options.targetModel === "Static") {
      // Chama fetchStatuses e define fetchedOptions com os dados retornados
      options
        .staticList()
        .then((statuses) => {
          setFetchedOptions(statuses);
        })
        .catch((error) => {
          console.error("Error fetching static statuses:", error);
        });
    } else {
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
    }
  }, [options]);

  // Encontra o nome do departamento atual do usuário
  const currentItemId =
    source[
      options.targetModel.charAt(0).toLowerCase() + options.targetModel.slice(1)
    ];
  const currentItem = fetchedOptions.find((item) => item._id === currentItemId);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedData = {
      sourceId: source._id,
      sourceModel: options.sourceModel,
      targetAttribute:
        options.targetModel === "Static"
          ? options.staticAttribute
          : options.targetModel.charAt(0).toLowerCase() +
            options.targetModel.slice(1),
      newAttributeValue: selectedOption,
    };

    try {
      const res = await api.put("/editSmall", updatedData);
      if (res.data) {
        toast.success(`Editado com Sucesso!`, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      props.closeAllMenus();
      props.setRefreshData(!props.refreshData);
      api.post("/log", {
        source: source._id,
        target: res.data,
        label: props.label,
        type: "editSmall",
        prevData: props.source,
      });
    } catch (error) {
      console.log("error", error);
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  const handleCancel = () => {
    setSelectedOption("");
    props.setSmallmenuAnchorEl(null);
  };

  const inputValue = currentItem
    ? currentItem.name
    : options.targetModel === "Static"
    ? source[options.staticAttribute] || ""
    : "Desconhecido";

  return (
    <form
      onSubmit={handleSubmit}
      style={{ backgroundColor: `${props.mainColor}B3` }}
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
            sx={{ width: 200 }}
            InputProps={{
              readOnly: true,
            }}
            value={inputValue}
          />
        </Grid>
        <Grid item>
          <Typography sx={{ fontSize: 12, mt: 2, color: "white" }}>
            Novo
          </Typography>
          <Select
            size="small"
            sx={{ width: 200 }}
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            {options.targetModel === "Static"
              ? fetchedOptions.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    disabled={option === source[options.staticAttribute]}
                  >
                    {option}
                  </MenuItem>
                ))
              : fetchedOptions.map((option) => (
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
