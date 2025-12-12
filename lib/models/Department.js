import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema(
  {
    name: String,
    code: String,
    series: Number,
    teams: {
      type: Array,
      default: [],
    },
    approvals: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    createdByName: String,
  },
  { timestamps: true }
);

// Check if the model already exists before compiling it
const Department =
  mongoose.models.Department || mongoose.model("Department", DepartmentSchema);

export default Department;
