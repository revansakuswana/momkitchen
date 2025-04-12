import {
  CssBaseline,
  Box,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  styled,
  TableRow,
  TableCell,
  tableCellClasses,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#932020",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/menu`
      );
      setFoods(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data makanan:", error);
    }
  };

  const handleEditOpen = (food) => {
    setSelectedFood({ ...food });
    setImagePreview(
      `${import.meta.env.VITE_BASE_URL}/public/images/${food.imageUrl}`
    );
    setImageFile(null);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setSelectedFood(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleEditChange = (e) => {
    setSelectedFood({ ...selectedFood, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", selectedFood.name);
      formData.append("price", selectedFood.price);
      if (imageFile) {
        formData.append("image", imageFile); // key "image" sesuai multer
      }

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/update-food/${selectedFood.id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAlert({
        open: true,
        message: "Menu berhasil diupdate!",
        severity: "success",
      });

      fetchFoods();
      handleEditClose();
    } catch (error) {
      console.error(error);
      setAlert({
        open: true,
        message: "Gagal mengupdate menu",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/delete-food/${id}`,
        {
          withCredentials: true,
        }
      );
      setAlert({
        open: true,
        message: "Menu berhasil dihapus!",
        severity: "success",
      });
      fetchFoods();
    } catch (error) {
      console.error(error);
      setAlert({
        open: true,
        message: "Gagal menghapus menu",
        severity: "error",
      });
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
          justifyContent: "space-between",
        }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}>
          <Typography variant="h4" fontWeight="bold">
            List Menu
          </Typography>
          <Button variant="contained" onClick={() => navigate("/add-food")}>
            Add Food
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>No</StyledTableCell>
                <StyledTableCell>Image</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Price</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {foods.length > 0 ? (
                foods.map((food, index) => (
                  <StyledTableRow key={food.id}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}/public/images/${
                          food.imageUrl
                        }`}
                        alt={food.name}
                        width={60}
                        height={60}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                      />
                    </StyledTableCell>
                    <StyledTableCell>{food.name}</StyledTableCell>
                    <StyledTableCell>
                      Rp. {new Intl.NumberFormat("id-ID").format(food.price)}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          variant="outlined"
                          onClick={() => handleEditOpen(food)}>
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(food.id)}>
                          Delete
                        </Button>
                      </Box>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={5} align="center">
                    No food items found
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Modal */}
        <Dialog open={openEdit} onClose={handleEditClose}>
          <DialogTitle>Edit Menu</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              name="name"
              value={selectedFood?.name || ""}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={selectedFood?.price || ""}
              onChange={handleEditChange}
              fullWidth
            />
            <Button component="label" variant="contained">
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button variant="contained" onClick={handleEditSubmit}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Alert */}
        <Snackbar
          open={alert.open}
          autoHideDuration={3000}
          onClose={() => setAlert({ ...alert, open: false })}>
          <Alert
            onClose={() => setAlert({ ...alert, open: false })}
            severity={alert.severity}
            sx={{ width: "100%" }}>
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
