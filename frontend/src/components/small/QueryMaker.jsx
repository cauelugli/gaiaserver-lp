/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid2, MenuItem, Select, Typography } from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const QueryMaker = () => {
  return "toDo";
};

// const QueryMaker = () => {
//   const [jobs, setJobs] = useState([]);
//   const [sales, setSales] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [clients, setClients] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [managers, setManagers] = useState([]);
//   const [services, setServices] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [groups, setGroups] = useState([]);

//   const [firstOption, setFirstOption] = useState("");
//   const [secondOptionList, setSecondOptionList] = useState([]);
//   const [secondOption, setSecondOption] = useState("");
//   const [thirdOptionList, setThirdOptionList] = useState([]);
//   const [thirdOption, setThirdOption] = useState("");

//   const handleSelectedFirstOption = (e) => {
//     const value = e.target.value;
//     setFirstOption(value);
//     setSecondOption("");

//     setThirdOption("");
//     setThirdOptionList([]);

//     switch (value) {
//       case "user":
//         setSecondOptionList(users);
//         break;
//       case "manager":
//         setSecondOptionList(managers);
//         break;
//       case "customer":
//         setSecondOptionList(customers);
//         break;
//       case "group":
//         setSecondOptionList(groups);
//         break;
//       case "client":
//         setSecondOptionList(clients);
//         break;
//       case "department":
//         setSecondOptionList(departments);
//         break;
//       case "services":
//         setSecondOptionList(services);
//         break;
//       case "job":
//         setSecondOptionList(jobs);
//         break;
//       case "sale":
//         setSecondOptionList(sales);
//         break;
//       default:
//         setSecondOptionList([]);
//     }
//   };

//   const handleSelectedSecondOption = (e) => {
//     setThirdOption("");
//     setSecondOption(e.target.value);
//     setThirdOptionList;
//   };

//   return (
//     <>
//       <Grid2
//         container
//         direction="row"
//         alignItems="center"
//         justifyContent="flex-start"
//       >
//         <Typography>Buscar por</Typography>
//         <Grid2 item sx={{ mx: 2 }}>
//           <Select
//             size="small"
//             value={firstOption}
//             onChange={(e) => handleSelectedFirstOption(e)}
//           >
//             <MenuItem value={"customer"}>Cliente Empresa</MenuItem>
//             <MenuItem value={"client"}>Cliente Pessoa Física</MenuItem>
//             <MenuItem value={"department"}>Departamento</MenuItem>
//             <MenuItem value={"manager"}>Gerente</MenuItem>
//             <MenuItem value={"group"}>Grupo</MenuItem>
//             <MenuItem value={"job"}>Job</MenuItem>
//             <MenuItem value={"service"}>Serviço</MenuItem>
//             <MenuItem value={"user"}>Usuário</MenuItem>
//             <MenuItem value={"sale"}>Venda</MenuItem>
//           </Select>
//         </Grid2>
//         {firstOption && (
//           <>
//             <Typography sx={{ mx: 1 }}>selecionar</Typography>
//             <Grid2 item sx={{ mx: 2 }}>
//               <Select
//                 size="small"
//                 value={secondOption}
//                 onChange={(e) => handleSelectedSecondOption(e)}
//               >
//                 {secondOptionList.map((item) => (
//                   <MenuItem key value={item}>
//                     {item.name || item.title}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </Grid2>
//           </>
//         )}
//       </Grid2>
//     </>
//   );
// };

export default QueryMaker;
