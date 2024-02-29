const mongoose = require("mongoose");

const agendaSchema = new mongoose.Schema({
  events: {
    type: Object,
  },
});

const Agenda = mongoose.model("Agenda", agendaSchema);

module.exports = Agenda;
