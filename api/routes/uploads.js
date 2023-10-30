const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");
const StockItem = require("../models/StockItem");
const User = require("../models/User");
const Manager = require("../models/Manager");

// Configuração do armazenamento das imagens usando o multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/images")); // Define o diretório de destino das imagens
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// CREATE SINGLE FILE
router.post("/singleProduct", upload.single("image"), (req, res) => {
  try {
    // Se o arquivo foi carregado com sucesso, retornar o caminho do arquivo
    const imagePath = req.file ? "/images/" + req.file.filename : "";
    return res.status(200).json({ imagePath });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao fazer o upload do arquivo." });
  }
});

// GET ALL FILES
router.get("/listFiles", async (req, res) => {
  const directory = path.join(__dirname, "../../uploads/images");
  fs.readdir(directory, async (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao listar os arquivos." });
    }
    // Coleta os IDs de imagens usadas nos modelos
    const inUse = [];

    try {
      const products = await Product.find();
      inUse.push(...products.map((product) => product.image));

      const stockItems = await StockItem.find();
      inUse.push(...stockItems.map((stockItem) => stockItem.image));

      const users = await User.find();
      inUse.push(...users.map((user) => user.image));

      const managers = await Manager.find();
      inUse.push(...managers.map((manager) => manager.image));

      let totalSpace = 0;

      files.forEach((file) => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);
        totalSpace += stats.size;
      });

      const totalSpaceInMB = (totalSpace / (1024 * 1024)).toFixed(2);

      const filesWithSizes = files.map((file) => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);
        const fileSizeInKB = Math.round(stats.size / 1024);

        return {
          name: file,
          sizeKB: fileSizeInKB,
        };
      });

      return res.status(200).json({
        files: filesWithSizes,
        totalSpaceMB: totalSpaceInMB,
        inUse: inUse, // Lista de IDs das imagens em uso
      });
    } catch (error) {
      console.error("Erro ao buscar imagens em uso:", error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar imagens em uso." });
    }
  });
});

// DELETE SINGLE FILE
router.delete("/deleteFile/:filename", (req, res) => {
  const directory = path.join(__dirname, "../../uploads/images");
  const filePath = path.join(directory, req.params.filename);

  // Verifique se o arquivo existe
  if (fs.existsSync(filePath)) {
    // Exclua o arquivo
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao excluir o arquivo." });
      }
      return res.status(200).json({ message: "Arquivo excluído com sucesso." });
    });
  } else {
    return res.status(404).json({ message: "Arquivo não encontrado." });
  }
});

// DELETE MULTIPLE FILES
router.post("/deleteMultipleFiles", (req, res) => {
  const { files } = req.body;
  const directory = path.join(__dirname, "../../uploads/images");

  try {
    files.forEach((file) => {
      const filePath = path.join(directory, file.name);
      fs.unlinkSync(filePath); // Exclua o arquivo
    });

    return res.status(200).json({ message: "Imagens excluídas com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir as imagens:", error);
    return res.status(500).json({ message: "Erro ao excluir as imagens." });
  }
});

module.exports = router;
