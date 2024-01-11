import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Drawer from "./Drawer";
import { getProfileDetails } from "../../Redux/Thunks/ProfileThunk";
import { useAppDispatch, useAppSelector } from "../../Redux/Store";
import { Button } from "@mui/material";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [showDrawer, setShowDrawer] = React.useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { profile } = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getProfileDetails());
  }, []);

  const onClickUserLogOut = () =>{
    Cookies.remove("accessToken");
    navigate("/");
  }



  const onClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setShowDrawer(!showDrawer);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={onClickMenu}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              LoRa Square
            </Typography>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
                <Typography variant="h5" >{profile.name}</Typography>
              </IconButton>
            </div>
            <Button onClick={onClickUserLogOut} >Log Out
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer showDrawer={showDrawer} setShowDrawer={setShowDrawer} onToggle={onClickMenu} />
    </>
  );
}
