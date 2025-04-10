const express = require('express');
const app = express();
const PORT = 3001;

// Rota de exemplo
app.get('/api', (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}/api`);
});