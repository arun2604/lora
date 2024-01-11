import { AppBar, Box, Button, ThemeProvider, Toolbar, Typography } from "@mui/material";
import theme from "../../theme/theme";
import BouncyButton from "./Button/ButtonComponent";

const style = {
  borderBottomRightRadius: "20px",
  borderBottomLeftRadius: "20px",
  top: "10px",
};

interface buttonProps {
  title: string;
  buttonProps?: any;
  handleClick: (arg0?: any) => any;
}

interface titleProps {
  title: string;
  buttons?: buttonProps[];
}

const TitleBar = ({ title, buttons = [] }: titleProps) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <ThemeProvider theme={theme}>
        <AppBar position="static" color="secondary" sx={style}>
          <Toolbar>
            <Typography variant="h1" component="div" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            {buttons.length > 0 &&
              buttons.map((button, index) => (
                <BouncyButton
                  onClick={() => {
                    button.handleClick((button.buttonProps = null));
                  }}
                  title={button.title}
                  style={{ ml: "1rem" }}
                  key={index}
                />
              ))}
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </Box>
  );
};

export default TitleBar;
