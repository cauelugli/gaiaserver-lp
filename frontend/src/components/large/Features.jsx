import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import PaletteIcon from "@mui/icons-material/Palette";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

const items = [
  {
    icon: <AutoAwesomeIcon />,
    title: (
      <Typography sx={{ fontWeight: "bold", fontSize: 22 }}>
        Simplicidade
      </Typography>
    ),
    description: (
      <Typography>
        Crie seus <strong> Clientes, Produtos e Vendas</strong> de forma{" "}
        <strong>simples e ilimitada</strong>.
      </Typography>
    ),
    image: `url(/images/new1.png)`,
  },
  {
    icon: <PaletteIcon />,
    title: (
      <Typography sx={{ fontWeight: "bold", fontSize: 22 }}>
        Personalização
      </Typography>
    ),
    description: (
      <Typography>
        Deixe o aplicativo com <strong>a sua cara</strong>! Escolha o{" "}
        <strong>Layout, Cores e Fontes </strong>que mais combinam com você.
      </Typography>
    ),
    image: `url(/images/homePage.png)`,
  },
  {
    icon: <ElectricBoltIcon />,
    title: (
      <Typography sx={{ fontWeight: "bold", fontSize: 22 }}>
        Rapidez no que Importa
      </Typography>
    ),
    description: (
      <Typography>
        Realize uma venda com menos de <strong>cinco clicks</strong>!
      </Typography>
    ),
    image: "url(/images/homePage.png)",
  },
  {
    icon: <SportsEsportsIcon />,
    title: (
      <Typography sx={{ fontWeight: "bold", fontSize: 22 }}>
        Você no Controle
      </Typography>
    ),
    description: (
      <Typography>
        Venda ou Serviço, Pessoa ou Empresa, À vista ou A prazo: Você{" "}
        <strong>comanda</strong>! Tenha em seu sistema{" "}
        <strong>apenas o que você usa</strong>.
      </Typography>
    ),
    image: "url(/images/homePage.png)",
  },
];

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  return (
    <Grid container direction="column" sx={{ my: 15 }}>
      <Box>
        <Typography variant="h2" gutterBottom>
          Soluções
        </Typography>
        <Typography variant="h5" sx={{ color: "text.secondary", mt: 4, mb: 10 }}>
          Confira tudo que o GaiaServer oferece para sua Empresa
        </Typography>
      </Box>
      <Grid container direction="row" sx={{ mx: 2 }}>
        <Grid item sx={{ width: "60%", mx: 3 }}>
          <Box
            sx={{
              height: 570,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundImage: "var(--items-image)",
              border: "1px solid #bbb",
              borderRadius: 3,
            }}
            style={
              items[selectedItemIndex] && {
                "--items-image": items[selectedItemIndex].image,
              }
            }
          />
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
              {items.map(({ icon, title, description }, index) => (
                <Box
                  key={index}
                  component={Button}
                  onClick={() => handleItemClick(index)}
                  sx={{
                    p: 2,
                    backgroundColor: selectedItemIndex === index && "#32aacd",
                  }}
                >
                  <Grid
                    sx={[
                      {
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "left",
                        gap: 0.5,
                        textAlign: "left",
                        textTransform: "none",
                        color: "text.secondary",
                      },
                      selectedItemIndex === index && {
                        color: "text.primary",
                      },
                    ]}
                  >
                    {icon}

                    <Typography variant="h5">{title}</Typography>
                    <Typography variant="body2">{description}</Typography>
                    {/* <Typography variant="body2">{selectedItemIndex === index && description}</Typography> */}
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
