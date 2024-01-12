/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import axios from "axios";

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
  Grid,
  TextField,
  DialogTitle,
  Switch,
} from "@mui/material";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const ImportContacts = ({
  openAdd,
  setOpenAdd,
  toast,
  refreshData,
  setRefreshData,
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

  const handleUpload = async () => {
    try {
      if (!fileData) {
        toast.error("Nenhum arquivo para enviar.");
        return;
      }

      const response = await api.post("/customers/importContacts", {
        fileData,
      });
      setFileData(null);
      setRefreshData(!refreshData);
      setOpenAdd(!openAdd);
      toast.success("Dados enviados com sucesso!");
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      toast.error("Erro ao enviar dados. Por favor, tente novamente.");
    }
  };

  return (
    <Grid>
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
                    } else {
                      const handleChange = (e) => {
                        const newData = [...fileData];
                        newData[rowIndex + 1][cellIndex] = e.target.value;
                        setFileData(newData);
                      };
                      return (
                        <TableCell key={cellIndex}>
                          <TextField
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
          <Grid
            container
            direction="row"
            justifyContent="center"
            sx={{ my: 3 }}
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<HelpOutlineIcon />}
              sx={{ mr: 2 }}
              onClick={handleDelete}
            >
              Dúvidas
            </Button>

            <Button
              variant="contained"
              color="success"
              startIcon={<DownloadIcon />}
              onClick={handleDelete}
            >
              Baixar Arquivo Modelo
            </Button>
          </Grid>
          <Typography
            sx={{ fontSize: 20, mt: 8, textAlign: "center", color: "#777" }}
          >
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
            startIcon={<DeleteIcon />}
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
                startIcon={<UploadFileIcon />}
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
    </Grid>
  );
};

export default ImportContacts;
