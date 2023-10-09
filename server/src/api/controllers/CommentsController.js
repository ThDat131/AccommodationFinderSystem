import CommentModel from "../models/comment.js";

const CommentsController = {
  //[POST] /api/comments/ => body {commentId, content, postId, userId}
  create: async (req, res, next) => {
    try {
      const { content, postId, userId } = req.body;
      const comment = await CommentModel.create({
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
          actice: 1,
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
      })
        .populate({
          path: "userId",
          model: "User",
        })
        .populate({ path: "replies.userId", model: "User" });
      if (comments.length === 0) {
        return res.status(404).json({ message: "Comment not found" });
      }
      return res.status(200).json(comments);
    } catch (error) {
      return next(error);
    }
  },

  //[PUT] /api/comments/:id => body { content, userId } truyền thêm userId để verify chứ k dùng nên dưới hàm edit không có userId
  edit: async (req, res, next) => {
    try {
      const { content } = req.body;
      const comment = await CommentModel.findByIdAndUpdate(
        { _id: req.params.id },
        { content },
        { new: true }
      )
        .populate({
          path: "userId",
          model: "User",
        })
        .populate({ path: "replies.userId", model: "User" });
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      return res.status(200).json(comment);
    } catch (error) {
      return next(error);
    }
  },
  //[PUT] /api/comments/:id/replies/:replyId  => body { contentReply, userId } truyền thêm userId để verify chứ k dùng nên dưới hàm editReply không có userId
  editReply: async (req, res, next) => {
    try {
      const commentId = req.params.id;
      const replyId = req.params.replyId;
      const { contentReply } = req.body;

      const comment = await CommentModel.findById({ _id: commentId }); // tìm bình luận
      if (!comment) {
        return res.status(404).json("Comment not found");
      }

      const reply = comment.replies.id(replyId); // tìm phản hồi của bình luận
      if (!reply) {
        return res.status(404).json("Reply not found");
      }

      reply.content = contentReply; // chỉnh sửa lại nội dụng của phản hồi
      await comment.save(); // lưu lại bình luận
      const newComment = await CommentModel.findById(commentId)
        .populate({
          path: "userId",
          model: "User",
        })
        .populate({ path: "replies.userId", model: "User" });
      return res.status(200).json(newComment);
    } catch (error) {
      return next(error);
    }
  },
  //[DELETE] /api/comments/:id => body {userId} userId này là của comment
  delete: async (req, res, next) => {
    try {
      const deleteComment = await CommentModel.delete({ _id: req.params.id });
      if (!deleteComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      return res.status(200).json({ message: "Comment has deleted" });
    } catch (error) {
      return next(error);
    }
  },

  //[DELETE] /api/comments/:id/replies/:replyId  => body { userId } userId này là của reply
  deleteReply: async (req, res, next) => {
    try {
      const commentId = req.params.id;
      const replyId = req.params.replyId;

      // tìm bình luận
      const comment = await CommentModel.findByIdAndUpdate(
        { _id: commentId },
        {
          $pull: { replies: { _id: replyId } },
        },
        {
          new: true,
        }
      )
        .populate({
          path: "userId",
          model: "User",
        })
        .populate({ path: "replies.userId", model: "User" });
      if (!comment) {
        return res.status(404).json("Comment not found");
      }

      // tìm phản hồi của bình luận
      // const reply = comment.replies.id(replyId);
      // const reply = comment.replies.id(replyId);
      // if (!reply) {
      //   return res.status(404).json("Reply not found");
      // }

      // await comment.save();
      // const newComment = await CommentModel.findById(commentId)
      // .populate({
      //   path: "userId",
      //   model: "User",
      // })
      // .populate({ path: "replies.userId", model: "User" });
      return res.status(200).json(comment);
    } catch (error) {
      return next(error);
    }
  },
};

export default CommentsController;
