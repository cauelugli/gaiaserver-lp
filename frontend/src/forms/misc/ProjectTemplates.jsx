/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Paper,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const ProjectTemplates = ({
  departments,
  projectsTemplates,
  setSelectedTemplate,
}) => {
  const [searchValue, setSearchValue] = React.useState("");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filterTemplatesByDepartment = (departmentId) => {
    return projectsTemplates
      .filter((template) => template.mainDepartment._id === departmentId)
      .filter((template) =>
        template.title.toLowerCase().includes(searchValue.toLowerCase())
      );
  };

  const filteredDepartments = departments.filter(
    (department) => filterTemplatesByDepartment(department._id).length > 0
  );

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: "bold",
          my: 2,
        }}
      >
        Selecione um Template
      </Typography>
      <TextField
        placeholder="Pesquise por..."
        size="small"
        variant="outlined"
        sx={{ my: 2, width: 350 }}
        value={searchValue}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ mb: 1, ml: 1, mr: -0.5 }} />
            </InputAdornment>
          ),
          endAdornment:
            searchValue.length > 0 ? (
              <InputAdornment position="end">
                <ClearIcon
                  cursor="pointer"
                  sx={{ color: "#d21404" }}
                  onClick={() => setSearchValue("")}
                />
              </InputAdornment>
            ) : null,
        }}
      />

      <Grid sx={{ mx: "20%" }}>
        {projectsTemplates.length > 0 && searchValue.trim() !== ""
          ? filteredDepartments.map((department) => (
              <Accordion key={department._id} sx={{ mb: 2, width: 400 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id={`panel1a-header-${department._id}`}
                >
                  <Grid container direction="row">
                    <Paper
                      elevation={0}
                      sx={{
                        mr: 1,
                        mt: 0.5,
                        width: 15,
                        height: 15,
                        borderRadius: 50,
                        backgroundColor: department.color,
                      }}
                    />
                    <Typography>{department.name}</Typography>
                  </Grid>{" "}
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container justifyContent="center">
                    {filterTemplatesByDepartment(department._id).length > 0 ? (
                      filterTemplatesByDepartment(department._id).map(
                        (template) => (
                          <Grid item key={template._id}>
                            <Chip
                              sx={{ m: 0.5 }}
                              onClick={() => setSelectedTemplate(template)}
                              label={template.title}
                            />
                          </Grid>
                        )
                      )
                    ) : (
                      <Typography variant="body2" textAlign="center">
                        Nenhum template encontrado para este departamento.
                      </Typography>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))
          : departments.map((department) => (
              <Accordion key={department._id} sx={{ mb: 2, width: 400 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id={`panel1a-header-${department._id}`}
                >
                  <Grid container direction="row">
                    <Paper
                      elevation={0}
                      sx={{
                        mr: 1,
                        mt: 0.5,
                        width: 15,
                        height: 15,
                        borderRadius: 50,
                        backgroundColor: department.color,
                      }}
                    />
                    <Typography>{department.name}</Typography>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container justifyContent="center">
                    {filterTemplatesByDepartment(department._id).length > 0 ? (
                      filterTemplatesByDepartment(department._id).map(
                        (template) => (
                          <Grid item key={template._id}>
                            <Chip
                              sx={{ m: 0.5 }}
                              onClick={() => setSelectedTemplate(template)}
                              label={template.title}
                            />
                          </Grid>
                        )
                      )
                    ) : (
                      <Typography variant="body2" textAlign="center">
                        Nenhum template encontrado para este departamento.
                      </Typography>
                    )}
                  </Grid>
                </AccordionDetails>{" "}
              </Accordion>
            ))}
      </Grid>
    </Grid>
  );
};

export default ProjectTemplates;
