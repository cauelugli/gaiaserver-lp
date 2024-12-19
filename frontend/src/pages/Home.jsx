/* eslint-disable react/prop-types */
import * as React from "react";

import { Grid } from "@mui/material";

import HomeBlock from "../components/large/HomeBlock";
import HomeSideBar from "../components/large/HomeSideBar";

const Home = ({
  userId,
  userUsername,
  allowedLinks,
  onMount,
  onUnmount,
  configData,
  handleShortcutClick,
  userAgenda,
  mainColor,
}) => {
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
      <Grid
        container
        sx={{
          width:"105%",
          minHeight: "40vw",
          mx: 2,
          mt: 1,
        }}
      >
        <Grid item md={8}>
          <HomeBlock
            userUsername={userUsername}
            allowedLinks={allowedLinks}
            configData={configData}
          />
        </Grid>
        <Grid item md={4}>
          <HomeSideBar
            userId={userId}
            handleShortcutClick={handleShortcutClick}
            allowedLinks={allowedLinks}
            userAgenda={userAgenda}
            mainColor={mainColor}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
