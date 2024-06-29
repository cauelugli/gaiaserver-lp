/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

import {
  Button,
  DialogActions,
  DialogTitle,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";


const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Permissions({ onClose }) {
  const [configData, setConfigData] = useState({});
  const [roles, setRoles] = useState([]);
  const [selectedLists, setSelectedLists] = useState({});
  // IMPORTANT: THESE TITLES MUST BE IN ORDER WITH THE MODEL 'CONFIG' !
  // const title = [
  //   "Dashboard",
  //   "Clientes",
  //   "Usuários",
  //   "Departamentos",
  //   "Solicitações",
  //   "Orçamentos",
  //   "Serviços",
  //   "Estoque",
  //   "Financeiro",
  //   "Arquivos",
  //   "Configurações",
  //   "Personalização",
  //   "Segurança",
  //   "Relatórios",
  //   "Projetos",
  //   "Produtos",
  //   "Materiais",
  // ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        const roles = await api.get("/roles");
        setConfigData(config.data[0].permissions);
        setRoles(roles.data);

        // const initialState = {};
        // Object.keys(config.data[0].sidebar).forEach((key) => {
        //   initialState[key] = {
        //     selected: config.data[0].sidebar[key],
        //     options: config.data[0].sidebar[key],
        //     title: title[key],
        //   };
        // });

        // setSelectedLists(initialState);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleSelectedChange = (key, selected, options, title) => {
  //   setSelectedLists((prevLists) => ({
  //     ...prevLists,
  //     [key]: {
  //       selected,
  //       options,
  //       title,
  //     },
  //   }));
  // };

  const handleChangePermissionsConfig = async (e) => {
    e.preventDefault();
    try {
      const payload = {};
      const res = await api.put("/config/permissions", payload);

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
    <form onSubmit={handleChangePermissionsConfig}>
      <>
        <DialogTitle
          sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
        >
          Permissões de Perfis{" "}
          <Tooltip
            title={
              <Typography sx={{ fontSize: 12 }}>
                Nesta sessão escolha o os Perfis de Acesso que podem visualizar
                os recursos do aplicativo. A coluna à esquerda mostra os
                Recursos, a coluna central mostra os Perfis que não possuem
                permissão, e a coluna da direita mostra os que possuem permissão
                para visualizar os Recursos.
              </Typography>
            }
          >
            <Button
              size="small"
              sx={{
                backgroundColor: "white",
                color: "#32aacd",
                "&:hover": {
                  backgroundColor: "white",
                },
              }}
            >
              ?
            </Button>
          </Tooltip>
        </DialogTitle>
      </>
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
      </DialogActions>
    </form>
  );
}
