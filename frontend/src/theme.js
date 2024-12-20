import axios from "axios";
import { createTheme } from "@mui/material/styles";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const getUserPaletteColor = async () => {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const userId = userData?._id;
  const userPreferences = await api.get(`/userPreferences/${userId}`);
  return userPreferences.data?.paletteColor || "#ffffff";
};

const userPaletteColor = await getUserPaletteColor();

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: userPaletteColor,
      paper: userPaletteColor,
    },
  },
  components: {
    MuiGrid: {
      styleOverrides: {
        root: {
          "&.noHoverBackground": {
            backgroundColor: userPaletteColor,
            "&:hover": {
              backgroundColor: "none",
            },
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#eee",
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: userPaletteColor,
      paper: userPaletteColor,
    },
  },
  components: {
    MuiGrid: {
      styleOverrides: {
        root: {
          "&.noHoverBackground": {
            backgroundColor: userPaletteColor,
            "&:hover": {
              backgroundColor: "none",
            },
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          backgroundColor: "none",
          "&:hover": {
            backgroundColor: "none",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#aaa",
          "&.Mui-selected": {
            color: "#fff",
          },
          "&:hover": {
            color: "#ddd",
            backgroundColor: "#2e2e2e",
          },
        },
      },
    },
  },
});
