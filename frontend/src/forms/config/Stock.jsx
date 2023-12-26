/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Departments({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);

  const [
    stockentriesDispatcherDepartment,
    setStockentriesDispatcherDepartment,
  ] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        const departments = await api.get("/departments");
        setDepartments(departments.data);
        setConfigData(config.data[0].stock);
        setStockentriesDispatcherDepartment(
          config.data[0].stock.stockentriesDispatcherDepartment
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangeStockConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/config/stock", {
        stockentriesDispatcherDepartment,
      });

      if (res.data) {
        toast.success("Configuração Alterada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      onClose();
    } catch (err) {
      console.log("erro", err);
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  console.log(
    "stockentriesDispatcherDepartment",
    stockentriesDispatcherDepartment
  );

  return (
    <form onSubmit={handleChangeStockConfig}>
      <DialogTitle>Configurações de Estoque</DialogTitle>
      {configData.length !== 0 && (
        <>
          <DialogContent>
            <Grid
              container
              sx={{ mt: 2 }}
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Grid item sx={{ my: 1.5 }}>
                <Grid container direction="row">
                  <Typography sx={{ my: "auto" }}>
                    Departamento Responsável pelo Estoque
                  </Typography>
                  <Tooltip
                    title={
                      <Typography sx={{ fontSize: 12 }}>
                        Escolha qual será o departamento responsável por Aprovar
                        pedidos de Entrada de Estoque. Este departamento terá o
                        Gerente notificado sobre TODAS as movimentações
                        relacionadas a Estoque.
                      </Typography>
                    }
                  >
                    <Button
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        color: "#32aacd",
                        "&:hover": {
                          backgroundColor: "white",
                        },
                      }}
                    >
                      ?
                    </Button>
                  </Tooltip>
                  <Grid item>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Select
                        onChange={(e) =>
                          setStockentriesDispatcherDepartment(e.target.value)
                        }
                        value={stockentriesDispatcherDepartment}
                        size="small"
                        displayEmpty
                        required
                        renderValue={(selected) => {
                          if (!selected) {
                            return (
                              <Typography>Selecione o Departamento</Typography>
                            );
                          } else {
                            return (
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
                            );
                          }
                        }}
                        sx={{ minWidth: "200px", mr:1 }}
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
                        ))}
                      </Select>
                      {stockentriesDispatcherDepartment &&
                        stockentriesDispatcherDepartment.manager && (
                          <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                              width: "auto",
                              ml: 1,
                            }}
                          >
                            <Typography sx={{mr:1}}>Gerente: </Typography>
                            <Avatar
                              src={`http://localhost:3000/static/${stockentriesDispatcherDepartment.manager.image}`}
                              style={{
                                width: 42,
                                height: 42,
                              }}
                            />
                            <Typography sx={{ fontSize: 13, ml: 1 }}>
                              {stockentriesDispatcherDepartment.manager.name}
                            </Typography>
                          </Grid>
                        )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained" color="success">
              OK
            </Button>
          </DialogActions>
        </>
      )}
    </form>
  );
}
