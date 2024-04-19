import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#fff",
      paper: "#fff",
    },
  },
  components: {
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
      default: "#121212",
      paper: "#424242",
    },
  },
  components: {
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
            backgroundColor: "#313131",
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
