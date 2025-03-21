/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Button, Tooltip, Grid2 } from "@mui/material";
import { icons } from "../../icons";

const ChartRequestsPerCustomerHeader = ({
  selectedCustomerDisplay,
  setSelectedCustomerDisplay,
  setSelectedCustomer,
  requestsPerCustomer,
}) => {
  return (
    <Grid2 container justifyContent="space-evenly" sx={{ my: 1 }}>
      <Tooltip title="Todos">
        <Button
          variant={selectedCustomerDisplay === "all" ? "contained" : "outlined"}
          onClick={() => {
            setSelectedCustomerDisplay("all");
            if (requestsPerCustomer && requestsPerCustomer.length > 0) {
              setSelectedCustomer(requestsPerCustomer[0]); // Redefine o cliente selecionado
            }
          }}
        >
          <icons.AllInclusiveIcon />
        </Button>
      </Tooltip>
      <Tooltip title="Empresas">
        <Button
          variant={
            selectedCustomerDisplay === "customer" ? "contained" : "outlined"
          }
          onClick={() => setSelectedCustomerDisplay("customer")}
          sx={{ mx: 1 }}
        >
          <icons.ApartmentIcon />
        </Button>
      </Tooltip>
      <Tooltip title="Pessoa Física">
        <Button
          variant={
            selectedCustomerDisplay === "client" ? "contained" : "outlined"
          }
          onClick={() => setSelectedCustomerDisplay("client")}
        >
          <icons.PersonIcon />
        </Button>
      </Tooltip>
    </Grid2>
  );
};

export default ChartRequestsPerCustomerHeader;
