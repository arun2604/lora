import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import { Provider } from "react-redux";
import store from "./Redux/Store";
import Dashboard from "./pages/Dashboard/Dashboard";
import Device from "./pages/Device/DeviceList";
import Groups from "./pages/Groups/Groups";
import Navbar from "./components/Navbar/Navbar";
import Cookies from "js-cookie";
import { JSX } from "react/jsx-runtime";
import GroupFromModal from "./pages/Groups/GroupFrom";
import GroupDetails from "./pages/Groups/GroupDetails";
import theme from "./theme/theme";
import { ThemeProvider } from "@mui/material";
import DeviceFormModal from "./pages/Device/DeviceFormModal";

interface Props {
  children: JSX.Element | JSX.Element[];
}

function PrivateRoute({ children }: Props) {
  // Check for authentication here
  const isAuthenticated = Cookies.get("accessToken");
  return isAuthenticated ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <Navigate to="/" replace />
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" Component={Login} />
            {/* <Route element={<PrivateRoute />}> */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/device"
              element={
                <PrivateRoute>
                  <Device />
                </PrivateRoute>
              }
            />
            <Route
              path="/group"
              element={
                <PrivateRoute>
                  <Groups />
                </PrivateRoute>
              }
            />
            <Route
              path="/createdevice"
              element={
                <PrivateRoute>
                  <DeviceFormModal />
                </PrivateRoute>
              }
            />
            <Route
              path="/addGroup"
              element={
                <PrivateRoute>
                  <GroupFromModal />
                </PrivateRoute>
              }
            />
            <Route
              path="/groupDetails"
              element={
                <PrivateRoute>
                  <GroupDetails />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
