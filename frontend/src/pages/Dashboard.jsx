/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { Typography } from "@mui/material";
import TestWebSocketButton from "../components/small/buttons/TestWebsocketButton";
import ProjectStageTasks from "../components/small/ProjectStageTasks";
import TestComponent from "../components/small/TestComponent";

const Dashboard = ({ user }) => {
  const fakelist = [
    { title: "Etapa Alpha", startAt: "", dueTo: "" },
    { title: "Etapa Beta", startAt: "", dueTo: "" },
    { title: "Etapa Gamma", startAt: "", dueTo: "" },
    { title: "Etapa Delta", startAt: "", dueTo: "" },
  ];
  return (
    // <TestComponent />
    <ProjectStageTasks stages={fakelist} members={Array.from(user)}/>
    // <>
    //   <TestWebSocketButton />
    //   <p>Dashboard</p>
    //   <Typography sx={{ my: 3 }}>
    //     Hellow, <strong>{user.name}</strong> !
    //   </Typography>
    //   <Typography sx={{ my: 1 }}>
    //     Departamento: {user.department ? user.department.name : "-"}
    //   </Typography>
    //   <Typography sx={{ my: 1 }}>
    //     Acesso: {user.role ? user.role.name : "-"}
    //   </Typography>
    //   <Typography sx={{ my: 1 }}>
    //     Cargo: {user.position ? user.position : "-"}
    //   </Typography>
    //   <Typography sx={{ my: 1 }}>Usuário: {user.username}</Typography>

    //   <img
    //     src={`http://localhost:3000/static${user.image}`}
    //     alt="Logo do Tenant"
    //     style={{
    //       width: "8%",
    //       marginTop: 2,
    //       marginBottom: 2,
    //       cursor: "pointer",
    //     }}
    //   />
    // </>
  );
};

export default Dashboard;
