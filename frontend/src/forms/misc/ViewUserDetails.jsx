/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
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

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function ViewUserDetails(props) {
  return (
    <>
      <DialogTitle sx={{ mb: 2 }}>
        Detalhes do {props.manager ? "Gerente" : "Colaborador"}
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <Avatar
              alt="Imagem do Usuário"
              src={`http://localhost:3000/static/${props.selectedUser.image}`}
              sx={{ width: 230, height: 230 }}
            />
          </Grid>
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
                    Departamento
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
                <TableCell>
                  <Typography>
                    {props.selectedUser.department ? (
                      <Grid container direction="props.selectedUser">
                        <Paper
                          elevation={0}
                          sx={{
                            mr: 1,
                            mt: 0.5,
                            width: 15,
                            height: 15,
                            borderRadius: 50,
                            backgroundColor: props.selectedUser.department.color,
                          }}
                        ></Paper>
                        <Typography>{props.selectedUser.department.name}</Typography>
                      </Grid>
                    ) : (
                      "-"
                    )}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table size="small" sx={{ mt: 4 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <Typography sx={{ fontSize: "14px", color: "#777" }}>
                    Cargo
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: "14px", color: "#777" }}>
                    Nome de Operador
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: "14px", color: "#777" }}>
                    Perfil de Acesso
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">
                  <Typography>
                    {props.selectedUser.position && props.selectedUser.position.name}
                    {props.manager && "Gerente"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{props.selectedUser.username ? props.selectedUser.username : "-"}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{props.selectedUser.role ? props.selectedUser.role.name : "-"}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setOpenDetails(false)}>Fechar</Button>
      </DialogActions>
    </>
  );
}
