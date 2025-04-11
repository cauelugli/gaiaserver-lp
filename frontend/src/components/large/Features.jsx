import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Carousel from "../small/Carousel";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import PaletteIcon from "@mui/icons-material/Palette";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

const items = [
  {
    itemIndex: 0,
    icon: <AutoAwesomeIcon />,
    title: "Simplicidade",
    description: (
      <Typography>
        Crie seus <strong> Clientes, Produtos e Vendas</strong> de forma{" "}
        <strong>simples e ilimitada</strong>.
      </Typography>
    ),
    images: ["/images/new1.png", "/images/new2.png", "/images/new3.png"],
  },
  {
    itemIndex: 1,
    icon: <PaletteIcon />,
    title: "Personalização",
    description: (
      <Typography>
        Deixe o aplicativo com <strong>a sua cara</strong>! Escolha o{" "}
        <strong>Layout, Cores e Fontes </strong>que mais combinam com você.
      </Typography>
    ),
    images: [
      "/images/custom1.png",
      "/images/custom2.png",
      "/images/custom3.png",
      "/images/custom4.png",
    ],
  },
  {
    itemIndex: 2,
    icon: <ElectricBoltIcon />,
    title: "Rapidez no que Importa",
    description: (
      <Typography>
        Realize uma venda com menos de <strong>cinco clicks</strong>!
      </Typography>
    ),
    images: ["/images/homePage.png"],
  },
  {
    itemIndex: 3,
    icon: <SportsEsportsIcon />,
    title: "Você no Controle",
    description: (
      <Typography>
        Venda ou Serviço, Pessoa ou Empresa, À vista ou A prazo: Você{" "}
        <strong>comanda</strong>! Tenha em seu sistema{" "}
        <strong>apenas o que você usa</strong>.
      </Typography>
    ),
    images: ["/images/homePage.png"],
  },
];

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (itemIndex) => {
    setSelectedItemIndex(itemIndex);
  };

  return (
    <Grid container direction="column" sx={{ my: 15 }}>
      <Box>
        <Typography variant="h2" gutterBottom>
          Soluções
        </Typography>
        <Typography
          variant="h5"
          sx={{ color: "text.secondary", mt: 4, mb: 10 }}
        >
          Confira tudo que o GaiaServer oferece para sua Empresa
        </Typography>
      </Box>

      <Grid container direction="row" sx={{ mx: 2 }}>
        <Grid item sx={{ width: "60%", mx: 3 }}>
          <Carousel images={items[selectedItemIndex].images} />
        </Grid>

        <Grid item sx={{ width: "30%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mx: "auto",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid #bbb",
                borderRadius: 3,
                height: 570,
              }}
            >
              {items.map((item, index) => (
                <Box
                  key={index}
                  component={Button}
                  onClick={() => handleItemClick(index)}
                  sx={{
                    p: 2,
                    backgroundColor:
                      selectedItemIndex === index ? "#32aacd" : "inherit",
                    "&:hover": {
                      backgroundColor:
                        selectedItemIndex === index
                          ? "#32aacd"
                          : "rgba(0,0,0,0.04)",
                    },
                  }}
                >
                  <Grid
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                      gap: 0.5,
                      textAlign: "left",
                      textTransform: "none",
                      color:
                        selectedItemIndex === index
                          ? "text.primary"
                          : "text.secondary",
                    }}
                  >
                    {item.icon}
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", fontSize: 22 }}
                    >
                      {item.title}
                    </Typography>
                    {item.description}
                  </Grid>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
