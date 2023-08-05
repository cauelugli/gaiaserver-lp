/* eslint-disable react/prop-types */
import React from "react";

import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

const CustomerBar = ({ customers, selectedCustomer, setSelectedCustomer }) => {
  return (
    <>
      <FormControl>
        <Select
          onChange={(e) => setSelectedCustomer(e.target.value)}
          value={selectedCustomer}
          displayEmpty
          sx={{ mt: 1, fontSize: "70%" }}
        >
          <MenuItem disabled value="">
            <Typography>
              <strong>CLIENTES</strong>
            </Typography>
          </MenuItem>
          {customers.map((item) => (
            <MenuItem value={item} key={item._id} sx={{ fontSize: "100%" }}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedCustomer && (
        <Box sx={{ alignItems: "left", m: 2, py: 1 }}>
          <Typography sx={{ fontSize: "80%", textAlign: "left", mb: 1 }}>
            <strong> {selectedCustomer.name}</strong>
          </Typography>
          <Typography sx={{ fontSize: "70%", textAlign: "left" }}>
            TEL: {selectedCustomer.phone}
          </Typography>
          <Typography sx={{ fontSize: "70%", textAlign: "left" }}>
            {selectedCustomer.address}
          </Typography>
          <Typography sx={{ fontSize: "60%", textAlign: "left" }}>
            CNPJ: {selectedCustomer.cnpj}
          </Typography>
          <Typography sx={{ fontSize: "60%", textAlign: "left" }}>
            Segmento {selectedCustomer.segment}
          </Typography>
          <Typography sx={{ fontSize: "60%" }}>
            Contato Principal: {selectedCustomer.mainContactName}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default CustomerBar;
