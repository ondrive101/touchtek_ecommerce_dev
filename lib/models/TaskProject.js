import mongoose from "mongoose";

const TaskProjectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    color: String,
    code: String,
    folderId: String,
    startDate: String,
    endDate: String,
    boards:{
        type: Array,
        default: [],
    },
    members:{
      type: Array,
      default: [],
    },
    data:{
      type: Object,
      default: {},
    },
    status: {
      type: String,
      default: "active",
    },
    createdByDepartment:{
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

// Check if the model already exists before compiling it
const TaskProject =
  mongoose.models.TaskProject || mongoose.model("TaskProject", TaskProjectSchema);

export default TaskProject;
