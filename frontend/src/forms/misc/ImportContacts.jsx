/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid2,
  TextField,
  DialogTitle,
  Switch,
  Select,
  MenuItem,
} from "@mui/material";

import { icons } from "../../icons";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const ImportContacts = ({
  openAdd,
  setOpenAdd,
  toast,
  refreshData,
  setRefreshData,
  userId,
}) => {
  const [fileData, setFileData] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const parsedData = parseCSV(e.target.result);
        setFileData(parsedData);
      };
      reader.readAsText(file);
    } else {
      toast.error("Por favor, selecione um arquivo CSV válido.");
    }
  };

  const parseCSV = (csvData) => {
    return csvData.split("\n").map((row) => row.split(","));
  };

  const handleDelete = () => {
    setFileData(null);
  };

  const handleSwitchChange = (event, rowIndex, cellIndex) => {
    const newData = [...fileData];
    newData[rowIndex + 1][cellIndex] = event.target.checked;
    setFileData(newData);
  };

  const handleGenderChange = (event, rowIndex, cellIndex) => {
    const newData = [...fileData];
    newData[rowIndex + 1][cellIndex] = event.target.value;
    setFileData(newData);
  };

  const handleUpload = async () => {
    try {
      if (!fileData) {
        toast.error("Nenhum arquivo para enviar.");
        return;
      }

      await api.post("/customers/importContacts", {
        fileData,
      });
      setFileData(null);
      setRefreshData(!refreshData);
      setOpenAdd(!openAdd);
      toast.success("Dados enviados com sucesso!");
      socket.emit("newDataRefreshButton", {
        page: "customers",
        userId: userId,
      });
      api.post("/log", {
        source: userId,
        target: fileData,
        label: "Upload de Arquivos",
        type: "importContacts",
      });
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      toast.error("Erro ao enviar dados. Por favor, tente novamente.");
    }
  };

  return (
    <Grid2>
      <DialogTitle
        sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
      >
        Importando Contatos
      </DialogTitle>

      {fileData ? (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                {fileData[0].map((header, index) => (
                  <TableCell key={index} align="center">
                    <Typography sx={{ fontWeight: "bold" }}>
                      {header.charAt(0).toUpperCase() + header.slice(1)}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {fileData.slice(1, -1).map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => {
                    if (cellIndex === row.length - 1) {
                      return (
                        <TableCell key>
                          <Switch
                            checked={cell}
                            onChange={(e) =>
                              handleSwitchChange(e, rowIndex, cellIndex)
                            }
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </TableCell>
                      );
                    } else if (cellIndex === row.length - 4) {
                      return (
                        <TableCell key>
                          <Select
                            sx={{ width: 135 }}
                            size="small"
                            value={cell}
                            onChange={(e) =>
                              handleGenderChange(e, rowIndex, cellIndex)
                            }
                          >
                            <MenuItem value={"m"}>Masculino</MenuItem>
                            <MenuItem value={"f"}>Feminino</MenuItem>
                            <MenuItem value={"0"}>Não Informar</MenuItem>
                          </Select>
                        </TableCell>
                      );
                    } else {
                      const handleChange = (e) => {
                        const newData = [...fileData];
                        newData[rowIndex + 1][cellIndex] = e.target.value;
                        setFileData(newData);
                      };
                      return (
                        <TableCell key={cellIndex}>
                          <TextField
                            sx={{ width: cellIndex === 2 ? 130 : 155 }}
                            value={cell}
                            onChange={handleChange}
                            size="small"
                          />
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <>
          <Grid2
            container
            direction="row"
            justifyContent="center"
            sx={{ my: 3 }}
          >
            <Button
              variant="contained"
              color="success"
              startIcon={<icons.DownloadIcon />}
            >
              <a
                href={`http://localhost:8080/static/exemplo.csv`}
                download
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Baixar Arquivo Modelo
              </a>{" "}
            </Button>
          </Grid2>
          <Typography sx={{ fontSize: 20, mt: 8, textAlign: "center" }}>
            FAÇA O ENVIO DO ARQUIVO NO BOTÃO ABAIXO
          </Typography>
        </>
      )}

      <DialogTitle sx={{ textAlign: "center" }}>
        {fileData ? (
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<icons.DeleteIcon />}
            onClick={handleDelete}
          >
            Deletar Arquivo
          </Button>
        ) : (
          <>
            <input
              type="file"
              accept=".csv"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="fileInput">
              <Button
                variant="contained"
                component="span"
                size="small"
                startIcon={<icons.UploadFileIcon />}
                sx={{ my: 2 }}
              >
                Enviar Arquivo
              </Button>
            </label>
          </>
        )}
      </DialogTitle>

      {fileData && (
        <DialogTitle sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleUpload}
          >
            Enviar Contatos
          </Button>
        </DialogTitle>
      )}
    </Grid2>
  );
};

export default ImportContacts;
