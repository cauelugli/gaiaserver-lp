/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
// import dayjs from "dayjs";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Viewer, Worker } from "@react-pdf-viewer/core";

export default function QuoteCard({ users, quote, type }) {
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [pdfUrl, setPdfUrl] = React.useState("");

  const openViewDialog = (file) => {
    setPdfUrl(
      `http://localhost:3000/static/docs/orcamento-${type[0]}-${file.number}${
        file.version !== 0 ? `.${file.version}` : ""
      }.pdf`
    );
    setViewDialogOpen(true);
  };

  const s = () => {
    setViewDialogOpen(false);
  };

  const handlePrint = () => {
    const printWindow = window.open(pdfUrl, "_blank");

    if (printWindow) {
      printWindow.onload = function () {
        printWindow.print();
        printWindow.onafterprint = function () {
          printWindow.close();
        };
      };
    } else {
      console.error("Não foi possível abrir a janela de impressão.");
    }
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Grid container direction="column">
          <Grid item>
            <Typography variant="h6" sx={{ fontWeight: "bold", my: 0.5 }}>
              Orçamento {type === "job" ? "de Job" : "da Venda"} #{quote.number}
            </Typography>
          </Grid>
          <Grid item>
            {type === "job" ? (
              <>
                <Typography variant="body1">{quote.customer.name}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {quote.department}
                </Typography>
                <Typography variant="body2">{quote.service}</Typography>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  sx={{ my: 2 }}
                >
                  {users.length > 0 && (
                    <Grid container direction="column">
                      <Typography sx={{ fontSize: 13 }}>Colaborador</Typography>
                      <Tooltip
                        title={`${
                          users.find((user) => user.name === quote.user).name
                        }`}
                      >
                        <Avatar
                          alt="Imagem"
                          src={`http://localhost:3000/static/${
                            users.find((user) => user.name === quote.user)
                              ?.image
                          }`}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        />
                      </Tooltip>
                    </Grid>
                  )}
                </Grid>
                <Grid sx={{ mt: 1 }}>
                  {quote.materialsCost && (
                    <Typography variant="body2">
                      Valor dos Materiais: R${quote.materialsCost.toFixed(2)}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Valor do Orçamento: R${quote.value.toFixed(2)}
                  </Typography>
                </Grid>
              </>
            ) : (
              <>
                <Typography variant="body1">{quote.customer}</Typography>
                <Typography variant="body2">{quote.department}</Typography>
                <Typography variant="body2">{quote.service}</Typography>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  sx={{ my: 1 }}
                >
                  {quote.materials.length !== 0 && (
                    <>
                      <Typography sx={{ fontSize: 13 }}>
                        Produtos ({quote.materials.length})
                      </Typography>
                      <Grid container direction="row">
                        {quote.materials.slice(0, 3).map((item) => (
                          <Grid direction="column" key={item.id} sx={{ mr: 1 }}>
                            <Grid item>
                              <Avatar
                                alt="Imagem do Produto"
                                src={`http://localhost:3000/static/${item.image}`}
                                sx={{ width: 32, height: 32, mx: "auto" }}
                              />
                            </Grid>
                            <Grid item>
                              <Typography sx={{ fontSize: 10, color: "#777" }}>
                                x{item.quantity} {item.name}
                              </Typography>
                            </Grid>
                          </Grid>
                        ))}
                        {quote.materials.length > 3 && (
                          <Typography
                            sx={{
                              marginY: "auto",
                              fontSize: 24,
                              color: "#444",
                            }}
                          >
                            +{quote.materials.length - 3}
                          </Typography>
                        )}
                      </Grid>
                    </>
                  )}
                  {users.length > 0 && (
                    <Grid container direction="column" sx={{ my: 1 }}>
                      <Typography sx={{ fontSize: 13 }}>Vendedor</Typography>
                      <Tooltip
                        title={`${
                          users.find((user) => user.name === quote.user).name
                        }`}
                      >
                        <Avatar
                          alt="Imagem"
                          src={`http://localhost:3000/static/${
                            users.find((user) => user.name === quote.user)
                              ?.image
                          }`}
                          sx={{ width: 32, height: 32 }}
                        />
                      </Tooltip>
                    </Grid>
                  )}
                </Grid>
                <Grid sx={{ mt: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Valor do Orçamento: R${quote.value.toFixed(2)}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ mb: 1 }}>
        <Grid container justifyContent="center">
          <PictureAsPdfIcon
            cursor="pointer"
            onClick={() => openViewDialog(quote)}
          />
        </Grid>
      </CardActions>
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Visualização do Orçamento</DialogTitle>
        <DialogContent sx={{ backgroundColor: "#ccc", width: "100%", pl: 6 }}>
          <Box style={{ height: "auto" }}>
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
            >
              <Viewer fileUrl={pdfUrl} />
            </Worker>
          </Box>
        </DialogContent>
        <DialogActions sx={{ my: 1, mr: 2 }}>
          <Button
            onClick={handlePrint}
            color="primary"
            variant="contained"
            size="small"
          >
            Imprimir | Download
          </Button>
          <Button
            onClick={() => setViewDialogOpen(false)}
            color="primary"
            size="small"
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
