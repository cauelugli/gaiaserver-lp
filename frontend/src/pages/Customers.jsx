import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CustomerTable from "../tables/CustomerTable";

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

export default function CustomerTab({ customers }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ minWidth: "121%" }}>
      <Typography variant="h4">Clientes</Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Clientes" />
          <Tab label="Something" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <CustomerTable />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Coming soon
      </CustomTabPanel>
    </Box>
  );
}
