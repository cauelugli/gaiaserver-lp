import * as React from "react";
import { useState } from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import FooterModal from "../small/FooterModal";

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
      {"Copyright © "}
      <Link color="text.secondary" href="https://gaiaserver.com.br/">
        GaiaServer
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleOpenModal = (content) => {
    setModalContent(content);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        py: 10,
      }}
    >
      <FooterModal
        open={openModal}
        onClose={handleCloseModal}
        content={modalContent}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          pt: { xs: 4, sm: 8 },
          width: "100%",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <div>
          <Link
            color="text.secondary"
            variant="body2"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleOpenModal("Política de Privacidade");
            }}
            sx={{ cursor: "pointer" }}
          >
            Política de Privacidade
          </Link>
          <Typography sx={{ display: "inline", mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <Link
            color="text.secondary"
            variant="body2"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleOpenModal("Termos de Serviço");
            }}
            sx={{ cursor: "pointer" }}
          >
            Termos de Serviço
          </Link>
          <Copyright />
        </div>
        <Stack sx={{ color: "text.secondary" }}>
          <IconButton
            color="inherit"
            size="small"
            href="https://www.linkedin.com/company/gaiaserver/about"
            aria-label="LinkedIn"
            sx={{ alignSelf: "center" }}
          >
            <LinkedInIcon />
          </IconButton>
        </Stack>
      </Box>
    </Container>
  );
}
