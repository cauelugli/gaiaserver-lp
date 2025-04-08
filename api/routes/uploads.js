const express = require("express");
const router = express.Router();
const multer = require("multer");
const getGFS = require("../gridfs");
const mongoose = require("mongoose");

const upload = multer({ storage: multer.memoryStorage() });
const uploadDocs = multer({ storage: multer.memoryStorage() });

const uploadToGridFS = (fileBuffer, filename, metadata = {}) => {
  const gfs = getGFS();

  if (!gfs) {
    return res.status(500).send("Sistema de arquivos não está pronto ainda");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = gfs.openUploadStream(filename, { metadata });
    uploadStream.write(fileBuffer);
    uploadStream.end((error) => {
      if (error) return reject(error);
      resolve(filename);
    });
  });
};

// GET FILES VIA GRIDFS
router.get("/files/:filename", async (req, res) => {
  const gfs = getGFS();

  if (!gfs) {
    return res.status(500).send("Sistema de arquivos não está pronto ainda");
  }

  try {
    const files = await gfs.find({ filename: req.params.filename }).toArray();
    if (!files.length) return res.status(404).send("Arquivo não existe");

    const file = files[0]; // Pega o primeiro arquivo
    const stream = gfs.openDownloadStream(file._id);

    stream.on("error", () => res.status(404).send());
    stream.pipe(res);
  } catch (err) {
    console.error("Erro:", err);
    res.status(500).send("Deu erro");
  }
});

// CREATE SINGLE FILE
router.post("/singleFile", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(204).json({ message: "Nenhum arquivo enviado." });
    } else {
      const filename = await uploadToGridFS(
        req.file.buffer,
        req.file.originalname,
        { type: "image" }
      );
      return res.status(200).json({ imagePath: `/${filename}` });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao fazer o upload do arquivo." });
  }
});

// CREATE MULTIPLE FILES
router.post("/multipleFiles", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Nenhum arquivo enviado." });
    }

    const uploadPromises = req.files.map((file) =>
      uploadToGridFS(file.buffer, file.originalname, { type: "image" })
    );

    const filenames = await Promise.all(uploadPromises);
    const imagePaths = filenames.map((filename) => `/${filename}`);

    return res.status(200).json({ imagePaths });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao fazer o upload dos arquivos." });
  }
});

// CREATE SINGLE ATTACHMENT
router.post(
  "/singleAttachment",
  uploadDocs.single("attachment"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Nenhum arquivo enviado." });
      }

      const filename = `${req.body.itemId}_${req.file.originalname}`;
      await uploadToGridFS(req.file.buffer, filename, {
        type: "attachment",
        itemId: req.body.itemId,
      });

      return res.status(200).json({
        attachmentPath: `/${filename}`,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao fazer o upload do anexo." });
    }
  }
);

// LIST ALL FILES
router.get("/listFiles", async (req, res) => {
  try {
    const files = await gfs.find({ "metadata.type": "image" }).toArray();

    const filesWithSizes = files.map((file) => ({
      name: file.filename,
      sizeKB: Math.round(file.length / 1024),
      uploadDate: file.uploadDate,
      id: file._id,
    }));

    const totalSpace = files.reduce((sum, file) => sum + file.length, 0);
    const totalSpaceMB = (totalSpace / (1024 * 1024)).toFixed(2);

    return res.status(200).json({
      files: filesWithSizes,
      totalSpaceMB,
      inUse: [], // Você pode preencher isso com lógica adicional
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao listar arquivos." });
  }
});

// LIST ALL ATTACHMENTS
router.get("/listAttachments", async (req, res) => {
  try {
    const attachments = await gfs
      .find({ "metadata.type": "attachment" })
      .toArray();

    const attachmentsWithSizes = attachments.map((file) => ({
      name: file.filename,
      sizeKB: Math.round(file.length / 1024),
      uploadDate: file.uploadDate,
      id: file._id,
      itemId: file.metadata.itemId,
    }));

    const totalSpace = attachments.reduce((sum, file) => sum + file.length, 0);
    const totalSpaceMB = (totalSpace / (1024 * 1024)).toFixed(2);

    return res.status(200).json({
      docs: attachmentsWithSizes,
      totalSpaceMB,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao listar anexos." });
  }
});

// DELETE FILE
router.delete("/deleteFile/:filename", async (req, res) => {
  try {
    const file = await gfs.find({ filename: req.params.filename }).next();

    if (!file) {
      return res.status(404).json({ message: "Arquivo não encontrado." });
    }

    await gfs.delete(file._id);
    return res.status(200).json({ message: "Arquivo excluído com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao excluir o arquivo." });
  }
});

// DELETE MULTIPLE FILES
router.post("/deleteMultipleFiles", async (req, res) => {
  try {
    const { files } = req.body;

    const deletePromises = files.map((file) =>
      gfs.delete(mongoose.Types.ObjectId(file.id))
    );

    await Promise.all(deletePromises);
    return res.status(200).json({ message: "Arquivos excluídos com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao excluir os arquivos." });
  }
});

module.exports = router;
