import { MongoClient } from 'mongodb';
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email } = req.body;

    const leadData = {
      name,
      email,
      plan: "solo",
      createdAt: new Date()
    };

    let client;
    try {
      client = new MongoClient(process.env.MONGO_URL);
      await client.connect();
      
      const db = client.db();
      const result = await db.collection('leads').insertOne(leadData);
      
      res.status(200).json({ success: true, id: result.insertedId });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    } finally {
      if (client) await client.close();
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}