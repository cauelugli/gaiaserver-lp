/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import { Grid, Table, TableCell, TableRow, Typography } from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const ServicesTableCell = ({ handleServiceChange, selectedServices }) => {
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/get", {
          params: { model: "Service" },
        });
        setOptions(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const getCount = (serviceName) => {
    const service = selectedServices.find((s) => s.name === serviceName);
    return service ? service.count : 0;
  };

  return (
    <Grid
      sx={{
        mx: 1,
        mt: 2,
        border: "1px solid #ccc",
        borderRadius: 1,
        width: "100%",
      }}
    >
      <Table size="small">
        <TableRow>
          <TableCell>
            <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
              Nome do Serviço
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
              Quantidade
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
              Valor do Serviço
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
              Total por Serviço
            </Typography>
          </TableCell>
        </TableRow>
        {options.map((option, index) => (
          <TableRow key={index} sx={{ mt: 3 }}>
            <TableCell>
              <Typography sx={{ fontSize: 12 }}>{option.name}</Typography>
            </TableCell>
            <TableCell align="right">
              <Grid
                container
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
              >
                <Typography
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    handleServiceChange(option, getCount(option.name) - 1)
                  }
                >
                  -
                </Typography>
                <Typography sx={{ fontSize: 12 }}>
                  {getCount(option.name)}
                </Typography>
                <Typography
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    handleServiceChange(option, getCount(option.name) + 1)
                  }
                >
                  +
                </Typography>
              </Grid>
            </TableCell>
            <TableCell align="right">
              <Typography sx={{ fontSize: 12 }}>
                R${option.price.toFixed(2)}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography sx={{ fontSize: 12 }}>
                R${(option.price * getCount(option.name)).toFixed(2)}
              </Typography>
            </TableCell>
          </TableRow>
        ))}

        <TableRow>
          <TableCell sx={{ mt: 2, pt: 2 }}>
            <Typography sx={{ fontSize: 16 }}>Total do Plano</Typography>
          </TableCell>
          <TableCell id="ghost" />
          <TableCell id="ghost" />
          <TableCell align="right" sx={{ mt: 2, pt: 2 }}>
            <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
              R$
              {selectedServices
                .reduce(
                  (sum, service) => sum + service.price * service.count,
                  0
                )
                .toFixed(2)}
            </Typography>
          </TableCell>
        </TableRow>
      </Table>
    </Grid>
  );
};

export default ServicesTableCell;
