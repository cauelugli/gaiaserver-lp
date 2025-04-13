import * as React from "react";
import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import RegisterModal from "../small/RegisterModal";

const tiers = [
  {
    title: "GaiaServer - Solo",
    price: "0",
    description: ["1 usuário", "2 GB de armazenamento", "Sem Limite de Vendas"],
    buttonText: "Registre-se Agora",
    buttonVariant: "outlined",
    buttonColor: "primary",
  },
  {
    title: "GaiaServer - Company",
    price: "0",
    description: ["", "", ""],
    buttonText: "Em Breve",
    buttonVariant: "none",
    buttonColor: "default",
  },
];

export default function Register() {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Container
      sx={{
        pt: 12,
        pb: 16,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <RegisterModal open={openModal} onClose={handleCloseModal} />

      <Box sx={{}}>
        <Typography variant="h2" gutterBottom>
          Planos
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Registre-se agora, e obtenha seu Código de Cliente para acessar a
          Plataforma.
        </Typography>
      </Box>
      <Grid
        container
        spacing={5}
        sx={{ alignItems: "center", justifyContent: "center", width: "100%" }}
      >
        {tiers.map((tier, index) => (
          <Grid item key={index}>
            <Card
              sx={[
                {
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  backgroundColor: index === 0 ? "" : "#32aacd",
                },
              ]}
            >
              <CardContent>
                <Box
                  sx={[
                    {
                      mb: 4,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      width: 400,
                    },
                    index === 0 ? { color: "" } : { color: "white" },
                  ]}
                >
                  <Grid container alignItems="center">
                    <Grid sx={{ mr: 3 }}>
                      <img
                        src="/images/logo.png"
                        alt="Logo"
                        style={{
                          height: 50,
                          filter: index === 0 ? "grayscale(100%)" : "",
                        }}
                      />
                    </Grid>
                    <Typography variant="h5">{tier.title}</Typography>
                  </Grid>
                </Box>
                <Box
                  sx={[
                    {
                      display: "flex",
                      alignItems: "baseline",
                    },
                    index === 0 ? { color: "" } : { color: "#32aacd" },
                  ]}
                >
                  <Typography variant="h2">${tier.price}</Typography>
                  <Typography variant="h6">&nbsp; por mês</Typography>
                </Box>
                <Divider sx={{ my: 2, opacity: 0.8, borderColor: "divider" }} />
                {tier.description.map((line, index) => (
                  <Box
                    key={index}
                    sx={{
                      py: 2,
                      display: "flex",
                      gap: 2.5,
                      alignItems: "center",
                    }}
                  >
                    <CheckCircleRoundedIcon
                      sx={{
                        width: 20,
                        color: "primary.main",
                      }}
                    />
                    <Typography>{line}</Typography>
                  </Box>
                ))}
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant={tier.buttonVariant}
                  color={tier.buttonColor}
                  disabled={index === 1}
                  onClick={index === 0 ? handleOpenModal : undefined}
                >
                  {tier.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
