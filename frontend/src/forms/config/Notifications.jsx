/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function Notifications({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [roles, setRoles] = React.useState([]);
  const [whenUserIsCreated, setWhenUserIsCreated] = React.useState([]);
  const [whenUserIsEdited, setWhenUserIsEdited] = React.useState([]);
  const [whenUserIsRemoved, setWhenUserIsRemoved] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        const roles = await api.get("/get", {
          params: { model: "Role" },
        });
        const configData = config.data[0].notifications;

        setConfigData(configData);
        setRoles(roles.data);
        setWhenUserIsCreated(configData.whenUserIsCreated || []);
        setWhenUserIsEdited(configData.whenUserIsEdited || []);
        setWhenUserIsRemoved(configData.whenUserIsRemoved || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleCheckboxChange = (roleId, type) => {
    const updateList = (list, setList) => {
      setList(
        list.includes(roleId)
          ? list.filter((id) => id !== roleId)
          : [...list, roleId]
      );
    };

    switch (type) {
      case "created":
        updateList(whenUserIsCreated, setWhenUserIsCreated);
        break;
      case "edited":
        updateList(whenUserIsEdited, setWhenUserIsEdited);
        break;
      case "removed":
        updateList(whenUserIsRemoved, setWhenUserIsRemoved);
        break;
      default:
        break;
    }
  };

  const handleChangeNotificationsConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/config/notifications", {
        whenUserIsCreated,
        whenUserIsEdited,
        whenUserIsRemoved,
      });

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
      {configData.length !== 0 && (
        <>
          <DialogContent>
            <Grid
              container
              sx={{ mt: 2 }}
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Accordion sx={{ width: "100%", mt: 2 }}>
                <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Colaboradores
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid item sx={{ my: 1.5 }}>
                    <Grid container direction="column" alignItems="center">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ width: 200 }}>Perfil</TableCell>
                            <TableCell sx={{ width: 200 }}>Criado</TableCell>
                            <TableCell sx={{ width: 200 }}>Editado</TableCell>
                            <TableCell sx={{ width: 200 }}>
                              Deletado
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
                            roles.map((role, index) => (
                              <TableRow key={index}>
                                <TableCell>{role.name}</TableCell>
                                <TableCell>
                                  <Checkbox
                                    checked={whenUserIsCreated.includes(
                                      role._id
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(role._id, "created")
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <Checkbox
                                    checked={whenUserIsEdited.includes(
                                      role._id
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(role._id, "edited")
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <Checkbox
                                    checked={whenUserIsRemoved.includes(
                                      role._id
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(role._id, "removed")
                                    }
                                  />
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
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
