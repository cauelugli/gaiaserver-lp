/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  // Accordion,
  // AccordionDetails,
  // AccordionSummary,
  // Checkbox,
  // Grid2,
  // Table,
  // TableBody,
  // TableCell,
  // TableHead,
  // TableRow,
  // Typography,
} from "@mui/material";

// import { icons } from "../../icons";

const socket = io("http://localhost:5002");
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Notifications({ onClose }) {
  const [configData, setConfigData] = React.useState(null);

  // const labels = {
  //   customer: "Clientes",
  //   job: "Jobs",
  //   sale: "Vendas",
  //   user: "Colaboradores",
  //   service: "Serviços",
  //   serviceplan: "Plano de Serviços",
  //   product: "Produtos",
  // };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const notificationConfig = await api.get("/get", {
          params: { model: "Notifications" },
        });
        setConfigData(notificationConfig.data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangeNotificationsConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/notifications", configData);
      if (res.data) {
        toast.success("Configuração Alterada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      onClose();
      socket.emit("forceRefresh");
    } catch (err) {
      console.log("erro", err);
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  return (
    <form onSubmit={handleChangeNotificationsConfig}>
      <DialogTitle
        sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
      >
        Configurações de Notificações
      </DialogTitle>
      {configData && (
        <>
          <DialogContent>{/* future */}</DialogContent>
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
