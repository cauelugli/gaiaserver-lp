/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
// import axios from "axios";

// import {
//   Box,
//   Collapse,
//   IconButton,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";

// import DeleteIcon from "@mui/icons-material/Delete";
// import ModeEditIcon from "@mui/icons-material/ModeEdit";

// const api = axios.create({
//   baseURL: "http://localhost:3000/api",
// });

export default function AdminTable(
  // { selectedCustomer }
  ) {
  // const [selectedUser, setSelectedUser] = React.useState("");
  // const [openDetail, setOpenDetail] = React.useState(false);

  // const [users, setUsers] = React.useState([]);

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await api.get("/users");
  //       const filteredUsers = response.data.filter(
  //         (user) => user.customerId === selectedCustomer._id
  //       );
  //       const filteredAdmins = filteredUsers.filter(
  //         (user) => user.position === "Proprietário"
  //       );
  //       setUsers(filteredAdmins);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchData();
  // }, [selectedCustomer._id, users]);

  // const handleOpenDetail = (user) => {
  //   setOpenDetail(!openDetail);
  //   setSelectedUser(user);
  // };

  // const handleOpenEdit = () => {
  //   alert("Não é possível editar proprietários!!");
  // };

  // const handleConfirmDelete = () => {
  //   alert("Não é possível deletar proprietários!!");
  // };

  return (
    <p>Coming Soon</p>
    // <Box>
    //   <TableContainer component={Paper}>
    //     <Table sx={{ minWidth: "100%" }}>
    //       <TableBody>
    //         {users.map((user) => (
    //           <>
    //             <TableRow
    //               key={user._id}
    //               sx={{
    //                 height: "4vw",
    //                 cursor: "pointer",
    //                 backgroundColor:
    //                   selectedUser.name === user.name && openDetail
    //                     ? "#eee"
    //                     : "none",
    //                 "&:hover": { backgroundColor: "#ccc " },
    //               }}
    //             >
    //               
    //               <TableCell
    //                 onClick={() => handleOpenDetail(user)}
    //                 cursor="pointer"
    //                 align="left"
    //               >
    //                 {user.name}
    //               </TableCell>
    //             </TableRow>
    //             <TableRow>
    //               <TableCell
    //                 style={{ paddingBottom: 0, paddingTop: 0 }}
    //                 colSpan={6}
    //               >
    //                 <Collapse
    //                   in={openDetail && selectedUser.name === user.name}
    //                   timeout="auto"
    //                   unmountOnExit
    //                 >
    //                   <Box sx={{ m: 1, p: 4 }}>
    //                     <Typography variant="h6" gutterBottom component="div">
    //                       Detalhes
    //                     </Typography>
    //                     <Table size="small">
    //                       <TableHead>
    //                         <TableRow>
    //                           <TableCell>Nome</TableCell>
    //                           <TableCell>Telefone</TableCell>
    //                           <TableCell>Departamento</TableCell>
    //                           <TableCell>Gerente</TableCell>
    //                         </TableRow>
    //                       </TableHead>
    //                       <TableBody>
    //                         <TableRow>
    //                           <TableCell component="th" scope="row">
    //                             {user.name}
    //                           </TableCell>
    //                           <TableCell>{user.phone}</TableCell>
    //                           <TableCell>
    //                             {user.department ? user.department.name : "N/A"}
    //                           </TableCell>
    //                           <TableCell>
    //                             {user.manager ? user.manager.name : "N/A"}
    //                           </TableCell>
    //                         </TableRow>
    //                       </TableBody>
    //                     </Table>
    //                     <Box sx={{ mt: 3, ml: "90%" }}>
    //                       <ModeEditIcon
    //                         cursor="pointer"
    //                         onClick={() => handleOpenEdit(user)}
    //                         sx={{ color: "grey", mr: 2 }}
    //                       />
    //                       <DeleteIcon
    //                         cursor="pointer"
    //                         onClick={() => handleConfirmDelete(user)}
    //                         sx={{ color: "#ff4444" }}
    //                       />
    //                     </Box>
    //                   </Box>
    //                 </Collapse>
    //               </TableCell>
    //             </TableRow>
    //           </>
    //         ))}
    //       </TableBody>
    //     </Table>
    //   </TableContainer>
    // </Box>
  );
}
