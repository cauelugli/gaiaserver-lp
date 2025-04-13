import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Carousel from "../small/Carousel";
import featureOptions from "../../options/featureOptions";

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const handleItemClick = (itemIndex) => {
    // Se estivermos mudando para um item diferente
    if (selectedItemIndex !== itemIndex) {
      setSelectedItemIndex(itemIndex);
      // Resetamos para a primeira imagem
      setCurrentImageIndex(0);
    }
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
          <Carousel
            images={featureOptions[selectedItemIndex].images}
            captions={featureOptions[selectedItemIndex].captions}
            currentImageIndex={currentImageIndex}
            onImageIndexChange={setCurrentImageIndex}
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
              {featureOptions.map((item, index) => (
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
