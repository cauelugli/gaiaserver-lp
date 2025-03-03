/* eslint-disable react/prop-types */
import * as React from "react";

import { Grid2 } from "@mui/material";

import HomeBlock from "../components/large/HomeBlock";
import HomeSideBar from "../components/large/HomeSideBar";
import FinanceSmallReports from "../components/small/FinanceSmallReports";

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
    <>
      <Grid2 container justifyContent={homePagePreferences === 3 && "center"}>
        <Grid2 sx={{ width: "80%" }}>
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
            <Grid2 sx={{ width: "20%" }}>
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
      <Grid2 container sx={{ height: "15vw", mt: 3 }}>
        <FinanceSmallReports api={api} mainColor={mainColor}/>
      </Grid2>
    </>
  );
};

export default Home;
