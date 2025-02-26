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

export default function ListOrder() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/list-order`,
          { withCredentials: true }
        );
        setOrders(response.data.orders);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, []);

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
        }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            List Order
          </Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>
                  <b>Order ID</b>
                </StyledTableCell>
                <StyledTableCell>
                  <b>User</b>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <b>Menu</b>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <b>Quantity</b>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <b>Price</b>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <b>Total</b>
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) =>
                  order.order_items.map((item) => (
                    <StyledTableRow key={item.id}>
                      <StyledTableCell>{order.id}</StyledTableCell>
                      <StyledTableCell>
                        {order.user.name} ({order.user.email})
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {item.food.name}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {item.quantity}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        Rp {item.food.price.toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        Rp {(item.quantity * item.food.price).toLocaleString()}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )
              ) : (
                <StyledTableRow>
                  <TableCell colSpan={6} align="center">
                    No orders found
                  </TableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
