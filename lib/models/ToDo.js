import mongoose from "mongoose";

const ToDoSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    color: String,
    code: String,
    members:{
      type: Array,
      default: [],
    },
    tasks:{
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
    createdByName: String,
  },
  { timestamps: true }
);

// Check if the model already exists before compiling it
const ToDo =
  mongoose.models.ToDo || mongoose.model("ToDo", ToDoSchema);

export default ToDo;
