import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";

export default function RegisterModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const API_URL = "http://localhost:4000/leads";

  const handleSubmit = async () => {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          Cadastre-se para receber um Código de Acesso
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
            <TextField
              label="Nome"
              variant="outlined"
              required
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              label="E-mail"
              variant="outlined"
              required
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button type="submit" variant="contained" color="success">
            OK
          </Button>

          <Button variant="contained" color="error" onClick={onClose}>
            Cancelar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
