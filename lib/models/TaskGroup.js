import mongoose from "mongoose";

const TaskGroupSchema = new mongoose.Schema(
  {
    title: String,
    code: String,
    order: Number,
    data:{
      type: Object,
      default: {},
    },
    createdByDepartment:{
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

// Check if the model already exists before compiling it
const TaskGroup =
  mongoose.models.TaskGroup || mongoose.model("TaskGroup", TaskGroupSchema);

export default TaskGroup;
