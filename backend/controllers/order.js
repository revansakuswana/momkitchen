import { order, orderItem, food, users } from "../models/index.js";

// Membuat pesanan baru
export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const { userId } = req.user;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Pesanan tidak boleh kosong" });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const foodItem = await food.findByPk(item.foodId);
      if (!foodItem) {
        return res.status(404).json({ message: "Makanan tidak ditemukan" });
      }

      totalPrice += foodItem.price * item.quantity;
      orderItems.push({
        foodId: item.foodId,
        quantity: item.quantity,
        price: foodItem.price,
      });
    }

    const newOrder = await order.create({ userId, totalPrice });

    await Promise.all(
      orderItems.map(async (item) => {
        await orderItem.create({ orderId: newOrder.id, ...item });
      })
    );

    res
      .status(201)
      .json({ message: "Pesanan berhasil dibuat", order: newOrder });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan saat membuat pesanan.",
      error: error.message,
    });
  }
};

// Mendapatkan semua pesanan (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await order.findAll({
      include: [
        { model: users, attributes: ["id", "name", "email"] },
        {
          model: orderItem,
          include: [{ model: food, attributes: ["id", "name", "price"] }],
        },
      ],
    });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil pesanan.",
      error: error.message,
    });
  }
};

// Mendapatkan pesanan berdasarkan ID (hanya pemilik atau admin)
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await order.findByPk(id, {
      include: [
        { model: users, attributes: ["id", "name", "email"] },
        {
          model: orderItem,
          include: [{ model: food, attributes: ["id", "name", "price"] }],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan." });
    }

    // Hanya pemilik pesanan atau admin yang bisa melihat
    if (req.user.role !== "admin" && req.user.id !== order.userId) {
      return res.status(403).json({ message: "Akses ditolak." });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil pesanan.",
      error: error.message,
    });
  }
};

// Mendapatkan pesanan pengguna yang sedang login
export const getUserOrders = async (req, res) => {
  const userId = req.user.userId;

  try {
    const orders = await order.findAll({
      where: { userId },
      include: [
        {
          model: orderItem,
          as: "items",
          include: [{ model: food, attributes: ["id", "name", "price"] }],
        },
      ],
    });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil pesanan",
      error: error.message,
    });
  }
};

// Menghapus pesanan (Admin)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan." });
    }

    await order.destroy();
    res.status(200).json({ message: "Pesanan berhasil dihapus." });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan saat menghapus pesanan.",
      error: error.message,
    });
  }
};
