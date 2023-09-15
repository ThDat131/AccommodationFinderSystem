import { Schema, model } from "mongoose";

const User = new Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      unique: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      require: true,
    }, 
    active: {
      type: Boolean,
    },
    fullName: {
      type: String,
      require: true
    },
    phone: {
      type: String,
      require: true,
      unique: true,
    },
    landlordId: {
      type: Schema.Types.ObjectId,
      ref: "Landlord" 
    }

  },
  {
    timestamps: true,
  }
);

export default model("User", User);
