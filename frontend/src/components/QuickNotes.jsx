import React, { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  TextareaAutosize,
  Paper,
  TableFooter,
  TextField,
} from "@mui/material";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const QuickNotes = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [editableNote, setEditableNote] = useState({ _id: null, body: "" });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/quicknotes");
        console.log("response", response.data);
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddNote = async () => {
    try {
      const response = await api.post("/quicknotes", {
        body: noteText,
      });
      setNotes([
        ...notes,
        { _id: response.data._id, body: response.data.body },
      ]);
      setNoteText("");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await api.delete(`/quicknotes/${noteId}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (err) {
      alert("Vish, deletou não..");
      console.log(err);
    }
  };

  const handleEditNote = (note) => {
    setEditableNote({ _id: note._id, body: note.body });
  };

  const handleSaveNote = async () => {
    try {
      await api.put(`/quicknotes`, {
        noteId: editableNote._id,
        body: editableNote.body,
      });
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === editableNote._id
            ? { ...note, body: editableNote.body }
            : note
        )
      );
    } catch (err) {
      alert("Erro ao salvar a nota.");
      console.log(err);
    }
    setEditableNote({ _id: null, body: "" });
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ mt: 2 }}
    >
      {notes.map((note, index) => (
        <Paper
          key={index}
          item
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          sx={{
            border: "1px solid #444",
            mx: 0.5,
            my: 0.25,
            minWidth: "80%",
            backgroundColor: "white",
            borderRadius: 0.7,
            position: "relative",
            cursor: "pointer",
          }}
          onClick={() => handleEditNote(note)}
        >
          {editableNote._id === note._id ? (
            <TextField
              sx={{
                fontSize: "14px",
                p: 0.3,
              }}
              value={editableNote.body}
              onChange={(e) =>
                setEditableNote({ ...editableNote, body: e.target.value })
              }
              onBlur={handleSaveNote}
              autoFocus
              fullWidth
            />
          ) : (
            <Typography
              sx={{ fontSize: "14px", p: 0.3 }}
              variant="body1"
              component="p"
              color="textPrimary"
            >
              {note.body}
            </Typography>
          )}
          {hoveredIndex === index && (
            <Grid
              container
              direction="column"
              justifyContent="flex-end"
              alignItems="flex-end"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                display: "flex",
              }}
            >
              <Grid item sx={{ mr: 0.5 }}>
                <TableFooter
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleDeleteNote(note._id)}
                >
                  <Typography sx={{ fontSize: "9px" }}>❌</Typography>
                </TableFooter>
              </Grid>
            </Grid>
          )}
        </Paper>
      ))}

      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          borderTop: "10px solid transparent",
        }}
      >
        <TextareaAutosize
          minRows={4}
          placeholder="Bloco de Notas"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <Button
          sx={{ mt: 1 }}
          variant="contained"
          color="success"
          size="small"
          onClick={handleAddNote}
        >
          +
        </Button>
      </Grid>
    </Grid>
  );
};

export default QuickNotes;
