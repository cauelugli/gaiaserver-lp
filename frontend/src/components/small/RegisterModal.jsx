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
  CircularProgress,
} from "@mui/material";

export default function RegisterModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          plan: "solo",
        }),
      });

      // Verifica se o endpoint existe
      if (response.status === 404) {
        throw new Error(
          "Endpoint não encontrado (404). Verifique a rota da API."
        );
      }

      // Verifica outros erros HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        alert("Cadastro realizado com sucesso!");
        onClose();
        setName("");
        setEmail("");
      } else {
        throw new Error(data.error || "Erro desconhecido");
      }
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setError(err.message);
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
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />

            <TextField
              label="E-mail"
              variant="outlined"
              required
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            {error && (
              <Typography color="error" variant="body2">
                Erro: {error}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? "Enviando..." : "OK"}
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
