/* eslint-disable react/prop-types */
import * as React from "react";

import {
  Dialog,
  Box,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Avatar,
  TableSortLabel,
  Grid,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import EditDepartmentForm from "../forms/edit/EditDepartmentForm";
import DeleteDepartmentForm from "../forms/delete/DeleteDepartmentForm";

export default function DepartmentTable({
  searchValue,
  searchOption,
  departments,
  users,
  managers,
  fetchData,
  toast,
}) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedDepartment, setSelectedDepartment] = React.useState([]);
  const [hoveredMember, setHoveredMember] = React.useState(null);

  const handleOpenDetail = (customer) => {
    setOpenDetail(!openDetail);
    setSelectedDepartment(customer.name);
  };

  const handleOpenEdit = (customer) => {
    setOpenEdit(!openEdit);
    setSelectedDepartment(customer);
  };

  const handleConfirmDelete = (customer) => {
    setSelectedDepartment(customer);
    setOpenDelete(!openDelete);
  };

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome",
    },
    {
      id: "email",
      label: "E-mail",
    },
    {
      id: "manager",
      label: "Gerente",
    },
    {
      id: "members",
      label: "Nº de Colaboradores",
    },
  ];

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = React.useMemo(() => {
    const compare = (a, b) => {
      const membersLenA = a.length ? a.length : "";
      const membersLenB = b.length ? b.length : "";

      if (order === "asc") {
        return membersLenA.localeCompare(membersLenB);
      } else {
        return membersLenB.localeCompare(membersLenA);
      }
    };

    if (orderBy === "department.name") {
      return [...departments].sort(compare);
    }

    return [...departments].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [departments, order, orderBy]);

  return (
    <Box sx={{ minWidth: "1050px" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow
              sx={{
                backgroundColor: "#ccc",
              }}
            >
              {tableHeaderRow.map((headCell) => (
                <TableCell
                  align={headCell.label === "Nome" ? "" : "center"}
                  sx={{
                    fontSize: 16,
                    fontWeight: "bold",
                    pl: headCell.label === "Nome" ? "" : 5,
                  }}
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={() => handleRequestSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
            {sortedRows
              .filter((user) => {
                const userProperty = searchOption
                  .split(".")
                  .reduce((obj, key) => obj[key], user);
                return (
                  userProperty &&
                  userProperty.toLowerCase().includes(searchValue.toLowerCase())
                );
              })
              .map((department) => (
                <>
                  <TableRow
                    key={department._id}
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedDepartment === department.name && openDetail
                          ? department.color
                          : "none",
                      "&:hover": { backgroundColor: department.color },
                    }}
                  >
                    <TableCell
                      onClick={() => handleOpenDetail(department)}
                      cursor="pointer"
                      align="left"
                      sx={{
                        color:
                          selectedDepartment === department.name && openDetail
                            ? "white"
                            : "black",
                      }}
                    >
                      <Typography sx={{ fontSize: 14 }}>
                        {department.name}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(department)}
                      cursor="pointer"
                      align="center"
                      sx={{
                        color:
                          selectedDepartment === department.name && openDetail
                            ? "white"
                            : "black",
                      }}
                    >
                      <Typography sx={{ fontSize: 14 }}>
                        {department.email}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(department)}
                      cursor="pointer"
                      sx={{
                        color:
                          selectedDepartment === department.name && openDetail
                            ? "white"
                            : "black",
                      }}
                    >
                      <Grid container direction="row" justifyContent="center">
                        <Grid item>
                          <Avatar
                            alt="Imagem do Gerente"
                            src={
                              managers.find(
                                (manager) =>
                                  manager.name === department.manager.name
                              )
                                ? `http://localhost:3000/static/${
                                    managers.find(
                                      (manager) =>
                                        manager.name === department.manager.name
                                    ).image
                                  }`
                                : ""
                            }
                            sx={{ width: 32, height: 32, mr: 1 }}
                          />
                        </Grid>
                        <Grid item>
                          <Typography sx={{ fontSize: 14, mt: 1 }}>
                            {department.manager && department.manager.name}
                          </Typography>
                        </Grid>
                      </Grid>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(department)}
                      cursor="pointer"
                      align="center"
                      sx={{
                        color:
                          selectedDepartment === department.name && openDetail
                            ? "white"
                            : "black",
                      }}
                    >
                      <Typography sx={{ fontSize: 14 }}>
                        {department.members.length}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={
                          openDetail && selectedDepartment === department.name
                        }
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ my: 4, px: 6 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontSize: 18, fontWeight: "bold" }}
                          >
                            Geral
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Nome do Departamento
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Tipo
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Telefone
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    E-mail Principal
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  <Typography>{department.name}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>{department.type}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>{department.phone}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>{department.email}</Typography>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>

                        <Box sx={{ my: 4, px: 6 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontSize: 18, fontWeight: "bold" }}
                          >
                            Gerência
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Nome do Gerente
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    E-mail
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Telefone
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  <Grid container direction="row">
                                    <Grid item>
                                      <Avatar
                                        alt="Imagem do Gerente"
                                        src={
                                          managers.find(
                                            (manager) =>
                                              manager.name ===
                                              department.manager.name
                                          )
                                            ? `http://localhost:3000/static/${
                                                managers.find(
                                                  (manager) =>
                                                    manager.name ===
                                                    department.manager.name
                                                ).image
                                              }`
                                            : ""
                                        }
                                        sx={{ width: 32, height: 32, mr: 1 }}
                                      />
                                    </Grid>
                                    <Grid item>
                                      <Typography sx={{ fontSize: 14, mt: 1 }}>
                                        {department.manager &&
                                          department.manager.name}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {department.manager
                                      ? department.manager.email
                                      : "-"}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {department.manager
                                      ? department.manager.phone
                                      : "-"}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>

                        <Box sx={{ my: 4, px: 6 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontSize: 18, fontWeight: "bold" }}
                          >
                            Membros ({department.members.length})
                          </Typography>
                          <Table size="small">
                            <TableBody>
                              <Grid container diretion="row">
                                {department.members.map((user) => (
                                  <TableCell
                                    key={user.id}
                                    style={{ position: "relative" }}
                                  >
                                    <Chip
                                      sx={{ mx: 0 }}
                                      onMouseEnter={() =>
                                        setHoveredMember(user)
                                      }
                                      onMouseLeave={() =>
                                        setHoveredMember(null)
                                      }
                                      avatar={
                                        <Avatar
                                          alt="Imagem do Colaborador"
                                          src={`http://localhost:3000/static/${user.image}`}
                                          sx={{
                                            width: 32,
                                            height: 32,
                                            mr: 1,
                                          }}
                                        />
                                      }
                                      label={
                                        <Typography
                                          sx={{
                                            fontSize: "100%",
                                          }}
                                        >
                                          {user.name}
                                        </Typography>
                                      }
                                    />
                                    {hoveredMember === user && (
                                      <Paper
                                        onMouseEnter={() =>
                                          setHoveredMember(user)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredMember(null)
                                        }
                                        style={{
                                          position: "absolute",
                                          width: 200,
                                          height: 220,
                                          boxShadow:
                                            "0 2px 4px rgba(0, 0, 0, 0.2)",
                                          bottom: -50,
                                          left: "14%",
                                          zIndex: 999,
                                          border: "2px solid #444",
                                          borderRadius: 15,
                                        }}
                                      >
                                        <Grid
                                          container
                                          direction="column"
                                          alignItems="center"
                                          justifyContent="center"
                                        >
                                          <Grid item sx={{ mt: 1 }}>
                                            <Typography>{user.name}</Typography>
                                          </Grid>

                                          <Grid item sx={{ my: 1 }}>
                                            <Avatar
                                              alt="Imagem do Colaborador"
                                              src={`http://localhost:3000/static/${user.image}`}
                                              sx={{
                                                width: 120,
                                                height: 120,
                                              }}
                                            />
                                          </Grid>
                                          <Grid item sx={{ my: 0.5 }}>
                                            <Typography
                                              sx={{
                                                fontSize: 10,
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {user.position ? user.position.toUpperCase() : "-"}
                                            </Typography>
                                          </Grid>
                                          <Grid item>
                                            <Typography sx={{ fontSize: 10 }}>
                                              {user.email}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </Paper>
                                    )}
                                  </TableCell>
                                ))}
                              </Grid>
                            </TableBody>
                          </Table>
                        </Box>

                        {department.services.length > 0 && (
                          <Box sx={{ my: 4, px: 6 }}>
                            <Typography
                              variant="h6"
                              sx={{ fontSize: 18, fontWeight: "bold" }}
                            >
                              Serviços ({department.services.length})
                            </Typography>
                            <Table size="small">
                              <TableBody>
                                <TableRow>
                                  <TableCell>
                                    <Typography>
                                      {department.services.map((service) => (
                                        <Chip
                                          sx={{ mx: 1 }}
                                          size="small"
                                          key={service.id}
                                          label={
                                            <Typography
                                              sx={{
                                                fontSize: "100%",
                                              }}
                                            >
                                              {service.name}
                                            </Typography>
                                          }
                                        />
                                      ))}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Box>
                        )}
                        <Box sx={{ my: 2, ml: "90%" }}>
                          <ModeEditIcon
                            cursor="pointer"
                            option="delete"
                            onClick={() => handleOpenEdit(department)}
                            sx={{ color: "grey", mr: 2 }}
                          />
                          <DeleteIcon
                            cursor="pointer"
                            option="delete"
                            onClick={() => handleConfirmDelete(department)}
                            sx={{ color: "#ff4444" }}
                          />
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {openEdit && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditDepartmentForm
            openEdit={openEdit}
            users={users}
            managers={managers}
            selectedDepartment={selectedDepartment}
            setOpenEdit={setOpenEdit}
            fetchData={fetchData}
            toast={toast}
          />
        </Dialog>
      )}
      {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
          <DeleteDepartmentForm
            selectedDepartment={selectedDepartment}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            fetchData={fetchData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
