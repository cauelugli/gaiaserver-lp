import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Typography from "@mui/material/Typography";

const Carousel = ({ images, captions, fromHero }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Função para verificar se o arquivo é um vídeo
  const isVideo = (url) => {
    const videoExtensions = [".mp4", ".webm", ".ogg"];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  const currentMedia = images[currentImageIndex];
  const isCurrentVideo = isVideo(currentMedia);

  return (
    <Box
      sx={{
        position: "relative",
        height: fromHero ? 650 : 570,
        width: fromHero ? "120%" : "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        border: fromHero ? "" : "1px solid #bbb",
        borderRadius: fromHero ? 2 : 3,
        overflow: "hidden",
        pb: fromHero ? 10 : 0,
      }}
    >
      {isCurrentVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            maxWidth: fromHero ? "95%" : "90%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        >
          <source
            src={currentMedia}
            type={`video/${currentMedia.split(".").pop()}`}
          />
        </video>
      ) : (
        <img
          src={currentMedia}
          alt={`Slide ${currentImageIndex}`}
          style={{
            maxWidth: fromHero ? "95%" : "90%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      )}

      {captions && captions[currentImageIndex] && (
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "white",
            padding: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="subtitle1">
            {captions[currentImageIndex]}
          </Typography>
        </Box>
      )}

      {images.length > 1 && !isCurrentVideo && (
        <>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: fromHero ? 6 : 16,
              backgroundColor: "rgba(0,0,0,0.3)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.5)",
              },
              zIndex: 2,
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: fromHero ? 6 : 16,
              backgroundColor: "rgba(0,0,0,0.3)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.5)",
              },
              zIndex: 2,
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default Carousel;
