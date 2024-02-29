const express = require("express");
const router = express.Router();
const Agenda = require("../models/Agenda");

// GET USER'S AGENDA
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const agenda = await Agenda.findOne({});
    const userEvents = agenda.events[userId];
    if (!userEvents) {
      return res
        .status(404)
        .json({ message: "Eventos para este usuário não encontrados." });
    }

    res.status(200).json(userEvents);
  } catch (err) {
    console.error("Erro ao buscar eventos da agenda:", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar eventos da agenda.", error: err });
  }
});

// CREATE EVENT TO USER'S AGENDA
router.post("/addAgendaEvent", async (req, res) => {
  const { userId, title, start, end, status } = req.body;
  try {
    const agenda = await Agenda.findOne({});

    if (!agenda) {
      const newAgenda = new Agenda({
        events: {
          [userId]: [{ title, start, end, status }],
        },
      });
      const savedAgenda = await newAgenda.save();
      res.status(200).json(savedAgenda);
    } else {
      const userEvents = agenda.events[userId] || [];
      userEvents.push({ title, start, end, status });

      const updatedAgenda = await Agenda.findOneAndUpdate(
        {},
        {
          $set: { [`events.${userId}`]: userEvents },
        },
        {
          new: true,
          upsert: true,
        }
      );

      res.status(200).json(updatedAgenda);
    }
  } catch (err) {
    console.error("Erro ao adicionar evento à agenda:", err);
    res
      .status(500)
      .json({ message: "Erro ao adicionar evento à agenda.", error: err });
  }
});

// EDIT (REMOVE) EVENT FROM USER'S AGENDA
router.put("/deleteAgendaEvent", async (req, res) => {
  const { userId, start, end } = req.body;
  try {
    const agenda = await Agenda.findOne({});
    const filteredEvents = agenda.events[userId].filter(event => event.start !== start || event.end !== end);
    const updatedAgenda = await Agenda.findOneAndUpdate(
      {},
      {
        $set: { [`events.${userId}`]: filteredEvents },
      },
      {
        new: true,
      }
    );

    res.status(200).json({ message: "Evento removido com sucesso.", updatedAgenda });
  } catch (err) {
    console.error("Erro ao editar (remover) evento da agenda:", err);
    res.status(500).json({ message: "Erro ao editar (remover) evento da agenda.", error: err });
  }
});


module.exports = router;
