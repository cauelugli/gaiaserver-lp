/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import dayjs from "dayjs";
import { useAppData } from "../../AppDataContext";
import { Avatar, Grid, Tooltip, Typography, Box } from "@mui/material";
import { icons } from "../../../src/icons";

const AgendaEventChip = (props) => {
  const appData = useAppData();
  const idIndexList = appData.idIndexList;
  const [hovered, setHovered] = useState(false);

  const statusColors = [
    { key: "Resolvido", value: "#bbffbb" }, // green
    // { key: "Deleção", value: "#ffbbbb" }, // red
    // { key: "Edição", value: "#bbffff" }, // blue
    { key: "Arquivado", value: "#dbdbdb" }, // lightgrey
    { key: "Aberto", value: "#ffffff" }, // white
  ];

  const findTypeColor = (status) => {
    const translated = statusColors.find((item) => item.key === status);
    const defaultColor = translated ? translated.value : "#f5f5f5";

    // Verifica se o item está atrasado
    const scheduleTime = props.item.scheduleTime;
    if (scheduleTime) {
      const [startTime] = scheduleTime.split(" ~ "); // Pega apenas a hora inicial
      const scheduledHour = parseInt(startTime.split(":")[0], 10);
      const scheduledMinute = parseInt(startTime.split(":")[1], 10);

      const now = dayjs();
      const scheduledTime = dayjs()
        .set("hour", scheduledHour)
        .set("minute", scheduledMinute);

      if (now.isAfter(scheduledTime)) {
        return "#ffbbbb"; // Aplica a cor vermelha se o item estiver atrasado
      }
    }

    return defaultColor;
  };

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{
        position: "relative",
        width: "95%",
        border: "1px solid #c5c5cc",
        borderRadius: 3,
        p: 1,
        mx: "auto",
        mt: 1,
        backgroundColor: hovered ? "#f0f0f0" : findTypeColor(props.item.status),
        cursor: hovered ? "pointer" : "default",
      }}
      gap={2}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Tooltip
        title={
          idIndexList.find((item) => item.id === props.item.customer)?.name ||
          ""
        }
      >
        <Avatar
          src={`http://localhost:3000/static/${
            idIndexList.find((item) => item.id === props.item.customer)
              ?.image || ""
          }`}
          sx={{ width: 16, height: 16, mr: 1 }}
        />
      </Tooltip>
      <Tooltip
        title={
          idIndexList.find((item) => item.id === props.item.service)?.name || ""
        }
      >
        <Typography
          sx={{
            fontSize: 11,
            color: "black",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 100,
          }}
        >
          {idIndexList.find((item) => item.id === props.item.service)?.name ||
            ""}
        </Typography>
      </Tooltip>
      <Typography sx={{ fontSize: 11, color: "black" }}>
        {props.item.scheduleTime}
      </Typography>
      {hovered && (
        <Box
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            padding: "2px",
          }}
        >
          <icons.MoreVertIcon sx={{ fontSize: 16 }} />
        </Box>
      )}
    </Grid>
  );
};

export default AgendaEventChip;
