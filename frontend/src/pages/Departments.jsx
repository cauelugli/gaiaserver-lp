/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import { Box, Button, Grid, Tab, Tabs, Typography } from "@mui/material";
import DepartmentTable from "../tables/DepartmentTable";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

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

  const [serviceDepartments, setServiceDepartments] = React.useState([]);
  const [saleDepartments, setSaleDepartments] = React.useState([]);
  const [internalDepartments, setInternalDepartments] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const departments = await api.get("/departments");
        setServiceDepartments(
          departments.data.filter(
            (department) => department.type === "Serviços"
          )
        );
        setSaleDepartments(
          departments.data.filter((department) => department.type === "Vendas")
        );
        setInternalDepartments(
          departments.data.filter((department) => department.type === "Interno")
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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
            label="Serviços"
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label="Vendas"
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label="Internos"
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <DepartmentTable
          departments={serviceDepartments}
          openAdd={openAdd}
          setOpenAdd={setOpenAdd}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <DepartmentTable
          departments={saleDepartments}
          openAdd={openAdd}
          setOpenAdd={setOpenAdd}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <DepartmentTable
          departments={internalDepartments}
          openAdd={openAdd}
          setOpenAdd={setOpenAdd}
        />
      </CustomTabPanel>
    </Box>
  );
}
