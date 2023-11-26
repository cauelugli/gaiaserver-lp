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
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function AddPaymentScheduleForm({
  selectedFinanceIncome,
  openEdit,
  setOpenEdit,
  refreshData,
  setRefreshData,
  toast,
}) {
  const previousData = selectedFinanceIncome;
  const [paymentMethod, setPaymentMethod] = React.useState("");
  const [paymentOption, setPaymentOption] = React.useState("Parcelado");
  const [paymentDates, setPaymentDates] = React.useState({});
  const [commonDay, setCommonDay] = React.useState(0);
  const parcels = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const [parcelQuantity, setParcelQuantity] = React.useState(2);
  const [hasParcelMonthlyFee, setHasParcelMonthlyFee] = React.useState(false);
  const [parcelMonthlyFee, setParcelMonthlyFee] = React.useState(2.99);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/finances/schedulePayment  ", {
        id: selectedFinanceIncome._id,
        paymentMethod,
        paymentOption,
        parcelQuantity,
        hasParcelMonthlyFee,
        parcelMonthlyFee,
        paymentDates,
        finalPrice: hasParcelMonthlyFee
          ? (
              (previousData.price / parcelQuantity) *
              (1 + parcelMonthlyFee / 100) *
              parcelQuantity
            ).toFixed(2)
          : previousData.price,
        previousData,
      });
      if (res.data) {
        toast.success("Agendamento de Pagamento Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenEdit(!openEdit);
      setRefreshData(!refreshData);
    } catch (err) {
      if (err.response && err.response.status === 422) {
        toast.error(err.response.data.error, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      } else {
        console.log(err);
        toast.error("Houve algum erro...", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
    }
  };

  const [tableBodyResetKey, setTableBodyResetKey] = React.useState(0);

  const handleParcelQuantityChange = (event) => {
    setParcelQuantity(event.target.value);
    setCommonDay(0);
    setPaymentDates({});
    setTableBodyResetKey((prevKey) => prevKey + 1);
  };

  const handleChangeCommonDay = (e) => {
    const selectedCommonDay = Number(e.target.value);

    // Atualizar o estado commonDay
    setCommonDay(selectedCommonDay);

    // Atualizar as datas de vencimento apenas para os itens não desabilitados
    const updatedPaymentDates = { ...paymentDates };

    for (let i = 0; i < 12; i++) {
      const currentDate = new Date();
      currentDate.setDate(selectedCommonDay);
      currentDate.setMonth(currentDate.getMonth() + i);

      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();

      const optionValue = `${selectedCommonDay}/${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`;

      // Atualizar apenas se não estiver desabilitado
      if (i < parcelQuantity) {
        updatedPaymentDates[i] = optionValue;
      }
    }

    // Atualizar o estado paymentDates
    setPaymentDates(updatedPaymentDates);
  };

  return (
    <form onSubmit={handleEdit}>
      <DialogTitle>Agendamento de Pagamento</DialogTitle>
      <DialogContent>
        <Typography sx={{ my: 1, ml: 4, fontSize: 18, fontWeight: "bold" }}>
          Informações
        </Typography>
        <Box sx={{ px: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontSize: 14, color: "#777" }}>
                    Orçamento
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 14, color: "#777" }}>
                    Serviço
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 14, color: "#777" }}>
                    Departamento
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography>{previousData.quote}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography>{previousData.service}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography>{previousData.department}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
        <Grid container sx={{ mt: 3 }}>
          <Typography
            sx={{ my: 2, ml: 4, mr: 2, fontSize: 18, fontWeight: "bold" }}
          >
            Forma de Pagamento
          </Typography>
          <RadioGroup
            row
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value)}
          >
            <FormControlLabel
              value="A vista"
              control={<Radio size="small" sx={{ mt: -0.25, mr: -1 }} />}
              label={<Typography sx={{ fontSize: 14 }}>A vista</Typography>}
            />
            <FormControlLabel
              value="Parcelado"
              control={<Radio size="small" sx={{ mt: -0.25, mr: -1 }} />}
              label={<Typography sx={{ fontSize: 14 }}>Parcelado</Typography>}
            />
          </RadioGroup>
        </Grid>

        {paymentOption === "A vista" && (
          <>
            <Grid item sx={{ mb: 2, mr: 4 }}>
              <Typography sx={{ mb: 1 }}>Método de Pagamento</Typography>
              <Select
                size="small"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                displayEmpty
              >
                <MenuItem disabled value={""}>
                  <Typography sx={{ fontSize: 14 }}>
                    Selecione um Método
                  </Typography>
                </MenuItem>
                <MenuItem value={"Dinheiro"}>
                  <Typography sx={{ fontSize: 14 }}>Dinheiro</Typography>
                </MenuItem>
                <MenuItem value={"Cartão de Débito"}>
                  <Typography sx={{ fontSize: 14 }}>
                    Cartão de Débito
                  </Typography>
                </MenuItem>
                <MenuItem value={"Cartão de Crédito"}>
                  <Typography sx={{ fontSize: 14 }}>
                    Cartão de Crédito
                  </Typography>
                </MenuItem>
                <MenuItem value={"Boleto"}>
                  <Typography sx={{ fontSize: 14 }}>Boleto</Typography>
                </MenuItem>
                <MenuItem value={"Pix"}>
                  <Typography sx={{ fontSize: 14 }}>Pix</Typography>
                </MenuItem>
              </Select>
            </Grid>
            {paymentMethod && <p>date</p>}
          </>
        )}
        {paymentOption === "Parcelado" && (
          <Box sx={{ px: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography sx={{ fontSize: 14, color: "#777" }}>
                      Valor
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: 14, color: "#777" }}>
                      Método de Pagamento
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: 14, color: "#777" }}>
                      Quantidade de Parcelass
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: 14, color: "#777" }}>
                      Juros Mensais?
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: 14, color: "#777" }}>
                      Alíquota
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: 14, color: "#777" }}>
                      Valor Final
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography>R${previousData.price.toFixed(2)}</Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Select
                      size="small"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      displayEmpty
                      required
                    >
                      <MenuItem disabled value={""}>
                        <Typography sx={{ fontSize: 14 }}>
                          Selecione um Método
                        </Typography>
                      </MenuItem>
                      <MenuItem value={"Cartão de Crédito"}>
                        <Typography sx={{ fontSize: 14 }}>
                          Cartão de Crédito
                        </Typography>
                      </MenuItem>
                      <MenuItem value={"Boleto"}>
                        <Typography sx={{ fontSize: 14 }}>Boleto</Typography>
                      </MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="left">
                    <Select
                      size="small"
                      value={parcelQuantity}
                      required
                      onChange={(event) => handleParcelQuantityChange(event)}
                    >
                      {parcels.map((numParcels) => {
                        const value = hasParcelMonthlyFee
                          ? (previousData.price / numParcels) *
                            (1 + parcelMonthlyFee / 100)
                          : previousData.price / numParcels;

                        return (
                          <MenuItem key={numParcels} value={numParcels}>
                            <Typography sx={{ fontSize: 14 }}>
                              {`${numParcels}x`} de R${value.toFixed(2)}
                            </Typography>
                          </MenuItem>
                        );
                      })}
                    </Select>{" "}
                  </TableCell>
                  <TableCell align="left">
                    <Switch
                      size="small"
                      checked={hasParcelMonthlyFee}
                      onChange={(e) => setHasParcelMonthlyFee(e.target.checked)}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <OutlinedInput
                      size="small"
                      disabled={!hasParcelMonthlyFee}
                      sx={{ width: 135 }}
                      value={parcelMonthlyFee}
                      onChange={(e) => setParcelMonthlyFee(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end" sx={{ mx: -0.8 }}>
                          % ao mês
                        </InputAdornment>
                      }
                    />{" "}
                  </TableCell>
                  <TableCell align="left">
                    <Typography>
                      R$
                      {hasParcelMonthlyFee
                        ? (
                            (previousData.price / parcelQuantity) *
                            (1 + parcelMonthlyFee / 100) *
                            parcelQuantity
                          ).toFixed(2)
                        : previousData.price.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        )}
        <Typography
          sx={{ my: 1, mt: 3, ml: 4, fontSize: 18, fontWeight: "bold" }}
        >
          Data de Vencimento
        </Typography>
        <Box sx={{ px: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontSize: 14, color: "#777" }}>
                    Todo dia
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 14, color: "#777" }}>
                    Datas de Vencimento
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 14, color: "#777" }}>
                    Confirma
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody key={tableBodyResetKey}>
              <TableRow>
                <TableCell>
                  <Grid
                    container
                    direction="column"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    sx={{ ml: -1, mr: 2 }}
                  >
                    <Select
                      size="small"
                      value={commonDay}
                      onChange={handleChangeCommonDay}
                      sx={{ width: 80 }}
                      displayEmpty
                      renderValue={(selected) => selected || 0}
                    >
                      <MenuItem value="" disabled>
                        0
                      </MenuItem>
                      {[...Array(29)].map((_, index) => (
                        <MenuItem key={index + 1} value={index + 1}>
                          {index + 1}
                        </MenuItem>
                      ))}
                    </Select>
                    <Button
                      sx={{ mt: 1 }}
                      color="error"
                      disabled={commonDay === 0}
                      startIcon={<DeleteIcon sx={{ ml: -1 }} />}
                      onClick={() => setCommonDay(0)}
                      variant="contained"
                    >
                      <Typography sx={{ fontSize: 12, mr: -1 }}>
                        Limpar
                      </Typography>
                    </Button>
                  </Grid>
                </TableCell>
                <TableCell align="left">
                  {commonDay !== 0 ? (
                    <Grid
                      container
                      direction="row"
                      alignItems="flex-start"
                      justifyContent="flex-start"
                    >
                      {Object.keys(paymentDates).map((key) => (
                        <Grid
                          item
                          key={key}
                          sx={{ mr: 2, my: 0.5, width: 180 }}
                        >
                          <Typography
                            sx={{
                              p: 1.5,
                              border: "1px solid #ccc",
                              borderRadius: 2,
                              fontSize: 14,
                            }}
                          >
                            {`${parseInt(key, 10) + 1}ª Parcela`} :{" "}
                            {paymentDates[key]}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Grid container direction="row">
                      {[...Array(12)].map((_, index) => {
                        const currentDate = new Date();
                        currentDate.setDate(commonDay);
                        currentDate.setMonth(currentDate.getMonth() + index);

                        const lastDayOfMonth = new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          0
                        ).getDate();

                        const isDisabled = index >= parcelQuantity;

                        return (
                          <Grid item key={index + 1} sx={{ marginRight: 2 }}>
                            <Select
                              size="small"
                              sx={{
                                width: 180,
                                my: 0.5,
                              }}
                              displayEmpty
                              onChange={(e) => {
                                const selectedValue = e.target.value;
                                const newDates = {
                                  ...paymentDates,
                                  [index]: selectedValue,
                                };
                                setPaymentDates(newDates);
                                console.log("newDates", newDates);
                              }}
                              disabled={isDisabled}
                              renderValue={(selected) => (
                                <Typography sx={{ fontSize: 14 }}>
                                  {selected || "Selecione uma Data"}
                                </Typography>
                              )}
                            >
                              {[...Array(lastDayOfMonth)].map((_, dayIndex) => {
                                const currentDate = new Date();
                                currentDate.setDate(commonDay);

                                // Adiciona o índice do mês ao currentDate
                                currentDate.setMonth(
                                  currentDate.getMonth() + index
                                );

                                // Adiciona o índice do dia ao currentDate
                                currentDate.setDate(
                                  currentDate.getDate() + dayIndex
                                );

                                const displayDay = currentDate.getDate();
                                const displayMonth = currentDate.getMonth() + 1;
                                const displayYear = currentDate.getFullYear();

                                const optionValue = `${displayDay}/${displayMonth}/${displayYear}`;

                                return (
                                  <MenuItem key={dayIndex} value={optionValue}>
                                    <Typography sx={{ fontSize: 14 }}>
                                      {optionValue}
                                    </Typography>
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
                </TableCell>

                <TableCell>Confirmazione</TableCell>
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
