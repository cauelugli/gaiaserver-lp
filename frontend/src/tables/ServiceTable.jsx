/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";

import {
  Box,
  Collapse,
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

import EditServiceForm from "../forms/edit/EditServiceForm";
import DeleteServiceForm from "../forms/delete/DeleteServiceForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function ServiceTable() {
  const [selectedService, setSelectedService] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);

  const [services, setServices] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [stockItems, setStockItems] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const services = await api.get("/services");
        const departments = await api.get("/departments");
        const stockItems = await api.get("/stockItems");
        setServices(services.data);
        setDepartments(departments.data);
        setStockItems(stockItems.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [services]);

  const fetchData = async () => {
    try {
      const services = await api.get("/services");
      const departments = await api.get("/departments");
      const stockItems = await api.get("/stockItems");
      setServices(services.data);
      setDepartments(departments.data);
      setStockItems(stockItems.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenDetail = (service) => {
    setOpenDetail(!openDetail);
    setSelectedService(service);
  };

  const handleOpenEdit = (service) => {
    setOpenEdit(!openEdit);
    setSelectedService(service);
  };

  const handleConfirmDelete = (service) => {
    setOpenDelete(!openDelete);
    setSelectedService(service);
  };

  return (
    <>
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: "100%" }}>
            <TableBody>
              <TableRow
                sx={{
                  backgroundColor: "#ccc",
                }}
              >
                <TableCell align="left">
                  <Typography>Nome do Serviço</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography>Departamento</Typography>
                </TableCell>
              </TableRow>
              {services.map((service) => (
                <>
                  <TableRow
                    key={service._id}
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedService.name === service.name && openDetail
                          ? "#95dd95"
                          : "none",
                      "&:hover": { backgroundColor: "#ccc " },
                    }}
                  >
                    <TableCell
                      onClick={() => handleOpenDetail(service)}
                      cursor="pointer"
                      align="left"
                    >
                      <Typography>{service.name}</Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(service)}
                      cursor="pointer"
                      align="left"
                    >
                      <Typography>{service.department ? service.department.name : "-"}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={openDetail && selectedService.name === service.name}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ my: 4, px: 6 }}>
                          <Typography variant="h6" component="div">
                            Informações do Serviço
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Nome
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Departamento
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Valor
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  <Typography>{service.name}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {service.department
                                      ? service.department.name
                                      : "-"}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>R${service.value}</Typography>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                        <Box sx={{ my: 4, px: 6 }}>
                          <Typography variant="h6" component="div">
                            Materiais Utilizados
                          </Typography>
                          <Table size="small">
                            <TableBody>
                              <TableRow>
                                {service.materials.length > 0 ? (
                                  <ol>
                                    {service.materials.map(
                                      (material) =>
                                        material.quantity > 0 && (
                                          <li key={material.id}>
                                            {material.name} - x
                                            {material.quantity}
                                          </li>
                                        )
                                    )}
                                    <Typography sx={{ mt: 1 }}>
                                      Total de Materiais: R$
                                      {service.materialsCost.toFixed(2)}
                                    </Typography>
                                  </ol>
                                ) : (
                                  <Typography sx={{ mt: 1 }}>
                                    Não há uso de Materiais
                                  </Typography>
                                )}
                              </TableRow>
                            </TableBody>
                          </Table>
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
            <EditServiceForm
              openEdit={openEdit}
              selectedService={selectedService}
              previousMaterials={selectedService.materials}
              departments={departments}
              stockItems={stockItems}
              setOpenEdit={setOpenEdit}
              fetchData={fetchData}
            />
          </Dialog>
        )}
        {openDelete && (
          <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
            <DeleteServiceForm
              selectedService={selectedService}
              openDelete={openDelete}
              setOpenDelete={setOpenDelete}
              fetchData={fetchData}
            />
          </Dialog>
        )}
      </Box>
    </>
  );
}
