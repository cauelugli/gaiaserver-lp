/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

import { useAppData } from "../../AppDataContext";

import { Avatar, Grid, Tooltip, Typography } from "@mui/material";

const AgendaEventChip = (props) => {
  const appData = useAppData();
  const idIndexList = appData.idIndexList;

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: "95%",
        border: "1px solid #c5c5cc",
        borderRadius: 3,
        p: 1,
        mx: "auto",
        mt: 1,
      }}
      gap={2}
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
    </Grid>
  );
};

export default AgendaEventChip;
