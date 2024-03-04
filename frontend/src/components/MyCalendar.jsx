/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, forwardRef } from "react";
import { Calendar, luxonLocalizer } from "react-big-calendar";
import { DateTime, Settings } from "luxon";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import moment from "moment";

Settings.defaultLocale = "pt-BR";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  Slide,
} from "@mui/material";

import AgendaActions from "./small/buttons/AgendaActions";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const localizer = luxonLocalizer(DateTime);

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const minTime = new Date();
minTime.setHours(7, 0, 0);
const maxTime = new Date();
maxTime.setHours(22, 0, 0);

const MyCalendar = ({ user }) => {
  const [refreshCount, setRefreshCount] = React.useState(0);
  const [userAgenda, setUserAgenda] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [newEvent, setNewEvent] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const parseDateString = (dateStr, timeStr = "00:00") => {
    const [day, month, year] = dateStr.split("/");
    const [hours, minutes] = timeStr.split(":");
    return new Date(year, month - 1, day, hours, minutes);
  };

  const fetchData = async () => {
    try {
      const userAgenda = await api.get(`/agenda/${user._id}`);
      const convertedEvents = userAgenda.data.map((event) => {
        const start = event.start
          ? parseDateString(
              event.start.split(" ")[0],
              event.start.split(" ")[1]
            )
          : parseDateString(event.date);
        const end = event.end
          ? parseDateString(event.end.split(" ")[0], event.end.split(" ")[1])
          : start;
        return { ...event, start, end };
      });
      setEvents(convertedEvents);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddEvent = () => {
    if (title) {
      const eventToAdd = {
        title,
        start: moment(newEvent.start).format("DD/MM/YYYY HH:mm"),
        end: moment(newEvent.end).format("DD/MM/YYYY HH:mm"),
        status: "Aberto",
      };
      api
        .post("/agenda/addAgendaEvent", { ...eventToAdd, userId: user._id })
        .then(() => {
          setRefreshCount((currentCount) => currentCount + 1);
          fetchData(); // Atualiza os eventos após adicionar
        })
        .catch((error) => {
          console.error("Erro ao salvar o evento:", error);
        });
      setOpen(false);
      setTitle("");
    }
  };

  const handleDeleteEvent = () => {
    const payload = {
      userId: user._id,
      start: moment(selectedEvent.start).format("DD/MM/YYYY HH:mm"),
      end: moment(selectedEvent.end).format("DD/MM/YYYY HH:mm"),
    };

    api
      .put("/agenda/deleteAgendaEvent", payload)
      .then(() => {
        setRefreshCount((currentCount) => currentCount + 1);
        fetchData(); // Atualiza os eventos após excluir
      })
      .catch((error) => {
        console.error("Erro ao excluir o evento:", error);
      });
    setDetailsDialogOpen(false);
  };

  const handleSelectSlot = ({ start, end }) => {
    setOpen(true);
    setNewEvent({ start, end });
  };

  const handleClose = () => {
    setOpen(false);
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

  const EventDetailsDialog = ({ event, open, onClose }) => (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      BackdropProps={{ style: { backgroundColor: "transparent" } }}
    >
      <DialogTitle>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            mt: 1,
            mb: 2,
          }}
        >
          Detalhes do Evento
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ width: 450 }}>
        <Typography gutterBottom>Título: {event?.title}</Typography>
        <Typography gutterBottom>
          Início: {moment(event?.start).format("DD/MM/YYYY HH:mm")}
        </Typography>
        <Typography gutterBottom>
          Fim: {moment(event?.end).format("DD/MM/YYYY HH:mm")}
        </Typography>
        <Typography>Status: {event?.status}</Typography>
      </DialogContent>
      <DialogActions>
        <AgendaActions
          onClose={onClose}
          handleDeleteEvent={handleDeleteEvent}
        />
      </DialogActions>
    </Dialog>
  );

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  return (
    <>
      <div style={{ height: 700 }}>
        <Calendar
          onSelectEvent={(event) => handleSelectEvent(event)}
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
        />
      </div>
      <EventModal
        open={open}
        handleClose={handleClose}
        title={title}
        setTitle={setTitle}
        handleAddEvent={handleAddEvent}
      />
      {selectedEvent && (
        <EventDetailsDialog
          event={selectedEvent}
          open={detailsDialogOpen}
          onClose={handleCloseDetailsDialog}
        />
      )}
    </>
  );
};

export default MyCalendar;
