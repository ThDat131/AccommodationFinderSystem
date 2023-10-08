import CommentModel from "../models/comment.js";

const CommentsController = {
  //[POST] /api/comments/ => body {commentId, content, postId, userId}
  create: async (req, res, next) => {
    try {
      const { content, postId, userId } = req.body;
      const comment = await CommentModel.create({
        content,
        active: 0,
        postId,
        userId,
      });
      await comment.populate("userId");
      return res.status(201).json(comment);
    } catch (error) {
      return next(error);
    }
  },

  //[PUT] /api/comments/:id => body { content, userId }
  reply: async (req, res, next) => {
    try {
      const commentId = req.params.id;
      const { content, userId } = req.body;
      if (commentId) {
        const reply = {
          commentId,
          content,
          userId,
        };
        const newComment = await CommentModel.findByIdAndUpdate(
          { _id: commentId },
          { $push: { replies: reply } },
          { new: true }
        )
          .populate({
            path: "userId",
            model: "User",
          })
          .populate({
            path: "replies.userId",
            model: "User",
          });
        return res.status(200).json(newComment);
      }
      return res.status(400).json({ message: "Something wrong!!!" });
    } catch (error) {
      return next(error);
    }
  },

  //[GET] /api/comments/:postId => params postId
  getAll: async (req, res, next) => {
    try {
      const comments = await CommentModel.find({
        postId: req.params.postId,
      }).populate("commentId");
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
