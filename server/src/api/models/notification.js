import { Schema, model } from "mongoose";

const Notification = new Schema(
  {
    content: {
      type: String,
    },
    active: {
      type: Boolean,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
export default model("Notification", Notification);
