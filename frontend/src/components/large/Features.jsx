import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";

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
    images: ["/images/new1.png", "/images/new2.png", "/images/new3.png"].map(
      (img) => ({
        src: img,
        alt: "Demonstração de simplicidade",
      })
    ),
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
    image: "/images/homePage.png",
  },
  // ... outros itens mantêm a mesma estrutura
];

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);
  const [key, setKey] = React.useState(0); // Chave para forçar rerender

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
    setKey((prev) => prev + 1); // Força rerender do Carousel
  };

  const selectedItem = items[selectedItemIndex];

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
          <Box
            sx={{
              height: 570,
              border: "1px solid #bbb",
              borderRadius: 3,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {selectedItemIndex === 0 ? (
              <Carousel
                key={key} // Usamos a chave para forçar rerender
                autoPlay={false}
                animation="fade"
                navButtonsAlwaysVisible
                duration={500}
                sx={{ height: "100%" }}
              >
                {selectedItem.images.map((img, i) => (
                  <Box
                    key={i}
                    sx={{
                      height: 570,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "background.paper",
                    }}
                  >
                    <Box
                      component="img"
                      src={img.src}
                      alt={img.alt}
                      sx={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        display: "block",
                      }}
                      onError={(e) => {
                        console.error(`Erro ao carregar imagem: ${img.src}`);
                        e.target.style.display = "none";
                      }}
                    />
                  </Box>
                ))}
              </Carousel>
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "background.paper",
                }}
              >
                <Box
                  component="img"
                  src={selectedItem.image}
                  alt={selectedItem.title.props.children}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}
          </Box>
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
