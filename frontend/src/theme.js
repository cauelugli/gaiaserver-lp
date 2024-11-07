import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f8f8ff",
      paper: "#f8f8ff",
    },
  },
  components: {
    MuiGrid: {
      styleOverrides: {
        root: {
          "&.noHoverBackground": {
            backgroundColor: "#f8f8ff",
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
      default: "#1D1D1D",
      paper: "red",
    },
  },
  components: {
    MuiGrid: {
      styleOverrides: {
        root: {
          "&.noHoverBackground": {
            backgroundColor: "#1D1D1D",
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
