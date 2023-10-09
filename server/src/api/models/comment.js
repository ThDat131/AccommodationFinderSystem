import { Schema, model } from "mongoose";
import mongooseDelete from "mongoose-delete";

const Comment = new Schema(
  {
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
    replies: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        content: {
          type: String,
          require: true,
        },
        commentId: {
          type: Schema.Types.ObjectId,
          require: true,
        },
        createAt: {
          type: Date,
          default: Date.now,
        },
      },
      {
        timestamps: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

Comment.plugin(mongooseDelete, { overrideMethods: "all" });

export default model("Comment", Comment);
