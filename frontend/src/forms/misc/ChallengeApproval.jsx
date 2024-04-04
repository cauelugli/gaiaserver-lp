/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function ChallengeApproval({
  user,
  selectedFinanceOutcome,
  entry,
  setOpen,
  refreshData,
  setRefreshData,
  toast,
}) {
  const [message, setMessage] = React.useState("");

  const handleChallenge = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/finances/challengeApproval", {
        selectedFinanceOutcomeId: selectedFinanceOutcome._id,
        entryId: entry._id,
        message,
        user,
      });
      if (res.data) {
        toast.success("Contestação Enviada ao Gerente!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        // const newNotification = {
        //   noteBody: `Olá! O colaborador ${user.name} contestou uma aprovação de Entrada de Estoque 
        //   com a seguinte mensagem: ${message}.`,
        //   sender: user.name,
        //   // receiver: "StockEntriesDispatcherDepartment",
        //   status: "Não Lida",
        // };
        setOpen(false);
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

  return (
    <form onSubmit={handleChallenge}>
      <DialogTitle sx={{ mb: 2 }}>Contestar Entrada de Estoque</DialogTitle>
      <DialogContent>
        <Typography>Mensagem de Contestação</Typography>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpen(false)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
