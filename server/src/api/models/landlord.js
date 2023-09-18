import { Schema, model } from "mongoose";

const Landlord = new Schema(
  {
    personalId: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true
    },
    active: {
      type: Boolean,
    },
    images: {
      type: [String]
    }
  },
  {
    timestamps: true,
  }
);

export default model("Landlord", Landlord);
