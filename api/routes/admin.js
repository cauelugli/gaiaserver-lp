const express = require("express");
const router = express.Router();
const Admin = require("../../models/models/Admin");

// UPDATE ADMIN'S PROFILE PICTURE
router.put("/changeProfilePicture", async (req, res) => {
  try {
    const updatedAdmin = await Admin.findOneAndUpdate(
      {},
      { image: req.body.image },
      { new: true }
    );
    return res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao atualizar a imagem de perfil." });
  }
});

module.exports = router;
