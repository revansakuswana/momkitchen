import {
  Container,
  CssBaseline,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
  styled,
  Stack,
  Link,
  FormLabel,
  Box,
  FormControl,
  Card as MuiCard,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
}));

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.redirect || "/home";

  const handleSignin = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users-signin`,
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setAlertSeverity("success");
        setAlertMessage(response.data.message);
        setAlertOpen(true);
        setTimeout(() => {
          navigate(from, { replace: true, state: {} });
        }, 1500);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message;
      setAlertSeverity("error");
      setAlertMessage(errorMsg);
      setAlertOpen(true);
      setTimeout(() => {
        setAlertOpen(false);
      }, 2000);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (e.target.value && /\S+@\S+\.\S+/.test(e.target.value)) {
      setEmailError(false);
      setEmailErrorMessage("");
    } else {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length >= 6) {
      setPasswordError(false);
      setPasswordErrorMessage("");
    } else {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
    }
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
        <Stack sx={{ justifyContent: "center", height: "90dvh", p: 2 }}>
          <Card variant="outlined">
            <Typography variant="h2">Signin</Typography>

            <Box
              component="form"
              onSubmit={handleSignin}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  error={emailError}
                  helperText={emailErrorMessage}
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
              <FormControl>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                </Box>
                <TextField
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••"
                  autoComplete="current-password"
                  required
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
              <Button type="submit" fullWidth variant="contained">
                Signin
              </Button>
              <Typography sx={{ textAlign: "center" }}>
                Don&apos;t have an account?{" "}
                <Link href="/users-signup" variant="body2">
                  Signup
                </Link>
              </Typography>
            </Box>
            {/* <Divider>or</Divider>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => alert("Sign in with Google")}
                  startIcon={<GoogleIcon />}>
                  Sign in with Google
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
