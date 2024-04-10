/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";
import {
  Avatar,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const ProjectSelect = (props) => {
  const [projects, setProjects] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resProjects = await api.get("/projects");
        setProjects(resProjects.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchValue.toLowerCase()) &&
      project.status !== "Concluido" &&
      project.members.some((member) => member.id === props.userId)
  );

  return (
    <FormControl sx={{ mx: props.mx075 ? 0.75 : 0 }}>
      <Select
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return <Typography>Projeto</Typography>;
          }

          return selected.name;
        }}
        sx={{ mt: 1, width: 180 }}
        onChange={(e) => props.setProject(e.target.value.name)}
      >
        <TextField
          placeholder="Pesquisar"
          variant="outlined"
          sx={{ my: 1, mx: "10%" }}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {filteredProjects.length > 0 ? (
          filteredProjects.map((item) => (
            <MenuItem value={item} key={item._id}>
              <Grid container direction="row" alignItems="center">
                <Typography id="ghostText" sx={{ color: "white" }}>
                  {"•"}
                </Typography>
                <Typography>{item.name}</Typography>
              </Grid>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography sx={{ textAlign: "center" }}>
              Nenhum projeto encontrado
            </Typography>
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default ProjectSelect;
