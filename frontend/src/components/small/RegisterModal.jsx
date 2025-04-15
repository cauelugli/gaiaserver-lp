import * as React from "react";
import { useState } from "react";
import { MongoClient } from "mongodb"; // Adicionamos a importação do MongoClient

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
  const [isLoading, setIsLoading] = useState(false); // Adicionamos estado para loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Dados do lead
    const leadData = {
      name,
      email,
      plan: "solo",
      createdAt: new Date(), // Adicionamos data de criação
    };

    let client;
    try {
      // Conecta ao MongoDB
      client = new MongoClient(process.env.MONGO_URL);
      await client.connect();

      // Acessa a coleção (se não existir, será criada automaticamente)
      const db = client.db(); // Se precisar especificar o banco, use db('nome-do-banco')
      const leadsCollection = db.collection("leads");

      // Insere o novo documento
      const result = await leadsCollection.insertOne(leadData);

      console.log("Lead inserido com ID:", result.insertedId);
      alert("Cadastro realizado com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar lead no MongoDB:", error);
      alert(
        "Ocorreu um erro ao realizar o cadastro. Por favor, tente novamente."
      );
    } finally {
      if (client) {
        await client.close(); // Fecha a conexão
      }
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
