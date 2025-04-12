import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

const StyledBox = styled("div")(({ theme }) => ({
  alignSelf: "center",
  width: "100%",
  height: 400,
  marginTop: theme.spacing(8),
  borderRadius: (theme.vars || theme).shape.borderRadius,
  outline: "6px solid",
  outlineColor: "hsla(220, 25%, 80%, 0.2)",
  border: "1px solid #ccc",
  boxShadow: "0 0 12px 8px hsla(220, 25%, 80%, 0.2)",
  backgroundImage: "url(/images/homePage.png)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(10),
    height: 750,
    width:1580
  },
}));

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
        <Stack
          spacing={2}
          sx={{ alignItems: "center", width: { xs: "100%", sm: "70%" } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              fontSize: "clamp(3rem, 10vw, 3.5rem)",
            }}
          >
            Gerencie&nbsp;seu&nbsp;negócio&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: "inherit",
                color: "primary.main",
                ...theme.applyStyles("dark", {
                  color: "primary.light",
                }),
              })}
            >
              de&nbsp;forma&nbsp;Simples.
            </Typography>
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: 17,
              color: "text.secondary",
              mt: 1,
            }}
          >
            O GaiaServer é a solução <strong>completa</strong> para uma gestão{" "}
            <strong>simples, rápida </strong> e <strong>eficiente</strong>.
          </Typography>
        </Stack>
        <StyledBox />
      </Container>
    </Box>
  );
}
