/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import dayjs from "dayjs";

import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Collapse,
  FormControlLabel,
  Grid,
  IconButton,
  Popover,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import PaletteIcon from "@mui/icons-material/Palette";

const ProjectStages = ({
  stages,
  stagesColorSchema,
  updateStages,
  setStagesSchemaColor,
  setDefinedStagesColors,
}) => {
  const [visibleButton, setVisibleButton] = useState(Boolean(true));
  const [colorSchema, setColorSchema] = useState(stagesColorSchema || 0);
  const [stagesNumber, setStagesNumber] = useState(stages.length || 1);
  const [stagesList, setStagesList] = useState(
    stages && stages.length !== 0
      ? stages
      : [
          {
            title: "",
            tasks: [],
            startAt: dayjs(),
            dueTo: dayjs(),
          },
        ]
  );

  const [colorPopoverAnchorEl, setColorPopoverAnchorEl] = useState(null);
  const colorPopoverOpen = Boolean(colorPopoverAnchorEl);

  const handleColorClick = (event) => {
    setColorPopoverAnchorEl(event.currentTarget);
  };

  const handleColorClose = () => {
    setColorPopoverAnchorEl(null);
  };

  const handleColorChange = (e) => {
    const selectedColor = Number(e.target.value);
    setColorSchema(selectedColor);
    handleColorClose();
  };

  const handleStagesChange = (newStages) => {
    setStagesNumber(newStages);
    const newStagesList = Array.from({ length: newStages }, (_, index) => {
      return (
        stagesList[index] || {
          title: "",
          tasks: [],
          startAt: dayjs(),
          dueTo: dayjs(),
          expanded: false,
        }
      );
    });
    setStagesList(newStagesList);
  };

  const handleStageChange = (index, field, value) => {
    const newStagesList = [...stagesList];
    newStagesList[index][field] = value;
    setStagesList(newStagesList);
  };

  const normalColors = ["#ff0000", "#3300ff"];
  const pastelColors = ["#ff5555", "#0055ff"];

  const renderColorGrid = (colors) => (
    <Grid container spacing={0.3} sx={{ mt: 1 }}>
      {colors.map((color, index) => (
        <Grid key={index} item>
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: color,
              border: "1px solid #aaa",
              borderRadius: 3,
            }}
          />
        </Grid>
      ))}
    </Grid>
  );

  const interpolateColor = (index, totalStages, colorSchema) => {
    if (colorSchema === 0) return undefined; // Sem cor para esquema desabilitado

    const startColor = colorSchema === 1 ? normalColors[0] : pastelColors[0];
    const endColor = colorSchema === 1 ? normalColors[1] : pastelColors[1];

    if (totalStages <= 1) return startColor;

    const mixRatio = index / (totalStages - 1);
    const startRGB = startColor.match(/\w\w/g).map((hex) => parseInt(hex, 16));
    const endRGB = endColor.match(/\w\w/g).map((hex) => parseInt(hex, 16));

    const interpolatedRGB = startRGB.map((start, i) => {
      return Math.round(start + (endRGB[i] - start) * mixRatio);
    });

    return `#${interpolatedRGB
      .map((val) => val.toString(16).padStart(2, "0"))
      .join("")}`;
  };

  const renderCardHeader = (index, title) => {
    const backgroundColor = interpolateColor(
      index,
      stagesList.length,
      colorSchema
    );
    return (
      <CardHeader
        title={
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography sx={{ fontSize: 18 }}>
              {title ? title : `Etapa #${index + 1}`}
            </Typography>
            <IconButton>
              <ExpandMoreIcon />
            </IconButton>
          </Grid>
        }
        sx={{ backgroundColor: backgroundColor || "inherit" }} // Usa a cor calculada ou herda a cor padrão
      />
    );
  };

  const [selectedStage, setSelectedStage] = useState(null);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);

  const handlePopoverOpen = (event, index) => {
    setPopoverAnchorEl(event.currentTarget);
    setSelectedStage(index);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
    setSelectedStage(null);
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        sx={{ height: 320 }}
      >
        <Grid>
          <Typography sx={{ textAlign: "center", fontSize: 22 }}>
            Etapas do Projeto
          </Typography>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{ my: 2 }}
            >
              <Button
                onClick={() => handleStagesChange(stagesNumber - 1)}
                disabled={stagesNumber === 1}
              >
                <Typography sx={{ fontSize: 22 }}>-</Typography>
              </Button>
              <Typography sx={{ fontSize: 22 }}>{stagesNumber}</Typography>
              <Button
                onClick={() => handleStagesChange(stagesNumber + 1)}
                disabled={stagesNumber === 12}
              >
                <Typography
                  sx={{ fontSize: 28 }}
                  disabled={stagesNumber === 12}
                >
                  +
                </Typography>
              </Button>
            </Grid>
          </Grid>
          <Grid container direction="column">
            <Button
              startIcon={<PaletteIcon />}
              variant="contained"
              onClick={handleColorClick}
              size="small"
            >
              Habilitar Cores
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              sx={{ my: 1 }}
              startIcon={<DeleteIcon />}
              onClick={() =>
                setStagesList(
                  [
                    {
                      title: "",
                      startAt: dayjs(),
                      dueTo: dayjs(),
                    },
                  ],
                  setStagesNumber(1),
                  setVisibleButton(Boolean(true)),
                  updateStages([])
                )
              }
            >
              Limpar Etapas
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<CheckIcon />}
              disabled={stagesList.length === 1 || !visibleButton}
              onClick={() => {
                updateStages(stagesList);
                setDefinedStagesColors(
                  stagesList.map((_, index) =>
                    interpolateColor(index, stagesList.length, colorSchema)
                  )
                );
                setVisibleButton(Boolean(false));
                setStagesSchemaColor(colorSchema);
              }}
            >
              SALVAR ETAPAS
            </Button>
            <Popover
              open={colorPopoverOpen}
              anchorEl={colorPopoverAnchorEl}
              onClose={handleColorClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Grid sx={{ width: 200, height: 150, p: 1 }}>
                <RadioGroup
                  value={colorSchema}
                  onChange={handleColorChange}
                  >
                  <FormControlLabel
                    value={0}
                    control={<Radio sx={{ mt: -0.25, mr: -0.5 }} />}
                    label={
                      <Typography sx={{ fontSize: 13 }}>
                        Desabilitado
                      </Typography>
                    }
                  />

                  <FormControlLabel
                    value={1}
                    control={<Radio sx={{ mt: -0.25, mr: -0.5 }} />}
                    label={
                      <Grid container direction="row">
                        <Grid sx={{ m: "auto" }}>
                          <Typography sx={{ fontSize: 13 }}>Padrão</Typography>
                        </Grid>
                        <Grid sx={{ ml: 1, mb: 1 }}>
                          {renderColorGrid(normalColors)}
                        </Grid>
                      </Grid>
                    }
                  />
                  <FormControlLabel
                    value={2}
                    control={<Radio sx={{ mt: -0.25, mr: -0.5 }} />}
                    label={
                      <Grid container direction="row">
                        <Grid sx={{ m: "auto" }}>
                          <Typography sx={{ fontSize: 13 }}>
                            Tons Pastéis
                          </Typography>
                        </Grid>
                        <Grid sx={{ ml: 1, mb: 1 }}>
                          {renderColorGrid(pastelColors)}
                        </Grid>
                      </Grid>
                    }
                  />
                </RadioGroup>
              </Grid>
            </Popover>
          </Grid>
        </Grid>
        <Grid sx={{ width: 700 }} container direction="row">
          {stagesList.map((stage, index) => (
            <React.Fragment key={index}>
              <Card sx={{ mr: 1, mb: 0.5, width: 220 }}>
                <CardActionArea onClick={(e) => handlePopoverOpen(e, index)}>
                  {renderCardHeader(index, stage.title)}
                </CardActionArea>
              </Card>
              <Popover
                open={selectedStage === index}
                anchorEl={popoverAnchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <Grid container direction="column" sx={{ p: 2 }}>
                  <TextField
                    label={`Nome da Etapa ${index + 1}`}
                    value={stage.title}
                    onChange={(e) =>
                      handleStageChange(index, "title", e.target.value)
                    }
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Início em"
                      value={stage.startAt}
                      format="DD/MM/YYYY"
                      onChange={(date) =>
                        handleStageChange(index, "startAt", date)
                      }
                      renderInput={(params) => <TextField {...params} />}
                      sx={{ my: 2 }}
                    />
                    <DatePicker
                      label="Término"
                      value={stage.dueTo}
                      format="DD/MM/YYYY"
                      onChange={(date) =>
                        handleStageChange(index, "dueTo", date)
                      }
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Popover>
            </React.Fragment>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProjectStages;
