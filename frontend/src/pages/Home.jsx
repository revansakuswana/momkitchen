import {
  Container,
  CssBaseline,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid2,
} from "@mui/material";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const featuredFoods = [
    {
      id: 1,
      name: "Nasi Goreng Spesial",
      price: 25000,
      image:
        "https://asset.kompas.com/crops/U6YxhTLF-vrjgM8PN3RYTHlIxfM=/84x60:882x592/1200x800/data/photo/2021/11/17/61949959e07d3.jpg",
    },
    {
      id: 2,
      name: "Mie Ayam Bakso",
      price: 20000,
      image:
        "https://anakjajan.com/wp-content/uploads/2019/04/dscf8342.jpg?w=1200",
    },
    {
      id: 3,
      name: "Ayam Bakar Madu",
      price: 30000,
      image:
        "https://kecipir.com/blog/wp-content/uploads/2022/06/resep-ayam-bakar-madu.jpg",
    },
    {
      id: 4,
      name: "Frech Fries",
      price: 15000,
      image:
        "https://kecipir.com/blog/wp-content/uploads/2022/06/resep-ayam-bakar-madu.jpg",
    },
    {
      id: 5,
      name: "Infused Water",
      price: 8000,
      image:
        "https://kecipir.com/blog/wp-content/uploads/2022/06/resep-ayam-bakar-madu.jpg",
    },
  ];

  return (
    <>
      <CssBaseline />
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
        {/* Hero Section */}
        <Box
          sx={{
            width: "100%",
            height: "300px",
            backgroundImage:
              "url('https://whatsnewindonesia.com/sites/default/files/articles/Best%20Modern%20Indonesian%20Restaurant%20CVR.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 3,
          }}>
          <Box sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h2" fontWeight="bold" color="white">
              Mom Kitchen 🍽️
            </Typography>
            <Typography variant="h5" sx={{ mt: 2 }} color="white">
              Masakan rumahan lezat dengan cita rasa khas
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href="/menu"
              sx={{ mt: 3, px: 2, py: 1, fontSize: 14 }}
              startIcon={<ShoppingCartIcon width={18} />}>
              Order Now
            </Button>
          </Box>
        </Box>

        {/* Highlight Menu */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold">
            Menu Andalan Kami 🍛
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: "gray" }}>
            Pilih makanan favorit Anda dari menu spesial kami
          </Typography>
        </Box>

        {/* Grid Menu */}
        <Grid2 container spacing={1.8} sx={{ mt: 4 }}>
          {featuredFoods.map((food) => (
            <Grid2 item xs={12} sm={6} md={4} key={food.id}>
              <Card sx={{ borderRadius: 3 }}>
                <CardMedia
                  component="img"
                  sx={{
                    width: "100%",
                    height: 150,
                    objectFit: "cover",
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  }}
                  image={food.image}
                  alt={food.image}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" fontWeight="bold">
                    {food.name}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    Rp. {new Intl.NumberFormat("id-ID").format(food.price)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </>
  );
}
