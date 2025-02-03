/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

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
  selectedFinanceOutcome,
  entry,
  setOpen,
  refreshData,
  setRefreshData,
  toast,
  userId,
}) {
  const [message, setMessage] = React.useState("");

  const handleChallenge = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/finances/challengeApproval", {
        selectedFinanceOutcomeId: selectedFinanceOutcome._id,
        entryId: entry._id,
      });
      if (res.data) {
        toast.success("Contestação Enviada ao Gerente!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        socket.emit("newDataRefreshButton", {
          page: "finance",
          userId: userId,
        });
        setOpen(false);
        setRefreshData(!refreshData);
        api.post("/log", {
          source: userId,
          target: res.data,
          label: "Contestação",
          type: "challengeRequest",
        });
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
