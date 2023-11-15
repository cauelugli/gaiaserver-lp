/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import "react-toastify/dist/ReactToastify.css";

import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function Account({ user }) {
  const [openImage, setOpenImage] = React.useState(false);

  const handleOpenImage = () => {
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
  };

  return (
    <>
      <Typography
        sx={{ fontSize: 23, mt: 0.5, ml: 1, mr: 2, fontWeight: "bold" }}
      >
        Perfil
      </Typography>
      <Grid
        sx={{ ml: 5 }}
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box>
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            sx={{ mb: 3 }}
          >
            <Avatar
              alt="Imagem do Usuário"
              src={`http://localhost:3000/static/${user.image}`}
              sx={{ width: 230, height: 230 }}
              onDoubleClick={handleOpenImage}
            />
            <Dialog open={openImage} onClose={handleCloseImage}>
              <DialogContent>
                <img
                  cursor="pointer"
                  src={`http://localhost:3000/static/${user.image}`}
                  alt="Imagem do Usuário"
                  style={{ maxWidth: "100%" }}
                />
              </DialogContent>
            </Dialog>
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
                  <Typography>{user.name}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{user.email}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{user.phone}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {user.department ? (
                      <Grid container direction="user">
                        <Paper
                          elevation={0}
                          sx={{
                            mr: 1,
                            mt: 0.5,
                            width: 15,
                            height: 15,
                            borderRadius: 50,
                            backgroundColor: user.department.color,
                          }}
                        ></Paper>
                        <Typography>{user.department.name}</Typography>
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
                    {user.position ? user.position.name : "-"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{user.username ? user.username : "-"}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{user.role ? user.role : "-"}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Grid>
    </>
  );
}
