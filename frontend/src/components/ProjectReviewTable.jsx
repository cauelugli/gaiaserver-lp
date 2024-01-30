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
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
            Informações do Projeto
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Table size="small">
            {/* PART ONE */}
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 13, color: "#777" }}>
                  Tipo de Projeto
                </TableCell>
                <TableCell align="left" sx={{ fontSize: 13, color: "#777" }}>
                  Nome do Projeto
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontSize: 13 }}>{type}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 13 }}>{name}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {/* PART ONE */}
          {/* PART ONE.HALF */}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="left" sx={{ fontSize: 13, color: "#777" }}>
                  Descrição
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 13 }}>{description}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {/* PART ONE.HALF */}
          {/* PART TWO */}
          <Table size="small">
            <TableHead sx={{ mt: 1 }}>
              <TableRow>
                <TableCell align="left" sx={{ fontSize: 13, color: "#777" }}>
                  Tipo de Cliente
                </TableCell>
                <TableCell align="left" sx={{ fontSize: 13, color: "#777" }}>
                  Cliente
                </TableCell>
                <TableCell align="left" sx={{ fontSize: 13, color: "#777" }}>
                  Valor
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 13 }}>{customerType}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 13 }}>
                    {customer && customer.name}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 13 }}>R${price}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {/* PART TWO */}
          {/* PART THREE */}
          <Table size="small">
            <TableHead sx={{ mt: 1 }}>
              <TableRow>
                <TableCell sx={{ fontSize: 13, color: "#777" }}>
                  Departamento Principal
                </TableCell>
                <TableCell align="left" sx={{ fontSize: 13, color: "#777" }}>
                  Departamentos Secundários
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontSize: 13 }}>
                    {mainDepartment && mainDepartment.name}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  {selectedDepartments &&
                    selectedDepartments.map((dept) => (
                      <Typography key sx={{ fontSize: 13 }}>
                        {dept.name}
                      </Typography>
                    ))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {/* PART THREE */}
          {/* PART FOUR */}
          <Table size="small">
            <TableHead sx={{ mt: 1 }}>
              <TableRow>
                <TableCell align="left" sx={{ fontSize: 13, color: "#777" }}>
                  Membros do Projeto
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="left">
                  <Grid container direction="row" alignItems="center">
                    {members.map((member) => (
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
                            sx={{ ml: 0.5, mr: 1, fontSize: 13, my: "auto" }}
                          >
                            {member.name}
                          </Typography>
                        </Grid>
                      </>
                    ))}
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
            {/* PART FOUR */}
          </Table>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ my: 1 }}>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
            Etapas e Tarefas
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Faça um map fodastico aqui</Typography>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default ProjectReviewTable;
