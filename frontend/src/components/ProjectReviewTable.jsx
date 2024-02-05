/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { purple } from "@mui/material/colors";

const ProjectReviewTable = ({
  type,
  customer,
  customerType,
  name,
  price,
  mainDepartment,
  selectedDepartments,
  members,
  stages,
  description,
}) => {
  return (
    <Grid sx={{ px: "10%" }}>
      {/* <Accordion defaultExpanded> */}
      <Accordion>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
            Informações do Projeto
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* PART ONE */}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Grid container direction="column">
                    <Typography sx={{ fontSize: 13, color: "#777", mb: 1 }}>
                      Tipo de Projeto
                    </Typography>
                    <Typography sx={{ fontSize: 13 }}>{type}</Typography>
                  </Grid>
                </TableCell>
                <TableCell align="left" sx={{ fontSize: 13 }}>
                  <Grid container direction="column">
                    <Typography sx={{ fontSize: 13, color: "#777", mb: 1 }}>
                      None do Projeto
                    </Typography>
                    <Typography sx={{ fontSize: 13 }}>{name}</Typography>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
          {/* PART ONE */}
          {/* PART ONE.HALF */}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <Grid container direction="column">
                    <Typography sx={{ fontSize: 13, color: "#777", mb: 1 }}>
                      Descrição
                    </Typography>
                    <Typography sx={{ fontSize: 13 }}>{description}</Typography>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
          {/* PART ONE.HALF */}
          {/* PART TWO */}
          <Table size="small">
            <TableHead sx={{ mt: 1 }}>
              <TableRow>
                <TableCell align="left">
                  <Grid container direction="column">
                    <Typography sx={{ fontSize: 13, color: "#777", mb: 1 }}>
                      Tipo de Cliente
                    </Typography>
                    <Typography sx={{ fontSize: 13 }}>
                      {customerType}
                    </Typography>
                  </Grid>
                </TableCell>
                <TableCell align="left">
                  <Grid container direction="column">
                    <Typography sx={{ fontSize: 13, color: "#777", mb: 1 }}>
                      Cliente
                    </Typography>
                    <Typography sx={{ fontSize: 13 }}>
                      {customer && customer.name}
                    </Typography>
                  </Grid>
                </TableCell>
                <TableCell align="left">
                  <Grid container direction="column">
                    <Typography sx={{ fontSize: 13, color: "#777", mb: 1 }}>
                      Valor
                    </Typography>
                    <Typography sx={{ fontSize: 13 }}>R$ {price}</Typography>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
          {/* PART TWO */}
          {/* PART THREE */}
          <Table size="small">
            <TableHead sx={{ mt: 1 }}>
              <TableRow>
                <TableCell>
                  <Grid container direction="column">
                    <Typography sx={{ fontSize: 13, color: "#777", mb: 1 }}>
                      Departamento Principal
                    </Typography>
                    <Typography sx={{ fontSize: 13 }}>
                      {mainDepartment && mainDepartment.name}
                    </Typography>
                  </Grid>
                </TableCell>
                <TableCell align="left">
                  <Grid container direction="column">
                    <Typography sx={{ fontSize: 13, color: "#777", mb: 1 }}>
                      Departamentos Secundários
                    </Typography>
                    <Typography sx={{ fontSize: 13 }}>
                      {selectedDepartments &&
                        selectedDepartments.map((dept) => (
                          <Typography key sx={{ fontSize: 13 }}>
                            {dept.name}
                          </Typography>
                        ))}
                    </Typography>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
          {/* PART THREE */}
          {/* PART FOUR */}
          <Table size="small">
            <TableHead sx={{ mt: 1 }}>
              <TableRow>
                <TableCell align="left">
                  <Grid container direction="column">
                    <Typography sx={{ fontSize: 13, color: "#777", mb: 1 }}>
                      Membros do Projeto
                    </Typography>
                    <Grid container direction="row" alignItems="center">
                      {members &&
                        members.map((member) => (
                          <>
                            <Grid item>
                              <Avatar
                                alt="Imagem do Colaborador"
                                src={`http://localhost:3000/static/${member.image}`}
                                sx={{ width: 22, height: 22 }}
                              />
                            </Grid>
                            <Grid item>
                              <Typography
                                sx={{
                                  ml: 0.5,
                                  mr: 1,
                                  fontSize: 13,
                                  my: "auto",
                                }}
                              >
                                {member.name}
                              </Typography>
                            </Grid>
                          </>
                        ))}
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
          {/* PART FOUR */}
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ my: 1 }} defaultExpanded>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
            Etapas e Tarefas
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container direction="row">
            {stages.map((stage, index) => (
              <Table key size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      <Grid container direction="row">
                        <Typography
                          sx={{ fontSize: 16, my: 1, fontWeight: "bold" }}
                        >
                          Etapa {index} - {stage.title}
                        </Typography>
                        {stage.tasks.map((task, index) => (
                          <Grid
                            key={index}
                            container
                            direction="row"
                            sx={{
                              fontSize: 14,
                              mt: 1,
                              py: 1,
                              backgroundColor:
                                index % 2 ? "lightgrey" : "white",
                            }}
                          >
                            <Typography sx={{ fontSize: 14 }}>
                              Tarefa: {task.title}
                            </Typography>
                            <Grid item sx={{ mx: 1 }}>
                              <Grid container direction="row">
                                {task.assignees.map((assignee) => (
                                  <>
                                    <Grid item>
                                      <Avatar
                                        alt="Imagem do Colaborador"
                                        src={`http://localhost:3000/static/${assignee.image}`}
                                        sx={{ width: 20, height: 20 }}
                                      />
                                    </Grid>
                                    <Grid item>
                                      <Typography
                                        sx={{
                                          ml: 0.5,
                                          mr: 1,
                                          fontSize: 13,
                                          my: "auto",
                                        }}
                                      >
                                        {assignee.name}
                                      </Typography>
                                    </Grid>
                                  </>
                                ))}
                              </Grid>
                            </Grid>

                            <Typography sx={{ fontSize: 14 }}>
                              Prazo: {task.dueTo}
                            </Typography>
                            {task.services.length > 0 && (
                              <Grid container direction="row" sx={{ mt: 1 }}>
                                <Typography key sx={{ fontSize: 14, mr: 1 }}>
                                  Serviço:
                                </Typography>
                                {task.services.length > 0 &&
                                  task.services.map((service) => (
                                    <Typography
                                      key
                                      sx={{ fontSize: 14, mr: 1 }}
                                    >
                                      {service.name}
                                    </Typography>
                                  ))}
                              </Grid>
                            )}
                            {task.products.length > 0 && (
                              <Grid container direction="row " sx={{ mt: 1 }}>
                                <Typography key sx={{ fontSize: 14, mr: 1 }}>
                                  Produtos:
                                </Typography>
                                {task.products.length > 0 &&
                                  task.products.map((product) => (
                                    <Typography
                                      key
                                      sx={{ fontSize: 14, mr: 1 }}
                                    >
                                      {product.name}
                                    </Typography>
                                  ))}
                              </Grid>
                            )}
                          </Grid>
                        ))}
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default ProjectReviewTable;
