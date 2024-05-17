const { mongoose } = require("../db");

const agendaSchema = new mongoose.Schema({
  events: {
    type: Object,
  },
});

const Agenda = mongoose.model("Agenda", agendaSchema);

module.exports = Agenda;
