import { food } from "../models/index.js";
import upload from "../middleware/multer.js";
import fs from "fs";
import path from "path";

export const addFood = async (req, res) => {
  try {
    // Proses upload gambar
    await new Promise((resolve, reject) => {
      upload.single("image")(req, res, (err) => {
        if (err) return reject(err instanceof Error ? err : new Error(err));
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
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
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
    // Proses upload gambar
    await new Promise((resolve, reject) => {
      upload.single("image")(req, res, (err) => {
        if (err) return reject(err instanceof Error ? err : new Error(err));
        resolve();
      });
    });

    const { id } = req.params;
    const { name, price } = req.body;
    const image = req.file;

    const existingFood = await food.findByPk(id);
    if (!existingFood) {
      return res.status(404).json({ message: "Makanan tidak ditemukan" });
    }

    // Hapus gambar lama jika ada gambar baru
    if (image && existingFood.imageUrl) {
      const oldImagePath = path.join("public/images", existingFood.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update data
    const updatedData = {
      name: name || existingFood.name,
      price: price || existingFood.price,
      imageUrl: image ? image.filename : existingFood.imageUrl,
    };

    await existingFood.update(updatedData);

    res.status(200).json({
      message: "Makanan berhasil diperbarui",
      data: existingFood,
    });
  } catch (error) {
    console.error("Update error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// Hapus makanan (Hanya Admin)
export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const existingFood = await food.findByPk(id);

    if (!existingFood) {
      return res.status(404).json({ message: "Makanan tidak ditemukan" });
    }

    // Hapus gambar dari file system jika ada
    if (existingFood.imageUrl) {
      const imagePath = path.join("public/images", existingFood.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await existingFood.destroy(); // ✅ Ini yang benar
    res.status(200).json({ message: "Makanan berhasil dihapus" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};
