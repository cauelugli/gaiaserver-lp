import { createTheme } from "@mui/material/styles";

const getUserPaletteColor = () => {
  const userPreferences = JSON.parse(sessionStorage.getItem("userPreferences"));
  return userPreferences?.paletteColor || "#f8f8ff";
};

const userPaletteColor = getUserPaletteColor();

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
