import React from 'react'

import { Box, Tab, Tabs, Typography } from '@mui/material'
import DepartmentTable from '../tables/DepartmentTable';

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

export default function Departments({selectedCustomer}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ minWidth: "121%" }}>
      <Typography variant="h4">Departamentos</Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Setores" sx={{ color: "#eee" }} />
          <Tab label="Something" sx={{ color: "#eee" }} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <DepartmentTable selectedCustomer={selectedCustomer}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Coming soon
      </CustomTabPanel>
    </Box>
  )
}
