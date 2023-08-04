import * as React from "react";
import axios from "axios";

import {
  Button,
  Dialog,
  DialogTitle,
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

// import DeleteIcon from "@mui/icons-material/Delete";
// import ModeEditIcon from "@mui/icons-material/ModeEdit";
// import DeleteCustomerForm from "../forms/DeleteCustomerForm";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AddCustomerForm from "../forms/AddCustomerForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function DepartmentTable() {
  const [openAdd, setOpenAdd] = React.useState(false);
  // const [openEdit, setOpenEdit] = React.useState(false);
  // const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);

  const [departments, setDepartments] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/departments");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // const handleEdit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await api.put("/customers", {
  //       customer: "selectedCustomer._id",
  //       name,
  //       address,
  //       phone,
  //       mainContactName,
  //       mainContactEmail,
  //       mainContactPosition,
  //       segment,
  //       domain,
  //       employees,
  //       website,
  //       cnpj,
  //     });
  //     res.data && alert("Editado com sucesso!");
  //     setOpenEdit(!openEdit);
  //   } catch (err) {
  //     alert("Vish, editei não...");
  //     console.log(err);
  //   }
  // };

  // const handleConfirmDelete = (customer) => {
  //   setOpenDelete(!openDelete);
  //   setSelectedCustomer(customer);
  // };

  // const handleDelete = async (selectedCustomer) => {
  //   try {
  //     const res = await api.delete(`/customers/${selectedCustomer._id}`);
  //     res.status === 200 && alert("Cliente deletado com sucesso!");
  //     setOpenDelete(!openDelete);
  //   } catch (err) {
  //     alert("Vish, deletou não..");
  //     console.log(err);
  //   }
  // };

  return (
    <>
      <Button onClick={() => setOpenAdd(true)}>
        <Typography variant="h6" color="#eee">
          + Novo
        </Typography>
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ height: "7vw" }}>
            <TableRow>
              <TableCell>Nome</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((department) => (
              <TableRow
                key={department._id}
                sx={{ height: "7vw", "&:hover": { backgroundColor: "#ccc " } }}
              >
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpenDetail(!openDetail, "department")}
                >
                  {openDetail ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </IconButton>
                <TableCell cursor="pointer" align="left">
                  {department.name}
                </TableCell>

                {/* <DeleteIcon
                    cursor="pointer"
                    option="delete"
                    onClick={() => handleConfirmDelete(customer)}
                    sx={{ color: "#ff4444" }}
                  /> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {openDetail && (
        <Dialog open={openDetail} onClose={() => setOpenDetail(!openDetail)}>
          {/* <form onSubmit={handleEdit}>edit me</form> */}
          Detalhes do department=department
        </Dialog>
      )}
      {openAdd && (
        <Dialog open={openAdd} onClose={() => setOpenAdd(!openAdd)}>
          <DialogTitle>Novo Departmento - {"selectedCustomer.name"}</DialogTitle>
          {/* <AddCustomerForm /> */}
        </Dialog>
      )}
      {/* {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
          <DialogTitle>{`Deletar Cliete ${selectedCustomer.name} ?`}</DialogTitle>
          <DeleteCustomerForm selectedCustomer={selectedCustomer} />
        </Dialog>
      )} */}
    </>
  );
}
