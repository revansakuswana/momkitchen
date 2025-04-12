import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  CssBaseline,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  tableCellClasses,
  Button,
} from "@mui/material";

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

export default function MyOrder() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/my-order`,
        { withCredentials: true }
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/order-item/${itemId}`,
        { withCredentials: true }
      );
      fetchOrders(); // Refresh list
    } catch (error) {
      console.error("Error deleting order item:", error);
    }
  };

  const getTotalPrice = (orders) =>
    orders.reduce(
      (total, order) =>
        total +
        order.items.reduce(
          (subtotal, item) => subtotal + item.quantity * item.food.price,
          0
        ),
      0
    );

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
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Your Order
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell><b>Menu</b></StyledTableCell>
                  <StyledTableCell align="right"><b>Quantity</b></StyledTableCell>
                  <StyledTableCell align="right"><b>Price</b></StyledTableCell>
                  <StyledTableCell align="right"><b>Total</b></StyledTableCell>
                  <StyledTableCell align="center"><b>Action</b></StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) =>
                    order.items.map((item) => (
                      <StyledTableRow key={item.id}>
                        <StyledTableCell>{item.food.name}</StyledTableCell>
                        <StyledTableCell align="right">
                          {item.quantity}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          Rp {item.food.price.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          Rp {(item.quantity * item.food.price).toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDeleteItem(item.id)}>
                            Delete
                          </Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )
                ) : (
                  <StyledTableRow>
                    <TableCell colSpan={5} align="center">
                      No orders found
                    </TableCell>
                  </StyledTableRow>
                )}
                <StyledTableRow>
                  <TableCell colSpan={3} align="right">
                    <b>Total Price</b>
                  </TableCell>
                  <TableCell align="right">
                    <b>Rp {getTotalPrice(orders).toLocaleString()}</b>
                  </TableCell>
                  <TableCell />
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </>
  );
}