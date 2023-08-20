/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddSupportForm = ({
  openAdd,
  selectedCustomer,
  setOpenAdd,
  fetchData,
}) => {
  const [requester, setRequester] = React.useState("");
  const [worker, setWorker] = React.useState("");
  const [manager, setManager] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [procedure, setProcedure] = React.useState("");
  const [price, setPrice] = React.useState(0);
  const [cost, setCost] = React.useState({});
  const [local, setLocal] = React.useState("");
  const [scheduledTo, setScheduledTo] = React.useState("");
  
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/jobs", {
        customerId: selectedCustomer._id,
        requester,
        worker,
        manager,
        department,
        title,
        description,
        procedure,
        price,
        cost,
        local,
        scheduledTo,
      });
      res.data && alert("Job Adicionado à Agenda!");
      setOpenAdd(!openAdd);
      fetchData();
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogTitle>Novo Suporte</DialogTitle>
      <DialogContent>
        <Grid
          container
          sx={{ pr: "4%", mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Typography>Solicitante</Typography>
            <TextField
              size="small"
              value={requester}
              onChange={(e) => setRequester(e.target.value)}
              required
              sx={{ mr: 1, width: 300 }}
            />
          </Grid>
        </Grid>
        <Grid
          container
          sx={{ pr: "4%", mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Typography>Responsáveis</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenAdd(!openAdd)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddSupportForm;
