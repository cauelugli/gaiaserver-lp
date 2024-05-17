const express = require("express");
const router = express.Router();
const QuickNote = require("../../models/models/QuickNote");

// GET QUICKNOTES
router.get("/", async (req, res) => {
  try {
    const qn = await QuickNote.find();
    res.status(200).json(qn);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE QUICKNOTE
router.post("/", async (req, res) => {
  const newQN = new QuickNote(req.body);
  try {
    const savedQN = await newQN.save();
    res.status(200).json(savedQN);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE QUICKNOTE
router.delete("/:id", async (req, res) => {
  const noteId = req.params.id;
  try {
    const deletedNote = await QuickNote.findByIdAndDelete(noteId);
    res.status(200).json(noteId);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE QUICKNOTE
router.put("/", async (req, res) => {
  try {
    const updatedNote = await QuickNote.findByIdAndUpdate(
      req.body.noteId,
      {
        body: req.body.body,
      },
      { new: true }
    );
    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
