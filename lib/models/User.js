import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    userID: Number,
    type: String,  // department, department-user
    connection: String, // none, department-id
    designation: String, // none, head, team
    login: Boolean, // true, false
    role: {
      type: String,
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Method to return user object without password
UserSchema.methods.withoutPassword = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

// Method to return user object without password and email
UserSchema.methods.withoutPasswordEmail = function () {
  let obj = this.toObject();
  delete obj.password;
  delete obj.email;
  return obj;
};

// Check if the model already exists before compiling it
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
