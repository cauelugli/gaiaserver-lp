/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  Grid,
  Typography,
} from "@mui/material";

// import ModeEditIcon from "@mui/icons-material/ModeEdit";

// import EditAccountForm from "../forms/edit/EditAccountForm";

export default function Account({ user }) {
  const [openEdit, setOpenEdit] = React.useState(false);

  return (
    <>
      <Typography
        sx={{ fontSize: 23, mt: 0.5, ml: 1, mr: 2, fontWeight: "bold" }}
      >
        Perfil
      </Typography>
      {/* <Button
        onClick={() => setOpenEdit(!openEdit)}
        sx={{ ml: "90%" }}
        color="inherit"
        variant="outlined"
        startIcon={<ModeEditIcon />}
      >
        Editar
      </Button> */}

      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid
          container
          justifyContent="center"
          sx={{
            width: 550,
            height: 300,
            ml: 10,
            mt: -2,
            borderRadius: 5,
          }}
        >
          <Card sx={{ width: 345, height: 450 }}>
            <CardMedia
              component="img"
              height="60%"
              src={`http://localhost:3000/static/${user.image}`}
              alt="User Image"
            />
            <CardContent>
              <Typography variant="h5" component="div">
                {user.name}
              </Typography>
              <Typography gutterBottom variant="h6" sx={{ color: "#444" }}>
                {user.department.name}
              </Typography>
              <Typography variant="body1" color="#777">
                {user.position ? user.position : "Gerente"}
              </Typography>
              <Typography variant="body2" color="#777">
                {user.email}
              </Typography>
              <Typography variant="body2" color="#777">
                {user.phone}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* {openEdit && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditAccountForm
            openEdit={openEdit}
            user={user}
            setOpenEdit={setOpenEdit}
            toast={toast}
          />
        </Dialog>
      )} */}
    </>
  );
}
