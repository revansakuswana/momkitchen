import { Container, Typography, Divider } from "@mui/material";

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: "text.secondary" }}>
      {"© Copyright"} {new Date().getFullYear()}, All Rights Reserved by Mom
      Kitchen
    </Typography>
  );
}

export default function Footer() {
  return (
    <>
      <Divider />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 2, sm: 4 },
          py: { xs: 4, sm: 4 },
          textAlign: { sm: "center", md: "left" },
        }}>
        <Copyright />
      </Container>
    </>
  );
}
