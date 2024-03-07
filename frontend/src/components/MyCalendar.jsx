/* eslint-disable react-hooks/exhaustive-deps */
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
  DialogActions,
  Typography,
  Slide,
} from "@mui/material";

import CalendarEventModal from "../forms/misc/CalendarEventModal";
import AgendaActions from "./small/buttons/AgendaActions";
import CalendarEvents from "./small/CalendarEvents";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const localizer = luxonLocalizer(DateTime);

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const MyCalendar = ({ user, config }) => {
  const [events, setEvents] = React.useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [customer, setCustomer] = useState({});
  const [service, setService] = useState({});
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

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleAddEvent = () => {
    if (title) {
      const eventToAdd = {
        title,
        start: moment(newEvent.start).format("DD/MM/YYYY HH:mm"),
        end: moment(newEvent.end).format("DD/MM/YYYY HH:mm"),
        status: "Aberto",
        type,
        customer,
        service,
      };
      api
        .post("/agenda/addAgendaEvent", { ...eventToAdd, userId: user._id })
        .then(() => {
          fetchData();
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
        fetchData();
      })
      .catch((error) => {
        console.error("Erro ao excluir o evento:", error);
      });
    setDetailsDialogOpen(false);
  };

  const handleResolveEvent = () => {
    const startFormatted = moment(selectedEvent.start).format(
      "DD/MM/YYYY HH:mm"
    );
    const endFormatted = moment(selectedEvent.end).format("DD/MM/YYYY HH:mm");

    api
      .put(`/agenda/resolveAgendaEvent`, {
        userId: user._id,
        start: startFormatted,
        end: endFormatted,
      })
      .then(() => {
        fetchData();
        setDetailsDialogOpen(false);
      })
      .catch((error) => {
        console.error("Erro ao atualizar o status do evento:", error);
      });
  };

  const handleSelectSlot = ({ start, end }) => {
    setOpen(true);
    setNewEvent({ start, end });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const EventDetailsDialog = ({ event, open, onClose }) => (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      handleResolveEvent={handleResolveEvent}
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
        <Typography gutterBottom>Status: {event?.status}</Typography>
        <Typography gutterBottom>Tipo de Evento: {event?.type}</Typography>
        <Typography gutterBottom>
          Cliente: {event.customer ? event.customer.name : "-"}
        </Typography>
        <Typography gutterBottom>
          Serviço: {event.service ? event.service.name : "-"}
        </Typography>
      </DialogContent>
      <DialogActions>
        <AgendaActions
          onClose={onClose}
          handleResolveEvent={handleResolveEvent}
          handleDeleteEvent={handleDeleteEvent}
        />
      </DialogActions>
    </Dialog>
  );

  const eventStyleGetter = (event) => {
    console.log("event.", event.type);
    let style = {
      backgroundColor:
        event.type === "Job"
          ? "red"
          : event.type === "Reunião"
          ? "blue"
          : "none",
      border: "1px solid black",
      color: "white",
    };

    let definedType;

    if (event.type === "Job") {
      definedType === "red";
    } else if (event.type === "Reunião") {
      definedType === "blue";
    }

    // Exemplo de lógica condicional para estilos baseados em propriedades do evento
    if (event.isImportant) {
      style.backgroundColor = definedType;
    }

    return {
      style: style,
    };
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  const minTime = new Date();
  minTime.setHours(config.minTime || 7, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(config.maxTime || 22, 0, 0);

  const customFormats = {
    // This removes the event time on the event container
    eventTimeRangeFormat: () => "",
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
          formats={customFormats}
          min={minTime}
          max={maxTime}
          components={{
            event: CalendarEvents,
          }}
          eventPropGetter={eventStyleGetter}
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
      <CalendarEventModal
        selectedDate={`${moment(newEvent.start).format(
          "DD/MM/YYYY HH:mm"
        )} até ${moment(newEvent.end).format("HH:mm")}`}
        open={open}
        handleClose={handleClose}
        title={title}
        setTitle={setTitle}
        type={type}
        types={config.eventTypes}
        setType={setType}
        service={service}
        setService={setService}
        customer={customer}
        setCustomer={setCustomer}
        handleAddEvent={handleAddEvent}
      />
      {selectedEvent && (
        <EventDetailsDialog
          event={selectedEvent}
          handleResolveEvent={handleResolveEvent}
          open={detailsDialogOpen}
          onClose={handleCloseDetailsDialog}
        />
      )}
    </>
  );
};

export default MyCalendar;
