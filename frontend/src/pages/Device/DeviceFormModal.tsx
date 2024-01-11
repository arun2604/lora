import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../Redux/Store";
import { useEffect, useState } from "react";
import { createDevice, getByIdDeviceDetails, getDeviceDetails, updateDevice } from "../../Redux/Thunks/DeviceThunks";
import { DeviceListModel, DeviceModel } from "../../models/DeviceModel";
import { Field, Formik, Form } from "formik";
import { Grid, Snackbar, TextField } from "@mui/material";
import "./Device.css";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

const createSchema = yup.object({
  name: yup.string().required("DeviceName is required"),
  APIKey: yup.string().required("API Key is required"),
});

interface Props {
  openModel: boolean;
  handleClose: () => void;
  device: DeviceListModel;
  editId: number;
}

const DeviceFormModal = ({ openModel, handleClose, device, editId }: any) => {
  const dispatch = useAppDispatch();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  useEffect(() => {
    dispatch(getDeviceDetails());
  }, []);

  let initialCreateValues: DeviceModel = {
    id: editId ? editId : 0,
    name: editId > 0 ? device.name : "",
    APIKey: editId > 0 ? device.APIKey : "",
  };

  return (
    <Box>
      <Modal
        open={openModel}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <Box sx={style}>
            <Box className="device-head">
              <Typography className="device-list" variant="h4">
                {editId > 0 ? "Update Device" : "Create Device"}
              </Typography>
            </Box>
            <Formik
              initialValues={initialCreateValues}
              validationSchema={createSchema}
              onSubmit={async (values) => {
                if (editId > 0) {
                  let res = await dispatch(updateDevice(values));
                  if (res.payload.status && res.payload.data.deviceId > 0) {
                    let getDeviceResponse = await dispatch(getDeviceDetails());
                    if (getDeviceResponse.payload.status) {
                      setShowSnackBar(true);
                      setSnackBarMessage(res.payload.message);
                      handleClose();
                    } else {
                      setShowSnackBar(true);
                      setSnackBarMessage(res.payload.message);
                    }
                  }
                } else {
                  let res = await dispatch(createDevice(values));
                  if (res.payload.status && res.payload.data.deviceId > 0) {
                    setShowSnackBar(true);
                    setSnackBarMessage(res.payload.message);
                    let getDeviceResponse = await dispatch(getDeviceDetails());
                    if (getDeviceResponse.payload.status) {
                      handleClose();
                    } 
                  }
                  else {
                    console.log(res.payload.message);
                    setShowSnackBar(true);
                    setSnackBarMessage(res.payload.message);
                  }
                }
              }}
              enableReinitialize
            >
              {({ errors, touched }) => (
                <Form>
                  <Grid container spacing={5}>
                    <Grid item xs={12} md={12}>
                      <Field
                        as={TextField}
                        name="name"
                        label="Device Name"
                        variant="outlined"
                        error={errors.name && touched.name}
                        helperText={errors.name && touched.name && errors.name}
                        fullWidth
                      />
                      <Field
                        as={TextField}
                        name="APIKey"
                        label="APIKey"
                        variant="outlined"
                        error={errors.APIKey && touched.APIKey}
                        helperText={errors.APIKey && touched.APIKey && errors.APIKey}
                        fullWidth
                      />
                    </Grid>
                    <Grid className="center" item xs={12}>
                      <Button variant="contained" color="primary" type="submit">
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={showSnackBar}
        autoHideDuration={2000}
        onClose={() => setShowSnackBar(false)}
        message={snackBarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: {
            display: "block",
            textAlign: "center",
            color: "#fff",
          },
        }}
      />
    </Box>
  );
};
export default DeviceFormModal;
