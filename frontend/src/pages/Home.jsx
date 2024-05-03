/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import { Grid } from "@mui/material";

import HomeBlock from "../components/HomeBlock";
import HomeSideBar from "../components/HomeSideBar";
import WelcomingMessage from "../components/small/WelcomingMessage";

const Home = ({
  userId,
  userName,
  userUsername,
  userGender,
  allowedLinks,
  configDashboard,
  onMount,
  onUnmount,
  configData,
  handleShortcutClick,
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
      <Grid container direction="row">
        <Grid item md={9}>
          <HomeBlock
            userUsername={userUsername}
            allowedLinks={allowedLinks}
            configData={configData}
          />
        </Grid>
        <Grid item md={3}>
          <HomeSideBar
            userId={userId}
            handleShortcutClick={handleShortcutClick}
            allowedLinks={allowedLinks}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
