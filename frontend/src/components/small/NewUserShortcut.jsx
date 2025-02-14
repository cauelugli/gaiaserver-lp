/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { Button, Grid, Popover, TextField, Typography } from "@mui/material";

import { icons } from "../../icons";

import NewUserShortcutOptions from "./NewUserShortcutOptions";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const NewUserShortcut = ({ userId, reloadShortcuts, allowedLinks }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [newShortcutName, setNewShortcutName] = useState("");
  const [newShortcutAction, setNewShortcutAction] = useState("");
  const [newShortcutSelectedItem, setNewShortcutSelectedItem] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/userPreferences/addShortcut", {
        userId: userId,
        newShortcutName,
        newShortcutAction,
        newShortcutSelectedItem,
      });
      if (res.data) {
        toast.success("Atalho Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        reloadShortcuts();
        setAnchorEl(null);
      }
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  return (
    <Grid>
      <Typography
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          p: 1,
          px: 2,
          fontSize: 12,
          mb: 1,
          backgroundColor: "#fff",
          borderRadius: 2,
          textAlign: "center",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#ddd",
          },
        }}
      >
        ADICIONAR ATALHO
      </Typography>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ mt: 1 }}
        elevation={0}
      >
        <Grid
          container
          direction="column"
          sx={{ width: "100%", height: "100%", maxWidth: 260 }}
        >
          <TextField
            sx={{ p: 1.5, mt: 2 }}
            size="small"
            placeholder="Nome do Novo Atalho"
            variant="outlined"
            value={newShortcutName}
            onChange={(e) => setNewShortcutName(e.target.value)}
          />
          <Grid sx={{ p: 1.5, mb: 2 }}>
            <NewUserShortcutOptions
              setOption={setNewShortcutAction}
              newShortcutSelectedItem={newShortcutSelectedItem}
              setNewShortcutSelectedItem={setNewShortcutSelectedItem}
              allowedLinks={allowedLinks}
            />
          </Grid>
          {newShortcutName && newShortcutAction && (
            <Grid sx={{ mb: 1.5, mx: "auto" }}>
              <Button
                color="success"
                variant="contained"
                onClick={handleAdd}
                startIcon={<icons.CheckIcon />}
              >
                Criar
              </Button>
            </Grid>
          )}
        </Grid>
      </Popover>
    </Grid>
  );
};

export default NewUserShortcut;
