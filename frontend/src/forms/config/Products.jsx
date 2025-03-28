/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";
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
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";

import AddBaseProductForm from "../add/AddBaseProductForm";
import EditBaseProductForm from "../edit/EditBaseProductForm";
import DeleteFormModel from "../delete/DeleteFormModel";

export default function Products({
  onClose,
  userId,
  userName,
  configCustomization,
}) {
  const [configData, setConfigData] = React.useState([]);
  const [refreshData, setRefreshData] = React.useState(false);
  const [baseProducts, setBaseProducts] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [openAddProduct, setOpenAddProduct] = React.useState(false);
  const [openEditProduct, setOpenEditProduct] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState(null);
  // eslint-disable-next-line no-unused-vars
  const [selectedProductName, setSelectedProductName] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        const products = await api.get("/get", {
          params: { model: "Product" },
        });
        setBaseProducts(products.data.filter((product) => !product.name));
        setProducts(products.data.filter((product) => product.name));
        setConfigData(config.data.products);
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
        fakefield: "is fake",
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
              <Grid2
                container
                sx={{ mt: 2 }}
                direction="column"
                justifyContent="center"
                alignItems="flex-start"
              >
                <Accordion sx={{ width: "100%" }}>
                  <AccordionSummary expandIcon={<icons.ArrowDropDownIcon />}>
                    <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                      Produtos Base
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {baseProducts.map((product, index) => (
                      <Accordion sx={{ width: "100%" }} key={index}>
                        <AccordionSummary
                          expandIcon={<icons.ArrowDropDownIcon />}
                        >
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
                                        <Grid2 container direction="row">
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
                                        </Grid2>
                                      )}
                                      {field.type === "currency" && "-"}
                                      {field.type === "date" &&
                                        `Tipo: ${
                                          field.dateType === "simple"
                                            ? "Simples"
                                            : "Período"
                                        } ${
                                          field.dateType === "range"
                                            ? `${field.dateValue} ${field.datePeriod}`
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
                            Produtos Criados (
                            {
                              products.filter(
                                (prod) => product.type === prod.type
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
                                    Nome do Produto
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
                              {products
                                .filter((prod) => product.type === prod.type)
                                .map((prod, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      <Avatar
                                        src={`http://localhost:8080/static/${
                                          prod.images?.[0] || ""
                                        }`}
                                        alt={prod.name?.[0] || ""}
                                        style={{
                                          width: 32,
                                          height: 32,
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Typography sx={{ fontSize: 12 }}>
                                        {prod.name ? prod.name : "-"}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography sx={{ fontSize: 12 }}>
                                        {prod.createdAt
                                          ? dayjs(prod.createdAt).format(
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
                        <Grid2
                          container
                          direction="row"
                          justifyContent="flex-end"
                        >
                          <Button
                            sx={{ m: 1 }}
                            color="inherit"
                            variant="contained"
                            onClick={() => {
                              setSelectedProductId(product._id);
                              setOpenEditProduct(true);
                            }}
                          >
                            <icons.SettingsIcon />
                          </Button>
                          <Button
                            sx={{ m: 1 }}
                            color="error"
                            variant="contained"
                            onClick={() => {
                              setSelectedProductId(product._id);
                              setSelectedProductName(product.type);
                              setOpenDialog(!openDialog);
                            }}
                          >
                            <icons.DeleteIcon />
                          </Button>
                        </Grid2>
                      </Accordion>
                    ))}

                    <Grid2
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      sx={{ mt: 2 }}
                    >
                      <Grid2 item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setOpenAddProduct(true)}
                          sx={{ ml: 1 }}
                        >
                          Novo Produto
                        </Button>
                      </Grid2>
                    </Grid2>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ width: "100%", mt: 2 }}>
                  <AccordionSummary expandIcon={<icons.ArrowDropDownIcon />}>
                    <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                      Permissões
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                  </AccordionDetails>
                </Accordion>
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

      {/* Diálogo para adicionar novo produto */}
      {openAddProduct && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openAddProduct}
          onClose={() => setOpenAddProduct(false)}
        >
          <AddBaseProductForm
            userName={userName}
            userId={userId}
            onClose={() => setOpenAddProduct(false)}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            configCustomization={configCustomization}
            toast={toast}
          />
        </Dialog>
      )}

      {/* Diálogo para editar produto existente */}
      {openEditProduct && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openEditProduct}
          onClose={() => setOpenEditProduct(false)}
        >
          <EditBaseProductForm
            productId={selectedProductId}
            userName={userName}
            userId={userId}
            onClose={() => {
              setOpenEditProduct(false);
              setRefreshData(!refreshData);
            }}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}

      {openDialog && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        >
          <DeleteFormModel
            userId={userId}
            selectedItem={{ id: selectedProductId, title: selectedProductName }}
            model={"Product"}
            label={"Produto"}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            page={"products"}
            isProduct={true}
          />
        </Dialog>
      )}
    </>
  );
}
