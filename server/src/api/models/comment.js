import { Schema, model } from "mongoose";

const Comment = new Schema(
  {
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    content: {
      type: String,
      require: true,
    },
    active: {
      type: Boolean,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
export default model("Comment", Comment);
