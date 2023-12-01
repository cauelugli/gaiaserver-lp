/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { IMaskInput } from "react-imask";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function AddParcelPaymentForm({
  selectedFinanceIncome,
  openEdit,
  setOpenEdit,
  refreshData,
  setRefreshData,
  toast,
}) {
  const previousData = selectedFinanceIncome;
  const [paymentData, setPaymentData] = React.useState([]);

  const initializePaymentData = () => {
    const initialData = Object.keys(
      selectedFinanceIncome.payment.paymentDates
    ).map((key) => ({
      paidAt: "",
      paymentMethod: "",
      date: selectedFinanceIncome.payment.paymentDates[key].date,
    }));
    setPaymentData(initialData);
  };

  React.useEffect(() => {
    initializePaymentData();
  }, [selectedFinanceIncome.payment.paymentDates]);

  const [selectedParcels, setSelectedParcels] = React.useState([]);
  const handleAddButtonClick = (index) => {
    const updatedSelectedParcels = [...selectedParcels];
    updatedSelectedParcels[index] = true;
    setSelectedParcels(updatedSelectedParcels);
  };

  const handleUncheck = (index) => {
    const updatedSelectedParcels = [...selectedParcels];
    updatedSelectedParcels[index] = false;
    setSelectedParcels(updatedSelectedParcels);
  };

  const handlePaymentMethodChange = (event, index) => {
    setPaymentData((prevPaymentData) => {
      const updatedPaymentData = [...prevPaymentData];
      updatedPaymentData[index] = {
        ...updatedPaymentData[index],
        paymentMethod: event.target.value,
      };
      return updatedPaymentData;
    });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/finances/receivePayment/parcel", {
        id: selectedFinanceIncome._id,
        previousData,
        paymentData,
      });
      if (res.data) {
        toast.success("Parcelas Recebidas!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenEdit(!openEdit);
      setRefreshData(!refreshData);
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  return (
    <form onSubmit={handleEdit}>
      <DialogTitle
        sx={{ textAlign: "center", my: 1, fontSize: 24, fontWeight: "bold" }}
      >
        Recebimento de Parcelas
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ my: 1, ml: 4, fontSize: 18, fontWeight: "bold" }}>
          Parcelas
        </Typography>
        <Box sx={{ px: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontSize: 13, color: "#777" }}>
                    Selecionar
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 13, color: "#777" }}>
                    Número
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 13, color: "#777" }}>
                    Valor
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 13, color: "#777" }}>
                    Data de Vencimento
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 13, color: "#777" }}>
                    Data de Pagamento
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 13, color: "#777" }}>
                    Status da Parcela
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(selectedFinanceIncome.payment.paymentDates).map(
                (key, index) => {
                  const item = selectedFinanceIncome.payment.paymentDates[key];
                  return (
                    <TableRow key={key}>
                      <TableCell>
                        {item.status === "Pago" ? (
                          <Checkbox sx={{ ml: 0.8, py: 0 }} disabled checked />
                        ) : (
                          <Button
                            disabled={selectedParcels[index]}
                            sx={{ color: "darkgreen" }}
                            cursor="pointer"
                            onClick={() => handleAddButtonClick(index)}
                            startIcon={<AddCircleIcon sx={{ py: 0 }} />}
                          />
                        )}
                      </TableCell>
                      <TableCell align="left">
                        <Typography
                          sx={{
                            fontSize: 13,
                            color:
                              item.status === "Pago" ? "darkgreen" : "black",
                          }}
                        >
                          {index + 1}/
                          {selectedFinanceIncome.payment.parcelQuantity}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          sx={{
                            fontSize: 13,
                            color:
                              item.status === "Pago" ? "darkgreen" : "black",
                          }}
                        >
                          R${item.parcelValue}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          sx={{
                            fontSize: 13,
                            color:
                              item.status === "Pago" ? "darkgreen" : "black",
                          }}
                        >
                          {item.date}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          sx={{
                            fontSize: 13,
                            color:
                              item.status === "Pago" ? "darkgreen" : "black",
                          }}
                        >
                          {item.paidAt ? item.paidAt : "-"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          sx={{
                            fontSize: 13,
                            color:
                              item.status === "Pago" ? "darkgreen" : "black",
                          }}
                        >
                          {item.status}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </Box>
        {selectedParcels.some((isSelected) => isSelected) && (
          <>
            <Typography
              sx={{ my: 1, mt: 3, ml: 4, fontSize: 18, fontWeight: "bold" }}
            >
              Selecionadas
            </Typography>
            <Box sx={{ px: 3, mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Remover
                      </Typography>
                    </TableCell>
                    <TableCell align="left" sx={{ ml: 2 }}>
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Número
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Valor
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Data de Vencimento
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Data de Pagamento
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Forma de Pagamento
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedParcels.map((isSelected, index) => {
                    if (isSelected) {
                      const item =
                        selectedFinanceIncome.payment.paymentDates[index];

                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Button
                              cursor="pointer"
                              onClick={() => handleUncheck(index)}
                              color="error"
                              startIcon={<DeleteIcon />}
                            />
                          </TableCell>
                          <TableCell>
                            {`${index + 1}/${
                              selectedFinanceIncome.payment.parcelQuantity
                            }`}
                          </TableCell>
                          <TableCell align="center">
                            R${item.parcelValue}
                          </TableCell>
                          <TableCell align="center">{item.date}</TableCell>
                          <TableCell align="center">
                            <Grid item>
                              <IMaskInput
                                required
                                style={{
                                  width: "40%",
                                  padding: "3%",
                                  marginTop: "1%",
                                  borderColor: "#eee",
                                }}
                                mask="00/00/0000"
                                definitions={{
                                  "#": /[0-9]/,
                                }}
                                onAccept={(value) => {
                                  const updatedPaymentData = [...paymentData];
                                  updatedPaymentData[index] = {
                                    ...updatedPaymentData[index],
                                    paidAt: value,
                                  };
                                  setPaymentData(updatedPaymentData);
                                }}
                                value={paymentData[index].paidAt}
                              />
                            </Grid>
                          </TableCell>
                          <TableCell align="center">
                            <Select
                              displayEmpty
                              required
                              size="small"
                              value={paymentData[index].paymentMethod}
                              onChange={(event) =>
                                handlePaymentMethodChange(event, index)
                              }
                              renderValue={(selected) => {
                                if (!selected) {
                                  return "Selecione um Método";
                                }

                                return selected; // Ou qualquer outra lógica personalizada que você desejar para exibir o valor selecionado.
                              }}
                            >
                              <MenuItem disabled value="">
                                <em>Selecione um Método</em>
                              </MenuItem>
                              <MenuItem value={"Dinheiro"}>Dinheiro</MenuItem>
                              <MenuItem value={"Boleto"}>Boleto</MenuItem>
                              <MenuItem value={"Cartão de Crédito"}>
                                Cartão de Crédito
                              </MenuItem>
                              <MenuItem value={"Cartão de Débito"}>
                                Cartão de Débito
                              </MenuItem>
                              <MenuItem value={"Pix"}>Pix</MenuItem>
                            </Select>
                          </TableCell>
                        </TableRow>
                      );
                    }
                    return null;
                  })}
                </TableBody>
              </Table>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenEdit(!openEdit)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
