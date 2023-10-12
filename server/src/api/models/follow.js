import { Schema, model } from "mongoose";

const Follow = new Schema(
  {
    active: {
      type: Boolean,
    },
    follower: {
      // người được follower
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    following: {
      // người follow
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Follow", Follow);
