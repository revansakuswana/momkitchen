import express from "express";
import {
  addFood,
  getAllFood,
  updateFood,
  deleteFood,
} from "../controllers/food.js";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  deleteOrder,
} from "../controllers/order.js";
import {
  Signup,
  Signin,
  logout,
  getProfile,
  getSession,
} from "../controllers/auth.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/users-signup", Signup);
router.post("/users-signin", Signin);
router.delete("/users-logout", logout);
router.get("/profile", verifyToken, getProfile);
router.get("/session", verifyToken, getSession);

router.post("/add-order", verifyToken, createOrder); // User membuat pesanan
router.get("/list-order", verifyToken, isAdmin, getAllOrders); // Admin melihat semua pesanan
router.get("/my-order", verifyToken, getUserOrders); // User melihat pesanan mereka sendiri
router.get("/detail-order/:id", verifyToken, getOrderById); // Admin atau pemilik pesanan melihat detail pesanan
router.delete("/delete-order/:id", verifyToken, isAdmin, deleteOrder); // Admin menghapus pesanan
router.get("/menu", getAllFood); // Semua user bisa melihat daftar makanan
router.post("/add-food", verifyToken, isAdmin, addFood); // Hanya admin bisa menambah makanan
router.put("/updated-food/:id", verifyToken, isAdmin, updateFood); // Hanya admin bisa mengedit makanan
router.delete("/delete-food/:id", verifyToken, isAdmin, deleteFood); // Hanya admin bisa menghapus makanan

export default router;
