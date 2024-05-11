/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  Dialog,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";

import FinanceIncomeTableActions from "../small/buttons/tableActionButtons/FinanceIncomeTableActions";
import FinanceOutcomeTableActions from "../small/buttons/tableActionButtons/FinanceOutcomeTableActions";
import AddPaymentScheduleForm from "../../forms/add/AddPaymentScheduleForm";
import AddParcelPaymentForm from "../../forms/add/AddParcelPaymentForm";
import ChallengeApproval from "../../forms/misc/ChallengeApproval";
import CashPaymentForm from "../../forms/add/CashPaymentForm";

export default function FinanceCard({
  item,
  type,
  userId,
  refreshData,
  setRefreshData,
  configData,
  configCustomization,
}) {
  const [openSchedulePayment, setOpenSchedulePayment] = React.useState(false);
  const [openCashPayment, setOpenCashPayment] = React.useState(false);
  const [openAddParcelPayment, setOpenAddParcelPayment] = React.useState(false);
  const [openChallengeApproval, setOpenChallengeApproval] =
    React.useState(false);

  return (
    <Card elevation={3}>
      <CardContent>
        <Grid container direction="column">
          <Grid item>
            <Typography variant="h6" sx={{ fontWeight: "bold", my: 0.5 }}>
              {type === "income" ? `Orçamento #${item.quote}` : `${item.type}`}
            </Typography>
          </Grid>

          <Grid item>
            {type === "income" ? (
              <>
                <Typography variant="body2" sx={{ fontSize: 13 }}>
                  Tipo: {item.type === "job" ? "Job" : "Venda"}
                </Typography>
                {item.items.length !== 0 && (
                  <Grid sx={{ my: 2 }}>
                    <Typography variant="body2" sx={{ fontSize: 13 }}>
                      Itens:
                    </Typography>
                    <Grid container direction="row" alignItems="center">
                      <>
                        {item.items.map((item, index) => (
                          <Grid
                            key={index}
                            direction="column"
                            alignItems="center"
                            sx={{ mr: 2 }}
                          >
                            <Tooltip title={`x${item.quantity} ${item.name}`}>
                              <Avatar
                                alt="Imagem do Produto"
                                src={`http://localhost:3000/static/${item.image}`}
                                sx={{ width: 34, height: 34, mx: "auto" }}
                              />
                            </Tooltip>
                          </Grid>
                        ))}
                      </>
                    </Grid>
                  </Grid>
                )}
                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Departamento: {item.department}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Valor Total: R$
                  {item.finalPrice
                    ? item.finalPrice.toFixed(2)
                    : item.price.toFixed(2)}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Status: {item.status}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Criado em: {dayjs(item.createdAt).format("DD/MM/YY")}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body2" sx={{ fontSize: 13 }}>
                  Tipo: {item.type}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Departamento: {item.department}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Valor Total: R$
                  {item.finalPrice
                    ? item.finalPrice.toFixed(2)
                    : item.price.toFixed(2)}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Status: {item.status}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Criado em: {dayjs(item.createdAt).format("DD/MM/YY")}
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </CardContent>
      {item.status !== "Pago" && (
        <CardActions sx={{ mt: -3 }}>
          <Grid container justifyContent="center">
            {type === "income" ? (
              <FinanceIncomeTableActions
                configData={configData}
                income={item}
                handleOpenAddSchedulePayment={() =>
                  setOpenSchedulePayment(!openSchedulePayment)
                }
                handleOpenAddCashPayment={() =>
                  setOpenCashPayment(!openCashPayment)
                }
                handleOpenAddParcelPayment={() =>
                  setOpenAddParcelPayment(!openAddParcelPayment)
                }
              />
            ) : (
              <FinanceOutcomeTableActions
                outcome={item}
                handleOpenAddSchedulePayment={() =>
                  setOpenSchedulePayment(!openSchedulePayment)
                }
                handleOpenAddCashPayment={() =>
                  setOpenCashPayment(!openCashPayment)
                }
                handleOpenAddParcelPayment={() =>
                  setOpenAddParcelPayment(!openAddParcelPayment)
                }
                handleChallengeApproval={() =>
                  setOpenChallengeApproval(!openChallengeApproval)
                }
              />
            )}
          </Grid>
        </CardActions>
      )}
      {openAddParcelPayment && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openAddParcelPayment}
          onClose={() => setOpenAddParcelPayment(!openAddParcelPayment)}
        >
          <AddParcelPaymentForm
            userId={userId}
            selectedFinanceIncome={item}
            openEdit={openAddParcelPayment}
            configCustomization={configCustomization}
            setOpenEdit={setOpenAddParcelPayment}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
      {openCashPayment && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openCashPayment}
          onClose={() => setOpenCashPayment(!openCashPayment)}
        >
          <CashPaymentForm
            userId={userId}
            selectedFinanceIncome={item}
            openEdit={openCashPayment}
            setOpenEdit={setOpenCashPayment}
            configCustomization={configCustomization}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
      {openSchedulePayment && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openSchedulePayment}
          onClose={() => setOpenSchedulePayment(!openSchedulePayment)}
        >
          <AddPaymentScheduleForm
            userId={userId}
            openEdit={openSchedulePayment}
            selectedFinanceIncome={item}
            previousMaterials={item.materials}
            setOpenEdit={setOpenSchedulePayment}
            configCustomization={configCustomization}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
      {openChallengeApproval && type === "outcome" && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openChallengeApproval}
          onClose={() => setOpenChallengeApproval(!openChallengeApproval)}
        >
          <ChallengeApproval
            userId={userId}
            selectedFinanceOutcome={item}
            entry={item.entry}
            open={openChallengeApproval}
            setOpen={setOpenChallengeApproval}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
    </Card>
  );
}
