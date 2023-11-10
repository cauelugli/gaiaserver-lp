/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";

import { Badge, IconButton, Stack, Tooltip, Typography } from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoodIcon from "@mui/icons-material/Mood";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const InteractionReactions = ({
  userId,
  userReactions,
  setUserReactions,
  job,
  number,
  interaction,
}) => {
  const reactionsMap = {
    love: {
      icon: <FavoriteBorderIcon />,
      title: "Amei",
      color: "#a83f39",
    },
    like: {
      icon: <ThumbUpIcon />,
      title: "Gostei",
      color: "#228b22",
    },
    dislike: {
      icon: <ThumbDownIcon />,
      title: "Não Gostei",
      color: "#2b2c5a",
    },
    haha: {
      icon: <MoodIcon />,
      title: "Haha",
      color: "#ffdb58",
    },
  };

  const handleReactionClick = async (reactionType) => {
    try {
      const res = await api.put("/jobs", {
        jobId: job._id,
        number,
        userId,
        option: "reaction",
        reactionType,
      });
      setUserReactions({
        ...userReactions,
        [job._id]: res.data.reactions,
      });
    } catch (err) {
      console.error("Erro ao atualizar reação:", err);
    }
  };

  const userReacted = (reactionType) =>
    interaction.reactions[reactionType].usersReacted.includes(userId);

  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      {Object.keys(reactionsMap).map((reactionType) => (
        <Tooltip title={reactionsMap[reactionType].title} key={reactionType}>
          <IconButton
            size="small"
            onClick={() => handleReactionClick(reactionType)}
            sx={{
              color: userReacted(reactionType)
                ? reactionsMap[reactionType].color
                : "#777",
            }}
          >
            <Badge
              badgeContent={
                <Typography sx={{ fontSize: 9 }}>
                  {interaction.reactions[reactionType].quantity}
                </Typography>
              }
            >
              {reactionsMap[reactionType].icon}
            </Badge>
          </IconButton>
        </Tooltip>
      ))}
    </Stack>
  );
};

export default InteractionReactions;
