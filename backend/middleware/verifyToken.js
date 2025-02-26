import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({ message: "Silahkan login untuk mengakses" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "Invalid token" });
  }
};
