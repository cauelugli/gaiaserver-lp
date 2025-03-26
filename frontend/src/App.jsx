/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { io } from "socket.io-client";
const socket = io("http://localhost:5002");

import { Grid2, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme";

import NavBar from "./components/large/NavBar";
import SideBar from "./components/large/SideBar";
import ShortcutModals from "./components/large/ShortcutModals";

import pageOptions from "./options/pageOptions";

import Account from "./pages/Account";
import Config from "./pages/Config";
import Files from "./pages/Files";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PageModel from "./pages/PageModel";
import Reports from "./pages/Reports";
import { AppDataProvider } from "./AppDataContext";
import Log from "./pages/Log";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

function isAuthenticated(login, userData) {
  return login && userData;
}

export default function App() {
  const [configData, setConfigData] = useState([]);
  const [userPreferences, setUserPreferences] = useState({});
  const [userAgenda, setUserAgenda] = useState([]);
  const login = JSON.parse(sessionStorage.getItem("login"));
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const [shortcutModalState, setShortcutModalState] = useState({
    show: false,
    action: null,
    props: {},
  });
  const [showSidebar, setShowSidebar] = useState(true);

  const [refreshData, setRefreshData] = React.useState(false);
  const theme = userPreferences?.darkMode ? darkTheme : lightTheme;

  console.log("App mounted control");

  const handleSidebarVisibility = (visibility) => {
    setShowSidebar(visibility);
  };

  // force 10S TIMED refresh from websocket (for global changes)
  useEffect(() => {
    socket.on("forceRefresh", () => {
      toast.info(
        "Atualização necessária! Recarregando a página em 10 segundos",
        {
          closeOnClick: false,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 9500,
        }
      );

      const timer = setTimeout(() => {
        window.location.reload();
      }, 10000);

      return () => {
        clearTimeout(timer);
      };
    });

    return () => {
      socket.off("forceRefresh");
    };
  }, []);

  // force 1S TIMED refresh from websocket (for individual changes)
  useEffect(() => {
    socket.on("forceIndividualRefresh", (userId) => {
      if (userId === userData._id) {
        toast.info("Atualização necessária! Recarregando a página", {
          closeOnClick: false,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 450,
          color: "success",
        });

        const timer = setTimeout(() => {
          window.location.reload();
        }, 1000);

        return () => {
          clearTimeout(timer);
        };
      }
    });

    return () => {
      socket.off("forceIndividualRefresh");
    };
  }, []);

  // Fetch initial data and check permissions for pages
  // Fetch initial data and check permissions for pages
  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        const [config, preferences, userAgenda] = await Promise.all([
          api.get("/config"),
          api.get(`/userPreferences`),
          api.get(`/get/userAgenda`),
        ]);

        setConfigData(config.data);
        setUserPreferences(preferences.data);
        setUserAgenda(userAgenda.data);
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      }
    };

    fetchAndProcessData();
  }, [refreshData]);

  // Changing window size
  // eslint-disable-next-line no-unused-vars
  const [windowSizeSetter, setWindowSizeSetter] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const getSizeCategory = (width) => {
    if (width < 480) return "nano"; // nano
    if (width < 600) return "xs"; // extra small
    if (width < 960) return "sm"; // small
    if (width < 1200) return "md1"; // medium 1
    if (width < 1280) return "md2"; // medium 2
    if (width < 1600) return "lg1"; // large 1
    if (width < 1920) return "lg2"; // large 2
    return "xl"; // extra large
  };
  const [currentWindowSize, setCurrentWindowSize] = useState(
    getSizeCategory(window.innerWidth)
  );
  useEffect(() => {
    let timeoutId;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const newWidth = window.innerWidth;
        setWindowSizeSetter({
          width: newWidth,
          height: window.innerHeight,
        });
        setCurrentWindowSize(getSizeCategory(newWidth));
      }, 500);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <AppDataProvider>
      <ThemeProvider theme={theme}>
        <Grid2
          sx={{
            m: -1,
            backgroundColor: userPreferences?.paletteColor,
          }}
        >
          <Router>
            <Grid2 container>
              {login && (
                <NavBar
                  api={api}
                  socket={socket}
                  user={userData}
                  configData={configData}
                  barPosition={userPreferences.barPosition}
                />
              )}
              {login && showSidebar && !userPreferences.barPosition && (
                <Grid2
                  item
                  sx={{
                    textAlign: "center",
                    height: "auto",
                    maxWidth: 58,
                  }}
                >
                  <SideBar configData={configData} user={userData} />
                </Grid2>
              )}

              <Grid2 container sx={{ p: 1, minHeight: "55vw" }}>
                <Grid2>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        isAuthenticated(login, userData) ? (
                          <Home
                            api={api}
                            layout={userPreferences.homePageLayout}
                            homePagePreferences={
                              userPreferences.homePagePreferences
                            }
                            userId={userData._id}
                            userName={userData.name}
                            userUsername={userData.username}
                            userAgenda={userAgenda}
                            mainColor={
                              configData?.customization &&
                              configData?.customization?.mainColor
                            }
                            handleShortcutClick={"handleShortcutClick"}
                            configData={configData}
                            onMount={() => handleSidebarVisibility(false)}
                            onUnmount={() => handleSidebarVisibility(true)}
                            currentWindowSize={currentWindowSize}
                            windowSizeSetter={windowSizeSetter}
                          />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/login"
                      element={!login ? <Login /> : <Navigate to="/" />}
                    />
                    <Route
                      path="/account"
                      element={
                        isAuthenticated(login, userData) ? (
                          <Account
                            user={userData}
                            userPreferences={userPreferences}
                            refreshData={refreshData}
                            setRefreshData={setRefreshData}
                            topBar={userPreferences.barPosition}
                          />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />

                    <Route
                      path="/reports"
                      element={
                        isAuthenticated(login, userData) ? (
                          <Reports
                            userId={userData._id}
                            userUsername={userData.username}
                            configCustomization={configData?.customization}
                            topBar={userPreferences.barPosition}
                            api={api}
                            mainColor={configData?.customization?.mainColor}
                            windowSizeSetter={windowSizeSetter}
                          />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/config"
                      element={
                        isAuthenticated(login, userData) ? (
                          <Config
                            topBar={userPreferences.barPosition}
                            mainColor={
                              configData?.customization?.mainColor || "#f8ff00"
                            }
                            userName={userData.name}
                            userId={userData._id}
                            refreshData={refreshData}
                            setRefreshData={setRefreshData}
                            configCustomization={configData?.customization}
                            currentWindowSize={currentWindowSize}
                          />
                        ) : isAuthenticated(login, userData) ? (
                          <Typography sx={{ m: 2, fontSize: 16 }}>
                            Seu usuário não possui autorização à página.
                          </Typography>
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />

                    <Route
                      path="/log"
                      element={
                        isAuthenticated(login, userData) &&
                        userData.username === "admin" ? (
                          <Log
                            api={api}
                            topBar={userPreferences.barPosition}
                            mainColor={configData?.customization?.mainColor}
                          />
                        ) : isAuthenticated(login, userData) ? (
                          <Typography sx={{ m: 2, fontSize: 16 }}>
                            Seu usuário não possui autorização à página.
                          </Typography>
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />

                    <Route
                      path="/files"
                      element={
                        isAuthenticated(login, userData) ? (
                          <Files
                            topBar={userPreferences.barPosition}
                            userName={userData.name}
                            userId={userData._id}
                            refreshData={refreshData}
                            setRefreshData={setRefreshData}
                            configCustomization={configData?.customization}
                          />
                        ) : isAuthenticated(login, userData) ? (
                          <Typography sx={{ m: 2, fontSize: 16 }}>
                            Seu usuário não possui autorização à página.
                          </Typography>
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />

                    {configData.customization
                      ? pageOptions.map((option, index) => (
                          <Route
                            key={index}
                            path={`/${option.page}`}
                            element={
                              isAuthenticated(login, userData) ? (
                                <PageModel
                                  api={api}
                                  socket={socket}
                                  item={option}
                                  palette={theme.palette}
                                  userId={userData._id}
                                  userUsername={userData.username}
                                  isAdmin={userData.username === "admin"}
                                  userName={userData.name}
                                  setUserPreferences={setUserPreferences}
                                  configData={configData}
                                  topBar={userPreferences.barPosition}
                                  tableOrCardView={
                                    userPreferences.tableOrCardView
                                  }
                                  cardSize={userPreferences.cardSize}
                                  configCustomization={
                                    configData?.customization
                                  }
                                  currentWindowSize={currentWindowSize}
                                  windowSizeSetter={windowSizeSetter}
                                />
                              ) : (
                                <Navigate to="/login" />
                              )
                            }
                          />
                        ))
                      : ""}
                  </Routes>
                </Grid2>
              </Grid2>
            </Grid2>
            <ToastContainer />
            {shortcutModalState.show && (
              <ShortcutModals
                {...shortcutModalState.props}
                configData={configData}
                configCustomization={configData?.customization}
                configNotifications={configData.notifications}
                user={userData}
                toast={toast}
                action={shortcutModalState.action}
                fullWidth={shortcutModalState.fullWidth}
                maxWidth={shortcutModalState.maxWidth}
                selectedItem={shortcutModalState.selectedItem}
                onClose={() => setShortcutModalState({ show: false })}
              />
            )}
          </Router>
        </Grid2>
      </ThemeProvider>
    </AppDataProvider>
  );
}
