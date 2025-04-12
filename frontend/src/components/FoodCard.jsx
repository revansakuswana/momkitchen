import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default function FoodCard() {
  const [foods, setFoods] = useState([]);
  const [quantities, setQuantities] = useState({});

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/menu`
        );
        setFoods(response.data.data);

        // Inisialisasi quantity default ke 1 untuk setiap makanan
        const initialQuantities = {};
        response.data.data.forEach((food) => {
          initialQuantities[food.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };

    fetchFoods();
  }, []);

  const handleQuantityChange = (foodId, value) => {
    const newQuantities = { ...quantities };
    const intValue = parseInt(value);
    newQuantities[foodId] = isNaN(intValue) || intValue < 1 ? 1 : intValue;
    setQuantities(newQuantities);
  };

  const handleOrder = async (foodId) => {
    try {
      const orderData = {
        items: [{ foodId, quantity: quantities[foodId] || 1 }],
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/add-order`,
        orderData,
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        setAlertSeverity("success");
        setAlertMessage(response.data.message);
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || "Order failed");
      setAlertOpen(true);
    }
  };

  return (
    <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 justify-items-center">
      {foods.length > 0 ? (
        foods.map((food) => (
          <Card
            key={food.id}
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: 5,
            }}>
            <Box sx={{ position: "relative" }}>
              <CardMedia
                component="img"
                sx={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
                image={`${import.meta.env.VITE_BASE_URL}/public/images/${
                  food.imageUrl
                }`}
                alt={food.name}
              />
            </Box>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {food.name}
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="body">
                  Rp. {new Intl.NumberFormat("id-ID").format(food.price)}
                </Typography>
              </Box>

              {/* Input quantity */}
              <Box mt={1} mb={1}>
                <TextField
                  type="number"
                  size="small"
                  label="Qty"
                  value={quantities[food.id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(food.id, e.target.value)
                  }
                  inputProps={{ min: 1 }}
                  fullWidth
                />
              </Box>

              <Button
                fullWidth
                variant="contained"
                startIcon={<ShoppingCartIcon width={18} />}
                onClick={() => handleOrder(food.id)}>
                Order
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}

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
    </Box>
  );
}