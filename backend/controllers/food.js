import { food } from "../models/index.js";
import upload from "../middleware/multer.js";

export const addFood = async (req, res) => {
  try {
    // Proses upload gambar
    await new Promise((resolve, reject) => {
      upload.single("image")(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    const { name, price } = req.body;

    if (!name || !price) {
      return res
        .status(400)
        .json({ message: "Nama dan harga makanan harus diisi" });
    }

    // Simpan data makanan ke database
    const newFood = await food.create({
      name,
      price,
      imageUrl: req.file ? req.file.filename : null,
    });

    res.status(201).json({
      message: "Makanan berhasil ditambahkan",
      data: newFood,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Ambil semua makanan
export const getAllFood = async (req, res) => {
  try {
    const foods = await food.findAll();
    res.status(200).json({ data: foods });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Perbarui makanan (Hanya Admin)
export const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl } = req.body;

    const food = await food.findByPk(id);
    if (!food) {
      return res.status(404).json({ message: "Makanan tidak ditemukan" });
    }

    await food.update({ name, description, price, imageUrl });
    res
      .status(200)
      .json({ message: "Makanan berhasil diperbarui", data: food });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Hapus makanan (Hanya Admin)
export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await food.findByPk(id);

    if (!food) {
      return res.status(404).json({ message: "Makanan tidak ditemukan" });
    }

    await food.destroy();
    res.status(200).json({ message: "Makanan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
