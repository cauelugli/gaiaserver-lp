import * as React from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import PaletteIcon from "@mui/icons-material/Palette";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import Typography from "@mui/material/Typography";

const featureOptions = [
  {
    icon: <AutoAwesomeIcon />,
    title: "Simplicidade",
    description: (
      <Typography>
        Crie seus <strong> Clientes, Produtos e Vendas</strong> de forma{" "}
        <strong>simples e ilimitada</strong>.
      </Typography>
    ),
    images: ["/images/new1.png", "/images/new2.png", "/images/new3.png"],
    captions: [
      "Formulários mais Simples: Use informações relevantes para Você!",
      "Campos Personalizados: Crie os Produtos como Você quiser!",
      "Foco nas Vendas: Com um fluxo suave, Você vende mais!",
    ],
  },
  {
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
    captions: [
      "Inúmeras Possibilidades de Customização",
      "Inúmeras Possibilidades de Customização",
      "Inúmeras Possibilidades de Customização",
      "Inúmeras Possibilidades de Customização",
    ],
  },
  {
    icon: <ElectricBoltIcon />,
    title: "Rapidez no que Importa",
    description: (
      <Typography>
        Realize uma venda com menos de <strong>nove clicks</strong>!
      </Typography>
    ),
    images: ["/images/addingSale.mp4"],
  },
  {
    icon: <SportsEsportsIcon />,
    title: "Você no Controle",
    description: (
      <Typography>
        Venda ou Serviço, Pessoa ou Empresa, À vista ou A prazo: Você{" "}
        <strong>comanda</strong>! Tenha em seu sistema{" "}
        <strong>apenas o que você usa</strong>.
      </Typography>
    ),
    images: ["/images/new1.png", "/images/new1.png", "/images/new1.png"],
    captions: ["new1", "new2", "new3"],
  },
];

export default featureOptions;
