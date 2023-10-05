import { Schema, model } from "mongoose";

const Notification = new Schema(
  {
    content: {
      type: String,
    },
    active: {
      type: Boolean,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    landlordId: {
      type: Schema.Types.ObjectId,
      ref: "Landlord",
    },
  },
  { timestamps: true }
);
export default model("Notification", Notification);
