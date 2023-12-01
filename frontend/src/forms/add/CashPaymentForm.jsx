/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { IMaskInput } from "react-imask";
import dayjs from "dayjs";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function CashPaymentForm({
  selectedFinanceIncome,
  openEdit,
  setOpenEdit,
  refreshData,
  setRefreshData,
  toast,
}) {
  const previousData = selectedFinanceIncome;
  const [date, setDate] = React.useState(dayjs().format("DD/MM/YYYY"));
  const [method, setMethod] = React.useState("");
  const [hasDiscount, setHasDicount] = React.useState(false);
  const [discount, setDiscount] = React.useState(10);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const calculatedFinalPrice = hasDiscount
        ? (selectedFinanceIncome.price * (100 - discount)) / 100
        : selectedFinanceIncome.price;

      const res = await api.put("/finances/receivePayment/cash", {
        id: selectedFinanceIncome._id,
        date,
        method,
        hasDiscount,
        discount,
        previousData,
        finalPrice: calculatedFinalPrice.toFixed(2),
      });
      if (res.data) {
        toast.success("Pagamento Recebido!", {
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
        Pagamento a Vista
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ m: 1, fontSize: 18, fontWeight: "bold" }}>
          Dados do Pagamento
        </Typography>
        <Box sx={{ px: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontSize: 13, color: "#777" }}>
                    Valor
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 13, color: "#777" }}>
                    Desconto?
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 13, color: "#777" }}>
                    Valor do Desconto
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 13, color: "#777" }}>
                    Valor Final
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 13, color: "#777" }}>
                    Data de Pagamento
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 13, color: "#777" }}>
                    Método de Pagamento
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  R${selectedFinanceIncome.price.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <Switch
                    size="small"
                    checked={hasDiscount}
                    onChange={(e) => setHasDicount(e.target.checked)}
                  />
                </TableCell>
                <TableCell align="center">
                  <OutlinedInput
                    size="small"
                    disabled={!hasDiscount}
                    sx={{ width: 80 }}
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end" sx={{ mx: -0.8 }}>
                        %
                      </InputAdornment>
                    }
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography
                    sx={{ fontSize: 13 }}
                    color={hasDiscount ? "darkgreen" : "#777"}
                  >
                    R$
                    {(
                      (selectedFinanceIncome.price * (100 - discount)) /
                      100
                    ).toFixed(2)}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <IMaskInput
                    style={{
                      width: 100,
                      padding: "1%",
                      marginRight: "4%",
                      marginTop: "1%",
                      borderColor: "#eee",
                      borderRadius: 4,
                    }}
                    mask="00/00/0000"
                    definitions={{
                      "#": /[1-9]/,
                    }}
                    onAccept={(value) => setDate(value)}
                    overwrite
                    value={date}
                  />
                </TableCell>
                <TableCell align="center">
                  <Select
                    displayEmpty
                    required
                    size="small"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <Typography sx={{ fontSize: 13 }}>
                            Selecione um Método
                          </Typography>
                        );
                      }

                      return (
                        <Typography sx={{ fontSize: 13 }}>
                          {selected}
                        </Typography>
                      );
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
            </TableBody>
          </Table>
        </Box>
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
