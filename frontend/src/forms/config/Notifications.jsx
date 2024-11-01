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
  // USER
  const [whenUserIsCreated, setWhenUserIsCreated] = React.useState([]);
  const [whenUserIsEdited, setWhenUserIsEdited] = React.useState([]);
  const [whenUserIsDeleted, setWhenUserIsDeleted] = React.useState([]);
  // CUSTOMER
  const [whenCustomerIsCreated, setWhenCustomerIsCreated] = React.useState([]);
  const [whenCustomerIsEdited, setWhenCustomerIsEdited] = React.useState([]);
  const [whenCustomerIsDeleted, setWhenCustomerIsDeleted] = React.useState([]);

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
        // USER
        setWhenUserIsCreated(configData.whenUserIsCreated || []);
        setWhenUserIsEdited(configData.whenUserIsEdited || []);
        setWhenUserIsDeleted(configData.whenUserIsDeleted || []);
        // CUSTOMER
        setWhenCustomerIsCreated(configData.whenCustomerIsCreated || []);
        setWhenCustomerIsEdited(configData.whenCustomerIsEdited || []);
        setWhenCustomerIsDeleted(configData.whenCustomerIsDeleted || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const statesMap = {
    User: {
      created: [whenUserIsCreated, setWhenUserIsCreated],
      edited: [whenUserIsEdited, setWhenUserIsEdited],
      deleted: [whenUserIsDeleted, setWhenUserIsDeleted],
    },
    Customer: {
      created: [whenCustomerIsCreated, setWhenCustomerIsCreated],
      edited: [whenCustomerIsEdited, setWhenCustomerIsEdited],
      deleted: [whenCustomerIsDeleted, setWhenCustomerIsDeleted],
    },
  };

  const handleCheckboxChange = (roleId, model, type) => {
    const [list, setList] = statesMap[model][type];
    setList(
      list.includes(roleId)
        ? list.filter((id) => id !== roleId)
        : [...list, roleId]
    );
  };

  const handleChangeNotificationsConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/config/notifications", {
        whenUserIsCreated,
        whenUserIsEdited,
        whenUserIsDeleted,
        whenCustomerIsCreated,
        whenCustomerIsEdited,
        whenCustomerIsDeleted,
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
              <Accordion sx={{ width: "100%" }}>
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
                            <TableCell sx={{ width: 200 }}>Deletado</TableCell>
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
                                      handleCheckboxChange(
                                        role._id,
                                        "User",
                                        "created"
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <Checkbox
                                    checked={whenUserIsEdited.includes(
                                      role._id
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        role._id,
                                        "User",
                                        "edited"
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <Checkbox
                                    checked={whenUserIsDeleted.includes(
                                      role._id
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        role._id,
                                        "User",
                                        "deleted"
                                      )
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
              <Accordion sx={{ width: "100%", mt: 2 }}>
                <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Clientes
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
                            <TableCell sx={{ width: 200 }}>Deletado</TableCell>
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
                                    checked={whenCustomerIsCreated.includes(
                                      role._id
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        role._id,
                                        "Customer",
                                        "created"
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <Checkbox
                                    checked={whenCustomerIsEdited.includes(
                                      role._id
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        role._id,
                                        "Customer",
                                        "edited"
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <Checkbox
                                    checked={whenCustomerIsDeleted.includes(
                                      role._id
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        role._id,
                                        "Customer",
                                        "deleted"
                                      )
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
