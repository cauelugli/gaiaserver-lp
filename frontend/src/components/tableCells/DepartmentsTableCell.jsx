/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import {
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid2,
  Paper,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { icons } from "../../icons";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const DepartmentsTableCell = (props) => {
  const [departments, setDepartments] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDepartment, setSelectedDepartment] = React.useState(null);

  const departmentTypes = {
    Vendas: <icons.SellIcon />,
    Serviços: <icons.BuildIcon />,
    Interno: <icons.LanIcon />,
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resDepartments = await api.get("/get", {
          params: { model: "Department" },
        });

        const sortedDepartments = resDepartments.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setDepartments(sortedDepartments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.field.dynamicData, props.fields.data]);

  React.useEffect(() => {
    if (
      props.fields.department &&
      typeof props.fields.department === "string"
    ) {
      const department = departments.find(
        (dep) => dep.name === props.fields.department
      );
      setSelectedDepartment(department);
    } else if (
      props.fields.department &&
      typeof props.fields.department === "object"
    ) {
      setSelectedDepartment(props.fields.department);
    } else {
      setSelectedDepartment(null);
    }
  }, [props.fields.department, departments]);

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      <InputLabel>{props.field.label}</InputLabel>
      <Tooltip
        title={
          props.managerRestriction &&
          "Utilize 'Departamentos' para editar o Departamento de um Gerente"
        }
      >
        <Select
          disabled={props.managerRestriction}
          value={selectedDepartment || ""}
          onChange={props.handleChange(props.field.name)}
          sx={{ minWidth: 175, width: 200 }}
          size="small"
          renderValue={(selected) =>
            selected ? (
              <Tooltip title={props.managerRestriction ? "" : selected.name}>
                <Grid2 container alignItems="center">
                  <Paper
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: 50,
                      backgroundColor: selected.color,
                      mr: 1,
                    }}
                  />
                  {departmentTypes[selected.type]}
                  <Typography
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 100,
                      fontSize: 13,
                    }}
                  >
                    {selected.name}
                  </Typography>
                </Grid2>
              </Tooltip>
            ) : (
              ""
            )
          }
          MenuProps={{ PaperProps: { sx: { padding: "10px" } } }}
        >
          <TextField
            placeholder="Buscar..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">🔍</InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment
                  position="end"
                  onClick={handleClearSearch}
                  style={{ cursor: "pointer" }}
                >
                  ❌
                </InputAdornment>
              ),
            }}
            sx={{
              marginBottom: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                fontSize: "13px",
                height: "30px",
              },
            }}
          />

          {filteredDepartments.map((department, index) => {
            const hasManager =
              department.manager && department.manager.trim() !== "";
            const isDisabled = props.managerRestriction && hasManager;

            return (
              <MenuItem key={index} value={department} disabled={isDisabled}>
                <Grid2 container alignItems="center">
                  <Paper
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: 50,
                      backgroundColor: department.color,
                      mr: 1,
                    }}
                  />
                  {departmentTypes[department.type]}
                  <Typography sx={{ ml: 1 }}>{department.name}</Typography>
                </Grid2>
              </MenuItem>
            );
          })}

          {filteredDepartments.length === 0 && (
            <Typography sx={{ ml: 1, fontSize: 13 }}>
              Nenhum Departamento Encontrado
            </Typography>
          )}
        </Select>
      </Tooltip>
    </>
  );
};

export default DepartmentsTableCell;
