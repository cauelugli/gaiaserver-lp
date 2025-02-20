/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";

const socket = io("http://localhost:5002");
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Notifications({ onClose }) {
  const [configData, setConfigData] = React.useState(null);
  const [roles, setRoles] = React.useState([]);

  const labels = {
    customer: "Clientes",
    job: "Jobs",
    sale: "Vendas",
    user: "Colaboradores",
    department: "Departamentos",
    group: "Grupos",
    service: "Serviços",
    serviceplan: "Plano de Serviços",
    product: "Produtos",
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const notificationConfig = await api.get("/get", {
          params: { model: "Notifications" },
        });
        setConfigData(notificationConfig.data[0]);

        const rolesResponse = await api.get("/get", {
          params: { model: "Role" },
        });
        setRoles(rolesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleCheckboxChange = (roleId, category, type) => {
    const updatedList = configData[category]?.[type] || [];
    const newList = updatedList.includes(roleId)
      ? updatedList.filter((id) => id !== roleId)
      : [...updatedList, roleId];

    setConfigData((prevConfig) => ({
      ...prevConfig,
      [category]: {
        ...prevConfig[category],
        [type]: newList,
      },
    }));
  };

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
          <DialogContent>
            <Grid2
              container
              sx={{ mt: 2 }}
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
            >
              {Object.keys(configData)
                .filter((category) => labels[category])
                .map((category) => (
                  <Accordion key={category} sx={{ width: "100%", mt: 2 }}>
                    <AccordionSummary expandIcon={<icons.ArrowDropDownIcon />}>
                      <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                        {labels[category]}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid2 item sx={{ my: 1.5 }}>
                        <Grid2 container direction="column" alignItems="center">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ width: 200 }}>
                                  Perfil
                                </TableCell>
                                <TableCell sx={{ width: 200 }}>
                                  Criado
                                </TableCell>
                                <TableCell sx={{ width: 200 }}>
                                  Editado
                                </TableCell>
                                <TableCell sx={{ width: 220 }}>
                                  Deletado / Arquivado
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {roles.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={4}>
                                    Nenhum perfil disponível
                                  </TableCell>
                                </TableRow>
                              ) : (
                                roles.map((role) => (
                                  <TableRow key={role._id}>
                                    <TableCell>{role.name}</TableCell>
                                    <TableCell>
                                      <Checkbox
                                        checked={configData[category]?.[
                                          `${category}IsCreated`
                                        ]?.includes(role._id)}
                                        onChange={() =>
                                          handleCheckboxChange(
                                            role._id,
                                            category,
                                            `${category}IsCreated`
                                          )
                                        }
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Checkbox
                                        checked={configData[category]?.[
                                          `${category}IsEdited`
                                        ]?.includes(role._id)}
                                        onChange={() =>
                                          handleCheckboxChange(
                                            role._id,
                                            category,
                                            `${category}IsEdited`
                                          )
                                        }
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Checkbox
                                        checked={configData[category]?.[
                                          `${category}IsDeleted`
                                        ]?.includes(role._id)}
                                        onChange={() =>
                                          handleCheckboxChange(
                                            role._id,
                                            category,
                                            `${category}IsDeleted`
                                          )
                                        }
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </Grid2>
                      </Grid2>
                    </AccordionDetails>
                  </Accordion>
                ))}
            </Grid2>
          </DialogContent>
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
