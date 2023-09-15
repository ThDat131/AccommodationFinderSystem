import jwt from "jsonwebtoken";
import { createError } from "../../utils/error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next(createError(401, "You are not authenticated!"));

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return next(createError(403, "Invalid token"));
    }

    req.user = user;
    next();
  });
};
