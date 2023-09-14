import { Schema, model } from "mongoose";

const Follow = new Schema(
  {
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
  {
    timestamps: true,
  }
);

export default model("Follow", Follow);
