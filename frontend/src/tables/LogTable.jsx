/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import {
  TableRow,
  TableCell,
  Typography,
  InputLabel,
  Grid,
} from "@mui/material";
import { isId } from "../../../controllers/functions/overallFunctions";

function LogTable(props) {
  return (
    <>
      <TableRow>
        <TableCell align="left" sx={{ mr: 1 }}>
          <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
            Colaborador
          </Typography>
        </TableCell>
        <TableCell align="left" sx={{ mr: 1 }}>
          <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
            Modelo
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
            Payload
          </Typography>
        </TableCell>
      </TableRow>
      {props.items.map((row, rowIndex) => (
        <TableRow key={rowIndex}>
          <TableCell align="left" sx={{ mr: 1 }}>
            <Typography sx={{ fontSize: 12 }}>
              {props.idIndexList.find((item) => item.id === row.source)?.name ||
                "??? ou Admin"}
            </Typography>
          </TableCell>
          <TableCell align="left" sx={{ mr: 1 }}>
            <Typography sx={{ fontSize: 12 }}>{row.label}</Typography>
          </TableCell>
          <TableCell align="left">
            <Grid container direction="row">
              {Object.entries(row.target)
                .filter(
                  ([key]) =>
                    ![
                      "_id",
                      "__v",
                      "password",
                      "attachments",
                      "interactions",
                    ].includes(key)
                )
                .map(([key, value], index) => (
                  <Grid item key={index} sx={{ mr: 0.5 }}>
                    <InputLabel sx={{ fontSize: 12 }}>{key}</InputLabel>
                    <Typography sx={{ fontSize: 12 }}>
                      {value ? (isId(value) ? value.name : value) : "-"}
                    </Typography>
                  </Grid>
                ))}
            </Grid>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default LogTable;
