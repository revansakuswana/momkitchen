import express from "express";
import router from "./routes/routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// Middleware CORS
app.use(
  cors({
    credentials: true,
    origin: process.env.APP_BASE_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

// Middleware untuk parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk parsing cookies
app.use(cookieParser());

// Konfigurasi path untuk file statis (images)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  "/public/images/",
  express.static(path.join(__dirname, "public/images/"))
);

// Gunakan Router
app.use("/api", router);

// Jalankan server
const PORT = process.env.APP_PORT || 3001;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
