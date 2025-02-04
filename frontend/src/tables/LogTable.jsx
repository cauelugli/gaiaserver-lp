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
  Button,
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
    { key: "Adição", value: "#bbffbb" }, // green
    { key: "Deleção", value: "#ffbbbb" }, // red
    { key: "Deleção Múltipla", value: "#ffbbbb" }, // red
    { key: "Edição", value: "#bbffff" }, // blue
    { key: "Arquivamento", value: "#dbdbdb" }, // lightgrey
    { key: "Desarquivamento", value: "#bbffbb" }, // green
    { key: "Interação", value: "#ffffff" }, // white
    { key: "Contestação", value: "#ffffff" }, // white
    { key: "Resolução", value: "#bbffbb" }, // green
    { key: "Resquisição de Compra", value: "#ffffff" }, // white
    { key: "Resquisição de Aprovação", value: "#ffffff" }, // white
  ];

  const translatedKeys = [
    { key: "customer", value: "Cliente" },
    { key: "worker", value: "Designado" },
    { key: "service", value: "Serviço" },
    { key: "scheduledTo", value: "Data Agendada" },
    { key: "description", value: "Descrição" },
    { key: "createdBy", value: "Criado por" },
  ];

  const translateLogType = (logType) => {
    const translated = translatedLogTypes.find((item) => item.key === logType);
    return translated ? translated.value : logType;
  };

  const findTypeColor = (logType) => {
    const translated = typeColors.find((item) => item.key === String(logType));
    return translated ? translated.value : "#f5f5f5";
  };

  const translateKeys = (key) => {
    if (key === "number") {
      return "#";
    }
    const translated = translatedKeys.find((item) => item.key === String(key));
    return translated ? translated.value : "";
  };

  return (
    <>
      <TableRow sx={{ m: 0 }}>
        <TableCell align="left" sx={{ mr: 1 }}>
          <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
            Data &uarr;
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
            <Typography sx={{ fontSize: 12 }}>
              {row.targetModel || row.label}
            </Typography>
          </TableCell>
          <TableCell align="left">
            <Grid container direction="row">
              {row.target ? (
                Array.isArray(row.target) && row.type === "Deleção Múltipla" ? (
                  row.target.map((item, index) => (
                    <Grid item key={index} sx={{ mr: 0.5, width: 200 }}>
                      <InputLabel sx={{ fontSize: 12 }}>
                        Item {index + 1}:
                      </InputLabel>
                      <Typography sx={{ fontSize: 12 }}>{item.name}</Typography>
                    </Grid>
                  ))
                ) : Array.isArray(row.target) ? (
                  row.target.map((change, index) => (
                    <Grid item key={index} sx={{ mr: 0.5, width: 200 }}>
                      <InputLabel sx={{ fontSize: 12 }}>
                        {translateKeys(change.field)}
                      </InputLabel>
                      <Typography sx={{ fontSize: 12 }}>
                        <b>Antes:</b>{" "}
                        {isId(change.oldValue)
                          ? props.idIndexList.find(
                              (item) => item.id === change.oldValue
                            )?.name || change.oldValue
                          : change.oldValue}
                      </Typography>
                      <Typography sx={{ fontSize: 12 }}>
                        <b>Depois:</b>{" "}
                        {isId(change.newValue)
                          ? props.idIndexList.find(
                              (item) => item.id === change.newValue
                            )?.name || change.newValue
                          : change.newValue}
                      </Typography>
                    </Grid>
                  ))
                ) : typeof row.target === "string" ? (
                  <Grid item sx={{ mr: 0.5, width: 200 }}>
                    <InputLabel sx={{ fontSize: 12 }}>Nome</InputLabel>
                    <Typography sx={{ fontSize: 12 }}>
                      {props.idIndexList.find((item) => item.id === row.target)
                        ?.name || row.target}
                    </Typography>
                  </Grid>
                ) : typeof row.target === "number" ? (
                  <Grid item sx={{ mr: 0.5, width: 200 }}>
                    <InputLabel sx={{ fontSize: 12 }}>#</InputLabel>
                    <Typography sx={{ fontSize: 12 }}>{row.target}</Typography>
                  </Grid>
                ) : (
                  Object.entries(row.target)
                    .filter(([key]) => !["_id", "__v"].includes(key))
                    .map(([key, value], index) => (
                      <Grid
                        item
                        key={index}
                        sx={{
                          mr: 0.5,
                          width: index === 0 && key === "number" ? 50 : 200,
                        }}
                      >
                        <InputLabel sx={{ fontSize: 12 }}>
                          {translateKeys(key)}
                        </InputLabel>
                        <Typography sx={{ fontSize: 12 }}>
                          {isId(value)
                            ? props.idIndexList.find(
                                (item) => item.id === value
                              )?.name || ""
                            : value}
                        </Typography>
                      </Grid>
                    ))
                )
              ) : (
                <Typography sx={{ fontSize: 12, fontStyle: "italic" }}>
                  Nenhum dado disponível
                </Typography>
              )}
            </Grid>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default LogTable;
