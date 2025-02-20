/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import dayjs from "dayjs";
import { useAppData } from "../../AppDataContext";
import { Avatar, Grid2, Tooltip, Typography, Box } from "@mui/material";
import { icons } from "../../../src/icons";

const AgendaEventChip = (props) => {
  const { item } = props;
  const appData = useAppData();
  const idIndexList = appData.idIndexList;
  const [hovered, setHovered] = useState(false);

  const renderItem = (detail, typeColor) => {
    return (
      <Grid2
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
          backgroundColor: typeColor,
          cursor: hovered ? "pointer" : "default",
        }}
        gap={2}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Tooltip
          title={
            idIndexList.find((customer) => customer.id === detail.customer)
              ?.name || ""
          }
        >
          <Avatar
            src={`http://localhost:3000/static/${
              idIndexList.find((customer) => customer.id === detail.customer)
                ?.image || ""
            }`}
            sx={{ width: 16, height: 16, mr: 1 }}
          />
        </Tooltip>
        <Tooltip
          title={
            idIndexList.find((service) => service.id === detail.service)
              ?.name || ""
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
            {idIndexList.find((service) => service.id === detail.service)
              ?.name || ""}
          </Typography>
        </Tooltip>
        <Typography sx={{ fontSize: 11, color: "black" }}>
          {detail.scheduleTime}
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
      </Grid2>
    );
  };

  return (
    <>
      {item.details &&
        renderItem(item.details, item.type === "job" ? "#ffbbbb" : "#bbffff")}
    </>
  );
};

export default AgendaEventChip;
