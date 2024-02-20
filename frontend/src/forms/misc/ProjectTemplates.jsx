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
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ProjectTemplates = ({
  departments,
  projectsTemplates,
  setSelectedTemplate,
}) => {
  const filterTemplatesByDepartment = (departmentId) => {
    return projectsTemplates.filter(
      (template) => template.mainDepartment._id === departmentId
    );
  };

  return (
    <>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: 16,
          fontWeight: "bold",
          mt: 2,
          mb: 4,
        }}
      >
        Selecione um Template
      </Typography>
      <Grid sx={{ mx: "20%" }}>
        {projectsTemplates.length > 0 ? (
          departments.map((department) => (
            <Accordion key={department._id} sx={{ mb: 2 }}>
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
                            sx={{
                              m: 0.5,
                              // border: "1px solid lightgrey",
                              // borderRadius: 1,
                            }}
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
        ) : (
          <Typography variant="h6">
            Nenhum template criado pelo usuário.
          </Typography>
        )}
      </Grid>
    </>
  );
};

export default ProjectTemplates;
