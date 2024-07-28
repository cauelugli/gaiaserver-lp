/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";
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
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SettingsIcon from "@mui/icons-material/Settings";

import AddBaseProductForm from "../add/AddBaseProductForm";

export default function Materials({
  onClose,
  userId,
  userName,
  configCustomization,
}) {
  const [configData, setConfigData] = React.useState([]);
  const [refreshData, setRefreshData] = React.useState(false);
  const [baseMaterials, setBaseMaterials] = React.useState([]);
  const [materials, setMaterials] = React.useState([]);

  const [canBeDeleted, setCanBeDeleted] = React.useState(null);
  const [notifyWhenMaterialIsCreated, setNotifyWhenMaterialIsCreated] =
    React.useState(null);

  const [openAddMaterial, setOpenAddMaterial] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        const materials = await api.get("/get", {
          params: { model: "Product" },
          // remember: a Material is a Product with 'isMaterial===true'
        });
        setBaseMaterials(
          materials.data.filter(
            (material) => !material.name && material.isMaterial
          )
        );
        setMaterials(
          materials.data.filter(
            (material) => material.name && material.isMaterial
          )
        );
        setConfigData(config.data[0].materials);
        setCanBeDeleted(config.data[0].materials.canBeDeleted);
        setNotifyWhenMaterialIsCreated(
          config.data[0].materials.notifyWhenMaterialIsCreated
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  const handleChangeMaterialsConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/config/materials", {
        canBeDeleted,
        notifyWhenMaterialIsCreated,
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
    <>
      <form onSubmit={handleChangeMaterialsConfig}>
        <DialogTitle
          sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
        >
          Configurações de Materiais
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
                      Materiais Base
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {baseMaterials.map((material, index) => (
                      <Accordion sx={{ width: "100%" }} key={index}>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                          <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                            {material.type}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography
                            sx={{ fontSize: 14, my: 1, fontWeight: "bold" }}
                          >
                            Campos do Material
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: 14, fontWeight: "bold" }}
                                  >
                                    #
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: 14, fontWeight: "bold" }}
                                  >
                                    Nome do Campo
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: 14, fontWeight: "bold" }}
                                  >
                                    Tipo do Campo
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: 14, fontWeight: "bold" }}
                                  >
                                    Propriedades
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {material.fields.map((field, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 12 }}>
                                      {field.index + 1}
                                    </Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Typography sx={{ fontSize: 12 }}>
                                      {field.name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 12 }}>
                                      {field.type === "string" && "Texto"}
                                      {field.type === "number" && "Número"}
                                      {field.type === "options" &&
                                        "Lista de Opções"}
                                      {field.type === "currency" &&
                                        "Moeda (R$)"}
                                      {field.type === "date" && "Data"}
                                    </Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Typography sx={{ fontSize: 12 }}>
                                      {field.type === "string" &&
                                        `Min ${field.minCharacter} Max ${field.maxCharacter} Caracteres`}
                                      {field.type === "number" &&
                                        `Tipo: ${
                                          field.numberType === "integer"
                                            ? "Inteiro"
                                            : "Decimal"
                                        }, Min ${field.minValue} Max ${
                                          field.maxValue
                                        }`}
                                      {field.type === "options" && (
                                        <Grid container direction="row">
                                          <Typography
                                            sx={{ mr: 1, fontSize: 12 }}
                                          >
                                            Opções:
                                          </Typography>
                                          {field.options.map(
                                            (option, index) => (
                                              <Typography
                                                key={index}
                                                sx={{ mr: 1, fontSize: 12 }}
                                              >
                                                {option}
                                              </Typography>
                                            )
                                          )}
                                        </Grid>
                                      )}
                                      {field.type === "currency" && "-"}
                                      {field.type === "date" &&
                                        `Tipo: ${
                                          field.newDateType === "simple"
                                            ? "Simples"
                                            : "Período"
                                        } ${
                                          field.newDateType === "period"
                                            ? `${field.newDateValue} ${field.newDatePeriod} `
                                            : ""
                                        }`}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          <Typography
                            sx={{
                              fontSize: 14,
                              my: 1,
                              mt: 3,
                              fontWeight: "bold",
                            }}
                          >
                            Materiais Criados (
                            {
                              materials.filter(
                                (material) => material.type === material.type
                              ).length
                            }
                            )
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{
                                      fontSize: 14,
                                      fontWeight: "bold",
                                      ml: 1,
                                    }}
                                  >
                                    📷
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: 14, fontWeight: "bold" }}
                                  >
                                    Nome do Material
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: 14, fontWeight: "bold" }}
                                  >
                                    Criador
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: 14, fontWeight: "bold" }}
                                  >
                                    Criado em
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {materials
                                .filter(
                                  (material) => material.type === material.type
                                )
                                .map((material, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      <Avatar
                                        src={`http://localhost:3000/static/${material.images[0]}`}
                                        alt={material.name[0]}
                                        style={{
                                          width: 32,
                                          height: 32,
                                        }}
                                      />
                                    </TableCell>

                                    <TableCell>
                                      <Typography sx={{ fontSize: 12 }}>
                                        {material.name ? material.name : "-"}
                                      </Typography>
                                    </TableCell>

                                    <TableCell>
                                      <Typography sx={{ fontSize: 12 }}>
                                        {material.createdBy
                                          ? material.createdBy
                                          : "-"}
                                      </Typography>
                                    </TableCell>

                                    <TableCell>
                                      <Typography sx={{ fontSize: 12 }}>
                                        {material.createdAt
                                          ? dayjs(material.createdAt).format(
                                              "DD/MM/YYYY HH:mm:ss"
                                            )
                                          : "-"}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </AccordionDetails>
                        <Button
                          color="inherit"
                          sx={{ ml: "92%", pr: 1, pb: 1 }}
                        >
                          <SettingsIcon />
                        </Button>
                      </Accordion>
                    ))}

                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      sx={{ mt: 2 }}
                    >
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setOpenAddMaterial(true)}
                          sx={{ ml: 1 }}
                        >
                          Novo Material
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <Accordion sx={{ width: "100%", mt: 2 }}>
                  <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                    <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                      Permissões
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container direction="row">
                      <Typography sx={{ my: "auto", mr: 1 }}>
                        Materiais Podem ser Deletados
                      </Typography>
                      <Tooltip
                        title={
                          <Typography sx={{ fontSize: 12 }}>
                            Se a opção marcada for "Sim", os Materiais poderão
                            ser deletados DEFINITIVAMENTE. A opção padrão é
                            "Não".
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
                      <RadioGroup
                        row
                        value={canBeDeleted}
                        onChange={(e) => setCanBeDeleted(e.target.value)}
                      >
                        <FormControlLabel
                          value={Boolean(true)}
                          control={
                            <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                          }
                          label={
                            <Typography sx={{ fontSize: 13 }}>Sim</Typography>
                          }
                        />
                        <FormControlLabel
                          value={Boolean(false)}
                          control={
                            <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                          }
                          label={
                            <Typography sx={{ fontSize: 13 }}>Não</Typography>
                          }
                        />
                      </RadioGroup>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ width: "100%", mt: 2 }}>
                  <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                    <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                      Notificações
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {" "}
                    <AccordionDetails>
                      <Grid container direction="row">
                        <Typography sx={{ my: "auto", mr: 1 }}>
                          Notificar ao Criar Material
                        </Typography>
                        <Tooltip
                          title={
                            <Typography sx={{ fontSize: 12 }}>
                              Se a opção marcada for "Sim", os Administradores
                              serão notificados quando um novo material for
                              criado. A opção padrão é "Não".
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
                        <RadioGroup
                          row
                          value={notifyWhenMaterialIsCreated}
                          onChange={(e) =>
                            setNotifyWhenMaterialIsCreated(e.target.value)
                          }
                        >
                          <FormControlLabel
                            value={Boolean(true)}
                            control={
                              <Radio
                                size="small"
                                sx={{ mt: -0.25, mr: -0.5 }}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: 13 }}>Sim</Typography>
                            }
                          />
                          <FormControlLabel
                            value={Boolean(false)}
                            control={
                              <Radio
                                size="small"
                                sx={{ mt: -0.25, mr: -0.5 }}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: 13 }}>Não</Typography>
                            }
                          />
                        </RadioGroup>
                      </Grid>
                    </AccordionDetails>
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
      {openAddMaterial && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddMaterial}
          onClose={() => setOpenAddMaterial(!openAddMaterial)}
        >
          <AddBaseProductForm
            userName={userName}
            userId={userId}
            onClose={() => setOpenAddMaterial(!openAddMaterial)}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            configCustomization={configCustomization}
            toast={toast}
            isMaterial
          />
        </Dialog>
      )}
    </>
  );
}
