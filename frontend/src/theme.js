import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#fff",
      paper: "#fff",
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
          color: "white", // Torna o texto branco para todos os Typography no tema escuro
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: "white", // Torna o texto branco para todos os Typography no tema escuro
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#aaa", // Cor para abas não selecionadas
          "&.Mui-selected": {
            color: "#fff", // Cor quando a aba está selecionada
          },
          "&:hover": {
            color: "#ddd",
            backgroundColor: "#2e2e2e", // Um pouco mais claro que o fundo do componente Tabs
          },
        },
      },
    },
  },
});
