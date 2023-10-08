import CommentModel from "../models/comment.js";

const CommentsController = {
  //[POST] /api/comments/ => body {commentId, content, postId, userId}
  create: async (req, res, next) => {
    try {
      const { commentId, content, postId, userId } = req.body;
      const comment = await CommentModel.create({
        commentId,
        content,
        postId,
        userId,
      }); 
      await comment.populate("userId");
      return res.status(201).json(comment);
    } catch (error) {
      return next(error);
    }
  },

  //[GET] /api/comments/:postId => params postId
  getAll: async (req, res, next) => {
    try {
      const comments = await CommentModel.find({
        postId: req.params.postId,
      }).populate("commentId").populate("userId");
      if (comments.length === 0) {
        return res.status(404).json({ message: "Comment not found" });
      }
      return res.status(200).json(comments);
    } catch (error) {
      return next(error);
    }
  },
  edit: async (req, res, next) => {
    try {
    } catch (error) {
      return next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
    } catch (error) {
      return next(error);
    }
  },
};

export default CommentsController;
