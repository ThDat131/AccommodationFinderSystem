import { Schema, model } from "mongoose";

const ImageUsage = new Schema(
  {
    active: {
      type: Boolean,
    },
    imageId: {
      type: Schema.Types.ObjectId,
      ref: "Image",
    },
    // typeImageId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "TypeImage",
    // },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    landlordId: {
      type: Schema.Types.ObjectId,
      ref: "Landlord",
    },
  },
  { timestamps: true }
);

export default model("ImageUsage", ImageUsage);
