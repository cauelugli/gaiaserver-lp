/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import WelcomingMessage from "../components/small/WelcomingMessage";
import HomeBlock from "../components/HomeBlock";

const Home = ({ user, configDashboard, onMount, onUnmount }) => {
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
      <HomeBlock />
    </>
  );
};

export default Home;
