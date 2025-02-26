export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Akses ditolak. Hanya admin yang dapat menambah menu.",
    });
  }
};
