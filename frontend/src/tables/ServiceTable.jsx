/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  Collapse,
  Dialog,
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

import EditServiceForm from "../forms/edit/EditServiceForm";
import GenericDeleteForm from "../forms/delete/GenericDeleteForm";
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
}) {
  const [selectedService, setSelectedService] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openDetailInfo, setOpenDetailInfo] = React.useState(true);
  const [openDetailMaterials, setOpenDetailMaterials] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleConfirmDelete = (position) => {
    setSelectedItem(position);
    setOpenDialog(true);
  };

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
      label: "Nome",
    },
    {
      id: "department.name",
      label: "Departamento",
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
    <>
      <Box sx={{ minWidth: "1250px" }}>
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
                .filter((user) =>
                  user[searchOption]
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
                )
                .map((service) => (
                  <>
                    <TableRow
                      key={service._id}
                      sx={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedService.name === service.name && openDetail
                            ? "#eee"
                            : "none",
                        "&:hover": { backgroundColor: "#eee " },
                      }}
                    >
                      <TableCell
                        onClick={() => handleOpenDetail(service)}
                        cursor="pointer"
                      >
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                        >
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
                      <TableCell
                        onClick={() => handleOpenDetail(service)}
                        cursor="pointer"
                        align="center"
                      >
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
                                {service.department.name}
                              </Typography>
                            </Grid>
                          ) : (
                            "-"
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell
                        cursor="pointer"
                        align="center"
                        onClick={() => setSelectedService(service)}
                      >
                        <ServiceTableActions
                          configData={configData}
                          setOpenEdit={setOpenEdit}
                          selectedItem={selectedService}
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
                            openDetail && selectedService.name === service.name
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
                                onClick={() =>
                                  setOpenDetailInfo(!openDetailInfo)
                                }
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
                                        Nome
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography
                                        sx={{ fontSize: 13, color: "#777" }}
                                      >
                                        Departamento
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography
                                        sx={{ fontSize: 13, color: "#777" }}
                                      >
                                        Valor do Serviço
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography
                                        sx={{ fontSize: 13, color: "#777" }}
                                      >
                                        Tempo de Execução
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>
                                      <Typography sx={{ fontSize: 13 }}>
                                        {service.name}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography sx={{ fontSize: 13 }}>
                                        {service.department.name}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography sx={{ fontSize: 13 }}>
                                        R${service.value}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography sx={{ fontSize: 13 }}>
                                        {service.executionTime === 0.5 &&
                                          "30 min"}
                                        {service.executionTime > 0.5 &&
                                          `${service.executionTime}h`}
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
                                Materiais Necessários
                              </Typography>
                              <IconButton
                                onClick={() =>
                                  setOpenDetailMaterials(!openDetailMaterials)
                                }
                              >
                                <ExpandMoreIcon />
                              </IconButton>
                            </Grid>
                            <Collapse
                              in={openDetailMaterials}
                              timeout="auto"
                              unmountOnExit
                            >
                              {service.materials.length > 0 ? (
                                <>
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell sx={{ width: "350px" }}>
                                          <Typography
                                            sx={{
                                              fontSize: 13,
                                              color: "#777",
                                            }}
                                          >
                                            Nome do Item
                                          </Typography>
                                        </TableCell>
                                        <TableCell sx={{ width: "350px" }}>
                                          <Typography
                                            sx={{
                                              fontSize: 13,
                                              color: "#777",
                                            }}
                                          >
                                            Quantidade
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Typography
                                            sx={{
                                              fontSize: 13,
                                              color: "#777",
                                            }}
                                          >
                                            Valor dos Itens
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {service.materials.map(
                                        (material) =>
                                          material.quantity > 0 && (
                                            <TableRow key={material.id}>
                                              <TableCell
                                                sx={{ width: "350px" }}
                                              >
                                                <Typography
                                                  sx={{ fontSize: 13 }}
                                                >
                                                  {material.name}
                                                </Typography>
                                              </TableCell>

                                              <TableCell
                                                sx={{ width: "350px" }}
                                              >
                                                <Typography
                                                  sx={{ fontSize: 13 }}
                                                >
                                                  {material.quantity}
                                                </Typography>
                                              </TableCell>
                                              <TableCell>
                                                <Typography
                                                  sx={{ fontSize: 13 }}
                                                >
                                                  R$
                                                  {material.sellValue *
                                                    material.quantity}
                                                </Typography>
                                              </TableCell>
                                            </TableRow>
                                          )
                                      )}
                                    </TableBody>
                                  </Table>
                                  <Box sx={{ ml: "760px", mr: -10 }}>
                                    <TableRow>
                                      <TableCell>
                                        <Typography
                                          sx={{
                                            fontSize: 13,
                                            color: "#777",
                                            my: -1,
                                            mb: -2,
                                            mt: 2,
                                          }}
                                        >
                                          Valor Total (serviço + itens)
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>
                                        <Typography
                                          sx={{
                                            my: -1,
                                            color: "#228B22",
                                            fontSize: 13,
                                          }}
                                        >
                                          R${" "}
                                          {(
                                            service.materialsCost +
                                            service.value
                                          ).toFixed(2)}
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  </Box>
                                </>
                              ) : (
                                <Typography sx={{ mt: 1, fontSize: 13 }}>
                                  Não há uso de Materiais
                                </Typography>
                              )}
                            </Collapse>

                            <Box sx={{ mt: 3, ml: "90%" }}>
                              <ModeEditIcon
                                cursor="pointer"
                                onClick={() => handleOpenEdit(service)}
                                sx={{ color: "grey", mr: 2 }}
                              />
                              <DeleteIcon
                                cursor="pointer"
                                onClick={() => handleConfirmDelete(service)}
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
        {openDialog && (
          <Dialog open={openDialog} onClose={() => setOpenDialog(!openDialog)}>
            <GenericDeleteForm
              selectedItem={selectedItem}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              toast={toast}
              endpoint="services"
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              successMessage={`${
                selectedItem.name && selectedItem.name
              } Deletado com Sucesso`}
            />
          </Dialog>
        )}
      </Box>
    </>
  );
}
