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

export default function Products({
  onClose,
  userId,
  userName,
  configCustomization,
}) {
  const [configData, setConfigData] = React.useState([]);
  const [refreshData, setRefreshData] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [canBeDeleted, setCanBeDeleted] = React.useState(null);
  const [notifyWhenProductIsCreated, setNotifyWhenProductIsCreated] =
    React.useState(null);

  const [openAddProduct, setOpenAddProduct] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        const products = await api.get("/products");
        setProducts(products.data.filter((product) => !product.name));
        setConfigData(config.data[0].products);
        setCanBeDeleted(config.data[0].products.canBeDeleted);
        setNotifyWhenProductIsCreated(
          config.data[0].products.notifyWhenProductIsCreated
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  const handleChangeProductsConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/config/products", {
        canBeDeleted,
        notifyWhenProductIsCreated,
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
      <form onSubmit={handleChangeProductsConfig}>
        <DialogTitle
          sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
        >
          Configurações de Produtos
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
                      Produtos Base
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {products.map((product, index) => (
                      <Accordion sx={{ width: "100%" }} key={index}>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                          <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                            {product.type}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography
                            sx={{ fontSize: 14, my: 1, fontWeight: "bold" }}
                          >
                            Campos do Produto
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
                              {product.fields.map((field, index) => (
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
                          onClick={() => setOpenAddProduct(true)}
                          sx={{ ml: 1 }}
                        >
                          Novo Produto
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
                        Produtos Podem ser Deletados
                      </Typography>
                      <Tooltip
                        title={
                          <Typography sx={{ fontSize: 12 }}>
                            Se a opção marcada for <strrong>Sim</strrong>, os
                            Produtos poderão ser deletados DEFINITIVAMENTE. A
                            opção padrão é <strong>Não</strong>.
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
                          Notificar ao Criar Produto
                        </Typography>
                        <Tooltip
                          title={
                            <Typography sx={{ fontSize: 12 }}>
                              Se a opção marcada for <strong>Sim</strong>, os
                              Administradores serão notificados quando um novo
                              produto for criado. A opção padrão é{" "}
                              <strong>Não</strong>.
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
                          value={notifyWhenProductIsCreated}
                          onChange={(e) =>
                            setNotifyWhenProductIsCreated(e.target.value)
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
      {openAddProduct && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddProduct}
          onClose={() => setOpenAddProduct(!openAddProduct)}
        >
          <AddBaseProductForm
            userName={userName}
            userId={userId}
            onClose={() => setOpenAddProduct(!openAddProduct)}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            configCustomization={configCustomization}
            toast={toast}
          />
        </Dialog>
      )}
    </>
  );
}
