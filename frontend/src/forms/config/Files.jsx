/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
// import { toast } from "react-toastify";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5002");

import {
  Button,
  DialogActions,
  DialogTitle,
  // Accordion,
  // AccordionDetails,
  // AccordionSummary,
  // DialogContent,
  // FormControlLabel,
  // Grid2,
  // Radio,
  // RadioGroup,
  // Typography,
} from "@mui/material";


const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Files() {
  const [configData, setConfigData] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data[0].files);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <form>
      <DialogTitle
        sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
      >
        Configurações de Arquivos
      </DialogTitle>
      {configData.length !== 0 && (
        <>
          <DialogActions>
            <Button type="submit" variant="contained" color="success">
              OK
            </Button>
          </DialogActions>
        </>
      )}
    </form>
  );
}
