import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Carousel = ({ images }) => {
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

  return (
    <Box
      sx={{
        position: "relative",
        height: 570,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        border: "1px solid #bbb",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <img
        src={images[currentImageIndex]}
        alt={`Slide ${currentImageIndex}`}
        style={{
          maxWidth: "90%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
      />

      {images.length > 1 && (
        <>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: 16,
              backgroundColor: "rgba(0,0,0,0.3)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.5)",
              },
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 16,
              backgroundColor: "rgba(0,0,0,0.3)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.5)",
              },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>

          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              display: "flex",
              gap: 1,
            }}
          >
            {images.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor:
                    index === currentImageIndex
                      ? "primary.main"
                      : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor:
                      index === currentImageIndex
                        ? "primary.main"
                        : "rgba(255,255,255,0.7)",
                  },
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Carousel;
