import { createError } from "../../utils/error.js";
import { transporter } from "../../utils/mail.js";
import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";
import { response } from "express";
import jwt from "jsonwebtoken";
import cache from "memory-cache";
import passport from "passport";
import request from "request";
import user from "../models/user.js";

const AuthsController = {
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
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

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

  signinWithFacebook: async (req, res, next) => {
    const { access_token } = req.body;
    await request.get(
      `https://graph.facebook.com/me?access_token=${access_token}`,
      async (error, response, body) => {
        if (!error && response.statusCode === 200) {
          request.get(
            `https://graph.facebook.com/${
              JSON.parse(body).id
            }?fields=email, name, picture&access_token=${access_token}`,
            async (error, response, body) => {
              if (!error && response.statusCode === 200) {
                const data = await JSON.parse(body);
                const user = await UserModel.findOne({
                  email: data.email,
                });
                console.log(data)
                if (!user) {
                  const createUserByFB = await UserModel.create({
                    fullName: data.name,
                    email: data.email,
                    role: "ROLE_USER",
                    active: 0,
                    phone: null,
                    landlordId: null,
                    avatar: data.picture.data.url,
                    password: null,
                  });
                  const token = jwt.sign(
                    { id: createUserByFB._id, role: createUserByFB.role },
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
                } else {
                  const token = jwt.sign(
                    { id: user._id, role: user.role },
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
                }
              } else {
                res.status(400).send("Bad request");
              }
            }
          );
        } else {
          res.status(400).send("Something wrong");
        }
      }
    );
    // const user = await UserModel.find({email: '2051052029duc@ou.edu.vn'})
    // res.status(200).json(user)
  },

  // authenticateFacebook: passport.authenticate("facebook", {
  //   scope: ["public_profile", "email"],
  // }),

  // callbackFacebook: async (req, res, next) => {
  //   passport.authenticate("facebook", (err, user) => {
  //     if (err) {
  //       return next(err);
  //     }
  //     if (!user) {
  //       return res.redirect("/signin");
  //     }
  //     req.logIn(user, (err) => {
  //       if (err) {
  //         return next(err);
  //       }
  //       return res.redirect("/");
  //     });
  //   });
  // },
  // logout: async (req, res, next) => {
  //   req.logout();
  //   res.redirect("/signin");
  // },
};
export default AuthsController;
