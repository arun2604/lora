import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "./Loader.css";

interface loaderProps {
  open: boolean;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  outline: "none",
};

const Loader = ({ open }: loaderProps) => {
  return (
    <Modal open={open}>
      <Box sx={style}>
        <div className="loader">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="loader-text">
          <span>In Progress...</span>
        </div>
      </Box>
    </Modal>
  );
};

export default Loader;
