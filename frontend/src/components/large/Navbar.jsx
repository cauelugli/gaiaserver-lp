import * as React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

export default function Navbar() {
  const [isTop, setIsTop] = React.useState(true);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Grid
      sx={{
        position: "fixed",
        width: "100%",
        py: 3,
        px: 6,
        m: -1,
        backgroundColor: "white",
        zIndex: 1,
        transition: "all 0.3s ease",
      }}
      container
      direction="row"
      alignItems="center"
    >
      <Grid item>
        <img
          src="/images/logo.png"
          alt="Logo"
          style={{
            height: isTop ? 120 : 50,
            transition: "all 0.2s ease",
          }}
        />
      </Grid>
      <Grid item sx={{ mx: "auto", width: "50%" }}>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Button>Soluções</Button>
          <Button>Módulos</Button>
        </Grid>
      </Grid>

      <Grid item>
        <Button variant="contained" sx={{ backgroundColor: "#36454F" }}>
          Acesse a Demo
        </Button>{" "}
      </Grid>
    </Grid>
  );
}
