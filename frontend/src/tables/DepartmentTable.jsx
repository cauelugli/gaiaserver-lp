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
  TablePagination,
  IconButton,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import EditDepartmentForm from "../forms/edit/EditDepartmentForm";
import DepartmentTableActions from "../components/small/buttons/tableActionButtons/DepartmentTableActions";
import DepartmentMembers from "../components/small/DepartmentMembers";

export default function DepartmentTable({
  userId,
  configData,
  departments,
  users,
  managers,
  refreshData,
  setRefreshData,
  toast,
  topBar,
}) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openDetailInfo, setOpenDetailInfo] = React.useState(true);
  const [openDetailManager, setOpenDetailManager] = React.useState(false);
  const [openDetailMembers, setOpenDetailMembers] = React.useState(false);
  const [openDetailServices, setOpenDetailServices] = React.useState(false);
  const [openDetailPositions, setOpenDetailPositions] = React.useState(false);
  const [selectedDepartment, setSelectedDepartment] = React.useState([]);
  const [hoveredMember, setHoveredMember] = React.useState(null);

  const handleOpenDetail = (customer) => {
    setOpenDetail(!openDetail);
    setSelectedDepartment(customer.name);
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
      id: "members",
      label: "Colaboradores",
    },
    {
      id: "manager",
      label: "Gerente",
    },
    {
      id: "actions",
      label: "Ações",
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

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  return (
    <Box sx={{ width: topBar ? "105%" : "100%", minHeight: "50vw" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              {tableHeaderRow.map((headCell) => (
                <TableCell
                  align={headCell.label === "Nome" ? "" : "center"}
                  sx={{
                    fontSize: 13,
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
              .map((department) => (
                <>
                  <TableRow key={department._id} sx={{ cursor: "pointer" }}>
                    <TableCell
                      onClick={() => handleOpenDetail(department)}
                      cursor="pointer"
                      align="center"
                    >
                      <Typography sx={{ fontSize: 13 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            ml: 1,
                            width: 16,
                            height: 16,
                            borderRadius: 50,
                            backgroundColor: department.color,
                          }}
                        />
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(department)}
                      cursor="pointer"
                      align="left"
                    >
                      <Typography sx={{ fontSize: 13 }}>
                        {department.name}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(department)}
                      cursor="pointer"
                      align="center"
                    >
                      <Typography sx={{ fontSize: 13 }}>
                        {department.email}
                      </Typography>
                    </TableCell>

                    <TableCell
                      onClick={() => handleOpenDetail(department)}
                      cursor="pointer"
                      align="center"
                    >
                      <DepartmentMembers
                        members={department.members}
                        users={users}
                        managers={managers}
                      />
                    </TableCell>

                    {department.manager ? (
                      <TableCell
                        onClick={() => handleOpenDetail(department)}
                        cursor="pointer"
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
                            <Typography sx={{ fontSize: 13, mt: 1 }}>
                              {department.manager && department.manager.name}
                            </Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                    ) : (
                      <TableCell
                        onClick={() => handleOpenDetail(department)}
                        cursor="pointer"
                      />
                    )}
                    <TableCell
                      cursor="pointer"
                      align="center"
                      onClick={() => setSelectedDepartment(department)}
                    >
                      <DepartmentTableActions
                        userId={userId}
                        configData={configData}
                        setOpenEdit={setOpenEdit}
                        selectedItem={selectedDepartment}
                        refreshData={refreshData}
                        setRefreshData={setRefreshData}
                      />
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
                          <Grid container direction="row">
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: 18,
                                fontWeight: "bold",
                                my: "auto",
                              }}
                            >
                              Informações Gerais
                            </Typography>
                            <IconButton
                              onClick={() => setOpenDetailInfo(!openDetailInfo)}
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={openDetailInfo}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Nome do Departamento
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Tipo
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Telefone
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      E-mail Principal
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell component="th" scope="row">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {department.name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {department.type}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {department.phone}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {department.email}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Collapse>
                        </Box>

                        <Box sx={{ my: 4, px: 6 }}>
                          <Grid container direction="row">
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: 18,
                                fontWeight: "bold",
                                my: "auto",
                              }}
                            >
                              Gerência
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailManager(!openDetailManager)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={openDetailManager}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Nome do Gerente
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      E-mail
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Telefone
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  {department.manager ? (
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
                                            sx={{
                                              width: 32,
                                              height: 32,
                                              mr: 1,
                                            }}
                                          />
                                        </Grid>
                                        <Grid item>
                                          <Typography
                                            sx={{ fontSize: 13, mt: 1 }}
                                          >
                                            {department.manager &&
                                              department.manager.name}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </TableCell>
                                  ) : (
                                    <TableCell
                                      onClick={() =>
                                        handleOpenDetail(department)
                                      }
                                      cursor="pointer"
                                    />
                                  )}
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {department.manager
                                        ? department.manager.email
                                        : "-"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {department.manager
                                        ? department.manager.phone
                                        : "-"}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Collapse>
                        </Box>

                        <Box sx={{ my: 4, px: 6 }}>
                          <Grid container direction="row">
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: 18,
                                fontWeight: "bold",
                                my: "auto",
                              }}
                            >
                              Membros
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailMembers(!openDetailMembers)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={openDetailMembers}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableBody>
                                <Grid container diretion="row">
                                  {department.members.map((member) => (
                                    <TableCell
                                      key={member.id}
                                      style={{ position: "relative" }}
                                    >
                                      <Chip
                                        sx={{ mx: 0 }}
                                        onMouseEnter={() =>
                                          setHoveredMember(member)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredMember(null)
                                        }
                                        avatar={
                                          <Avatar
                                            alt="Imagem do Colaborador"
                                            src={`http://localhost:3000/static/${member.image}`}
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
                                            {member.name}
                                          </Typography>
                                        }
                                      />
                                      {hoveredMember === member && (
                                        <Paper
                                          onMouseEnter={() =>
                                            setHoveredMember(member)
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
                                              <Typography>
                                                {member.name}
                                              </Typography>
                                            </Grid>

                                            <Grid item sx={{ my: 1 }}>
                                              <Avatar
                                                alt="Imagem do Colaborador"
                                                src={`http://localhost:3000/static/${member.image}`}
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
                                                {member.position
                                                  ? member.position.name.toUpperCase()
                                                  : "-"}
                                              </Typography>
                                            </Grid>
                                            <Grid item>
                                              <Typography sx={{ fontSize: 10 }}>
                                                {member.email}
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
                          </Collapse>
                        </Box>

                        {department.services.length > 0 && (
                          <Box sx={{ my: 4, px: 6 }}>
                            <Grid container direction="row">
                              <Typography
                                variant="h6"
                                sx={{
                                  fontSize: 18,
                                  fontWeight: "bold",
                                  my: "auto",
                                }}
                              >
                                Serviços ({department.services.length})
                              </Typography>
                              <IconButton
                                onClick={() =>
                                  setOpenDetailServices(!openDetailServices)
                                }
                              >
                                <ExpandMoreIcon />
                              </IconButton>
                            </Grid>

                            <Collapse
                              in={openDetailServices}
                              timeout="auto"
                              unmountOnExit
                            >
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
                            </Collapse>
                          </Box>
                        )}

                        {department.positions.length > 0 && (
                          <Box sx={{ my: 4, px: 6 }}>
                            <Grid container direction="row">
                              <Typography
                                variant="h6"
                                sx={{
                                  fontSize: 18,
                                  fontWeight: "bold",
                                  my: "auto",
                                }}
                              >
                                Cargos ({department.positions.length})
                              </Typography>
                              <IconButton
                                onClick={() =>
                                  setOpenDetailPositions(!openDetailPositions)
                                }
                              >
                                <ExpandMoreIcon />
                              </IconButton>
                            </Grid>

                            <Collapse
                              in={openDetailPositions}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Table size="small">
                                <TableBody>
                                  <TableRow>
                                    <TableCell>
                                      <Typography>
                                        {department.positions.map(
                                          (position) => (
                                            <Chip
                                              sx={{ mx: 1 }}
                                              size="small"
                                              key={position._id}
                                              label={
                                                <Typography
                                                  sx={{
                                                    fontSize: "100%",
                                                  }}
                                                >
                                                  {position.name}
                                                </Typography>
                                              }
                                            />
                                          )
                                        )}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Collapse>
                          </Box>
                        )}
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))
              .slice(startIndex, endIndex)}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={sortedRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={"por Página"}
          labelDisplayedRows={({ from, to, count }) => {
            return " " + from + " à " + to + " total " + count;
          }}
        />
      </TableContainer>
      {openEdit && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditDepartmentForm
            userId={userId}
            openEdit={openEdit}
            users={users}
            managers={managers}
            selectedDepartment={selectedDepartment}
            setOpenEdit={setOpenEdit}
            setRefreshData={setRefreshData}
            refreshData={refreshData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
