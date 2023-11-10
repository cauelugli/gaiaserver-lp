/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";

import { Badge, IconButton, Stack, Tooltip, Typography } from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoodIcon from "@mui/icons-material/Mood";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

export default function MaterialList() {
  //   const [stateX, setStateX] = React.useState("");

  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Tooltip title="Amei">
        <IconButton size="small">
          <Badge
            badgeContent={<Typography sx={{ fontSize: 9 }}>1</Typography>}
          >
            <FavoriteBorderIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Tooltip title="Gostei">
        <IconButton size="small">
          <Badge
            badgeContent={<Typography sx={{ fontSize: 9 }}>3</Typography>}
          >
            <ThumbUpIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Tooltip title="Não Gostei">
        <IconButton size="small">
          <Badge
            badgeContent={<Typography sx={{ fontSize: 9, ml:0.5 }}>0</Typography>}
          >
            <ThumbDownIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Tooltip title="Haha">
        <IconButton size="small">
          <Badge badgeContent={<Typography sx={{ fontSize: 9 }}>1</Typography>}>
            <MoodIcon />
          </Badge>
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
