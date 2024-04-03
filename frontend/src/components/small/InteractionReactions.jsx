/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { keyframes } from "@mui/system";

import { Badge, IconButton, Stack, Tooltip, Typography } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoodIcon from "@mui/icons-material/Mood";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Define a animação para o ícone
const growShrinkAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(10);
  }
  50% {
    transform: scale(20);
  }
  75% {
    transform: scale(10);
  }
  100% {
    transform: scale(1);
  }
`;

const InteractionReactions = ({
  userId,
  userName,
  userReactions,
  setUserReactions,
  job,
  number,
  interaction,
  refreshData,
  setRefreshData,
  fromSales,
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
  const [endpoint, setEndpoint] = React.useState(fromSales ? "sales" : "jobs");

  const handleReactionClick = async (reactionType) => {
    try {
      const res = await api.put(`/${endpoint}/reaction`, {
        jobId: job._id,
        job,
        number,
        userId: userId,
        reactionType,
      });
      setUserReactions({
        ...userReactions,
        [job._id]: res.data.reactions,
      });
      setRefreshData(!refreshData);
    } catch (err) {
      console.error("Erro ao atualizar reação:", err);
    }
  };

  const handleDeleteInteraction = async (interactionId, activity, userName) => {
    try {
      const res = await api.put(`/${endpoint}/interaction/remove`, {
        jobId: job._id,
        interactionId: interactionId,
        activity: activity,
        userName: userName,
      });
      if (res.data) {
        toast.success("Interação Removida", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setRefreshData(!refreshData);
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
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
              "&:active": {
                animation: `${growShrinkAnimation} 3s ease-in-out`,
              },
              position: "relative",
              zIndex: 1,
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
      {interaction.user === userName &&
        !interaction.activity.startsWith("Aprovação solicitada") &&
        !interaction.activity.startsWith("Venda criada") && (
          <IconButton
            sx={{ ml: 2 }}
            onClick={() =>
              handleDeleteInteraction(interaction._id, interaction.activity)
            }
          >
            <DeleteIcon
              sx={{
                color: "#777",
                "&:hover": {
                  color: "red",
                },
              }}
            />
          </IconButton>
        )}
    </Stack>
  );
};

export default InteractionReactions;
