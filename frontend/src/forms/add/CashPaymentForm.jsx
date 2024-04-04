/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
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

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";

import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function CashPaymentForm({
  selectedFinanceIncome,
  openEdit,
  setOpenEdit,
  refreshData,
  configCustomization,
  setRefreshData,
  toast,
}) {
  const previousData = selectedFinanceIncome;
  const [date, setDate] = React.useState(dayjs());
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
      <DialogHeader title="Pagamento a Vista" femaleGender={false} />
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
                    {hasDiscount
                      ? (
                          (selectedFinanceIncome.price * (100 - discount)) /
                          100
                        ).toFixed(2)
                      : selectedFinanceIncome.price}
                  </Typography>
                </TableCell>

                <TableCell
                  align="center"
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={["DatePicker"]}
                      sx={{ py: 0 }}
                    >
                      <DatePicker
                        format="DD/MM/YYYY"
                        onChange={(newValue) => setDate(newValue)}
                        value={date}
                        sx={{
                          "& .MuiInputBase-root": {
                            height: 40,
                            width: 150,
                            mx: "auto",
                          },
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
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
                        return <Typography>Selecione um Método</Typography>;
                      }

                      return <Typography>{selected}</Typography>;
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
      <FormEndLineTenant configCustomization={configCustomization} />
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
