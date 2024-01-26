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
  const fakeColors = ["#ff5555", "#0055ff"];

  return (
    // <TestComponent />
    <ProjectStageTasks
      stages={fakelist}
      members={Array.from(user)}
      definedStagesColors={fakeColors}
    />
    // <>
    //   <TestWebSocketButton />
    //   <p>Dashboard</p>
    //   <Typography sx={{ my: 3 }}>
    //     Hellow, <strong>{user.name}</strong> !
    //   </Typography>
    // </>
  );
};

export default Dashboard;
