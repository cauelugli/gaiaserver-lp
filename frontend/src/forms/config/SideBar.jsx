/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import TransferList from "../../components/small/TransferList";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function SideBar({ onClose }) {
  const [configData, setConfigData] = useState({});
  const [roles, setRoles] = useState([]);
  const [selectedLists, setSelectedLists] = useState({});
  // IMPORTANT: THESE TITLES MUST BE IN ORDER WITH THE MODEL!
  // this doesnt make sense...
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
  console.log("configData", configData);

  let index = 0;

  return (
    <form onSubmit={handleChangeSidebarConfig}>
      <DialogTitle>Configurações da Barra Lateral</DialogTitle>
      {Object.keys(configData).map((key, index) => (
        <TransferList
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
