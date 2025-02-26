import { useState } from "react";
import axios from "axios";
import {
  Container,
  CssBaseline,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { PhotoIcon } from "@heroicons/react/24/outline";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function AddFood() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");

  const [foodData, setFoodData] = useState({
    name: "",
    price: "",
    image: null,
    imagePreview: "",
  });

  const handleChange = (e) => {
    setFoodData({ ...foodData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoodData({
        ...foodData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", foodData.name);
    formData.append("price", foodData.price);
    if (foodData.image) {
      formData.append("image", foodData.image); // Pastikan key "image" sesuai backend
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/add-food`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setAlertSeverity("success");
        setAlertMessage(response.data.message);
        setAlertOpen(true);
        setFoodData({ name: "", price: "", image: null, imagePreview: "" });
      }
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message);
      setAlertOpen(true);
    }
  };

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
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Add New Food
          </Typography>
          <Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <TextField
                fullWidth
                label="Food Name"
                name="name"
                value={foodData.name}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={foodData.price}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 3,
                mt: 2,
              }}>
              {/* Preview Gambar */}
              {foodData.imagePreview && (
                <Box
                  sx={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: 2,
                  }}>
                  <img
                    src={foodData.imagePreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}

              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<PhotoIcon className="h-5 w-5 mr-2" />}>
                Upload Image
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleSubmit}>
                Add Food
              </Button>
            </Box>
          </Box>
        </Box>

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
