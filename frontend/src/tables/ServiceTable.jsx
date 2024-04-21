/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Avatar,
  Box,
  Dialog,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";

import EditServiceForm from "../forms/edit/EditServiceForm";
import ServiceTableActions from "../components/small/buttons/tableActionButtons/ServiceTableActions";

export default function ServiceTable({
  configData,
  searchValue,
  searchOption,
  services,
  departments,
  stockItems,
  refreshData,
  setRefreshData,
  topBar,
}) {
  const [selectedService, setSelectedService] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome",
    },
    {
      id: "department.name",
      label: "Departamento",
    },
    {
      id: "materials",
      label: "Materiais",
    },
    {
      id: "executionTime",
      label: "Duração",
    },
    {
      id: "value",
      label: "Valor",
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
      const departmentA = a.department ? a.department.name : "";
      const departmentB = b.department ? b.department.name : "";

      if (order === "asc") {
        return departmentA.localeCompare(departmentB);
      } else {
        return departmentB.localeCompare(departmentA);
      }
    };

    if (orderBy === "department.name") {
      return [...services].sort(compare);
    }

    return [...services].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [services, order, orderBy]);

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
              .filter((item) =>
                item[searchOption]
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              )
              .map((service) => (
                <TableRow
                  key={service._id}
                  sx={{ "&:hover": { backgroundColor: "#eee " } }}
                >
                  <TableCell>
                    <Grid container direction="row" alignItems="center">
                      <Paper
                        elevation={0}
                        sx={{
                          mb: 0.5,
                          mr: 0.5,
                          width: 12,
                          height: 12,
                          borderRadius: 50,
                          backgroundColor: service.color,
                        }}
                      />
                      <Typography sx={{ fontSize: 13 }}>
                        {service.name}
                      </Typography>
                    </Grid>
                  </TableCell>

                  <TableCell align="center">
                    <Typography sx={{ fontSize: 13 }}>
                      {service.department ? (
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Paper
                            elevation={0}
                            sx={{
                              mb: 0.5,
                              mr: 0.5,
                              width: 12,
                              height: 12,
                              borderRadius: 50,
                              backgroundColor: service.department.color,
                            }}
                          />
                          <Typography sx={{ fontSize: 13 }}>
                            {service.department ? service.department.name : "-"}
                          </Typography>
                        </Grid>
                      ) : (
                        "-"
                      )}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography sx={{ fontSize: 13 }}>
                      {service.materials.length !== 0 ? (
                        service.materials.map(
                          (material) =>
                            material.quantity > 0 && (
                              <Grid
                                key={material.id}
                                container
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                                sx={{ my: -1 }}
                              >
                                <Tooltip title={material.name}>
                                  <Avatar
                                    src={`http://localhost:3000/static/${material.image}`}
                                    alt={material.name[0]}
                                    style={{
                                      width: 42,
                                      height: 42,
                                      cursor: "pointer",
                                    }}
                                  />
                                </Tooltip>

                                <Typography
                                  sx={{
                                    fontSize: 12,
                                    color: "#555",
                                    mt: 0.5,
                                  }}
                                >
                                  x{material.quantity}
                                </Typography>
                              </Grid>
                            )
                        )
                      ) : (
                        <Typography sx={{ fontSize: 13 }}>Não há</Typography>
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {service.executionTime === 0.5 ? (
                      <Tooltip title={"Atendimento único"}>
                        <Typography sx={{ fontSize: 13 }}>30 min</Typography>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title={
                          <Grid container direction="column">
                            {service.sessions.quantity} sessões de{" "}
                            {service.sessions.time}h com intervalo de{" "}
                            {service.sessions.interval} dias
                          </Grid>
                        }
                      >
                        <Typography sx={{ fontSize: 13 }}>
                          {service.sessions.quantity * service.sessions.time}h
                        </Typography>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip
                      title={
                        <>
                          {service.materialsCost ? (
                            <Grid container direction="column">
                              <Grid item>
                                R${service.materialsCost.toFixed(2)} (Materiais)
                              </Grid>
                              <Grid item>
                                R${service.value.toFixed(2)} (Serviço)
                              </Grid>
                            </Grid>
                          ) : (
                            `R$${service.value.toFixed(2)} (Apenas Serviço)`
                          )}
                        </>
                      }
                    >
                      <Typography sx={{ fontSize: 13 }}>
                        R$
                        {service.materialsCost
                          ? (service.materialsCost + service.value).toFixed(2)
                          : service.value.toFixed(2)}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  <TableCell
                    cursor="pointer"
                    align="center"
                    onClick={() => setSelectedService(service)}
                  >
                    <ServiceTableActions
                      configData={configData.services}
                      setOpenEdit={setOpenEdit}
                      selectedItem={selectedService}
                      refreshData={refreshData}
                      setRefreshData={setRefreshData}
                    />
                  </TableCell>
                </TableRow>
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
          <EditServiceForm
            openEdit={openEdit}
            selectedService={selectedService}
            previousMaterials={selectedService.materials}
            departments={departments}
            stockItems={stockItems}
            setOpenEdit={setOpenEdit}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
