const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

router.post("/singleProduct", upload.single("file"), (req, res) => {
  try {
    // Se o arquivo foi carregado com sucesso, retornar o caminho do arquivo
    const filePath = req.file ? "/images/" + req.file.filename : "";

    return res.status(200).json({ filePath });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao fazer o upload do arquivo." });
  }
});

router.get("/listFiles", (req, res) => {
  const directory = path.join(__dirname, "../../uploads/images");
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao listar os arquivos." });
    }

    let totalSpace = 0;

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      totalSpace += stats.size;
    });

    const totalSpaceInMB = (totalSpace / (1024 * 1024)).toFixed(2); // Tamanho total em MB com 2 casas decimais

    const filesWithSizes = files.map((file) => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      const fileSizeInKB = Math.round(stats.size / 1024); // Tamanho em KB

      return {
        name: file,
        sizeKB: fileSizeInKB,
      };
    });

    return res.status(200).json({ files: filesWithSizes, totalSpaceMB: totalSpaceInMB });
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
