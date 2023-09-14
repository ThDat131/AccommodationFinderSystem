import { Schema, model } from "mongoose";

const Image = new Schema(
  {
    url: {
      type: String,
    },
    active: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Image", Image);
