const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../../models/models/Product");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/images"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const storageDocs = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/attachments"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
const uploadDocs = multer({ storage: storageDocs });

// CREATE SINGLE FILE
router.post("/singleFile", upload.single("image"), (req, res) => {
  try {
    const imagePath = req.file ? "/images/" + req.file.filename : "";
    return res.status(200).json({ imagePath });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao fazer o upload do arquivo." });
  }
});

// CREATE MULTIPLE (max 10) FILES
router.post("/multipleFiles", upload.array("images", 10), (req, res) => {
  try {
    const imagePaths = req.files
      ? req.files.map((file) => "/images/" + file.filename)
      : [];
    return res.status(200).json({ imagePaths });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao fazer o upload dos arquivos." });
  }
});

// CREATE SINGLE ATTACHEMENT
router.post(
  "/singleAttachment",
  uploadDocs.single("attachment"),
  (req, res) => {
    const itemId = req.body.itemId;
    if (!req.file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado." });
    }

    const attachmentsBasePath = path.join(
      __dirname,
      "../../uploads/attachments"
    );
    const newFilename = `${itemId}.${req.file.originalname}`;
    const attachmentPath = path.join(attachmentsBasePath, newFilename);

    fs.copyFileSync(req.file.path, attachmentPath);
    fs.unlinkSync(req.file.path);

    return res
      .status(200)
      .json({ attachmentPath: `/attachments/${newFilename}` });
  }
);

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

// GET ALL DOCS
router.get("/listDocs", async (req, res) => {
  const directory = path.join(__dirname, "../../uploads/docs");
  fs.readdir(directory, async (err, docs) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao listar os documentos" });
    }
    try {
      let totalSpace = 0;

      docs.forEach((doc) => {
        const docPath = path.join(directory, doc);
        const stats = fs.statSync(docPath);
        totalSpace += stats.size;
      });

      const totalSpaceInMB = (totalSpace / (1024 * 1024)).toFixed(2);

      const docsWithSizes = docs.map((doc) => {
        const docPath = path.join(directory, doc);
        const stats = fs.statSync(docPath);
        const docSizeInKB = Math.round(stats.size / 1024);

        return {
          name: doc,
          sizeKB: docSizeInKB,
        };
      });

      return res.status(200).json({
        docs: docsWithSizes,
        totalSpaceMB: totalSpaceInMB,
      });
    } catch (error) {
      console.error("Erro ao buscar documentos em uso:", error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar documentos em uso." });
    }
  });
});

// GET ALL ATTACHMENTS
router.get("/listAttachments", async (req, res) => {
  const directory = path.join(__dirname, "../../uploads/attachments");
  fs.readdir(directory, async (err, docs) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao listar os documentos" });
    }
    try {
      let totalSpace = 0;

      docs.forEach((doc) => {
        const docPath = path.join(directory, doc);
        const stats = fs.statSync(docPath);
        totalSpace += stats.size;
      });

      const totalSpaceInMB = (totalSpace / (1024 * 1024)).toFixed(2);

      const docsWithSizes = docs.map((doc) => {
        const docPath = path.join(directory, doc);
        const stats = fs.statSync(docPath);
        const docSizeInKB = Math.round(stats.size / 1024);

        return {
          name: doc,
          sizeKB: docSizeInKB,
        };
      });

      return res.status(200).json({
        docs: docsWithSizes,
        totalSpaceMB: totalSpaceInMB,
      });
    } catch (error) {
      console.error("Erro ao buscar documentos em uso:", error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar documentos em uso." });
    }
  });
});

// DELETE SINGLE FILE
router.delete("/deleteFile/:filename", (req, res) => {
  const directory = path.join(__dirname, `../../uploads/images`);
  const filePath = path.join(directory, req.params.filename);

  if (fs.existsSync(filePath)) {
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

// DELETE SINGLE ATTACHMENT
router.delete("/deleteAttachment/:filename", (req, res) => {
  const directory = path.join(__dirname, `../../uploads/attachments`);
  const filePath = path.join(directory, req.params.filename);

  if (fs.existsSync(filePath)) {
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
  const directory = path.join(__dirname, `../../uploads/images`);
  try {
    files.forEach((file) => {
      const filePath = path.join(directory, file.name);
      fs.unlinkSync(filePath);
    });

    return res.status(200).json({ message: "Imagens excluídas com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir as imagens:", error);
    return res.status(500).json({ message: "Erro ao excluir as imagens." });
  }
});

// DELETE MULTIPLE ATTACHMENTS
router.post("/deleteMultipleAttachments", (req, res) => {
  const { files } = req.body;
  const directory = path.join(__dirname, `../../uploads/attachments`);
  try {
    files.forEach((file) => {
      const filePath = path.join(directory, file.name);
      fs.unlinkSync(filePath);
    });

    return res.status(200).json({ message: "Imagens excluídas com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir as imagens:", error);
    return res.status(500).json({ message: "Erro ao excluir as imagens." });
  }
});

module.exports = router;
