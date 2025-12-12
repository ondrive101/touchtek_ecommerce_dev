import mongoose from "mongoose";

const MailSetupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    employeeCode: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Check if the model already exists before compiling it
const MailSetup = mongoose.models.MailSetup || mongoose.model("MailSetup", MailSetupSchema);

export default MailSetup;
