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
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import AddProductForm from "../add/AddProductForm";

export default function Products({
  onClose,
  userId,
  userName,
  configCustomization,
  // products,
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
        setProducts(products.data);
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
                      Tipos de Produto
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {products.map((product, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`Nome: ${product.name}`}
                            sx={{ width: "5%" }}
                          />
                          <ListItemText
                            primary={`Tipo: ${product.type}`}
                            sx={{ width: "5%" }}
                          />
                          <ListItemText
                            primary={`Campos: ${product.fields.map(
                              (field) => field.name
                            )}`}
                            sx={{ width: "5%" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
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
          <AddProductForm
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
