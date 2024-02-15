/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Checkbox,
  Grid,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

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
  recurrent,
  setRecurrent,
  templateName,
  setTemplateName,
}) => {
  const totalServices = [];
  const totalProducts = [];

  stages.forEach((stage) => {
    stage.tasks.forEach((task) => {
      if (task.services) {
        task.services.forEach((service) => {
          totalServices.push({ ...service, taskTitle: task.title });
        });
      }
      if (task.products) {
        task.products.forEach((product) => {
          totalProducts.push({ ...product, taskTitle: task.title });
        });
      }
    });
  });

  const totalServicesValue = totalServices.reduce(
    (acc, curr) => acc + curr.value,
    0
  );

  const totalProductsValue = totalProducts.reduce(
    (acc, curr) => acc + curr.sellValue * curr.quantity,
    0
  );

  const grandTotal = totalServicesValue + totalProductsValue;

  const finalTotal = grandTotal + price;

  return (
    <Grid sx={{ px: "10%" }}>
      <Accordion defaultExpanded>
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
      <Accordion sx={{ my: 1 }}>
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
                          Etapa {index + 1} - {stage.title}
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
                                          fontSize: 14,
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
      <Accordion sx={{ my: 1 }}>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
            Serviços e Produtos
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ mb: 2, fontWeight: "bold" }}>Serviços</Typography>
          {totalServices.length > 0 ? (
            totalServices.map((service, index) => (
              <Typography key={index}>
                {index + 1}. Tarefa: {service.taskTitle} -{" "}
                {service.name || service.title} - R$ {service.value}
              </Typography>
            ))
          ) : (
            <Typography> Não há Serviços no Projeto</Typography>
          )}

          {totalServices.length > 0 ? (
            <Typography sx={{ mt: 2 }}>
              Valor Total dos Serviços: R$ {totalServicesValue.toFixed(2)}
            </Typography>
          ) : (
            ""
          )}

          <Typography sx={{ mb: 2, mt: 4, fontWeight: "bold" }}>
            Produtos
          </Typography>
          {totalProducts.length > 0 ? (
            totalProducts.map((product, index) => (
              <Typography key={index}>
                {index + 1}. Tarefa: {product.taskTitle}{" "}
                {product.name || product.title} x{product.quantity} - R${" "}
                {product.sellValue} por unidade - Total: R${" "}
                {(product.sellValue * product.quantity).toFixed(2)}
              </Typography>
            ))
          ) : (
            <Typography sx={{ mb: 4 }}> Não há Produtos no Projeto</Typography>
          )}

          {totalProducts.length > 0 ? (
            <Typography sx={{ mt: 2 }}>
              Valor Total dos Produtos: R$ {totalProductsValue.toFixed(2)}
            </Typography>
          ) : (
            ""
          )}

          {totalProducts.length > 0 || totalServices.length > 0 ? (
            <Typography sx={{ mt: 4, fontWeight: "bold", color: "grey" }}>
              Total Geral (Produtos + Serviços): R$ {grandTotal.toFixed(2)}
            </Typography>
          ) : (
            ""
          )}

          <Typography sx={{ mt: 1, fontWeight: "bold" }}>
            Total Geral (Produtos + Serviços + Projeto): R${" "}
            {finalTotal.toFixed(2)}
          </Typography>
        </AccordionDetails>{" "}
      </Accordion>
      <Grid item sx={{ mt: 2 }}>
        <Grid container direction="row">
          <Typography sx={{ my: "auto", fontWeight: "bold", ml: 2 }}>
            Tornar este Projeto Recorrente?
          </Typography>
          <Checkbox
            checked={recurrent}
            onChange={(e) => setRecurrent(e.target.checked)}
            inputProps={{ "aria-label": "controlled" }}
          />
          <Typography sx={{ my: "auto", mx: 1 }}>
            {recurrent ? "Sim" : "Não"}
          </Typography>
          {recurrent && (
            <TextField
              sx={{ my: "auto", width:350, ml:1 }}
              size="small"
              label="Insira um Nome para o Template"
              variant="outlined"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProjectReviewTable;
