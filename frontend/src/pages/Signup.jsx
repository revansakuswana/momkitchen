import * as React from "react";
import {
  CssBaseline,
  Container,
  Button,
  Typography,
  Alert,
  Snackbar,
  styled,
  Stack,
  Link,
  Box,
  FormControl,
  FormLabel,
  TextField,
  Card as MuiCard,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
}));

export default function SignUp() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users-signup`,
        {
          name,
          email,
          password,
          confPassword,
        }
      );

      if (response.status === 201) {
        setAlertSeverity("success");
        setAlertMessage(response.data.message);
        setAlertOpen(true);
        setTimeout(() => navigate("/users-signin"), 1000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message;
      setAlertSeverity("error");
      setAlertMessage(errorMsg);
      setAlertOpen(true);
      setTimeout(() => {
        setAlertOpen(false);
      }, 1500);
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (name.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    return isValid;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!/\S+@\S+\.\S+/.test(e.target.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (e.target.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <>
      <CssBaseline />
      <Container
        maxWidth="lg"
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          my: 10,
          gap: 4,
          justifyContent: "space-between",
        }}>
        <Stack
          sx={{
            justifyContent: "center",
            height: "90dvh",
            p: 2,
          }}>
          <Card variant="outlined">
            <Typography variant="h2">Signup</Typography>

            <Box
              component="form"
              onSubmit={handleSignup}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl>
                <FormLabel htmlFor="name">Full name</FormLabel>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  placeholder="type your name"
                  value={name}
                  onChange={handleNameChange}
                  error={nameError}
                  helperText={nameErrorMessage}
                  color={nameError ? "error" : "primary"}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  required
                  fullWidth
                  id="email"
                  placeholder="your@email.com"
                  name="email"
                  autoComplete="email"
                  variant="outlined"
                  value={email}
                  onChange={handleEmailChange}
                  error={emailError}
                  helperText={emailErrorMessage}
                  color={emailError ? "error" : "primary"}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  required
                  fullWidth
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  variant="outlined"
                  value={password}
                  onChange={handlePasswordChange}
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  color={passwordError ? "error" : "primary"}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="Confpassword">Confirm Password</FormLabel>
                <TextField
                  required
                  fullWidth
                  name="Confpassword"
                  placeholder="••••••"
                  type="password"
                  id="Confpassword"
                  variant="outlined"
                  value={confPassword}
                  onChange={(e) => setConfPassword(e.target.value)}
                  error={confPassword !== password}
                  helperText={
                    confPassword !== password ? "Passwords do not match." : ""
                  }
                  color={confPassword !== password ? "error" : "primary"}
                />
              </FormControl>
              <Button type="submit" fullWidth variant="contained">
                Signup
              </Button>
              <Typography sx={{ textAlign: "center" }}>
                Already have an account?{" "}
                <span>
                  <Link
                    href="/users-signin"
                    variant="body2"
                    sx={{ alignSelf: "center" }}>
                    Signin
                  </Link>
                </span>
              </Typography>
            </Box>
            {/* <Divider>
                <Typography sx={{ color: "text.secondary" }}>or</Typography>
              </Divider>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="outlined"
                  onClick={() => alert("Sign up with Google")}
                  startIcon={<GoogleIcon />}>
                  Sign up with Google
                </Button>
              </Box> */}
          </Card>
        </Stack>

        {/* ====== ALERT ====== */}
        <Snackbar
          open={alertOpen}
          autoHideDuration={2000}
          onClose={handleCloseAlert}>
          <Alert
            onClose={handleCloseAlert}
            severity={alertSeverity}
            sx={{ width: "100%" }}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
