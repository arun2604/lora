import Button from "@mui/material/Button";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, IconButton } from "@mui/material";

interface Props {
  text: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  onConfirm: (id: number) => Promise<void>;
  id: number;
}

export default function DeleteModel({ text, showModal, setShowModal, onConfirm: onDelete, id }: Props) {

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    // <Box>
    //   <Modal
    //     open={showModal}
    //     onClose={handleClose}
    //     aria-labelledby="modal-modal-title"
    //     aria-describedby="modal-modal-description"
    //   >
    //     <Box>
    //       <Box sx={style}>
    //         <Box>
    //           <Typography>
    //             {text}
    //           </Typography>
    //           <Box>
    //             <IconButton>
    //             <Button onClick={() => onDelete(id)}>Yes</Button>
    //             <Button sx = {{ textAlign : "center" ,ml :'1rem'}} onClick={handleClose}>No</Button>
    //             </IconButton>
    //           </Box>
    //         </Box>
    //       </Box>
    //     </Box>
    //   </Modal>
    // </Box>
    <Dialog
      sx={{ minWidth: '400px' }}
      open={showModal}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure want to delete ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button size="small" onClick={handleClose}>Close</Button>
        <Button size="small" onClick={() => onDelete(id)} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
