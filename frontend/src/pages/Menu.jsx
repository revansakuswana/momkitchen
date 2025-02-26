import { Container, CssBaseline, Box, Typography } from "@mui/material";
import FoodCard from "@components/FoodCard.jsx";

export default function Menu() {
  return (
    <>
      <CssBaseline enableColorScheme />
      <Container
        maxWidth="lg"
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          my: 16,
          gap: 4,
          justifyContent: "space-between",
        }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 2,
          }}>
          <Box
            sx={{
              width: "100%",
              height: "300px",
              backgroundImage:
                "url('https://img.freepik.com/free-photo/hot-spicy-stew-eggplant-sweet-pepper-tomato-zucchini-mushrooms-flat-lay-top-view_2829-19673.jpg?t=st=1740151159~exp=1740154759~hmac=415a63fb4a3982eadaf5d0494959aacb0740923fd52738f2bccdd0f5229003de&w=1800')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 3,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mt: 2,
            }}>
            Mom Kitchen Menu
          </Typography>
          <FoodCard />
        </Box>
      </Container>
    </>
  );
}
