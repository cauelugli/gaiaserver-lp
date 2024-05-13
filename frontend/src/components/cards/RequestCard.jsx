/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { io } from "socket.io-client";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const socket = io("http://localhost:3000");

import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  Dialog,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import JobTableActions from "../small/buttons/tableActionButtons/JobTableActions";
import SaleTableActions from "../small/buttons/tableActionButtons/SaleTableActions";
import ViewDialog from "../small/ViewDialog";
import AddAttachmentsForm from "../../forms/misc/AddAttachmentsForm";
import AddJobInteractionForm from "../../forms/misc/AddJobInteractionForm";
import EditJobForm from "../../forms/edit/EditJobForm";
import EditSaleForm from "../../forms/edit/EditSaleForm";

export default function RequestCard({
  request,
  type,
  userId,
  userName,
  userRole,
  refreshData,
  setRefreshData,
}) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [openAddInteraction, setOpenAddInteraction] = React.useState(false);
  const [openAddAttachments, setOpenAddAttachments] = React.useState(false);

  const handleManagerApproval = async () => {
    try {
      const requestBody = {
        jobId: request._id,
        status: "Aprovado",
        manager: request.manager,
        userName,
        date: dayjs().format("DD/MM/YYYY HH:mm"),
      };
      const res = await api.put("/jobs/managerApproval", requestBody);
      if (res.data) {
        toast.success("Job Aprovado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        setRefreshData(!refreshData);
      }
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
      console.error(err);
    }
  };

  const handleRequestApproval = async () => {
    try {
      const requestBody = {
        user: userName,
        jobId: request._id,
        jobManager: request.manager.name,
        date: dayjs().format("DD/MM/YYYY HH:mm"),
      };
      const res = await api.put("/jobs/requestApproval", requestBody);

      if (res.data) {
        toast.success("Aprovação Solicitada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        socket.emit("requestApproval", {
          sender: userName,
          receiver: request.manager.name,
          job: request,
          date: dayjs(Date.now()).format("DD/MM/YYYY HH:mm"),
        });
        socket.emit("newDataRefreshButton", {
          page: "requests",
          userId: userId,
        });
        setRefreshData(!refreshData);
      }
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  const addInteractionToJob = () => {
    setRefreshData(!refreshData);
  };

  return (
    <Card sx={{ maxWidth: 290 }} elevation={3}>
      <CardContent>
        <Typography gutterBottom variant="h6" sx={{ fontWeight: "bold" }}>
          {type === "job" ? request.title : `Venda #${request.quoteNumber}`}
        </Typography>
        <Typography variant="body1">
          Cliente: {request.customer.name}
        </Typography>
        <Grid container direction="row" alignItems="center" sx={{ mt: 1 }}>
          <Paper
            elevation={0}
            sx={{
              mr: 0.5,
              mb: 0.5,
              width: 9,
              height: 9,
              borderRadius: 50,
              backgroundColor: request.department.color,
            }}
          />
          <Typography variant="body2" sx={{ fontSize: 12 }}>
            {request.department.name}{" "}
            {type === "job" && ` - ${request.service.name}`}
          </Typography>
        </Grid>
        {type === "job" ? (
          <>
            <Grid sx={{ mt: 2 }}>
              <Grid container direction="row" alignItems="center">
                <Avatar
                  alt="Imagem do Colaborador"
                  src={`http://localhost:3000/static/${request.worker.image}`}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Typography variant="body2">{request.worker.name}</Typography>
              </Grid>
              <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                Agendado para:{" "}
                {request.selectedSchedule
                  ? request.selectedSchedule
                  : dayjs(request.scheduledTo).format("DD/MM/YY")}
              </Typography>
              <Typography variant="body2">Status: {request.status}</Typography>
            </Grid>
          </>
        ) : (
          <>
            <Grid sx={{ mt: 1 }}>
              <Grid container direction="row" alignItems="center">
                <>
                  {request.items.map((item) => (
                    <Grid
                      key
                      direction="column"
                      alignItems="center"
                      sx={{ mr: 1 }}
                    >
                      <Avatar
                        alt="Imagem do Produto"
                        src={`http://localhost:3000/static/${item.image}`}
                        sx={{ width: 34, height: 34, mx: "auto" }}
                      />
                      <Typography sx={{ fontSize: 11 }}>
                        x{item.quantity} {item.name}
                      </Typography>
                    </Grid>
                  ))}
                </>
              </Grid>
              <Grid
                container
                direction="row"
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <Avatar
                  alt="Imagem do Colaborador"
                  src={`http://localhost:3000/static/${request.seller.image}`}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Typography variant="body2">{request.seller.name}</Typography>
              </Grid>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Status: {request.status}
              </Typography>
              <Typography variant="body2" sx={{ mb: -1.5 }}>
                Valor da Venda: R${request.price.toFixed(2)}
              </Typography>
            </Grid>
          </>
        )}
      </CardContent>
      <CardActions>
        <Grid container justifyContent="center">
          {type === "job" ? (
            <JobTableActions
              fromCard
              userName={userName}
              userId={userId}
              userRole={userRole}
              selectedItem={request}
              job={request}
              handleManagerApproval={handleManagerApproval}
              handleRequestApproval={handleRequestApproval}
              handleOpenEdit={() => setOpenEdit(!openEdit)}
              handleOpenAddJobInteraction={setOpenAddInteraction}
              handleOpenAddAttachment={setOpenAddAttachments}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
            />
          ) : (
            <SaleTableActions
              fromCard
              userName={userName}
              userId={userId}
              selectedItem={request}
              sale={request}
              handleOpenEdit={() => setOpenEdit(!openEdit)}
              handleOpenAddSaleInteraction={setOpenAddInteraction}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
            />
          )}
        </Grid>
      </CardActions>

      {openEdit && type === "job" && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditJobForm
            userId={userId}
            openEditJob={openEdit}
            selectedJob={request}
            setOpenEditJob={setOpenEdit}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
      {openEdit && type === "sale" && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditSaleForm
            userId={userId}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
            selectedSale={request}
            setOpenAddSale={setOpenEdit}
          />
        </Dialog>
      )}
      {openAddInteraction && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openAddInteraction}
          onClose={() => setOpenAddInteraction(!openAddInteraction)}
        >
          <AddJobInteractionForm
            userId={userId}
            fromSales={type === "sale" && true}
            userName={userName}
            openEditJob={openAddInteraction}
            selectedJob={request}
            setOpenEditJob={setOpenAddInteraction}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
            addInteractionToJob={addInteractionToJob}
          />
        </Dialog>
      )}
      {openAddAttachments && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddAttachments}
          onClose={() => setOpenAddAttachments(!openAddAttachments)}
        >
          <AddAttachmentsForm
            userName={userName}
            userId={userId}
            selectedJob={request}
            setOpenAddAttachments={setOpenAddAttachments}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
            endpoint="jobs"
          />
        </Dialog>
      )}
      {openViewDialog && (
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          fullWidth
          maxWidth="lg"
        >
          <ViewDialog
            selectedItem={request}
            setOpenViewDialog={setOpenViewDialog}
          />
        </Dialog>
      )}
    </Card>
  );
}
