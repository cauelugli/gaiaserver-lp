import * as React from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Carousel from "../small/Carousel";

export default function Hero() {
  return (
    <Box id="hero" sx={{ width: "100%" }}>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 25,
          pb: 8,
        }}
      >
        <Stack>
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: "clamp(3rem, 10vw, 3.5rem)",
            }}
          >
            Gerencie&nbsp;seu&nbsp;negócio&nbsp;
            <Typography
              variant="h1"
              sx={{ fontSize: "inherit", color: "primary.main" }}
            >
              de&nbsp;forma&nbsp;Simples.
            </Typography>
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: 18,
              color: "text.secondary",
              mt: 3,
              mb: 6,
            }}
          >
            O GaiaServer é a solução <strong>completa</strong> para uma gestão{" "}
            <strong>simples, rápida </strong> e <strong>eficiente</strong>.
          </Typography>
        </Stack>
        <Carousel
          images={[
            "/images/hero1.png",
            "/images/hero2.png",
            "/images/hero3.png",
            "/images/hero4.png",
          ]}
          captions={[
            "Interface Compacta: Acesse Facilmente todos os Módulos",
            "Gerencie seus Clientes: Adicione Rapidamente uma Nova Venda",
            "Visualize seus Itens: Layouts Diferenciados para melhor Experiência",
            "Controle seus Pedidos: Faça Alterações com Precisão",
          ]}
          fromHero
        />
      </Container>
    </Box>
  );
}
