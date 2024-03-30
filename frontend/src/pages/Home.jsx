/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import { Grid } from "@mui/material";

import HomeBlock from "../components/HomeBlock";
import HomeSideBar from "../components/HomeSideBar";
import WelcomingMessage from "../components/small/WelcomingMessage";

const Home = ({
  user,
  userPreferences,
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
      <Grid container direction="row">
        <Grid item md={9}>
          <HomeBlock
            allowedLinks={allowedLinks}
            user={user}
            configData={configData}
            darkenedColor={darkenedColor}
            darkMode={darkMode}
          />
        </Grid>
        <Grid item md={3}>
          <HomeSideBar user={user} />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
