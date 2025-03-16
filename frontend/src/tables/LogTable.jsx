/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import dayjs from "dayjs";

import {
  TableRow,
  TableCell,
  Typography,
  InputLabel,
  Grid2,
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
    { key: "approveRequest", value: "Aprovação de Requisição" },
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
    { key: "Aprovação de Requisição", value: "#bbffff" }, // blue
  ];

  const translatedKeys = [
    { key: "name", value: "Nome" },
    { key: "customer", value: "Cliente" },
    { key: "worker", value: "Designado" },
    { key: "service", value: "Serviço" },
    { key: "scheduledTo", value: "Data Agendada" },
    { key: "description", value: "Descrição" },
    { key: "createdBy", value: "Criado por" },
    { key: "title", value: "Título" },
    { key: "position", value: "Cargo" },
    { key: "department", value: "Departamento" },
    { key: "resolution", value: "Resolução" },
    { key: "products", value: "Produtos" },
    { key: "buyValue", value: "Valor de Compra" },
    { key: "fields", value: "Campos" },
    { key: "sellValue", value: "Valor de Venda" },
    { key: "type", value: "Tipo" },
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
        <TableCell align="left" sx={{ mr: 2 }}>
          <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
            Data &uarr;
          </Typography>
        </TableCell>
        <TableCell align="left" sx={{ mr: 2 }}>
          <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
            Tipo
          </Typography>
        </TableCell>
        <TableCell align="left" sx={{ mr: 2 }}>
          <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
            Colaborador
          </Typography>
        </TableCell>
        <TableCell align="left" sx={{ mr: 2 }}>
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
          <TableCell align="left" sx={{ mr: 2 }}>
            <Typography sx={{ fontSize: 12 }}>
              {dayjs(row.createdAt).format("DD/MM/YYYY HH:mm:ss")}
            </Typography>
          </TableCell>
          <TableCell align="left" sx={{ mr: 2 }}>
            <Typography sx={{ fontSize: 12 }}>
              {translateLogType(row.type) || ""}
            </Typography>
          </TableCell>
          <TableCell align="left" sx={{ mr: 2 }}>
            <Grid2 container alignItems="center" spacing={1}>
              <Grid2 item>
                <Avatar
                  sx={{ width: 24, height: 24 }}
                  src={`http://localhost:3000/static/${
                    props.idIndexList.find((item) => item.id === row.source)
                      ?.image || ""
                  }`}
                />
              </Grid2>
              <Grid2 item>
                <Typography sx={{ fontSize: 12 }}>
                  {props.idIndexList.find((item) => item.id === row.source)
                    ?.name || "Admin"}
                </Typography>
              </Grid2>
            </Grid2>
          </TableCell>
          <TableCell align="left" sx={{ mr: 2 }}>
            <Typography sx={{ fontSize: 12 }}>
              {row.targetModel || row.label}
            </Typography>
          </TableCell>

          <TableCell align="left">
            <Grid2 container direction="row">
              {row.target ? (
                Array.isArray(row.target) && row.type === "Deleção Múltipla" ? (
                  row.target.map((item, index) => (
                    <Grid2 item key={index} sx={{ mr: 0.5, width: 200 }}>
                      <InputLabel sx={{ fontSize: 12 }}>
                        Item {index + 1}:
                      </InputLabel>
                      <Typography sx={{ fontSize: 12 }}>{item.name}</Typography>
                    </Grid2>
                  ))
                ) : Array.isArray(row.target) ? (
                  row.target.map((change, index) => (
                    <Grid2 item key={index} sx={{ mr: 0.5, width: 200 }}>
                      <InputLabel sx={{ fontSize: 12 }}>
                        {translateKeys(change.field) || change.field}
                      </InputLabel>
                      {change.field === "products" ? (
                        // Renderização específica para "products"
                        <Grid2 container spacing={1}>
                          <Grid2 item xs={12}>
                            <b>Antes:</b>{" "}
                            {Array.isArray(change.oldValue)
                              ? change.oldValue.map((item, idx) => {
                                  // Filtra as keys que não devem ser exibidas
                                  const filteredItem = Object.keys(item).reduce(
                                    (acc, key) => {
                                      if (
                                        ![
                                          "createdAt",
                                          "createdBy",
                                          "__v",
                                          "_id",
                                          "count",
                                          "stockQuantity",
                                        ].includes(key)
                                      ) {
                                        acc[key] = item[key];
                                      }
                                      return acc;
                                    },
                                    {}
                                  );

                                  return (
                                    <div
                                      key={idx}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                      }}
                                    >
                                      {/* Exibe o Avatar se houver imagens */}
                                      {filteredItem.images &&
                                        filteredItem.images.length > 0 && (
                                          <Avatar
                                            sx={{ width: 24, height: 24 }}
                                            src={`http://localhost:3000/static/${filteredItem.images[0]}`}
                                          />
                                        )}
                                      {/* Exibe as demais informações */}
                                      <div>
                                        {Object.entries(filteredItem).map(
                                          ([key, value]) => {
                                            if (key === "images") return null; // Ignora a key "images" pois já foi tratada
                                            return (
                                              <div key={key}>
                                                <b>{translateKeys(key)}:</b>{" "}
                                                {isId(value)
                                                  ? props.idIndexList.find(
                                                      (i) => i.id === value
                                                    )?.name || value
                                                  : JSON.stringify(value)}
                                              </div>
                                            );
                                          }
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              : isId(change.oldValue)
                              ? props.idIndexList.find(
                                  (item) => item.id === change.oldValue
                                )?.name || change.oldValue
                              : change.oldValue}
                          </Grid2>
                          <Grid2 item xs={12}>
                            <b>Depois:</b>{" "}
                            {Array.isArray(change.newValue)
                              ? change.newValue.map((item, idx) => {
                                  // Filtra as keys que não devem ser exibidas
                                  const filteredItem = Object.keys(item).reduce(
                                    (acc, key) => {
                                      if (
                                        ![
                                          "createdAt",
                                          "createdBy",
                                          "__v",
                                          "_id",
                                          "count",
                                          "stockQuantity",
                                        ].includes(key)
                                      ) {
                                        acc[key] = item[key];
                                      }
                                      return acc;
                                    },
                                    {}
                                  );

                                  return (
                                    <div
                                      key={idx}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                      }}
                                    >
                                      {/* Exibe o Avatar se houver imagens */}
                                      {filteredItem.images &&
                                        filteredItem.images.length > 0 && (
                                          <Avatar
                                            sx={{ width: 24, height: 24 }}
                                            src={`http://localhost:3000/static/${filteredItem.images[0]}`}
                                          />
                                        )}
                                      {/* Exibe as demais informações */}
                                      <div>
                                        {Object.entries(filteredItem).map(
                                          ([key, value]) => {
                                            if (key === "images") return null; // Ignora a key "images" pois já foi tratada
                                            return (
                                              <div key={key}>
                                                <b>{translateKeys(key)}:</b>{" "}
                                                {isId(value)
                                                  ? props.idIndexList.find(
                                                      (i) => i.id === value
                                                    )?.name || value
                                                  : JSON.stringify(value)}
                                              </div>
                                            );
                                          }
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              : isId(change.newValue)
                              ? props.idIndexList.find(
                                  (item) => item.id === change.newValue
                                )?.name || change.newValue
                              : change.newValue}
                          </Grid2>
                        </Grid2>
                      ) : (
                        // Renderização padrão para outros campos
                        <>
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
                        </>
                      )}
                    </Grid2>
                  ))
                ) : typeof row.target === "string" ? (
                  <Grid2 item sx={{ mr: 0.5, width: 200 }}>
                    <InputLabel sx={{ fontSize: 12 }}>Nome</InputLabel>
                    <Typography sx={{ fontSize: 12 }}>
                      {props.idIndexList.find((item) => item.id === row.target)
                        ?.name || row.target}
                    </Typography>
                  </Grid2>
                ) : typeof row.target === "number" ? (
                  <Grid2 item sx={{ mr: 0.5, width: 200 }}>
                    <InputLabel sx={{ fontSize: 12 }}>#</InputLabel>
                    <Typography sx={{ fontSize: 12 }}>{row.target}</Typography>
                  </Grid2>
                ) : (
                  Object.entries(row.target)
                    .filter(([key]) => !["_id", "__v", "image"].includes(key))
                    .map(([key, value], index) => (
                      <Grid2
                        item
                        key={index}
                        sx={{
                          mr: 0.5,
                          width:
                            index === 0 && key === "number"
                              ? 50
                              : key === "title"
                              ? 400
                              : 200,
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
                      </Grid2>
                    ))
                )
              ) : (
                <Typography sx={{ fontSize: 12, fontStyle: "italic" }}>
                  Nenhum dado disponível
                </Typography>
              )}
            </Grid2>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default LogTable;
