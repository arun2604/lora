import { Dispatch, ReactEventHandler, SetStateAction, useEffect, useState } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import CastIcon from "@mui/icons-material/Cast";
import GridViewIcon from "@mui/icons-material/GridView";
import GroupWorkOutlinedIcon from "@mui/icons-material/GroupWorkOutlined";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Typography } from "@mui/material";
import "./Drawer.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../Redux/Store";

interface props {
  showDrawer: boolean;
  setShowDrawer: Dispatch<SetStateAction<boolean>>;
  onToggle: ReactEventHandler<{}>;
}

export default function Drawer({ showDrawer, onToggle, setShowDrawer }: props) {
  const [isActive, setIsActive] = useState("dashboard");

  const navigation = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    let pathname = location.pathname.slice(1);
    setIsActive(pathname);
  }, [location]);

  const navigate = (activetab: string) => {
    setIsActive(activetab);
    navigation(`/${activetab}`);
    setShowDrawer(false);
  };

  return (
    <div>
      <SwipeableDrawer
        anchor={"left"}
        open={showDrawer}
        onClose={onToggle}
        onOpen={onToggle}
        PaperProps={{
          sx: { width: "20%" },
        }}
      >
        <List className="item-list">
          <ListItem
            className={isActive === "dashboard" ? "active-item" : "inactive-item"}
            key="Dashboard"
            onClick={() => navigate("dashboard")}
          >
            <ListItemIcon className={isActive === "dashboard" ? "active-item" : "inactive-item"}>
              <GridViewIcon />
            </ListItemIcon>
            <ListItemText className="list-item">
              <Typography className={isActive === "dashboard" ? "active-item" : "inactive-item"}>Dashboard</Typography>
            </ListItemText>
          </ListItem>
          <ListItem
            className={isActive === "device" ? "active-item" : "inactive-item"}
            key="Device"
            onClick={() => navigate("device")}
          >
            <ListItemIcon className={isActive === "device" ? "active-item" : "inactive-item"}>
              <CastIcon />
            </ListItemIcon>
            <ListItemText className="list-item">
              <Typography className={isActive === "device" ? "active-item" : "inactive-item"}>Devices</Typography>
            </ListItemText>
          </ListItem>
          <ListItem
            className={isActive === "group" ? "active-item" : "inactive-item"}
            key="Group"
            onClick={() => navigate("group")}
          >
            <ListItemIcon className={isActive === "group" ? "active-item" : "inactive-item"}>
              <GroupWorkOutlinedIcon />
            </ListItemIcon>
            <ListItemText className="list-item">
              <Typography className={isActive === "group" ? "active-item" : "inactive-item"}>Groups</Typography>
            </ListItemText>
          </ListItem>
        </List>
      </SwipeableDrawer>
    </div>
  );
}
