/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
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

import { Grid, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme";

import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";

import routeOptions from "./routesOptions";

import Account from "./pages/Account";
import Config from "./pages/Config";
import Dashboard from "./pages/Dashboard";
import Files from "./pages/Files";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PageModel from "./pages/PageModel";
import Reports from "./pages/Reports";

import ShortcutModals from "./components/ShortcutModals";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

function isAuthenticated(login, userData) {
  return login && userData;
}

function hasPermission(user, configData, routePath) {
  if (!configData.permissions) return false;
  if (user.role.name === "Admin") return true;

  const allowedRoles = configData.permissions[routePath];

  return allowedRoles && allowedRoles.some((id) => id === user.role.id);
}

// function darkenColor(hex, factor) {
//   hex = hex.replace(/^#/, "");
//   const bigint = parseInt(hex, 16);
//   const r = (bigint >> 16) & 255;
//   const g = (bigint >> 8) & 255;
//   const b = bigint & 255;

//   const newR = Math.max(0, Math.round(r - factor));
//   const newG = Math.max(0, Math.round(g - factor));
//   const newB = Math.max(0, Math.round(b - factor));

//   const darkenedHex = `#${((newR << 16) | (newG << 8) | newB)
//     .toString(16)
//     .padStart(6, "0")}`;

//   return darkenedHex;
// }

export default function App() {
  const [configData, setConfigData] = useState([]);
  const [configNotifications, setConfigNotifications] = useState([]);
  const [configNotificationsBooleans, setConfigNotificationsBooleans] =
    useState([]);
  const [configTables, setConfigTables] = useState(null);
  const [configAgenda, setConfigAgenda] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userPreferences, setUserPreferences] = useState([]);
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [allowedLinks, setAllowedLinks] = useState([]);
  const login = JSON.parse(sessionStorage.getItem("login"));
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const [shortcutModalState, setShortcutModalState] = useState({
    show: false,
    action: null,
    props: {},
  });
  const [showSidebar, setShowSidebar] = useState(true);

  const [refreshData, setRefreshData] = React.useState(false);
  const theme = userPreferences.darkMode ? darkTheme : lightTheme;

  console.log("App mounted control");

  const handleSidebarVisibility = (visibility) => {
    setShowSidebar(visibility);
  };

  // force refresh from websocket
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

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        const notifications = await api.get(
          `/managers/notifications/${userData._id}`
        );
        const preferences = await api.get(`/userPreferences/${userData._id}`);
        setConfigData(config.data[0]);
        setConfigNotifications(config.data[0].notifications);
        setConfigNotificationsBooleans(config.data[0].notificationsBooleans);
        setConfigTables(config.data[0].tables);
        setConfigAgenda(config.data[0].agenda);
        setNotifications(notifications.data);
        setUserPreferences(preferences.data);
        sessionStorage.setItem(
          "userPreferences",
          JSON.stringify(preferences.data)
        );

        const resUsers = await api.get("/users");
        const resManagers = await api.get("/managers");
        const usersCombinedData = [...resUsers.data, ...resManagers.data];
        setUsers(usersCombinedData);
        setManagers(resManagers.data);

        const positions = await api.get("/positions");
        setPositions(positions.data);

        const departments = await api.get("/departments");
        setDepartments(departments.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  // displaying notifications
  useEffect(() => {
    const handleUnload = () => {
      const readNotifications = Object.values(userData.notifications)
        .filter((notification) => notification.status === "Lida")
        .map((notification) => notification._id);

      if (readNotifications.length > 0) {
        localStorage.setItem(
          "readNotifications",
          JSON.stringify(readNotifications)
        );
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [userData]);

  // checks for user's permissions on app based on sidebar (permissions) config
  // defines 'allowedLinks' as an Array of string with permitted apps
  useEffect(() => {
    if (!configData || !userData || !configData.permissions) {
      return;
    }
    let newAllowedLinks = [];
    Object.keys(configData.permissions).forEach((routePath) => {
      if (hasPermission(userData, configData, routePath)) {
        newAllowedLinks.push(routePath);
      }
    });
    setAllowedLinks(newAllowedLinks);
  }, [configData]);

  // setting userPreferences "in session", since they are being modified in backend, and fetched once,
  // this useEffect grants the User Experience to see what he already changed,
  // not needing to reload the App to see them
  useEffect(() => {
    const storedPreferences = sessionStorage.getItem("userPreferences");
    if (storedPreferences) {
      setUserPreferences(JSON.parse(storedPreferences));
    }
  }, []);

  // opening modal according to userShortcuts
  const handleShortcutClick = (shortcut) => {
    setShortcutModalState({
      show: true,
      action: shortcut.action,
      size: shortcut.size,
      fullWidth: shortcut.fullWidth,
      maxWidth: shortcut.maxWidth,
      permission: shortcut.permission,
      selectedItem: shortcut.selectedItem,
      props: { ...shortcut.props },
    });
  };

  // updating userPreferences on Account Page
  const updateUserPreferences = (newPreferences) => {
    setUserPreferences(newPreferences);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        sx={{
          width: "auto",
          height: "auto",
          m: -1,
          mr: -2,
          backgroundColor: userPreferences.darkMode ? "#302c34" : "none",
        }}
      >
        <Router>
          <Grid container>
            {login && (
              <NavBar
                socket={socket}
                user={userData}
                configData={configData}
                notifications={notifications}
                setNotifications={setNotifications}
                barPosition={userPreferences.barPosition}
              />
            )}
            {login && showSidebar && !userPreferences.barPosition && (
              <Grid
                item
                sx={{
                  textAlign: "center",
                  height: "auto",
                  maxWidth: 58,
                }}
              >
                <SideBar configData={configData} user={userData} />
              </Grid>
            )}

            <Grid
              sx={{
                width: "95%",
              }}
            >
              <Grid container sx={{ p: 2 }}>
                <Grid item xs={12} xl={12}>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        isAuthenticated(login, userData) ? (
                          <Home
                            userId={userData._id}
                            userName={userData.name}
                            userUsername={userData.username}
                            userGender={userData.gender}
                            handleShortcutClick={handleShortcutClick}
                            allowedLinks={allowedLinks}
                            configData={configData}
                            configDashboard={configData.dashboard}
                            onMount={() => handleSidebarVisibility(false)}
                            onUnmount={() => handleSidebarVisibility(true)}
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
                            setUserPreferences={updateUserPreferences}
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
                      path="/dashboard"
                      element={
                        isAuthenticated(login, userData) &&
                        hasPermission(userData, configData, "dashboard") ? (
                          <Dashboard
                            userId={userData._id}
                            userUsername={userData.username}
                            users={users}
                            configAgenda={configAgenda}
                            configDashboard={configData.dashboard}
                            configCustomization={configData.customization}
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
                        isAuthenticated(login, userData) &&
                        hasPermission(userData, configData, "reports") ? (
                          <Reports
                            userId={userData._id}
                            userUsername={userData.username}
                            configCustomization={configData.customization}
                            topBar={userPreferences.barPosition}
                          />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/config"
                      element={
                        isAuthenticated(login, userData) &&
                        hasPermission(userData, configData, "config") ? (
                          <Config
                            topBar={userPreferences.barPosition}
                            userName={userData.name}
                            userId={userData._id}
                            refreshData={refreshData}
                            setRefreshData={setRefreshData}
                            configCustomization={configData.customization}
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
                        isAuthenticated(login, userData) &&
                        hasPermission(userData, configData, "files") ? (
                          <Files
                            topBar={userPreferences.barPosition}
                            userName={userData.name}
                            userId={userData._id}
                            refreshData={refreshData}
                            setRefreshData={setRefreshData}
                            configCustomization={configData.customization}
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

                    {routeOptions.map((option, index) => (
                      <Route
                        key={index}
                        path={`/${option.page}`}
                        element={
                          isAuthenticated(login, userData) &&
                          hasPermission(userData, configData, option.page) ? (
                            <PageModel
                              item={option}
                              userId={userData._id}
                              userUsername={userData.username}
                              users={users}
                              setUserPreferences={setUserPreferences}
                              configData={configData}
                              userName={userData.name}
                              topBar={userPreferences.barPosition}
                              tableOrCardView={userPreferences.tableOrCardView}
                              cardSize={userPreferences.cardSize}
                              configAgenda={configAgenda}
                              configDashboard={configData.dashboard}
                              configCustomization={configData.customization}
                            />
                          ) : (
                            <Navigate to="/login" />
                          )
                        }
                      />
                    ))}
                  </Routes>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <ToastContainer />
          {shortcutModalState.show && (
            <ShortcutModals
              {...shortcutModalState.props}
              configData={configData}
              configCustomization={configData.customization}
              configNotifications={configNotifications}
              configNotificationsBooleans={configNotificationsBooleans}
              user={userData}
              users={users}
              positions={positions}
              managers={managers}
              departments={departments}
              toast={toast}
              action={shortcutModalState.action}
              fullWidth={shortcutModalState.fullWidth}
              maxWidth={shortcutModalState.maxWidth}
              selectedItem={shortcutModalState.selectedItem}
              // section={shortcutModalState.section}
              configAgenda={configAgenda}
              onClose={() => setShortcutModalState({ show: false })}
            />
          )}
        </Router>
      </Grid>
    </ThemeProvider>
  );
}
