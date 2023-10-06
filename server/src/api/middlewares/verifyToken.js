import jwt from "jsonwebtoken";
import { createError } from "../../utils/error.js";

export const verifyToken = (req, res, next) => {
  const token = req.header("authorization");

  if (!token) return res.status(401).send("You are not authenticated!");

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json(err);
    }
    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.role === "ROLE_USER") {
      next();
    } else {
      return res.status(401).send("Unauthorized");
    }
  });
};

export const verifyLandlord = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "ROLE_LANDLORD") {
      next();
    } else {
      return res.status(401).send("Unauthorized");
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "ROLE_ADMIN" || req.user.role === "ROLE_SUPERADMIN") {
      next();
    } else {
      return res.status(401).send("Unauthorized");
    }
  });
};

export const verifySuperAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "ROLE_SUPERADMIN") {
      next();
    } else {
      return res.status(401).send("Unauthorized");
    }
  });
};

// export const verifyPost = (req, res, next) => {
//   verifyToken(req, res, () => {
//     if (req.user.role === "ROLE_USER" || req.user.role === "ROLE_LANDLORD") {
//       next();
//     } else {
//       return res.status(401).send("Unauthorized");
//     }
//   });
// };
