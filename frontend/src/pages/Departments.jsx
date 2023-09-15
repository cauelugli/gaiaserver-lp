/* eslint-disable react/prop-types */
import React from "react";

import { Box, Button, Grid, Tab, Tabs, Typography } from "@mui/material";
import DepartmentTable from "../tables/DepartmentTable";
import DepartmentInternalTable from "../tables/DepartmentInternalTable";

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

export default function Departments() {
  const [value, setValue] = React.useState(0);
  const [openAdd, setOpenAdd] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Typography
          sx={{ fontSize: 23, mt: 0.5, ml: 1, mr: 2, fontWeight: "bold" }}
        >
          Departamentos
        </Typography>
        <Button
          onClick={() => setOpenAdd(true)}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 3,
            bottom: 3,
            "&:hover": { borderColor: "#eee" },
          }}
        >
          <Typography variant="h6">+</Typography>
          <Typography sx={{ fontSize: 16, mt: 0.5, ml: 0.5 }}>Novo</Typography>
        </Button>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          <Tab
            label="Todos"
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label="Internos"
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <DepartmentTable openAdd={openAdd} setOpenAdd={setOpenAdd} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <DepartmentInternalTable openAdd={openAdd} setOpenAdd={setOpenAdd} />
      </CustomTabPanel>
    </Box>
  );
}
