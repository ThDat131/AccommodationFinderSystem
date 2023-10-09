import { createError } from "../../utils/error.js";
import { transporter } from "../../utils/mail.js";
import user from "../models/user.js";
import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cache from "memory-cache";

const UsersController = {
  confirmCode: async (req, res, next) => {
    const confirmationCode = Math.floor(100000 + Math.random() * 900000);
    const mailOptions = {
      from: "leminhduc6402@gmail.com",
      to: req.body.email,
      subject: "Xác nhận đăng ký",
      text: `Mã xác nhận của bạn là: ${confirmationCode}`,
    };
    await transporter.sendMail(mailOptions);
    cache.put(req.body.email, confirmationCode, 60000);
    return res.status(200).send("Gửi mail thành công");
  },

  signup: async (req, res, next) => {
    try {
      const { fullName, email, phone, password, confirmationCode } = req.body;
      const savedCode = cache.get(email);

      // Kiểm tra email
      const existingUserWithEmail = await UserModel.findOne({ email });
      if (existingUserWithEmail) {
        res
          .status(400)
          .json({ status: 400, email: "Email is already in use." });
        return next(createError(400, "Email is already in use."));
      }
      // Kiểm tra số điện thoại
      const existingUserWithPhone = await UserModel.findOne({ phone });
      if (existingUserWithPhone) {
        res
          .status(400)
          .json({ status: 400, phone: "Phone is already in use." });
        return next(createError(400, "Phone number is already in use."));
      }

      if (savedCode && savedCode.toString() === confirmationCode) {
        cache.del(email);
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);

        const default_avatar =
          "https://phongtro123.com/images/default-user.png";
        const user = await UserModel.create({
          fullName,
          email,
          phone,
          password: hash,
          role: "ROLE_USER",
          active: 0,
          avatar: default_avatar,
          landlordId: null,
        });
      
        const { password: demo, ...data } = user._doc;
        return res.status(201).json(data);
      }
      cache.del(email);
      return res.status(400).json({
        status: 400,
        confirmationCode: "Mã xác nhận không đúng",
        confirmationCode1: confirmationCode,
        saveCode: savedCode,
      });
    } catch (error) {
      return next(error);
    }
  },

  signin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        return next(createError(404, "User not found!"));
      }

      const isPassword = await bcrypt.compare(password, user.password);
      if (!isPassword) {
        return next(createError(400, "Wrong password or email"));
      }

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );

      return res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 3 * 60 * 60 * 1000,
        })
        .status(200)
        .send(token);
    } catch (error) {
      return next(error);
    }
  },

  getCurrentUser: async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      console.log(token);
      if (!token) {
        return next(createError(401, "Unauthorized"));
      }

      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      const userId = decodedToken.id;
      console.log(userId);

      const user = await UserModel.findById(userId).populate("landlordId");

      if (!user) {
        return next(createError(404, "User not found"));
      }

      res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  },

  getUser: async (req, res, next) => {
    try {
      const user = await UserModel.findById({ _id: req.params.id });

      if (!user) {
        return next(createError(404, "User not found!"));
      }

      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  },
  //[GET] /api/users/ => query phone
  getAllUser: async (req, res, next) => {
    try {
      const users = await UserModel.find({
        phone: { $regex: req.query?.phone || "", $options: "i" },
        role: { $in: ["ROLE_USER", "ROLE_LANDLORD"] },
      });
      if (!users) {
        return next(createError(404, "Users not found!"));
      }
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  },

  //[GET] /api/admin/users/ => query phone
  getAllAdmin: async (req, res, next) => {
    try {
      const users = await UserModel.find({
        phone: { $regex: req.query?.phone || "", $options: "i" },
        role: "ROLE_ADMIN",
      });
      if (!users) {
        return next(createError(404, "Users not found!"));
      }
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  },

  // [PUT] /users/:id/updateUser  {fullName, avatar, phone}
  updateUser: async (req, res, next) => {
    try {
      const default_avatar = "https://phongtro123.com/images/default-user.png";
      const file = req.file;
      const path = file?.path;
      const { fullName, avatar, phone, role, landlordId } = req.body;

      const user = await UserModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          fullName,
          avatar: path,
          role,
          phone,
          landlordId,
        },
        { new: true }
      );
      if (!user) return next(createError(404, "User not found"));
      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  },

  // [DELETE] /users/:id
  deleteUser: async (req, res, next) => {
    try {
      await UserModel.delete({ _id: req.params.id });

      return res.status(200).send("User has delete");
    } catch (error) {
      return next(error);
    }
  },

  // [GET] users/trash/list
  trashUsers: async (req, res, next) => {
    try {
      const users = await UserModel.findDeleted();
      if (!users) {
        return next(createError(404, "Users not found!"));
      }
      return res.status(200).json(users);
    } catch (error) {
      return next(error);
    }
  },

  // [PATCH] /users/:id/restore
  restoreUser: async (req, res, next) => {
    try {
      await UserModel.restore({ _id: req.params.id });

      return res.status(200).send("User has restore");
    } catch (error) {
      return next(error);
    }
  },

  // [DELETE] /users/:id/force
  destroyUser: async (req, res, next) => {
    try {
      await UserModel.deleteOne({ _id: req.params.id });

      return res.status(204).send("User has delete");
    } catch (error) {
      return next(error);
    }
  },

  createByAdmin: async (req, res, next) => {
    try {
      const { fullName, email, phone, password, role, active } = req.body;
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);
      const default_avatar = "https://phongtro123.com/images/default-user.png";
      const user = await UserModel.create({
        fullName,
        email,
        phone,
        password: hash,
        role: role || "ROLE_USER",
        active: active || 0,
        avatar: default_avatar,
        landlordId: null,
      });
      return res.status(201).json(user);
    } catch (error) {
      return next(error);
    }
  },
};
export default UsersController;
