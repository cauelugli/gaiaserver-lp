/* eslint-disable react/prop-types */
import * as React from "react";

import { Grid2 } from "@mui/material";

import HomeBlock from "../components/large/HomeBlock";
import HomeSideBar from "../components/large/HomeSideBar";

const Home = ({
  api,
  layout,
  homePagePreferences,
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
    <Grid2
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
      justifyContent={homePagePreferences === 3 && "center"}
    >
      <Grid2 item lg={9} xl={8}>
        <HomeBlock
          layout={layout}
          // userUsername={userUsername}
          allowedLinks={allowedLinks}
          configData={configData.customization}
          currentWindowSize={currentWindowSize}
        />
      </Grid2>
      {homePagePreferences !== 3 &&
        (currentWindowSize === "md2" ||
          currentWindowSize === "lg1" ||
          currentWindowSize === "lg2" ||
          currentWindowSize === "xl") && (
          <Grid2 item lg={3} xl={4}>
            <HomeSideBar
              userId={userId}
              homePagePreferences={homePagePreferences}
              handleShortcutClick={handleShortcutClick}
              allowedLinks={allowedLinks}
              userAgenda={userAgenda}
              mainColor={mainColor}
              api={api}
            />
          </Grid2>
        )}
    </Grid2>
  );
};

export default Home;
