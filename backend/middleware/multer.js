import { fileURLToPath } from "url";
import path, { dirname } from "path";
import multer from "multer";

// Mendapatkan __dirname di ES6
const __filename = fileURLToPath(import.meta.url); // Mendapatkan nama file saat ini
const __dirname = dirname(__filename); // Mendapatkan direktori dari file saat ini

// Konfigurasi multer untuk penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images")); // Direktori penyimpanan gambar
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Filter tipe file yang dapat diunggah
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .png, .jpg formats allowed!"), false);
  }
};

// Membuat middleware upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: fileFilter,
});

export default upload;
