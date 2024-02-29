/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import moment from "moment";
import "moment/locale/pt-br";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

moment.locale("pt-br");
const localizer = momentLocalizer(moment);

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const minTime = new Date();
minTime.setHours(7, 0, 0);
const maxTime = new Date();
maxTime.setHours(22, 0, 0);

const MyCalendar = ({ user, userAgenda }) => {
  const [events, setEvents] = useState([]);

  const parseDateString = (dateStr, timeStr = "00:00") => {
    const [day, month, year] = dateStr.split("/");
    const [hours, minutes] = timeStr.split(":");
    return new Date(year, month - 1, day, hours, minutes);
  };

  React.useEffect(() => {
    // Converter as datas de userAgenda para objetos Date
    const convertedEvents = userAgenda.map((event) => {
      const start = event.start
        ? parseDateString(event.start.split(" ")[0], event.start.split(" ")[1])
        : parseDateString(event.date);
      const end = event.end
        ? parseDateString(event.end.split(" ")[0], event.end.split(" ")[1])
        : start;
      return { ...event, start, end };
    });
    setEvents(convertedEvents);
  }, [userAgenda]);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [newEvent, setNewEvent] = useState({});

  const handleSelectSlot = ({ start, end }) => {
    setOpen(true);
    setNewEvent({ start, end });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddEvent = () => {
    if (title) {
      const eventToAdd = {
        title,
        start: moment(newEvent.start).format("DD/MM/YYYY HH:mm"),
        end: moment(newEvent.end).format("DD/MM/YYYY HH:mm"),
        status: "Aberto",
      };
      console.log("Evento a ser adicionado:", eventToAdd);
      api
        .post("/agenda/addAgendaEvent", { ...eventToAdd, userId: user._id })
        .then((response) => {
          setOpen(false);
          setEvents([...events, response.data]);
          setTitle("");
        })
        .catch((error) => {
          console.error("Erro ao salvar o evento:", error);
        });
    }
  };

  const EventModal = ({
    open,
    handleClose,
    title,
    setTitle,
    handleAddEvent,
  }) => (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Adicionar Evento</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="Título do Evento"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleAddEvent}>Adicionar</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <div style={{ height: 700 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectSlot={handleSelectSlot}
          selectable={true}
          defaultView="week"
          min={minTime}
          max={maxTime}
          messages={{
            next: "Próximo",
            previous: "Anterior",
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            agenda: "Agenda",
            date: "Data",
            time: "Hora",
            event: "Evento",
            noEventsInRange: "Não há eventos neste período.",
            showMore: (total) => `+ Ver mais (${total})`,
          }}
          culture="pt-br"
        />
      </div>
      <EventModal
        open={open}
        handleClose={handleClose}
        title={title}
        setTitle={setTitle}
        handleAddEvent={handleAddEvent}
      />
    </>
  );
};

export default MyCalendar;
