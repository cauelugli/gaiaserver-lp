require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
const mongoUrl = process.env.MONGO_URL;
let db;

async function connectDB() {
  const client = new MongoClient(mongoUrl);
  await client.connect();
  db = client.db();
  console.log("Conectado ao MongoDB!");
}

// Rota SIMPLES para cadastro (POST /leads)
app.post("/leads", async (req, res) => {
  try {
    const { nome, email } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ erro: "Nome e e-mail são obrigatórios" });
    }

    await db.collection("leads").insertOne({
      nome,
      email,
      plano: "solo",
      criadoEm: new Date(),
    });

    res.status(201).json({ sucesso: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Falha no servidor" });
  }
});

// Inicia o servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
  });
});
