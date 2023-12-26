/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Button,
  DialogActions,
  DialogTitle,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import SideBarConfigTransferList from "../../components/small/SideBarConfigTransferList";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function SideBar({ onClose }) {
  const [configData, setConfigData] = useState({});
  const [roles, setRoles] = useState([]);
  const [selectedLists, setSelectedLists] = useState({});
  // IMPORTANT: THESE TITLES MUST BE IN ORDER WITH THE MODEL!
  const title = [
    "Dashboard",
    "Clientes",
    "Usuários",
    "Departamentos",
    "Pedidos",
    "Orçamentos",
    "Serviços",
    "Estoque",
    "Financeiro",
    "Arquivos",
    "Personalização",
    "Segurança",
    "Configurações",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        const roles = await api.get("/roles");
        setConfigData(config.data[0].sidebar);
        setRoles(roles.data);

        const initialState = {};
        Object.keys(config.data[0].sidebar).forEach((key) => {
          initialState[key] = {
            selected: config.data[0].sidebar[key],
            options: config.data[0].sidebar[key],
            title: title[key],
          };
        });

        setSelectedLists(initialState);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectedChange = (key, selected, options, title) => {
    setSelectedLists((prevLists) => ({
      ...prevLists,
      [key]: {
        selected,
        options,
        title,
      },
    }));
  };

  const handleChangeSidebarConfig = async (e) => {
    e.preventDefault();
    try {
      const payload = {};
      Object.keys(selectedLists).forEach((key) => {
        payload[key] = selectedLists[key].selected;
      });

      const res = await api.put("/config/sidebar", payload);

      if (res.data) {
        toast.success("Configuração Alterada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      onClose();
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
    <form onSubmit={handleChangeSidebarConfig}>
      <Grid container direction="row">
        <DialogTitle>Configurações da Barra Lateral</DialogTitle>
        <Tooltip
          title={
            <Typography sx={{ fontSize: 12 }}>
              Nesta sessão escolha o que os Perfis de Acesso podem visualizar
              nos itens da Barra Lateral. A coluna à esquerda mostra as Páginas,
              a coluna central mostra os Perfis que não possuem permissão (o
              item do menu não será exibido), e os da coluna da direita mostra
              os que possuem permissão para visualizar as Páginas.
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
      </Grid>

      <Grid container direction="row" sx={{ mb: -2 }}>
        <Grid item sx={{ ml: 45 }}>
          <Typography>
            <VisibilityOffIcon sx={{ fontSize: 40, color: "#D00000" }} />
          </Typography>
        </Grid>
        <Grid item sx={{ ml: 33 }}>
          <Typography>
            <VisibilityIcon sx={{ fontSize: 40, color: "#417505" }} />
          </Typography>
        </Grid>
      </Grid>
      {Object.keys(configData).map((key, index) => (
        <SideBarConfigTransferList
          key={key}
          title={title[index]}
          options={roles}
          selectedList={selectedLists[key].selected}
          onSelectedChange={(selected, options) =>
            handleSelectedChange(key, selected, options)
          }
        />
      ))}

      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
      </DialogActions>
    </form>
  );
}
