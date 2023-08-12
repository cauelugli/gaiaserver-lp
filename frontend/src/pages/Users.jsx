/* eslint-disable react/prop-types */
import * as React from "react";

import { Box, Tab, Tabs, Typography } from "@mui/material";

import UserTable from "../tables/UserTable";
import ManagerTable from "../tables/ManagerTable";
import AdminTable from "../tables/AdminTable";

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

export default function Users({ selectedCustomer }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ minWidth: "120%" }}>
      <Typography variant="h4">Colaboradores</Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          <Tab
            label="Funcionários"
            sx={{ color: "#eee", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label="Gerência"
            sx={{ color: "#eee", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label="Diretoria"
            sx={{ color: "#eee", "&.Mui-selected": { color: "black" } }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <UserTable selectedCustomer={selectedCustomer} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ManagerTable selectedCustomer={selectedCustomer} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <AdminTable selectedCustomer={selectedCustomer} />
      </CustomTabPanel>
    </Box>
  );
}
