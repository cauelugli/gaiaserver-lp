/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";

const WelcomingMessage = ({ userName, userGender, showMessage }) => {
  const [initialMessage, setInitialMessage] = useState("");
  const [finalMessage, setFinalMessage] = useState("");
  const [shouldRenderMessage, setShouldRenderMessage] = useState({});

  useEffect(() => {
    const defineInitialMessage = () => {
      const currentDate = new Date();
      const currentHour = currentDate.getHours();
      let message = "";

      switch (shouldRenderMessage && shouldRenderMessage.helloInitialText) {
        case "hello":
          message = "Olá";
          break;
        case "welcome":
          message = `Bem vind${userGender === "f" ? "a" : "o"}`;
          break;
        case "formal":
          if (currentHour < 12) {
            message = "Bom dia";
          } else if (currentHour >= 12 && currentHour < 18) {
            message = "Boa tarde";
          } else {
            message = "Boa noite";
          }
          break;
        default:
          message = "";
          break;
      }

      setInitialMessage(message);
      if (shouldRenderMessage && shouldRenderMessage.helloFinalText !== "") {
        setFinalMessage(shouldRenderMessage.helloFinalText);
      }
    };

    defineInitialMessage();
    setShouldRenderMessage(showMessage.isActive);
  }, [shouldRenderMessage, showMessage, userGender]);

  if (shouldRenderMessage) {
    if (shouldRenderMessage.isActive === "false") {
      return null;
    } else if (shouldRenderMessage.isActive === "true") {
      return (
        <Typography sx={{ fontSize: 20, ml: 2, mb: 1, fontWeight: "bold" }}>
          {initialMessage}, {userName}. {finalMessage}
        </Typography>
      );
    }
  }
};

export default WelcomingMessage;
