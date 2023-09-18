import { createError } from "../../utils/error.js";
import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UsersController = {
  signup: async (req, res, next) => {
    try {
      const { fullName, email, phone, password } = req.body;

      // Kiểm tra email
      const existingUserWithEmail = await UserModel.findOne({ email });
      if (existingUserWithEmail) {
        return next(createError(400, "Email is already in use."));
      }

      // Kiểm tra số điện thoại
      const existingUserWithPhone = await UserModel.findOne({ phone });
      if (existingUserWithPhone) {
        return next(createError(400, "Phone number is already in use."));
      }

      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);

      const default_avatar = "https://phongtro123.com/images/default-user.png";
      const user = await UserModel.create({
        fullName,
        email,
        phone,
        password: hash,
        role: "ROLE_USER",
        active: 1,
        avatar: default_avatar,
        landlordId: null,
      });

      const { password: demo, ...data } = user._doc;
      return res.status(201).json(data);
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
        return next(createError(400, "Worng password or email"));
      }

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.SECRET_KEY
      );

      // const { password: mk, role, ...data } = user._doc;
      res
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

      const user = await UserModel.findById(userId);

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

  getAllUser: async (req, res, next) => {
    try {
      const users = await UserModel.find();

      if (!users) {
        return next(createError(404, "Users not found!"));
      }

      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      await UserModel.updateOne({ _id: req.params.id }, req.body);
      return res.status(200).json("User has update");
    } catch (error) {
      return next(error);
    }
  },
};
export default UsersController;
