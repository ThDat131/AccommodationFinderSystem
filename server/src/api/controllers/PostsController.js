import { createError } from "../../utils/error.js";
import PostModel from "../models/post.js";

const PostsController = {
  // [POST] /api/posts/create/ {name, content, price, images, acreage, longitude, latitude, address, userId, categoryId}
  create: async (req, res, next) => {
    try {
      const files = req.files;
      const paths = files?.map((file) => file.path);
      if (paths.length > 5) {
        res.status(400).send("Upload maximum 5 photos");
        return next(createError(400, "Upload maximum 5 photos"));
      }
      const {
        name,
        content,
        price,
        acreage,
        longitude,
        latitude,
        address,
        userId,
        categoryId,
      } = req.body;
      const post = await PostModel.create({
        name,
        content,
        price,
        images: paths,
        acreage,
        longitude,
        latitude,
        address,
        categoryId,
        active: 0,
        userId,
      });

      return res.status(200).json(post);
    } catch (error) {
      return next(error);
    }
  },

  // [GET] /api/posts/
  getAllPost: async (req, res, next) => {
    try {
      const posts = await PostModel.find();
      if (!posts) {
        return res.status(404).send("Posts not found");
      }
      return res.status(200).json(posts);
    } catch (error) {
      return next(error);
    }
  },

  // [GET] /api/posts/:id
  getPost: async (req, res, next) => {
    try {
      const post = await PostModel.findById({ _id: req.params.id });
      if (!post) {
        return res.status(404).send("Post not found!!!");
      }
      return res.status(200).json(post);
    } catch (error) {
      return next(error);
    }
  },

  // [GET] /api/posts/manage/:id
  getAllPostByUserId: async (req, res, next) => {
    try {
      const posts = await PostModel.find({ userId: req.params.id, categoryId: req.query?.categoryId });
      if (posts.length === 0) {
        return res.status(404).send("Posts not found");
      }
      return res.status(200).json(posts);
    } catch (error) {
      return next(error);
    }
  },

  // [DELETE] /api/posts/:id
  delete: async (req, res, next) => {
    try {
      const post = await PostModel.delete({ _id: req.params.id });
      
      if (post.modifiedCount === 0) {
        return res.status(400).send("Something wrong!!!");
      }

      return res.status(200).send("Post has delete");
    } catch (error) {
      return next(error);
    }
  }
};

export default PostsController;
