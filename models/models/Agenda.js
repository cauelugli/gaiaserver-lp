const { mongoose } = require("../db");

const agendaSchema = new mongoose.Schema({
  users: [
    {
      type: Map,
      of: Array,
    },
  ],
});

const Agenda = mongoose.model("Agenda", agendaSchema);

module.exports = Agenda;
