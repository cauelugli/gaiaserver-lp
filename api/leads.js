import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Método não permitido" });
  }

  const { name, email, plan } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: "Nome e e-mail são obrigatórios",
    });
  }

  let client;
  try {
    client = await MongoClient.connect(process.env.MONGO_URL);
    const db = client.db();
    await db.collection("leads").insertOne({
      name,
      email,
      plan: plan || "solo",
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Lead cadastrado com sucesso",
    });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({
      success: false,
      error: "Erro no servidor",
    });
  } finally {
    if (client) await client.close();
  }
}
