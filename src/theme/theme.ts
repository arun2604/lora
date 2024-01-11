import React from "react";
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#1e88e5",
      dark: "#2196f3",
      contrastText: "#fff",
    },
    secondary: {
      light: "#81EFDE",
      main: "#e0effb",
      dark: "#e64a19",
      contrastText: "#000",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    fontSize: 15,
    h1: {
      fontSize: "1.5rem",
      color: "#000000",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      color: "#616161",
      margin: "5px",
    },
    h6: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "#fff",
    },
    h5: {
      fontSize: "0.8rem",
      fontWeight: 600,
      color: "#fff",
    },
  },
  components:{
    MuiButton:{
      styleOverrides:{
        root:{
          fontSize : '1 rem',
          color:'#fff',
          background:"#1976d2"
        }
      }
    },
  }

  // Ag-grid Theming:

  
});
export default theme;
