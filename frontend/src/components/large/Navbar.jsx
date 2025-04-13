import * as React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Tooltip } from "@mui/material";

export default function Navbar() {
  const [isTop, setIsTop] = React.useState(true);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const goToSolutions = () =>
    window.scrollTo({ top: 1150, behavior: "smooth" });
  const goToRegister = () => window.scrollTo({ top: 2150, behavior: "smooth" });

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
      <Grid item onClick={goToTop} sx={{ cursor: isTop ? "" : "pointer" }}>
        <Tooltip title={isTop ? "o GS é um sonho feito com muito amor ♥" : ""}>
          <img
            src="/images/logo.png"
            alt="Logo"
            style={{
              height: isTop ? 120 : 50,
              transition: "all 0.2s ease",
            }}
          />
        </Tooltip>
      </Grid>
      <Grid item sx={{ mx: "auto", width: "50%" }}>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Button sx={{ fontSize: 16 }} onClick={goToSolutions}>
            Soluções
          </Button>
          <Button sx={{ fontSize: 16, mx: 2 }} onClick={goToRegister}>
            Registre-se
          </Button>
        </Grid>
      </Grid>

      <Grid item>
        <Button variant="contained" sx={{ backgroundColor: "#36454F" }}>
          Acesse a Demo
        </Button>
      </Grid>
    </Grid>
  );
}
