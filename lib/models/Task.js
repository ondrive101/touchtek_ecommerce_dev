import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    dueDate: String,
    taskId: String,
    dueDate: String,
    frequency:{
      type: String,
      default: "oneTime",
    },
    frequencyHistory:{
      type: Object,
      default: {},
    },
    reminders:{
      type: Array,
      default: [],
    },
    priority: String,
    boardId: String,
    actualTime: String,//in hours
    estimatedTime: String,//in hours
    files: Array,
    forwardTo: Array,
    completedAt: String,
    verifiedAt: String,
    projectId: String,
    assignedTo: Array,
    tag: Array,
    forwardTo: Array,
    perUserBoardMap: {
      type: Object,
      default: {},
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
const Task =
  mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default Task;
