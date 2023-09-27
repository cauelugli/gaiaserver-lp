const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Configuração do armazenamento das imagens usando o multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/images")); // Define o diretório de destino das imagens
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage });

// Rota para fazer o upload de uma única imagem
router.post("/singleProduct", upload.single("image"), (req, res) => {
  try {
    // Se o arquivo foi carregado com sucesso, retornar o caminho do arquivo
    const imagePath = req.file ? "/images/" + req.file.filename : "";

    return res.status(200).json({ imagePath });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao fazer o upload da imagem." });
  }
});

module.exports = router;
