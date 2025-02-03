/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import dayjs from "dayjs";

import {
  TableRow,
  TableCell,
  Typography,
  InputLabel,
  Grid,
  Avatar,
} from "@mui/material";

import { isId } from "../../../controllers/functions/overallFunctions";

function LogTable(props) {
  const translatedLogTypes = [
    { key: "add", value: "Adição" },
    { key: "delete", value: "Deleção" },
    { key: "deleteMultiple", value: "Deleção Múltipla" },
    { key: "edit", value: "Edição" },
    { key: "archive", value: "Arquivamento" },
    { key: "unarchive", value: "Desarquivamento" },
    { key: "interaction", value: "Interação" },
    { key: "challengeRequest", value: "Contestação" },
    { key: "resolve", value: "Resolução" },
    { key: "requestBuy", value: "Resquisição de Compra" },
    { key: "requestApproval", value: "Resquisição de Aprovação" },
  ];

  const typeColors = [
    { key: "Adição", value: "#66ff66" }, // green
    { key: "Deleção", value: "#ff6666" }, // red
    { key: "Deleção Múltipla", value: "#ff6666" }, // red
    { key: "Edição", value: "#66ffff" }, // blue
    { key: "Arquivamento", value: "#d9d9d9" }, // lightgrey
    { key: "Desarquivamento", value: "#66ff66" }, // green
    { key: "Interação", value: "#ffffff" }, // white
    { key: "Contestação", value: "#ffffff" }, // white
    { key: "Resolução", value: "#66ff66" }, // green
    { key: "Resquisição de Compra", value: "#ffffff" }, // white
    { key: "Resquisição de Aprovação", value: "#ffffff" }, // white
  ];

  const translateLogType = (logType) => {
    const translated = translatedLogTypes.find((item) => item.key === logType);
    return translated ? translated.value : logType;
  };

  const findTypeColor = (logType) => {
    const translated = typeColors.find((item) => item.key === String(logType));
    return translated ? translated.value : "#f5f5f5";
  };

  return (
    <>
      <TableRow sx={{ m: 0 }}>
        <TableCell align="left" sx={{ mr: 1 }}>
          <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
            Data
          </Typography>
        </TableCell>
        <TableCell align="left" sx={{ mr: 1 }}>
          <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
            Tipo
          </Typography>
        </TableCell>
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
        <TableCell align="left" sx={{ width: "65vw" }}>
          <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
            Item / Alteração
          </Typography>
        </TableCell>
      </TableRow>
      {props.items.map((row, rowIndex) => (
        <TableRow
          key={rowIndex}
          sx={{
            m: 0,
            backgroundColor: findTypeColor(row.type) || "white",
          }}
        >
          <TableCell align="left" sx={{ mr: 1 }}>
            <Typography sx={{ fontSize: 12 }}>
              {dayjs(row.createdAt).format("DD/MM/YYYY HH:mm:ss")}
            </Typography>
          </TableCell>
          <TableCell align="left" sx={{ mr: 1 }}>
            <Typography sx={{ fontSize: 12 }}>
              {translateLogType(row.type) || ""}
            </Typography>
          </TableCell>
          <TableCell align="left" sx={{ mr: 1 }}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Avatar
                  sx={{ width: 24, height: 24 }}
                  src={`http://localhost:3000/static/${
                    props.idIndexList.find((item) => item.id === row.source)
                      ?.image || ""
                  }`}
                />
              </Grid>
              <Grid item>
                <Typography sx={{ fontSize: 12 }}>
                  {props.idIndexList.find((item) => item.id === row.source)
                    ?.name || "Admin"}
                </Typography>
              </Grid>
            </Grid>
          </TableCell>

          <TableCell align="left" sx={{ mr: 1 }}>
            <Typography sx={{ fontSize: 12 }}>{row.label}</Typography>
          </TableCell>
          <TableCell align="left">
            {/* <Grid container direction="row">
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
            </Grid> */}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default LogTable;
