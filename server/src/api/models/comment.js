import { Schema, model } from "mongoose";
import mongooseDelete from "mongoose-delete";

const Comment = new Schema(
  {
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
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
Comment.plugin(mongooseDelete, { overrideMethods: "all" });
export default model("Comment", Comment);
