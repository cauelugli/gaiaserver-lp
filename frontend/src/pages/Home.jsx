/* eslint-disable react/prop-types */
import * as React from "react";

import { Grid } from "@mui/material";

import HomeBlock from "../components/large/HomeBlock";
import HomeSideBar from "../components/large/HomeSideBar";

const Home = ({
  api,
  layout,
  userId,
  // userUsername,
  allowedLinks,
  onMount,
  onUnmount,
  configData,
  handleShortcutClick,
  userAgenda,
  mainColor,
  currentWindowSize,
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
    <Grid
      container
      sx={{
        mx:
          currentWindowSize === "lg1" ||
          currentWindowSize === "lg2" ||
          currentWindowSize === "xl"
            ? 1
            : 0,
        mt: 1,
        minHeight: "45vw",
      }}
    >
      <Grid item lg={9} xl={8}>
        <HomeBlock
          layout={layout}
          // userUsername={userUsername}
          allowedLinks={allowedLinks}
          configData={configData}
          currentWindowSize={currentWindowSize}
        />
      </Grid>
      {(currentWindowSize === "md2" ||
        currentWindowSize === "lg1" ||
        currentWindowSize === "lg2" ||
        currentWindowSize === "xl") && (
        <Grid item lg={3} xl={4}>
          <HomeSideBar
            userId={userId}
            handleShortcutClick={handleShortcutClick}
            allowedLinks={allowedLinks}
            userAgenda={userAgenda}
            mainColor={mainColor}
            api={api}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default Home;
