/* eslint-disable react/prop-types */
import * as React from "react";

import { Box, Tab, Tabs, Typography } from '@mui/material'

import UserTable from "../tables/UserTable";

function CustomTabPanel(props) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Users({ customers, selectedCustomer }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ minWidth: "120%" }}>
      <Typography variant="h4">Colaboradores</Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Funcionários" sx={{ color: "#eee" }} />
          <Tab label="Gerência" sx={{ color: "#eee" }} />
          <Tab label="Diretoria" sx={{ color: "#eee" }}/>
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <UserTable customers={customers} selectedCustomer={selectedCustomer} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <UserTable managers={"managers"} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <UserTable owners={"owners"} />
      </CustomTabPanel>
    </Box>
  );
}
