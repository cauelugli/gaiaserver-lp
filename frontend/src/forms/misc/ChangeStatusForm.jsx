/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import axios from "axios";
import {
  Button,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const ChangeStatusForm = ({
  selectedItem,
  refreshData,
  setRefreshData,
  openDialog,
  setOpenDialog,
  toast,
  endpoint,
}) => {
  const [newStatus, setNewStatus] = React.useState("");

  const handleChangeStatus = async () => {
    try {
      const res = await api.put(`/requests/changeStatus`, {
        itemId: selectedItem._id || selectedItem.id,
        newStatus,
      });
      if (res.data) {
        toast.success("Status Alterado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenDialog(false);
      setRefreshData(!refreshData);
    } catch (err) {
      alert("Houve algum erro...");
      console.log(err);
    }
  };

  return (
    <>
      <DialogTitle>
        Alterar Status{" "}
        {endpoint === "jobs"
          ? "do Job"
          : endpoint === "sales"
          ? "da Venda"
          : null}
      </DialogTitle>

      <DialogContent>
        <Grid container direction="column" alignItems="center">
          <Grid item sx={{ mx: 4 }}>
            <Select
              value={selectedItem.status}
              disabled
              sx={{ width: 250 }}
              displayEmpty
            >
              <MenuItem value={selectedItem.status}>
                {selectedItem.status}
              </MenuItem>
            </Select>
          </Grid>

          <Grid item sx={{ m: 4 }}>
            <Select
              value={newStatus}
              sx={{ width: 250 }}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value={"Aguardando Cliente"}>
                Aguardando Cliente
              </MenuItem>
              <MenuItem value={"Aguardando Terceiro"}>
                Aguardando Terceiro
              </MenuItem>
            </Select>
          </Grid>
        </Grid>

        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ my: 4 }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={handleChangeStatus}
            sx={{ mr: 2 }}
          >
            OK
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDialog(!openDialog)}
          >
            X
          </Button>
        </Grid>
      </DialogContent>
    </>
  );
};

export default ChangeStatusForm;
