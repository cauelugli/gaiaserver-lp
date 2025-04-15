import * as React from "react";
import { useState } from "react";
import dotenv from "dotenv";
dotenv.config();

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function RegisterModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar");
      }

      alert("Cadastro realizado com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao enviar lead:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="E-mail"
              variant="outlined"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "OK"}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onClose}
            sx={{ mr: 2 }}
            disabled={isLoading}
          >
            X
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
