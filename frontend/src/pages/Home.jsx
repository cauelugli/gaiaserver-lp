/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import WelcomingMessage from "../components/small/WelcomingMessage";
import HomeBlock from "../components/HomeBlock";
import { Grid } from "@mui/material";

const Home = ({
  user,
  allowedLinks,
  configDashboard,
  onMount,
  onUnmount,
  configData,
  darkenedColor,
  darkMode,
}) => {
  const [showMessage, setShowMessage] = React.useState(true);

  React.useEffect(() => {
    if (configDashboard) {
      setShowMessage((prevState) => ({
        ...prevState,
        isActive: configDashboard.showHello,
      }));
    }
  }, [configDashboard]);

  React.useEffect(() => {
    if (onMount) {
      onMount();
    }

    return () => {
      if (onUnmount) {
        onUnmount();
      }
    };
  }, [onMount, onUnmount]);

  return (
    <>
      <WelcomingMessage user={user} showMessage={showMessage} />
      <Grid container sx={{ mx: "2%" }}>
        <HomeBlock
          allowedLinks={allowedLinks}
          user={user}
          configData={configData}
          darkenedColor={darkenedColor}
          darkMode={darkMode}
        />
      </Grid>
    </>
  );
};

export default Home;
