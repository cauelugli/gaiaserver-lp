/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Grid2, Typography, Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";

const ChartRequestPerCustomer = ({
  requestsPerCustomer,
  mainColor,
  chartType,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState(
    requestsPerCustomer && requestsPerCustomer.length > 0
      ? requestsPerCustomer[0]
      : null
  );

  return (
    <Grid2 container direction="column" sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Requisições por Cliente
      </Typography>

      {!requestsPerCustomer || requestsPerCustomer.length === 0 ? (
        <Typography variant="body1" sx={{ mb: 2 }}>
          Nenhum dado de requisições por cliente encontrado.
        </Typography>
      ) : (
        <>
          {/* Avatares dos Clientes */}
          <Grid2 container spacing={2} sx={{ mb: 2 }}>
            {requestsPerCustomer.map((item, index) => (
              <Grid2 item key={index}>
                <Box
                  onClick={() => setSelectedCustomer(item)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    backgroundColor:
                      selectedCustomer?.id === item.id ? mainColor : "#e0e0e0",
                    color: selectedCustomer?.id === item.id ? "#fff" : "#000",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                    ":hover": {
                      backgroundColor: mainColor,
                      color: "#fff",
                    },
                  }}
                >
                  <Typography variant="subtitle1">
                    {item.title.split(" ")[1][0]}{" "}
                    {/* Mostra a primeira letra do nome */}
                  </Typography>
                </Box>
              </Grid2>
            ))}
          </Grid2>

          {/* Gráfico do Cliente Selecionado */}
          {selectedCustomer && (
            <Grid2 item>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedCustomer.title}
              </Typography>
              {chartType === "line" ? (
                <LineChart
                  xAxis={[
                    { data: selectedCustomer.labels, scaleType: "point" },
                  ]}
                  yAxis={[{ tickMinStep: 1, min: 0 }]}
                  series={[
                    {
                      data: selectedCustomer.length,
                      color: selectedCustomer.color,
                    },
                  ]}
                  width={600}
                  height={300}
                />
              ) : (
                <BarChart
                  xAxis={[{ data: selectedCustomer.labels, scaleType: "band" }]}
                  yAxis={[{ tickMinStep: 1, min: 0 }]}
                  series={[
                    {
                      data: selectedCustomer.length,
                      color: selectedCustomer.color,
                    },
                  ]}
                  width={600}
                  height={300}
                />
              )}
            </Grid2>
          )}
        </>
      )}
    </Grid2>
  );
};

export default ChartRequestPerCustomer;
