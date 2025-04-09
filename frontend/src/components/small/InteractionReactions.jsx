/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";
const api = axios.create({
  baseURL: "/api",
});
import toast from "react-hot-toast";
import { keyframes } from "@mui/system";

import { Badge, IconButton, Stack, Tooltip, Typography } from "@mui/material";

import { icons } from "../../icons";

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
  itemId,
  number,
  interaction,
  refreshData,
  setRefreshData,
  fromSales,
  updateInteractions,
  stageIndex,
  taskIndex,
  interactionIndex,
}) => {
  const reactionsMap = {
    love: {
      icon: <icons.FavoriteBorderIcon />,
      title: "Amei",
      color: "#a83f39",
    },
    like: {
      icon: <icons.ThumbUpIcon />,
      title: "Gostei",
      color: "#228b22",
    },
    dislike: {
      icon: <icons.ThumbDownIcon />,
      title: "Não Gostei",
      color: "#2b2c5a",
    },
    haha: {
      icon: <icons.MoodIcon />,
      title: "Haha",
      color: "#ffdb58",
    },
  };
  // eslint-disable-next-line no-unused-vars
  const [endpoint, setEndpoint] = React.useState(fromSales ? "sales" : "jobs");

  console.log("endpoint", endpoint);

  const handleReactionClick = async (reactionType) => {
    const finalEndpoint = `/${endpoint}/reaction`;
    try {
      const res = await api.put(finalEndpoint, {
        itemId,
        userId: userId,
        number,
        stageIndex,
        taskIndex,
        interactionIndex,
        reactionType,
      });

      if (res.data) {
        setUserReactions({
          ...userReactions,
          [itemId]: res.data.reactions,
        });
        updateInteractions(res.data.interactions);
        console.log("worked! there it goes: ", res.data.interactions, "\n");
        setRefreshData(!refreshData);
      }
    } catch (err) {
      console.log("err", err);
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  const handleDeleteInteraction = async (interactionId) => {
    try {
      const res = await api.put(`/${endpoint}/interaction/remove`, {
        itemId,
        interactionId: interactionId,
      });
      if (res.data) {
        toast.success("Interação Removida", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      console.log("res.data.interactions", res.data.interactions);
      updateInteractions(res.data.interactions);
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
                : "inherit",
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
            <icons.DeleteIcon
              sx={{
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
