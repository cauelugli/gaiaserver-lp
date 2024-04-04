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

import { IMaskInput } from "react-imask";
import dayjs from "dayjs";

import DeleteIcon from "@mui/icons-material/Delete";
import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function AddPaymentScheduleForm({
  selectedFinanceIncome,
  setOpenEdit,
  refreshData,
  setRefreshData,
  configCustomization,
  toast,
}) {
  const previousData = selectedFinanceIncome;
  const [paymentMethod, setPaymentMethod] = React.useState("");
  const [paymentOption, setPaymentOption] = React.useState("Parcelado");
  const [paymentDates, setPaymentDates] = React.useState({});
  const [commonDay, setCommonDay] = React.useState(0);
  const parcels = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const [parcelQuantity, setParcelQuantity] = React.useState(1);
  const [hasParcelMonthlyFee, setHasParcelMonthlyFee] = React.useState(false);
  const [parcelMonthlyFee, setParcelMonthlyFee] = React.useState(2.99);
  const [hasDiscount, setHasDiscount] = React.useState(false);
  const [discount, setDiscount] = React.useState(10);
  const [cashPaymentDate, setCashPaymentDate] = React.useState(dayjs());

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
        parcelValue: hasParcelMonthlyFee
          ? (previousData.price / parcelQuantity) * (1 + parcelMonthlyFee / 100)
          : previousData.price / parcelQuantity,
        finalPrice: hasParcelMonthlyFee
          ? (
              (previousData.price / parcelQuantity) *
              (1 + parcelMonthlyFee / 100) *
              parcelQuantity
            ).toFixed(2)
          : previousData.price.toFixed(2),
        cashPaymentDate,
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
      setOpenEdit(false);
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
    setCommonDay(selectedCommonDay);
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

      if (i < parcelQuantity) {
        updatedPaymentDates[i] = optionValue;
      }
    }
    setPaymentDates(updatedPaymentDates);
  };

  return (
    <form onSubmit={handleEdit}>
      <DialogHeader title="Agendamento de Pagamento" femaleGender={false} />
      <DialogContent>
        <Typography sx={{ my: 1, ml: 4, fontSize: 18, fontWeight: "bold" }}>
          Informações
        </Typography>
        <Box sx={{ px: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontSize: 13, color: "#777" }}>
                    Orçamento
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 13, color: "#777" }}>
                    Serviço
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 13, color: "#777" }}>
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
        <Grid container sx={{ mt: 4 }}>
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
              value="Parcela Única"
              control={<Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />}
              label={
                <Typography sx={{ fontSize: 13 }}>Parcela Única</Typography>
              }
            />
            <FormControlLabel
              value="Parcelado"
              control={<Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />}
              label={<Typography sx={{ fontSize: 13 }}>Parcelado</Typography>}
            />
          </RadioGroup>
        </Grid>

        {paymentOption === "Parcela Única" && (
          <Box sx={{ px: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, color: "#777" }}>
                      Valor
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: 13, color: "#777" }}>
                      Método de Pagamento
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: 13, color: "#777" }}>
                      Data de Pagamento
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: 13, color: "#777" }}>
                      Desconto?
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: 13, color: "#777" }}>
                      Taxa de Desconto
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: 13, color: "#777" }}>
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
                        <Typography sx={{ fontSize: 13 }}>
                          Selecione um Método
                        </Typography>
                      </MenuItem>
                      <MenuItem value={"Dinheiro"}>
                        <Typography sx={{ fontSize: 13 }}>Dinheiro</Typography>
                      </MenuItem>
                      <MenuItem value={"Cartão de Débito"}>
                        <Typography sx={{ fontSize: 13 }}>
                          Cartão de Débito
                        </Typography>
                      </MenuItem>
                      <MenuItem value={"Cartão de Crédito"}>
                        <Typography sx={{ fontSize: 13 }}>
                          Cartão de Crédito
                        </Typography>
                      </MenuItem>
                      <MenuItem value={"Boleto"}>
                        <Typography sx={{ fontSize: 13 }}>Boleto</Typography>
                      </MenuItem>
                      <MenuItem value={"Pix"}>
                        <Typography sx={{ fontSize: 13 }}>Pix</Typography>
                      </MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="left">
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
                      onAccept={(value) => setCashPaymentDate(value)}
                      overwrite
                      value={cashPaymentDate}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <Switch
                      size="small"
                      checked={hasDiscount}
                      onChange={(e) => setHasDiscount(e.target.checked)}
                    />
                  </TableCell>
                  <TableCell align="left">
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
                    />{" "}
                  </TableCell>
                  <TableCell align="left">
                    <Typography>
                      R$
                      {hasDiscount
                        ? (
                            previousData.price -
                            previousData.price * (discount / 100)
                          ).toFixed(2)
                        : previousData.price.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        )}
        {paymentOption === "Parcelado" && (
          <>
            <Box sx={{ px: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Valor
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Método de Pagamento
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Quantidade de Parcelas
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Juros Mensais?
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Alíquota
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
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
                          <Typography sx={{ fontSize: 13 }}>
                            Selecione um Método
                          </Typography>
                        </MenuItem>
                        <MenuItem value={"Cartão de Crédito"}>
                          <Typography sx={{ fontSize: 13 }}>
                            Cartão de Crédito
                          </Typography>
                        </MenuItem>
                        <MenuItem value={"Boleto"}>
                          <Typography sx={{ fontSize: 13 }}>Boleto</Typography>
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
                              <Typography sx={{ fontSize: 13 }}>
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
                        onChange={(e) =>
                          setHasParcelMonthlyFee(e.target.checked)
                        }
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
            <Typography
              sx={{ my: 1, mt: 6, ml: 4, fontSize: 18, fontWeight: "bold" }}
            >
              Datas de Vencimento
            </Typography>
            <Box sx={{ px: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Dia do Mês
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 13, color: "#777" }}>
                        Datas
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
                              sx={{ mr: 2, my: 0.5, width: 185 }}
                            >
                              <Typography
                                sx={{
                                  px: 1.5,
                                  py: 1,
                                  border: "1px solid #ccc",
                                  borderRadius: 1,
                                  fontSize: 13,
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
                            currentDate.setMonth(
                              currentDate.getMonth() + index
                            );

                            const lastDayOfMonth = new Date(
                              currentDate.getFullYear(),
                              currentDate.getMonth(),
                              0
                            ).getDate();

                            const isDisabled = index >= parcelQuantity;

                            return (
                              <Grid
                                item
                                key={index + 1}
                                sx={{ marginRight: 2 }}
                              >
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
                                    <Typography sx={{ fontSize: 13 }}>
                                      {selected || "Selecione uma Data"}
                                    </Typography>
                                  )}
                                >
                                  {[...Array(lastDayOfMonth)].map(
                                    (_, dayIndex) => {
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
                                      const displayMonth =
                                        currentDate.getMonth() + 1;
                                      const displayYear =
                                        currentDate.getFullYear();

                                      const optionValue = `${displayDay}/${displayMonth}/${displayYear}`;

                                      return (
                                        <MenuItem
                                          key={dayIndex}
                                          value={optionValue}
                                        >
                                          <Typography sx={{ fontSize: 13 }}>
                                            {optionValue}
                                          </Typography>
                                        </MenuItem>
                                      );
                                    }
                                  )}
                                </Select>
                              </Grid>
                            );
                          })}
                        </Grid>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </>
        )}
      </DialogContent>
      <FormEndLineTenant configCustomization={configCustomization} />
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenEdit(false)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
