/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";

import {
  Grid2,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";

const options = [
  { label: "Clientes", icon: <icons.WorkIcon />, link: "/customers" },
  { label: "Solicitações", icon: <icons.GradingIcon />, link: "/requests" },
  { label: "Serviços", icon: <icons.BuildIcon />, link: "/services" },
  { label: "Produtos", icon: <icons.SellIcon />, link: "/products" },
  { label: "Estoque", icon: <icons.WarehouseIcon />, link: "/stock" },
  { label: "Financeiro", icon: <icons.AttachMoneyIcon />, link: "/finance" },
  { label: "Relatórios", icon: <icons.AssessmentIcon />, link: "/reports" },
  {
    label: "Ajuda",
    icon: <icons.HelpCenterIcon />,
    link: "/help",
    disabled: true,
  },
  { label: "Arquivos", icon: <icons.InsertDriveFileIcon />, link: "/files" },
  { label: "Configurações", icon: <icons.SettingsIcon />, link: "/config" },
];

const SideBar = ({ configData }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <Grid2 sx={{ height: "98%" }}>
      <List
        sx={{
          height: "100%",
          backgroundColor:
            configData && configData.customization
              ? configData.customization.mainColor
              : "white",
        }}
      >
        <Link to="/">
          <ListItemButton
            sx={{
              backgroundColor:
                configData && configData.customization
                  ? configData.customization.mainColor
                  : "white",
            }}
          >
            <icons.HomeIcon
              sx={{
                color:
                  configData && configData.customization
                    ? configData.customization.fontColor
                    : "white",

                backgroundColor:
                  configData && configData.customization
                    ? configData.customization.mainColor
                    : "white",
              }}
            />
          </ListItemButton>
        </Link>
        {options.map((option, index) => (
          <Link
            key={index}
            onClick={() => setHoveredIndex(index)}
            to={option.link}
            style={{
              textDecoration: "none",
              color: "black",
              position: "relative",
              overflow: "hidden",
              backgroundColor:
                configData && configData.customization
                  ? configData.customization.mainColor
                  : "white",
            }}
          >
            <ListItemButton
              selected={hoveredIndex === index}
              disabled={option.disabled}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              sx={{
                color:
                  configData && configData.customization
                    ? configData.customization.fontColor
                    : "white",

                backgroundColor:
                  configData && configData.customization
                    ? configData.customization.mainColor
                    : "white",
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              {option.icon}
              <Typography
                sx={{
                  ml: 1,
                  color:
                    configData && configData.customization
                      ? configData.customization.fontColor
                      : "white",

                  backgroundColor:
                    configData && configData.customization
                      ? configData.customization.mainColor
                      : "white",
                  zIndex: 1,
                  pr: 2,
                  pl: 2,
                  py: 0.5,
                  borderRadius: 3,
                  position: "relative",
                  opacity: hoveredIndex === index ? 1 : 0,
                  transition:
                    "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
                  transform: `translateX(${
                    hoveredIndex === index ? "0" : "-100%"
                  })`,
                }}
              >
                {option.label}
              </Typography>
              <Typography
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",

                  backgroundColor:
                    configData && configData.customization
                      ? configData.customization.mainColor
                      : "white",
                  zIndex: 0,
                  opacity: hoveredIndex === index ? 1 : 0,
                  transition: "opacity 0.3s ease-in-out",
                }}
              />
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Grid2>
  );
};

export default SideBar;
