/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Avatar,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputAdornment,
  Paper,
} from "@mui/material";

const UsersTableCell = (props) => {
  const [users, setUsers] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsers = await api.get("/get", {
          params: { model: "User" },
        });
        const resDepartments = await api.get("/get", {
          params: { model: "Department" },
        });

        const sortedUsers = resUsers.data
          .filter((user) => user.isManager === false)
          .sort((a, b) => a.name.localeCompare(b.name));

        const filteredDepartments = resDepartments.data
          .filter((department) => department.type !== "Interno")
          .sort((a, b) => a.name.localeCompare(b.name));

        setUsers(sortedUsers);
        setDepartments(filteredDepartments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.field.dynamicData, props.fields.data]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <InputLabel>{props.field.label}</InputLabel>
      <Select
        value={props.fields[props.field.name]}
        onChange={props.handleChange(props.field.name)}
        sx={{ minWidth: 175, width: 200, maxHeight: 500 }}
        size="small"
        renderValue={(selected) =>
          selected ? (
            <Grid2 container direction="row" alignItems="center">
              <Avatar
                alt="Imagem"
                src={`http://localhost:3000/static/${selected.image}`}
                sx={{ width: 24, height: 24, marginRight: 2 }}
              />
              <Typography>{selected.name}</Typography>
            </Grid2>
          ) : (
            <Typography>Selecione um Cliente</Typography>
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
              <InputAdornment position="start">
                🔍 {/* Ícone de busca */}
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
        {departments.reduce((menuItems, department) => {
          const departmentUsers = filteredUsers.filter((user) =>
            department.members.includes(user._id)
          );

          if (departmentUsers.length > 0) {
            menuItems.push(
              <Grid2 container direction="row">
                <Paper
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: 50,
                    ml: 0.5,
                    my: "auto",
                    backgroundColor: department.color,
                  }}
                />
                <InputLabel
                  key={`${department._id}-label`}
                  sx={{ ml: 0.5, mt: 0.25, fontSize: 13 }}
                >
                  {department.name}
                </InputLabel>
              </Grid2>
            );

            menuItems.push(
              ...departmentUsers.map((user, index) => (
                <MenuItem value={user} key={index} sx={{ mb: 1 }}>
                  <Grid2 container direction="row" alignItems="center">
                    <Avatar
                      alt="Imagem"
                      src={`http://localhost:3000/static/${user.image}`}
                      sx={{ width: 24, height: 24, marginRight: 2 }}
                    />
                    <Typography>{user.name}</Typography>
                  </Grid2>
                </MenuItem>
              ))
            );
          }

          return menuItems;
        }, [])}
        {filteredUsers.length === 0 && (
          <Typography sx={{ ml: 1, fontSize: 13 }}>
            Nenhum Colaborador Encontrado
          </Typography>
        )}
      </Select>
    </>
  );
};

export default UsersTableCell;
