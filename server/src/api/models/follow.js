import { Schema, model } from "mongoose";

const Follow = new Schema(
  {
    active: {
      type: Boolean,
    },
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true,
  }
);

export default model("Follow", Follow);
