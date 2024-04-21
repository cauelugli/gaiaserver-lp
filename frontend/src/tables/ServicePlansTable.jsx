/* eslint-disable react/prop-types */
import * as React from "react";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// import EditServiceForm from "../forms/edit/EditServiceForm";

export default function ServicePlansTable({
  searchValue,
  searchOption,
  servicePlans,
  topBar,
  // refreshData,
  // setRefreshData,
}) {
  const [selectedService, setSelectedService] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openDetailInfo, setOpenDetailInfo] = React.useState(true);
  const [openDetailServices, setOpenDetailServices] = React.useState(false);

  const handleOpenDetail = (service) => {
    setOpenDetail(!openDetail);
    setSelectedService(service);
  };

  const handleOpenEdit = (service) => {
    setOpenEdit(!openEdit);
    setSelectedService(service);
  };

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome do Plano",
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
      const departmentA = a.department ? a.department.name : "";
      const departmentB = b.department ? b.department.name : "";

      if (order === "asc") {
        return departmentA.localeCompare(departmentB);
      } else {
        return departmentB.localeCompare(departmentA);
      }
    };

    if (orderBy === "service.name") {
      return [...servicePlans].sort(compare);
    }

    return [...servicePlans].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [servicePlans, order, orderBy]);

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
    <Box sx={{ width: topBar ? "105%" : "100%" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow
              sx={{
                backgroundColor: "#eee",
              }}
            >
              {tableHeaderRow.map((headCell) => (
                <TableCell
                  align={headCell.label === "Nome do Plano" ? "" : "center"}
                  sx={{
                    fontSize: 13,
                    fontWeight: "bold",
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
              .filter((user) =>
                user[searchOption]
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              )
              .map((servicePlan) => (
                <>
                  <TableRow key={servicePlan._id} sx={{ cursor: "pointer" }}>
                    <TableCell
                      onClick={() => handleOpenDetail(servicePlan)}
                      cursor="pointer"
                    >
                      <Typography sx={{ fontSize: 13 }}>
                        {servicePlan.name}
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
                          openDetail &&
                          selectedService.name === servicePlan.name
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
                              Informações do Serviço
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
                                  <TableCell sx={{ width: "350px" }}>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Nome
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Valor do Plano
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell sx={{ width: "350px" }}>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {servicePlan.name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      R${servicePlan.value}
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
                              Serviços Contemplados
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
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ width: "350px" }}>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Serviço
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ width: "350px" }}>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Departamento
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {servicePlan.services.map((service) => (
                                  <TableRow key={service.id}>
                                    <TableCell sx={{ width: "350px" }}>
                                      <Typography sx={{ fontSize: 13 }}>
                                        {service.name}
                                      </Typography>
                                    </TableCell>
                                    <TableCell sx={{ width: "350px" }}>
                                      <Typography sx={{ fontSize: 13 }}>
                                        {service.department.name}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Collapse>

                          <Box sx={{ mt: 3, ml: "90%" }}>
                            <ModeEditIcon
                              cursor="pointer"
                              onClick={() => handleOpenEdit(servicePlan)}
                              sx={{ color: "grey", mr: 2 }}
                            />
                            <DeleteIcon
                              cursor="pointer"
                              // onClick={() => handleConfirmDelete(servicePlan)}
                              sx={{ color: "#ff4444" }}
                            />
                          </Box>
                        </Box>
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
      {/* {openEdit && (
          <Dialog
            fullWidth
            maxWidth="md"
            open={openEdit}
            onClose={() => setOpenEdit(!openEdit)}
          >
            <EditServiceForm
              openEdit={openEdit}
              selectedService={selectedService}
              previousMaterials={selectedService.materials}
              setOpenEdit={setOpenEdit}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
            />
          </Dialog>
        )} */}
    </Box>
  );
}
