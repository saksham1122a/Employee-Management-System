const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {     // Name of the user
      type: String,
      required: true,
      trim: true,
    },

    email: {    // Email of the user
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: { // Password of the user
      type: String,
      required: true,
    },

    role: { // Role of the user
      type: String,
      enum: ["admin", "manager", "employee"],
      default: "employee",
    },
  },
  { timestamps: true }   // it adds createdAt and updatedAt fields to the schema, meaning when the user was created and when it was updated
);

module.exports = mongoose.model("User", userSchema);
