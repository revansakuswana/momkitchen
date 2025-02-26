import * as React from "react";
import {
  Typography,
  alpha,
  styled,
  Box,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Container,
  Divider,
  MenuItem,
  Drawer,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import AvatarIcon from "@components/Avatar.jsx";
import axios from "axios";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  padding: "8px 12px",
}));

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const getSessionLogin = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/session`,
        {
          withCredentials: true,
        }
      );
      setIsLoggedIn(response.data.isLoggedIn);
    } catch (error) {
      console.log(error);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/users-logout`, {
        withCredentials: true,
      });
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        getSessionLogin();
      }
    };

    getSessionLogin();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [location]);

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: 5,
      }}>
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 0,
            }}>
            <a href="/home">
              <img
                src="https://png.pngtree.com/png-clipart/20230628/original/pngtree-kitchen-logo-vector-png-image_9234692.png"
                alt="Logo"
                width={48}
              />
            </a>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 3,
              }}>
              <Typography
                component="a"
                href="/menu"
                variant="text"
                color="primary">
                Menu
              </Typography>
              <Typography
                component="a"
                href="/my-order"
                variant="text"
                color="primary">
                My Order
              </Typography>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 1,
                alignItems: "center",
              }}>
              {!isLoggedIn ? (
                <Button variant="contained" size="small" href="/users-signin">
                  Sign in
                </Button>
              ) : (
                <AvatarIcon handleLogout={handleLogout} />
              )}
            </Box>
          </Box>

          <Box sx={{ display: { sm: "flex", md: "none" } }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <Bars3Icon width={26} />
            </IconButton>
            <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "right",
                  }}>
                  <IconButton onClick={toggleDrawer(false)}>
                    <XMarkIcon width={28} />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: {
                      xs: "flex",
                      md: "flex",
                      flexDirection: "column",
                    },
                    alignItems: "left",
                    gap: 2,
                  }}>
                  <Typography
                    component="a"
                    href="/menu"
                    variant="text"
                    color="primary">
                    Menu
                  </Typography>
                  <Typography
                    component="a"
                    href="/my-order"
                    variant="text"
                    color="primary">
                    My Order
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    marginY: 2,
                  }}
                />
                <MenuItem sx={{ padding: 0 }}>
                  {!isLoggedIn ? (
                    <Button
                      variant="contained"
                      size="small"
                      href="/users-signin">
                      Sign in
                    </Button>
                  ) : (
                    <AvatarIcon handleLogout={handleLogout} />
                  )}
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
