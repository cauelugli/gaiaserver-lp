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

const ProjectStages = ({
  name,
  updateStages,
  setStagesSchemaColor,
  setSecondPartOK,
}) => {
  const [colorSchema, setColorSchema] = useState(0);
  const [stagesNumber, setStagesNumbers] = useState(1);
  const [stagesList, setStagesList] = useState([
    {
      title: "",
      startAt: dayjs(),
      dueTo: dayjs(),
    },
  ]);

  const [colorPopoverAnchorEl, setColorPopoverAnchorEl] = useState(null);
  const colorPopoverOpen = Boolean(colorPopoverAnchorEl);

  const handleColorClick = (event) => {
    setColorPopoverAnchorEl(event.currentTarget);
  };
  const handleColorClose = () => {
    setColorPopoverAnchorEl(null);
  };

  const handleStagesChange = (newStages) => {
    setStagesNumbers(newStages);
    const newStagesList = Array.from({ length: newStages }, (_, index) => {
      return (
        stagesList[index] || {
          title: "",
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

  // const handleExpandClick = (index) => {
  //   const newStagesList = [...stagesList];
  //   newStagesList[index].expanded = !newStagesList[index].expanded;
  //   setStagesList(newStagesList);
  // };

  const normalColors = [
    "#ff0000",
    "#ff3300",
    "#ff6600",
    "#ff9900",
    "#ffcc00",
    "#ffff00",
    "#ccff00",
    "#99ff00",
    "#66ff00",
    "#33ff00",
  ];

  const pastelColors = [
    "#ff5555",
    "#ff8855",
    "#ffbb55",
    "#ffdd55",
    "#ffff55",
    "#ccff55",
    "#99ff55",
    "#66ff55",
    "#33ff55",
    "#00ff55",
  ];

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

  const renderCardHeader = (index, title) => {
    const backgroundColor =
      colorSchema !== 0
        ? (colorSchema === 1 ? normalColors : pastelColors)[index]
        : undefined;
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
        sx={{ backgroundColor: backgroundColor }}
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
      direction="row"
      justifyContent="space-evenly"
      alignItems="center"
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
            <Typography
              sx={{
                p: 1,
                fontSize: 24,
                mx: 1,
              }}
            >
              {stagesNumber}
            </Typography>
            <Button
              onClick={() => handleStagesChange(stagesNumber + 1)}
              disabled={stagesNumber === 10}
            >
              <Typography sx={{ fontSize: 28 }} disabled={stagesNumber === 10}>
                +
              </Typography>
            </Button>
          </Grid>
        </Grid>
        <Typography sx={{ textAlign: "center", fontSize: 14 }}>
          <Button
            sx={{ color: "inherit", backgroundColor: "lightgrey" }}
            onClick={handleColorClick}
          >
            Habilitar Cores
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
            <Grid sx={{ width: 350, height: 150, p: 1 }}>
              <RadioGroup
                value={colorSchema}
                onChange={(e) => setColorSchema(Number(e.target.value))}
              >
                <FormControlLabel
                  value={0}
                  control={<Radio sx={{ mt: -0.25, mr: -0.5 }} />}
                  label={
                    <Typography sx={{ fontSize: 13 }}>Desabilitado</Typography>
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
        </Typography>
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
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Grid container direction="column" sx={{p:2}}>
                <TextField
                  label={`Nome da Etapa ${index}`}
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
                    onChange={(date) => handleStageChange(index, "dueTo", date)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
            </Popover>
          </React.Fragment>
        ))}
      </Grid>

      <Grid
        sx={{ mt: 2 }}
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <Button
          sx={{ my: 2 }}
          variant="contained"
          color="success"
          startIcon={<CheckIcon />}
          onClick={() => {
            updateStages(stagesList),
              setStagesSchemaColor(colorSchema),
              setSecondPartOK(Boolean(true));
          }}
        >
          OK e Prosseguir
        </Button>
      </Grid>
    </Grid>
  );
};

export default ProjectStages;
