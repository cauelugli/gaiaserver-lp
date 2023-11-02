/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
// import { toast } from "react-toastify";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Account({ user }) {
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const services = await api.get("/services");
        const departments = await api.get("/departments");
        const stockItems = await api.get("/stockItems");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Typography
        sx={{ fontSize: 23, mt: 0.5, ml: 1, mr: 2, fontWeight: "bold" }}
      >
        Perfil
      </Typography>
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
            width: 950,
            height: 600,
            ml: 10,
            border: "1px solid #777",
            borderRadius: 5,
          }}
        >
          <Card sx={{ width: 345 }}>
            <CardMedia
              component="img"
              height="50%"
              src={`http://localhost:3000/static/${user.image}`}
              alt="User Image"
            />
            <CardContent>
              <Typography variant="h5" component="div">
                {user.name}
              </Typography>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{ color: "#444" }}
              >
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
    </>
  );
}
