import { useEffect, useState } from "react";
import "./Login.css";
import { Form, Formik } from "formik";
import { LoginModel } from "../../models/LoginModel";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../Redux/Store";
import { validateLogin } from "../../Redux/Thunks/LoginThunk";
import { Box, Button, Grid, Snackbar, TextField } from "@mui/material";
import * as yup from "yup";
import Cookies from "js-cookie";
import { getProfileDetails } from "../../Redux/Thunks/ProfileThunk";

const loginSchema = yup.object().shape({
  email: yup.string().trim().required("* Email is required").email("Enter a valid Email"),
  password: yup.string().required("* Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  let initialLoginValues: LoginModel = {
    email: "",
    password: "",
  };

  const validateAcessToken = async () => {
    const token = Cookies.get("accessToken");
    if (token) {
      await dispatch(getProfileDetails()).then((res) => {
        if (res.payload.status) {
          navigate("/dashboard", { replace: true });
        }
      });
    }
  };

  useEffect(() => {
    validateAcessToken();
  }, []);

  return (
    <div className="container">
      <Grid container>
        <Grid item xs={1} md={4}></Grid>
        <Grid item xs={10} md={4}>
          <Formik
            initialValues={initialLoginValues}
            validationSchema={loginSchema}
            onSubmit={async (values) => {
              let result = await dispatch(validateLogin(values));
              if (result.payload.status) {
                navigate("/dashboard");
              } else {
                setShowSnackBar(true);
                setSnackBarMessage(result.payload.message);
              }
            }}
            enableReinitialize
          >
            {({ handleChange, handleBlur, values, errors, touched }) => (
              <Form className="form-container">
                <Box className="form-input">
                  <TextField
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.email && errors.email ? errors.email : ""}
                    fullWidth
                  />
                </Box>
                <Box className="form-input">
                  <TextField
                    label="Password"
                    variant="outlined"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.password && errors.password ? errors.password : ""}
                    type="password"
                    fullWidth
                  />
                </Box>
                <Box className="button-container">
                  <Button type="submit" variant="contained">
                    Login
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Grid>
        <Grid item xs={1} md={4}></Grid>
      </Grid>
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
    </div>
  );
};

export default Login;
