/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function ViewUserDetails(props) {
  return (
    <>
      <DialogTitle>Detalhes do Colaborador</DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item sx={{ mb: 2 }}>
            <Avatar
              alt="Imagem do Usuário"
              src={`http://localhost:3000/static/${props.selectedUser.image}`}
              sx={{ width: 180, height: 180 }}
            />
          </Grid>

          <Accordion sx={{ width: "100%" }} defaultExpanded>
            <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
              <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                Informações Pessoais
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography sx={{ fontSize: "14px", color: "#777" }}>
                        Nome
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: "14px", color: "#777" }}>
                        E-mail
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: "14px", color: "#777" }}>
                        Telefone
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: "14px", color: "#777" }}>
                        Data de Nascimento
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: "14px", color: "#777" }}>
                        Gênero
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography>{props.selectedUser.name}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>{props.selectedUser.email}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>{props.selectedUser.phone}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>
                        {dayjs(props.selectedUser.birthdate).format(
                          "DD/MM/YYYY"
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>
                        {props.selectedUser.gender === "m"
                          ? "Masculino"
                          : props.selectedUser.gender === "f"
                          ? "Feminino"
                          : "Não Informado"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ width: "100%", mt: 2 }}>
            <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
              <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                Departamento e Grupos
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: 300 }}>
                      <Typography sx={{ fontSize: "14px", color: "#777" }}>
                        Departamento
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ width: 300 }}>
                      <Typography sx={{ fontSize: "14px", color: "#777" }}>
                        Cargo
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ width: 300 }}>
                      <Typography sx={{ fontSize: "14px", color: "#777" }}>
                        Grupos
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center" sx={{ width: 300 }}>
                      <Typography>
                        {props.selectedUser.department ? (
                          <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                mr: 1,
                                // mt: 0.5,
                                width: 15,
                                height: 15,
                                borderRadius: 50,
                                backgroundColor:
                                  props.selectedUser.department.color,
                              }}
                            />
                            <Typography>
                              {props.selectedUser.department.name}
                            </Typography>
                          </Grid>
                        ) : (
                          "-"
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ width: 300 }}>
                      <Typography>
                        {props.selectedUser.position &&
                          props.selectedUser.position.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ width: 300 }}>
                      <Typography>
                        {props.selectedUser.groups.length > 0
                          ? props.selectedUser.groups.map((group) => group.name)
                          : "-"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ width: "100%", mt: 2 }}>
            <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
              <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                Perfil de Acesso
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: "14px", color: "#777" }}>
                        Nome do Perfil
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: "14px", color: "#777" }}>
                        Nome de Operador
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">
                      <Typography>
                        {props.selectedUser.role
                          ? props.selectedUser.role.name
                          : "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>
                        {props.selectedUser.username
                          ? props.selectedUser.username
                          : "-"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setOpenDetails(false)}>Fechar</Button>
      </DialogActions>
    </>
  );
}
