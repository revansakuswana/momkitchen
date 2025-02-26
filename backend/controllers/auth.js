import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import users from "../models/users.js";

export const Signup = async (req, res) => {
  try {
    const { name, email, password, confPassword } = req.body;
    // Validasi password
    if (password !== confPassword) {
      return res
        .status(400)
        .json({ message: "Password dan Confirm Password tidak sama" });
    }
    // Cek apakah email sudah terdaftar
    const existingUser = await users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Simpan user baru
    const newUser = await users.create({
      name,
      email,
      password: hashedPassword,
      role: "users",
    });

    res.status(201).json({ message: "Register berhasil", users: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const Signin = async (req, res) => {
  try {
    const user = await users.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Email tidak ditemukan, periksa alamat email Anda!",
      });
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ message: "Kata sandi salah, silakan coba lagi!" });
    }

    const userId = user.id;
    const name = user.name;
    const email = user.email;
    const role = user.role;

    const accessToken = jwt.sign(
      { userId, name, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    const refreshToken = jwt.sign(
      { userId, name, email, role },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: `Selamat datang kembali ${name}!`,
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  res.clearCookie("refreshToken");
  res.clearCookie("jwt");

  if (!refreshToken) return res.sendStatus(204);
  const user = await users.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user) return res.sendStatus(204);
  const userId = user.id;
  await users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );

  return res.sendStatus(200);
};

export const getProfile = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await users.findOne({
      where: { id: userId },
      attributes: ["id", "name", "email", "role", "created_at", "updated_at"],
    });

    if (!user) {
      return res.status(404).json;
    }
    // Pengecekan role
    if (user.role !== "users" && user.role !== "admin") {
      return res.status(403).json({
        message: `Akses ditolak, Role tidak valid`,
      });
    }

    res.status(200).json({
      message: `Profil berhasil dimuat`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

export const getSession = async (req, res) => {
  const token = req.cookies.jwt;
  // Verifikasi token JWT
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ isLoggedIn: false, role: null });
    }
    // Jika berhasil, kirimkan informasi login dan role
    return res.status(200).json({
      isLoggedIn: true,
      users: decoded,
      role: decoded.role,
    });
  });
};
