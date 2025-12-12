import { NextResponse, NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/mongoose";
import { generatCode } from "@/lib/utils/required";
import Department from "@/lib/models/Department";
import Kanban from "@/lib/models/Kanban";
import User from "@/lib/models/User";
import Series from "@/lib/models/Series";
import TaskProject from "@/lib/models/TaskProject";
import TaskGroup from "@/lib/models/TaskGroup";
import Employee from "@/lib/models/Employee";
import ToDo from "@/lib/models/ToDo";
import { nanoid } from "nanoid";
import Task from "@/lib/models/Task";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);
// Session validation function
const validateSession = async (session) => {
  console.log("Validating session...");
  if (!session || !session.user || !session.user.id) {
    console.log("Invalid session");
    return {
      valid: false,
      stage: "sv1",
      message: "Unauthorized, please login",
    };
  }

  // Step 2: Find user inside department designations
  const department = await Department.findOne({
    "teams.attachedEmployees.email": session.user.email,
  });
  if (!department) {
    return {
      valid: false,
      stage: "sv1",
      message: "Unauthorized, please login",
    };
  }

  // Step 3: Extract the matching employee
  let matchedEmployee = null;
  let matchedTeam = null;

  for (const team of department.teams) {
    const employee = team.attachedEmployees.find(
      (emp) => emp.email === session.user.email
    );
    if (employee) {
      matchedEmployee = employee;
      matchedTeam = team;
      break;
    }
  }

  console.log("Session validated successfully");
  return {
    valid: true,
    user: {
      ...matchedEmployee,
      team: matchedTeam,
      department: { name: department.name, code: department.code },
    },
  };
};

export async function POST(request) {
  await dbConnect();

  let reqBody = await request.json();

  if (!reqBody.session) {
    return NextResponse.json(
      {
        status: "fail",
        message: "Unauthorized, please login",
      },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const sessionValidation = await validateSession(reqBody.session);

  // Check session validation
  if (!sessionValidation.valid) {
    return NextResponse.json(
      { status: "fail", message: sessionValidation.message },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }
  const user = sessionValidation.user;

  // --create board
  // if (reqBody.route === "createBoard") {
  //   try {
  //     const { name, status, color } = reqBody.data;

  //     // Validate required fields
  //     if (!name || !status || !color) {
  //       return NextResponse.json(
  //         { status: "fail", message: "Missing required fields" },
  //         { status: StatusCodes.BAD_REQUEST }
  //       );
  //     }
  //     const code = generatCode(3, 2);
  //     const isFirstBoard = (await Kanban.countDocuments()) === 0;
  //     const series = await Series.findOne();

  //     const obj = {
  //       name,
  //       status,
  //       series: isFirstBoard ? 1 : series.board + 1,
  //       color,
  //       code,
  //       tasks: [],
  //       data: {
  //         base: "",
  //       },
  //       createdByDepartment: {
  //         departmentId: sessionValidation.user.department.code,
  //         teamId: sessionValidation.user.team.teamID,
  //         employeeId: sessionValidation.user.employeeCode,
  //         connectionID: sessionValidation.user.connectionID,
  //       },
  //     };

  //     // create product series or update
  //     await Series.updateOne({}, { $set: { board: obj.series } });

  //     const board = await Kanban.create(obj);
  //     if (!board) {
  //       return NextResponse.json(
  //         { status: "fail", message: "unable to create new board" },
  //         { status: StatusCodes.BAD_REQUEST }
  //       );
  //     }

  //     return NextResponse.json({
  //       status: "success",
  //       message: "return successfully",
  //     });
  //   } catch (e) {
  //     return NextResponse.json(
  //       {
  //         status: "fail",
  //         message: e.message || "An error occurred...",
  //       },
  //       { status: StatusCodes.BAD_REQUEST }
  //     );
  //   }
  // }

  // --get boards
  if (reqBody.route === "getBoards") {
    try {
      const { filter } = reqBody.data;

      //get employee list
      const employees = await Employee.find({});

      //apply board filter
      let query = {};
      if (filter.boardFilter !== "all") {
        query = { name: { $regex: filter.boardFilter } };
      }

      const boards = await Kanban.find(query).sort({ series: 1 });
      if (!boards) {
        return NextResponse.json(
          { status: "fail", message: "unable to get boards" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const list = boards.map((board) => {
        //get task related to only related to user either assigned to user or created by user
        let tasks = board.tasks.filter((task) => {
          const assignToUser = task.assignedEmployees.some((emp) => {
            return emp.employeeCode === user.employeeCode;
          });
          const createdByUser =
            task.createdByDepartment.employeeId === user.employeeCode;
          return assignToUser || createdByUser;
        });

        // add one more property in task like incoming and outgoing type
        tasks.forEach((task) => {
          //add employee names
          const employee = employees.find((emp) => {
            return emp.employeeCode === task.createdByDepartment.employeeId;
          });

          if (employee) {
            task.createdByDepartment.employeeName = employee.name;
          } else {
            task.createdByDepartment.employeeName = "Developer";
          }

          //add incoming and outgoing title
          if (
            task.assignedEmployees.some((emp) => {
              return emp.employeeCode === user.employeeCode;
            })
          ) {
            task.type = "incoming";
          } else {
            task.type = "outgoing";
          }
        });

        //apply io filter
        if (filter.ioFilter === "incoming") {
          tasks = tasks.filter((task) => task.type === "incoming");
        }
        if (filter.ioFilter === "outgoing") {
          tasks = tasks.filter((task) => task.type === "outgoing");
        }

        return {
          id: board._id,
          series: board.series,
          name: board.name,
          code: board.code,
          color: board.color,
          status: board.status,
          tasks: tasks,
          data: board.data,
        };
      });

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: list,
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }

  // --delete board
  if (reqBody.route === "deleteBoard") {
    try {
      const { boardId } = reqBody.data;

      // Step 1: Validate required fields
      if (!boardId) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      // Step 2: find board and delete
      const board = await Kanban.findByIdAndDelete(boardId);

      if (!board) {
        return NextResponse.json({
          status: "fail",
          message: "Board not found",
        });
      }

      return NextResponse.json({
        status: "success",
        message: "return successfully",
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }

  // --edit board
  // if (reqBody.route === "editBoard") {
  //   try {
  //     const { id, name, status, color } = reqBody.data;

  //     // Validate required fields
  //     if (!id || !name || !status || !color) {
  //       return NextResponse.json(
  //         { status: "fail", message: "Missing required fields" },
  //         { status: StatusCodes.BAD_REQUEST }
  //       );
  //     }

  //     const obj = {
  //       name,
  //       status,
  //       color,
  //     };

  //     const board = await Kanban.findByIdAndUpdate(id, obj);
  //     if (!board) {
  //       return NextResponse.json(
  //         { status: "fail", message: "unable to edit board" },
  //         { status: StatusCodes.BAD_REQUEST }
  //       );
  //     }

  //     return NextResponse.json({
  //       status: "success",
  //       message: "return successfully",
  //     });
  //   } catch (e) {
  //     return NextResponse.json(
  //       {
  //         status: "fail",
  //         message: e.message || "An error occurred...",
  //       },
  //       { status: StatusCodes.BAD_REQUEST }
  //     );
  //   }
  // }

  // --swap board
  // if (reqBody.route === "swapBoard") {
  //   try {
  //     const { activeBoardId, overBoardId } = reqBody.data;

  //     const activeBoard = await Kanban.findById(activeBoardId);
  //     const overBoard = await Kanban.findById(overBoardId);

  //     if (!activeBoard || !overBoard) {
  //       return NextResponse.json(
  //         { status: "fail", message: "Board not found" },
  //         { status: StatusCodes.BAD_REQUEST }
  //       );
  //     }

  //     //series swap
  //     const tempSeries = activeBoard.series;
  //     activeBoard.series = overBoard.series;
  //     overBoard.series = tempSeries;

  //     await activeBoard.save();
  //     await overBoard.save();

  //     return NextResponse.json({
  //       status: "success",
  //       message: "return successfully",
  //     });
  //   } catch (e) {
  //     return NextResponse.json(
  //       {
  //         status: "fail",
  //         message: e.message || "An error occurred...",
  //       },
  //       { status: StatusCodes.BAD_REQUEST }
  //     );
  //   }
  // }

  // --get department employees

  // --create task
  // if (reqBody.route === "createTask") {
  //   try {
  //     const { data } = reqBody;

  //     // find board by id
  //     const board = await Kanban.findById(data.boardId);
  //     if (!board) {
  //       return NextResponse.json(
  //         { status: "fail", message: "Board not found" },
  //         { status: StatusCodes.BAD_REQUEST }
  //       );
  //     }

  //     // Create a new task
  //     const newTask = {
  //       name: data.name,
  //       description: data.description || "",
  //       taskId: nanoid(16),
  //       dueDate: data.dueDate,
  //       priority: data.priority || "medium",
  //       status: data.status || "pending",
  //       data: {
  //         base: "",
  //         timeline: [
  //           {
  //             action: "created",
  //             time: new Date().toISOString(),
  //             by: {
  //               name: sessionValidation.user.name,
  //               employeeCode: sessionValidation.user.employeeCode,
  //               connectionID: sessionValidation.user.connectionID,
  //               departmentId: sessionValidation.user.department.code,
  //               departmentName: sessionValidation.user.department.name,
  //             },
  //           },
  //         ],
  //         comments: [],
  //       },
  //       boardId: data.boardId,
  //       assignedTo: data.assignedTo || [],
  //       assignedEmployees: data.assignedEmployees || [],
  //       createdByDepartment: {
  //         departmentId: sessionValidation.user.department.code,
  //         teamId: sessionValidation.user.team.teamID,
  //         employeeId: sessionValidation.user.employeeCode,
  //         connectionID: sessionValidation.user.connectionID,
  //       },
  //     };

  //     //push the new task in board.tasks
  //     board.tasks.push(newTask);

  //     await board.save();

  //     return NextResponse.json({
  //       status: "success",
  //       message: "return successfully",
  //     });
  //   } catch (e) {
  //     return NextResponse.json(
  //       {
  //         status: "fail",
  //         message: e.message || "An error occurred...",
  //       },
  //       { status: StatusCodes.BAD_REQUEST }
  //     );
  //   }
  // }

  // --update task
  // if (reqBody.route === "updateTask") {
  //   try {
  //     const { data } = reqBody;
  //     // find board by id
  //     const board = await Kanban.findById(data.task.boardId);
  //     if (!board) {
  //       return NextResponse.json(
  //         { status: "fail", message: "Board not found" },
  //         { status: StatusCodes.BAD_REQUEST }
  //       );
  //     }

  //     const task = board.tasks.find((task) => task.taskId === data.task.taskId);
  //     if (!task) {
  //       return NextResponse.json(
  //         { status: "fail", message: "Task not found" },
  //         { status: StatusCodes.BAD_REQUEST }
  //       );
  //     }

  //     if (data.type === "delete") {
  //       board.tasks = board.tasks.filter(
  //         (task) => task.taskId !== data.task.taskId
  //       );
  //       await board.save();
  //     }

  //     if (data.type === "accept") {
  //       // Update task status
  //       task.status = "in-progress";

  //       // Build accepted timeline entry
  //       const acceptedEntry = {
  //         action: "accepted",
  //         time: new Date().toISOString(),
  //         by: {
  //           name: sessionValidation.user.name,
  //           employeeCode: sessionValidation.user.employeeCode,
  //           connectionID: sessionValidation.user.connectionID,
  //           departmentId: sessionValidation.user.department.code,
  //           departmentName: sessionValidation.user.department.name,
  //         },
  //       };

  //       // Check if accepted timeline exists
  //       const acceptedIndex = task.data.timeline.findIndex(
  //         (t) => t.action === "accepted"
  //       );
  //       if (acceptedIndex === -1) {
  //         task.data.timeline.push(acceptedEntry);
  //       } else {
  //         task.data.timeline[acceptedIndex] = {
  //           ...task.data.timeline[acceptedIndex],
  //           time: acceptedEntry.time, // update only the time
  //         };
  //       }

  //       // Move task to 'In-Progress' board
  //       const inProgressBoard = await Kanban.findOne({ name: "In-Progress" });
  //       if (inProgressBoard) {
  //         inProgressBoard.tasks.push(task);
  //         //update task board id
  //         task.boardId = inProgressBoard._id.toString();
  //         await inProgressBoard.save();
  //       }

  //       // Remove task from current board
  //       board.tasks = board.tasks.filter((t) => t.taskId !== task.taskId);
  //       board.markModified("tasks");
  //       await board.save();
  //     }

  //     if (data.type === "completed") {
  //       // Update task status
  //       task.status = "completed";

  //       // Build completed timeline entry
  //       const completedEntry = {
  //         action: "completed",
  //         time: new Date().toISOString(),
  //         by: {
  //           name: sessionValidation.user.name,
  //           employeeCode: sessionValidation.user.employeeCode,
  //           connectionID: sessionValidation.user.connectionID,
  //           departmentId: sessionValidation.user.department.code,
  //           departmentName: sessionValidation.user.department.name,
  //         },
  //       };

  //       // Check if accepted timeline exists
  //       const completedIndex = task.data.timeline.findIndex(
  //         (t) => t.action === "completed"
  //       );
  //       if (completedIndex === -1) {
  //         task.data.timeline.push(completedEntry);
  //       } else {
  //         task.data.timeline[completedIndex] = {
  //           ...task.data.timeline[completedIndex],
  //           time: completedEntry.time, // update only the time
  //         };
  //       }

  //       // Move task to 'Completed' board
  //       const completedBoard = await Kanban.findOne({ name: "Completed" });
  //       if (completedBoard) {
  //         completedBoard.tasks.push(task);
  //         //update task board id
  //         task.boardId = completedBoard._id.toString();
  //         await completedBoard.save();
  //       }

  //       // Remove task from current board
  //       board.tasks = board.tasks.filter((t) => t.taskId !== task.taskId);
  //       board.markModified("tasks");
  //       await board.save();
  //     }

  //     if (data.type === "comment") {
  //       task.data.comments.push(data.data.comment);
  //       board.markModified("tasks");
  //       await board.save();
  //     }

  //     if (data.type === "editComment") {
  //       task.data.comments = task.data.comments.map((comment) =>
  //         comment.id === data.data.commentId
  //           ? { ...comment, text: data.data.text }
  //           : comment
  //       );
  //       board.markModified("tasks");
  //       await board.save();
  //     }

  //     if (data.type === "deleteComment") {
  //       task.data.comments = task.data.comments.filter(
  //         (comment) => comment.id !== data.data.commentId
  //       );
  //       board.markModified("tasks");
  //       await board.save();
  //     }

  //     if (data.type === "editTask") {
  //       task.name = data.data.name;
  //       task.description = data.data.description;
  //       task.priority = data.data.priority;
  //       task.dueDate = data.data.dueDate;
  //       board.markModified("tasks");
  //       await board.save();
  //     }

  //     return NextResponse.json({
  //       status: "success",
  //       message: "return successfully",
  //     });
  //   } catch (e) {
  //     return NextResponse.json(
  //       {
  //         status: "fail",
  //         message: e.message || "An error occurred...",
  //       },
  //       { status: StatusCodes.BAD_REQUEST }
  //     );
  //   }
  // }

  // --get projects
  if (reqBody.route === "getProjects") {
    try {
      const projects = await ToDo.find({}).sort({ createdAt: -1 });
      if (!projects) {
        return NextResponse.json(
          { status: "fail", message: "unable to get projects" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const list = projects.filter((project) => {
        return (
          project.createdByDepartment.employeeId ===
          sessionValidation.user.employeeCode
        );
      });

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: list,
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }

  // --delete board
  if (reqBody.route === "deleteProject") {
    try {
      const id = reqBody.id;

      // Step 1: Validate required fields
      if (!id) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      // Step 2: find board and delete
      const project = await ToDo.findByIdAndDelete(id);

      if (!project) {
        return NextResponse.json({
          status: "fail",
          message: "Project not found",
        });
      }

      // Step 3: delete project
      await ToDo.findOneAndDelete({ _id: id });

      return NextResponse.json({
        status: "success",
        message: "return successfully",
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }

  // --edit project
  if (reqBody.route === "editProject") {
    try {
      // const { title, description, color } = reqBody.data;

      // // Validate required fields
      // if (!title || !description || !color) {
      //   return NextResponse.json(
      //     { status: "fail", message: "Missing required fields" },
      //     { status: StatusCodes.BAD_REQUEST }
      //   );
      // }
      // const code = generatCode(3, 2);

      // const obj = {
      //   title,
      //   description,
      //   color,
      //   code,
      //   members: [],
      //   data: {
      //     base: "",
      //   },
      //   createdByDepartment: {
      //     departmentId: sessionValidation.user.department.code,
      //     teamId: sessionValidation.user.team.teamID,
      //     employeeId: sessionValidation.user.employeeCode,
      //     connectionID: sessionValidation.user.connectionID,
      //   },
      // };
      // const project = await ToDo.create(obj);
      // if (!project) {
      //   return NextResponse.json(
      //     { status: "fail", message: "unable to create new project" },
      //     { status: StatusCodes.BAD_REQUEST }
      //   );
      // }

      return NextResponse.json({
        status: "success",
        message: "return successfully",
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }

  // --create project or update project
  if (reqBody.route === "createUpdateProject") {
    try {
      if (reqBody.data.type === "create") {
        const { title, description, color } = reqBody.data;

        // Validate required fields
        if (!title || !description || !color) {
          return NextResponse.json(
            { status: "fail", message: "Missing required fields" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
        const code = generatCode(3, 2);

        const obj = {
          title,
          description,
          color,
          code,
          members: [],
          data: {
            base: "",
          },
          createdByDepartment: {
            departmentId: sessionValidation.user.department.code,
            teamId: sessionValidation.user.team.teamID,
            employeeId: sessionValidation.user.employeeCode,
            connectionID: sessionValidation.user.connectionID,
          },
        };
        const project = await ToDo.create(obj);
        if (!project) {
          return NextResponse.json(
            { status: "fail", message: "unable to create new project" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
      }

      if (reqBody.data.type === "update") {
        const project = await ToDo.findById(reqBody.data._id);
        if (!project) {
          return NextResponse.json(
            { status: "fail", message: "Project not found" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        project.title = reqBody.data.title;
        project.description = reqBody.data.description;
        project.color = reqBody.data.color;
        await project.save();
      }
      return NextResponse.json({
        status: "success",
        message: "return successfully",
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }

  // --create project or update project todo
  if (reqBody.route === "createUpdateTodo") {
    try {
      if (reqBody.data.type === "create") {
        const {
          title,
          description,
          tags,
          dueDate,
          isStarred,
          priority,
          projectId,
          sharedWith,
          status,
        } = reqBody.data;

        // Validate required fields
        if (
          !title ||
          !description ||
          !tags ||
          !dueDate ||
          !isStarred ||
          !priority ||
          !projectId ||
          !sharedWith ||
          !status
        ) {
          return NextResponse.json(
            { status: "fail", message: "Missing required fields" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
        const code = generatCode(4, 2);

        const project = await ToDo.findById(projectId);

        const obj = {
          id: code,
          title,
          description,
          priority,
          status,
          dueDate,
          createdAt: new Date(),
          isStarred,
          tags,
          sharedWith,
          projectId,
          createdByEmployee: sessionValidation.user.employeeCode,
          updatedAt: new Date(),
        };

        project.tasks.push(obj);
        await project.save();
      }

      if (reqBody.data.type === "update") {
        const project = await ToDo.findById(reqBody.data.projectId);
        if (!project) {
          return NextResponse.json(
            { status: "fail", message: "Project not found" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        const todo = project.tasks.find((todo) => todo.id === reqBody.data.id);
        if (!todo) {
          return NextResponse.json(
            { status: "fail", message: "Todo not found" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        if (reqBody.data.data.type === "status") {
          todo.status = reqBody.data.data.status;
          todo.updatedAt = new Date();
        }

        if (reqBody.data.data.type === "starred") {
          todo.isStarred = reqBody.data.data.isStarred;
          todo.updatedAt = new Date();
        }

        project.updatedAt = new Date();
        project.markModified("tasks");
        await project.save();
      }
      return NextResponse.json({
        status: "success",
        message: "return successfully",
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }

  // --delete todo
  if (reqBody.route === "deleteTodo") {
    try {
      const { id, projectId } = reqBody.data;

      // Step 1: Validate required fields
      if (!id || !projectId) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      // Step 2: find board and delete
      const project = await ToDo.findById(projectId);

      if (!project) {
        return NextResponse.json({
          status: "fail",
          message: "Project not found",
        });
      }

      // Step 3: delete project
      project.tasks = project.tasks.filter((task) => task.id !== id);

      project.markModified("tasks");
      await project.save();

      return NextResponse.json({
        status: "success",
        message: "return successfully",
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }

  if (reqBody.route === "getTaskProjects") {
    try {
      const projects = await TaskProject.find({}).sort({ createdAt: -1 });
      if (!projects) {
        return NextResponse.json(
          { status: "fail", message: "unable to get projects" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      //add employee full details
      const employees = await Employee.find({});
      const departments = await Department.find({});

      projects.forEach((project) => {
        project.members = project.members.map((member) => {
          let employee = employees.find(
            (emp) => emp.employeeCode === member.employeeCode
          );

          if (!employee) {
            const deptWithEmployees = departments.map((dept) => {
              const allEmployees = dept.teams.flatMap(
                (team) => team.attachedEmployees || []
              );
              return {
                departmentId: dept._id,
                departmentName: dept.name,
                employees: allEmployees,
              };
            });
            const employees = deptWithEmployees.flatMap((dept) =>
              dept.employees
                .filter((emp) => emp.status === "active")
                .map((emp) => ({
                  employeeCode: emp.employeeCode,
                  name: emp.name,
                  image: "",
                }))
            );
            employee = employees.find(
              (emp) => emp.employeeCode === member.employeeCode
            );
          }

          return {
            ...member,
            name: employee.name,
            image: employee.image,
            employeeCode: employee.employeeCode,
          };
        });
      });

      const list = projects.filter((project) => {
        return (
          project.createdByDepartment.employeeId ===
          sessionValidation.user.employeeCode
        );
      });

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: list,
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }

  // ------------------------------------------------------------------------

  if (reqBody.route === "getTaskGroups") {
    try {
      const userId = sessionValidation.user.employeeCode;
      console.log("userId", userId);

      const groups = await TaskGroup.find({}).sort({ order: 1 });

       
      let tasks = await Task.find({}).lean();
      tasks = tasks.filter((task) => {
        // console.log('processing',task?._id, task?.name)
        const assignToUser = task.assignedTo.some(
          (emp) => emp === userId
        );

        const forwardToUser = task.forwardTo.some(
          (emp) => emp.to.employeeCode === userId
        );

        return (assignToUser || forwardToUser || task.assignedTo.length === 0);
      });

      const projects = await TaskProject.find()
        .select("title folderId createdAt code createdByDepartment members")
        .sort({ createdAt: -1 });

      if (!groups) {
        return NextResponse.json(
          { status: "fail", message: "unable to get groups" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // Only include projects where user is creator or member
      const filteredProjects = projects.filter((project) => {
        const isCreator = project.createdByDepartment?.employeeId === userId;
        const isMember = project.members?.some(
          (member) => member?.employeeCode === userId
        );

        return isCreator || isMember;
      });

      const list = groups.map((group) => {
        const groupProjects = filteredProjects
          .filter(
            (project) => project.folderId?.toString() === group._id.toString()
          )
          .map((project) => {
            const p = project.toObject();
            p.user =
              p.createdByDepartment?.employeeId === userId
                ? "creator"
                : "member";
            p.tasks = tasks.filter((task) => {
              return task.projectId?.toString() === project._id.toString();
            });
            return p;
          });

        return {
          ...group.toObject(),
          projects: groupProjects,
          taskCount: groupProjects.reduce((acc, project) => acc + project.tasks.length, 0),
        };
      });

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: list,
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }

  if (reqBody.route === "createTaskProject") {
    console.log("body received", reqBody);
    try {
      if (reqBody.data.type === "main") {
       

        if(user?.department?.name !== "admin"){
          return NextResponse.json(
            { status: "fail", message: "Only admin can perform this action. Please contact admin" },
            { status: StatusCodes.BAD_REQUEST }
          );

          
        }

        const groups = await TaskGroup.find({})
        if(groups.length > 0){
          return NextResponse.json(
            { status: "fail", message: "Groups already exists! Try to refresh the page" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }






        //step 1: fetch all departments employees
        const departments = await Department.find({});

        const deptWithEmployees = departments.map((dept) => {
          const allEmployees = dept.teams.flatMap(
            (team) => team.attachedEmployees || []
          );
          return {
            departmentId: dept._id,
            departmentName: dept.name,
            employees: allEmployees,
          };
        });

        const employees = deptWithEmployees.flatMap((dept) =>
          dept.employees
            .filter((emp) => emp.status === "active")
            .map((emp) => ({
              employeeCode: emp.employeeCode,
            }))
        );
        //step 2: create defualt groups with name of projects, personal, shared, daily-task
        const groupsData = [
          {
            title: "Personal",
            code: generatCode(4, 3),
            order: 1,
            data: {
              base: "",
            },
          },
          {
            title: "Projects",
            code: generatCode(4, 3),
            order: 2,
            data: {
              base: "",
            },
          },

          // {
          //   title: "Shared",
          //   code: generatCode(4, 3),
          //   order: 3,
          //   data: {
          //     base: "",
          //   },
          // },
          {
            title: "Daily Task",
            code: generatCode(4, 3),
            order: 3,
            data: {
              base: "",
            },
          },
        ];
        const createdGroups = await Promise.all(
          groupsData.map((group) => {
            const groupPayload = {
              title: group.title,
              order: group.order,
              code: group.code,
              data: group.data,
              createdByDepartment: {
                departmentId: sessionValidation.user.department.code,
                teamId: sessionValidation.user.team.teamID,
                employeeId: sessionValidation.user.employeeCode,
                connectionID: sessionValidation.user.connectionID,
              },
            };
            return TaskGroup.create(groupPayload);
          })
        );
        // steo 4: create payload
        const payload = {
          title: "daily task",
          description: "create and perform daily tasks by the employees",
          folderId: createdGroups.find((group) => group.title === "Daily Task")
            ._id,
          color: "#000000",
          code: generatCode(4, 3),
          boards: [
            {
              name: "To-do",
              boardId: generatCode(4, 3),
              order: 1,
              color: "#000000",
              data: {
                base: "",
              },
            },
            {
              name: "In-Progress",
              boardId: generatCode(4, 3),
              order: 2,
              color: "#000000",
              data: {
                base: "",
              },
            },
            {
              name: "Completed",
              boardId: generatCode(4, 3),
              order: 3,
              color: "#000000",
              data: {
                base: "",
              },
            },
            {
              name: "Verified",
              boardId: generatCode(4, 3),
              order: 4,
              color: "#000000",
              data: {
                base: "",
              },
            },
          ],
          startDate: dayjs().format("YYYY-MM-DD"),
          endDate: null,
          createdByDepartment: {
            departmentId: sessionValidation.user.department.code,
            teamId: sessionValidation.user.team.teamID,
            employeeId: sessionValidation.user.employeeCode,
            connectionID: sessionValidation.user.connectionID,
          },
          members: employees,
          data: {
            base: "",
            customColums: {
              base: "",
            },
            customColums: {
              base: "",
            },
            userColumns:[],
            userGroupBy:[],
            hiddenTasks:[],
            defaultView: "list",
          },
        };
        // step 5: create project
        const project = await TaskProject.create(payload);
        if (!project) {
          return NextResponse.json(
            { status: "fail", message: "unable to create new project" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
      }

      if (reqBody.data.type === "main-after") {
        console.log("body received", reqBody.data);
        //step 1: fetch all departments employees
        const departments = await Department.find({});

        const deptWithEmployees = departments.map((dept) => {
          const allEmployees = dept.teams.flatMap(
            (team) => team.attachedEmployees || []
          );
          return {
            departmentId: dept._id,
            departmentName: dept.name,
            employees: allEmployees,
          };
        });

        const employees = deptWithEmployees.flatMap((dept) =>
          dept.employees
            .filter((emp) => emp.status === "active")
            .map((emp) => ({
              employeeCode: emp.employeeCode,
              name: emp.name,
            }))
        );

        const members = reqBody.data.members.map((member) => ({
          employeeCode: member.employeeCode,
          name: employees.find(
            (emp) => emp.employeeCode === member.employeeCode
          ).name,
          role: 'editor'
        }));

        const payload = {
          title: reqBody.data.name,
          description: "",
          folderId: reqBody.data.groupId,
          color: "#000000",
          code: generatCode(4, 3),
          boards: [
            {
              name: "To-do",
              boardId: generatCode(4, 3),
              order: 1,
              color: "#000000",
              data: {
                base: "",
              },
            },
            {
              name: "In-Progress",
              boardId: generatCode(4, 3),
              order: 2,
              color: "#000000",
              data: {
                base: "",
              },
            },
            {
              name: "Completed",
              boardId: generatCode(4, 3),
              order: 3,
              color: "#000000",
              data: {
                base: "",
              },
            },
            {
              name: "Verified",
              boardId: generatCode(4, 3),
              order: 4,
              color: "#000000",
              data: {
                base: "",
              },
            },
          ],
          startDate: reqBody.data.startDate,
          endDate: reqBody.data.endDate,
          createdByDepartment: {
            departmentId: sessionValidation.user.department.code,
            teamId: sessionValidation.user.team.teamID,
            employeeId: sessionValidation.user.employeeCode,
            connectionID: sessionValidation.user.connectionID,
          },
          members: members,
          data: {
            base: "",
            customColums: {
              base: "",
            },
            userColumns:[],
            userGroupBy:[],
            hiddenTasks:[],
            defaultView: reqBody.data.defaultView,
          },
        };
        // step 5: create project
        const project = await TaskProject.create(payload);
        if (!project) {
          return NextResponse.json(
            { status: "fail", message: "unable to create new project" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
      }
      return NextResponse.json({
        status: "success",
        message: "return successfully",
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }

  if (reqBody.route === "getTaskProject") {
    try {
      const filter = reqBody.filter;
      console.log(filter);

      const project = await TaskProject.findById(reqBody.id).lean();
      if (!project) {
        return NextResponse.json(
          { status: "fail", message: "Project not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      const group = await TaskGroup.findById(project.folderId);
      if (!group) {
        return NextResponse.json(
          { status: "fail", message: "Group not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      let tasks = await Task.find({ projectId: reqBody.id }).lean();

      // Get employees and departments
      const departments = await Department.find({});

      const employees = await Employee.find({}).select("name employeeCode image");

      // Build a flattened list of active employees across departments
      const allDepartmentEmployees = departments.flatMap((dept) =>
        dept.teams.flatMap((team) =>
          (team.attachedEmployees || [])
            .filter((emp) => emp.status === "active")
            .map((emp) => ({
              employeeCode: emp.employeeCode,
              name: emp.name,
              image: "", // Adjust as needed
              departmentName: dept.name,
            }))
        )
      );
      // Map project members to include full employee details
      project.members = project.members.map((member) => {
        let employee = allDepartmentEmployees.find(
          (emp) => emp.employeeCode === member.employeeCode
        );
        return {
          ...member,
          name: employee?.name || "N/A",
          image: employee?.image || "",
          employeeCode: employee?.employeeCode,
          departmentName: employee?.departmentName || "",
        };
      });
      // add name in project creator
      project.createdByDepartment.name = allDepartmentEmployees.find(
        (emp) =>
          emp.employeeCode === project.createdByDepartment.employeeId
      )?.name;
      project.group = { title: group.title, _id: group._id };
      project.employees = employees;

      //get task related to only related to user either assigned to user or created by user
      tasks = tasks.filter((task) => {
        const assignToUser = task.assignedTo.some(
          (emp) => emp === user.employeeCode
        );

        const createdByUser =
          task.createdByDepartment.employeeId === user.employeeCode;

        const forwardToUser = task.forwardTo.some(
          (emp) => emp.to.employeeCode === user.employeeCode
        );

        return assignToUser || createdByUser || forwardToUser;
      });
      // add one more property in task like incoming and outgoing type
      tasks.forEach((task) => {
        //add employee names
        let employee = allDepartmentEmployees.find(
          (emp) => emp.employeeCode === task.createdByDepartment.employeeId
        );

        if (employee) {
          task.createdByDepartment.employeeName = employee.name;
          task.createdByDepartment.departmentName = employee.departmentName;
        } else {
          task.createdByDepartment.employeeName = "N/A";
        }

        //add incoming and outgoing title
        if (
          task.assignedTo.some((empCode) => {
            return empCode === user.employeeCode; //means does not created by user but he is an assigned to user
          }) ||
          task.forwardTo.some((emp) => {
            return emp.to.employeeCode === user.employeeCode; //means does not created by user but he is an assigned to user
          })
        ) {
          // if current user forward task to other user then show outgoint for current user and incoming for that user
          const isForward = task.forwardTo.find(
            (forwardTo) => forwardTo.by.employeeCode === user.employeeCode
          );

          if (isForward) {
            task.type = "outgoing";
          } else {
            task.type = "incoming";
          }
        } else {
          task.type = "outgoing";
        }

        // update assignedTo with employee name
        task.assignedToFull = task.assignedTo.map((empCode) => {
          const employee = allDepartmentEmployees.find((emp) => {
            return emp.employeeCode === empCode;
          });
          return { name: employee?.name, employeeCode: empCode } || "N/A";
        });
          // update assignedTo with employee name
          task.tagFull = task.tag.map((empCode) => {
            const employee = allDepartmentEmployees.find((emp) => {
              return emp.employeeCode === empCode;
            });
            return { name: employee?.name, employeeCode: empCode } || "N/A";
          });
        task.group = { title: group.title, _id: group._id };

        // add comment details in activity content because currently activity content only have commentId
        task.data.activity.forEach((activity) => {
          if (activity.source === "comment") {
            const comment = task.data.comments.find(
              (comment) => comment.id === activity.content.commentId
            );
            if (comment) {
              activity.content.details = comment;
            }
          }
        });
      });

      //apply io filter
      if (["incoming", "outgoing"].includes(filter.ioFilter)) {
        tasks = tasks.filter((task) => task.type === filter.ioFilter);
      }
      //apply priority filter
      if (["high", "medium", "low", "urgent"].includes(filter.priorityFilter)) {
        tasks = tasks.filter((task) => task.priority === filter.priorityFilter);
      }

      project.tasks = tasks; // Clear tasks array if needed

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: project,
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }

  if (reqBody.route === "createTask") {
    try {
      const { data } = reqBody;

      // find project by id
      const project = await TaskProject.findById(data.projectId);
      if (!project) {
        return NextResponse.json(
          { status: "fail", message: "Project not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const group = await TaskGroup.findById(project.folderId);
      if (!group) {
        return NextResponse.json(
          { status: "fail", message: "Group not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      // console.log(group);

      //find board inside project
      const board = project.boards.find(
        (board) => board.boardId === data.boardId
      );
      if (!board) {
        return NextResponse.json(
          { status: "fail", message: "Board not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      if(data.assignedTo[0] === sessionValidation.user.employeeCode) {
        return NextResponse.json(
          { status: "fail", message: "You can't assign task to yourself" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const perUserBoardMap = {};

      if (group.title !== "Personal") {
        (data.assignedTo || []).forEach((user) => {
          perUserBoardMap[user] = {
            boardId: data.boardId, // initial board
            boardName: board.name,
            priority: data.priority || "medium", // per-user priority if needed
            hidden: false,
            data:{
              base:''
            },
            archive: false,
            reminders: [],
            completedAt: null,
            verifiedAt: null,
            updatedAt: new Date().toISOString(), // optional: track when it was last modified
          };
        });
      }

      // Ensure the creator is also included
      const creatorCode = sessionValidation.user.employeeCode;

      if (!perUserBoardMap[creatorCode]) {
        perUserBoardMap[creatorCode] = {
          boardId: data.boardId,
          boardName: board.name,
          priority: data.priority || "medium",
          hidden: false,
          data:{
            base:''
          },
          archive: false,
          reminders: [],
          completedAt: null,
          verifiedAt: null,
          updatedAt: new Date().toISOString(),
        };
      }

      // Create a new task
      const newTask = {
        name: data.name,
        description: data.description || "",
        taskId: nanoid(16),
        dueDate: data.dueDate || null,
        priority: data.priority || "medium",
        actualTime: "0", //in hours
        frequency: data.frequency || "one-time",
        frequencyHistory: {
          base: "",
          daily: {
            history: [],
          },
          weekly: {
            history: [],
          },
          monthly: {
            history: [],
          },
          yearly: {
            history: [],
          },
        },
        estimatedTime: "0", //in hours
        files: [],
        completedAt: null,
        verifiedAt: null,
        status: board.name,
        data: {
          base: "",

          comments: [],
          activity: [],
        },
        boardId: data.boardId,
        projectId: data.projectId,
        assignedTo: group.title === "Personal" ? [] : data.assignedTo || [],
        perUserBoardMap,
        createdByDepartment: {
          departmentId: sessionValidation.user.department.code,
          teamId: sessionValidation.user.team.teamID,
          employeeId: sessionValidation.user.employeeCode,
          connectionID: sessionValidation.user.connectionID,
        },
      };

      // Add to activity log
      const activityEntry = {
        action: "create-task",
        id: Date.now(),
        source: "task",
        time: new Date().toISOString(),
        content: {
          taskId: newTask.taskId,
        },
        by: {
          name: sessionValidation.user.name,
          employeeCode: sessionValidation.user.employeeCode,
          connectionID: sessionValidation.user.connectionID,
          departmentId: sessionValidation.user.department.code,
          departmentName: sessionValidation.user.department.name,
        },
      };

      newTask.data.activity.push(activityEntry);

      const task = await Task.create(newTask);

      if (!task) {
        return NextResponse.json(
          { status: "fail", message: "unable to create new task" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      return NextResponse.json({
        status: "success",
        message: "return successfully",
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }

  if (reqBody.route === "updateTask") {
    try {
      const { data } = reqBody;

      //find task by id
      const task = await Task.findById(data.task._id);
      if (!task) {
        return NextResponse.json(
          { status: "fail", message: "Task not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // find project by id
      const project = await TaskProject.findById(data.task.projectId);
      if (!project) {
        return NextResponse.json(
          { status: "fail", message: "Project not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      //find project group
      const projectGroup = await TaskGroup.findById(project.folderId);
      if (!projectGroup) {
        return NextResponse.json(
          { status: "fail", message: "Project group not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      //find board inside project
      const board = project.boards.find(
        (board) => board.boardId === data.task.boardId
      );
      if (!board) {
        return NextResponse.json(
          { status: "fail", message: "Board not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      if (data.type === "delete") {
        const isForward = task.forwardTo.find(
          (forwardTo) =>
            forwardTo.by.employeeCode === sessionValidation.user.employeeCode
        );
        if (isForward) {
          return NextResponse.json(
            {
              status: "fail",
              message: "You can't delete this task! It is forwarded by you",
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
        // once verified or completed it not deleted and only creator can delete task
        const isCreator =
          sessionValidation.user.employeeCode ===
          task.createdByDepartment.employeeId;

        if (!isCreator) {
          return NextResponse.json(
            {
              status: "fail",
              message:
                "You can't delete this task! It is not originated by you",
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        const usersNotInTodo = Object.entries(task.perUserBoardMap)
          .filter(([user, data]) => data.boardName !== "To-do")
          .map(([user]) => user);

        // console.log("userNotinTodo", usersNotInTodo);

        if (usersNotInTodo.length > 0) {
          return NextResponse.json(
            {
              status: "fail",
              message: `You can't delete this task! someone has moved it to another board ${usersNotInTodo.join(
                ", "
              )}`,
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        const deleteTask = await Task.findByIdAndDelete(data.task._id);
        if (!deleteTask) {
          return NextResponse.json(
            { status: "fail", message: "Task not found" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
      }

      if (data.type === "dueDate") {
        // Update task status
        task.dueDate = data.data.dueDate;

        task.markModified("data");

        await task.save();
      }

      // ------------------------------------
      if (data.type === "comment-text") {
        const comment = {
          ...data.comment,
          status: "active",
          by: {
            name: sessionValidation.user.name,
            employeeCode: sessionValidation.user.employeeCode,
            connectionID: sessionValidation.user.connectionID,
            departmentId: sessionValidation.user.department.code,
            departmentName: sessionValidation.user.department.name,
          },
        };

        task.data.comments.push(comment);

        //  uniquely collect tag members
        for (const member of data.comment.tag) {
          if (member?.employeeCode && !task.tag.includes(member.employeeCode)) {
            task.tag.push(member.employeeCode);
          }
        }

        //add activity
        const activityEntry = {
          action: data.type,
          id: Date.now(),
          source: "comment",
          time: new Date().toISOString(),
          content: {
            text: data.comment.text,
          },
          by: {
            name: sessionValidation.user.name,
            employeeCode: sessionValidation.user.employeeCode,
            connectionID: sessionValidation.user.connectionID,
            departmentId: sessionValidation.user.department.code,
            departmentName: sessionValidation.user.department.name,
          },
        };

        task.data.activity.push(activityEntry);

        //update unarchive that task when new or any user comment in that 
        for (const key in task.perUserBoardMap) {
          // console.log('updating archive',key)
          task.perUserBoardMap[key].archive = false;
      }
      task.markModified("perUserBoardMap");
        task.markModified("data");

        await task.save();
      }
      if (data.type === "comment-edit") {
        const commentId = data.commentId;

        // Find the comment once
        const commentToEdit = task.data.comments.find(
          (comment) => comment.id === commentId
        );

        if (!commentToEdit) {
          throw new Error("Comment not found");
        }

        //check is comment created by same user or not
        if (
          commentToEdit.by.employeeCode !== sessionValidation.user.employeeCode
        ) {
          throw new Error("You are not authorized to edit this comment");
        }

        //save new text in  text and old text in content
        const editData = {
          time: new Date().toISOString(),
          editId: Date.now(),
          oldText: commentToEdit.text,
          newText: data.content.newText,
          by: {
            name: sessionValidation.user.name,
            employeeCode: sessionValidation.user.employeeCode,
            connectionID: sessionValidation.user.connectionID,
            departmentId: sessionValidation.user.department.code,
            departmentName: sessionValidation.user.department.name,
          },
        };
        commentToEdit.content = {
          ...commentToEdit.content,
          oldText: commentToEdit.text,
        };
        commentToEdit.content.previousEdits.push(editData);
        commentToEdit.text = data.content.newText;

        //add activity
        const activityEntry = {
          action: data.type,
          id: Date.now(),
          source: "comment",
          time: new Date().toISOString(),
          content: {
            commentId,
            editId: editData.editId,
          },
          by: {
            name: sessionValidation.user.name,
            employeeCode: sessionValidation.user.employeeCode,
            connectionID: sessionValidation.user.connectionID,
            departmentId: sessionValidation.user.department.code,
            departmentName: sessionValidation.user.department.name,
          },
        };

        task.data.activity.push(activityEntry);

        //update unarchive that task when new or any user comment in that 
        for (const key in task.perUserBoardMap) {
          // console.log('updating archive',key)
          task.perUserBoardMap[key].archive = false;
      }
      task.markModified("perUserBoardMap");

        task.markModified("data");
        await task.save();
      }
      if (data.type === "comment-reply") {
        const commentId = data.commentId;

        // Find the comment once
        const commentToReply = task.data.comments.find(
          (comment) => comment.id === commentId
        );

        if (!commentToReply) {
          throw new Error("Comment not found");
        }

        //save new text in  text and old text in content
        const comment = {
          ...data.comment,
          text: commentToReply.text,
          by: {
            name: sessionValidation.user.name,
            employeeCode: sessionValidation.user.employeeCode,
            connectionID: sessionValidation.user.connectionID,
            departmentId: sessionValidation.user.department.code,
            departmentName: sessionValidation.user.department.name,
          },
        };
        task.data.comments.push(comment);

        for (const member of data.comment.tag) {
          if (member?.employeeCode && !task.tag.includes(member.employeeCode)) {
            task.tag.push(member.employeeCode);
          }
        }

        //add activity
        const activityEntry = {
          action: data.type,
          id: Date.now(),
          source: "comment",
          time: new Date().toISOString(),
          content: {
            commentId,
          },
          by: {
            name: sessionValidation.user.name,
            employeeCode: sessionValidation.user.employeeCode,
            connectionID: sessionValidation.user.connectionID,
            departmentId: sessionValidation.user.department.code,
            departmentName: sessionValidation.user.department.name,
          },
        };

        task.data.activity.push(activityEntry);

        //update unarchive that task when new or any user comment in that 
        for (const key in task.perUserBoardMap) {
          // console.log('updating archive',key)
          task.perUserBoardMap[key].archive = false;
      }
      task.markModified("perUserBoardMap");

        task.markModified("data");
        await task.save();
      }
      if (data.type === "comment-like") {
        const commentId = data.data.commentId;

        // Find the comment once
        const commentToLike = task.data.comments.find(
          (comment) => comment.id === commentId
        );

        if (!commentToLike) {
          throw new Error("Comment not found");
        }
        if (commentToLike.content.isLiked) {
          return NextResponse.json(
            { status: "fail", message: "Comment already liked" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        commentToLike.content = {
          ...commentToLike.content,
          isLiked: true,
          likeBy: {
            name: sessionValidation.user.name,
            employeeCode: sessionValidation.user.employeeCode,
            connectionID: sessionValidation.user.connectionID,
            departmentId: sessionValidation.user.department.code,
            departmentName: sessionValidation.user.department.name,
          },
        };

        // //add activity
        const activityEntry = {
          action: data.type,
          id: Date.now(),
          source: "comment",
          time: new Date().toISOString(),
          content: {
            commentId,
          },
          by: {
            name: sessionValidation.user.name,
            employeeCode: sessionValidation.user.employeeCode,
            connectionID: sessionValidation.user.connectionID,
            departmentId: sessionValidation.user.department.code,
            departmentName: sessionValidation.user.department.name,
          },
        };

        task.data.activity.push(activityEntry);
        //update unarchive that task when new or any user comment in that 
        for (const key in task.perUserBoardMap) {
          // console.log('updating archive',key)
          task.perUserBoardMap[key].archive = false;
      }
      task.markModified("perUserBoardMap");
        task.markModified("data");
        await task.save();
      }
      if (data.type === "deleteComment") {
        const commentId = data.data.commentId;

        // Find the comment once
        const commentToDelete = task.data.comments.find(
          (comment) => comment.id === commentId
        );

        if (!commentToDelete) {
          throw new Error("Comment not found");
        }
        // if current time and comment time difference exceed 1 minute then no delete allowed
        const timeDiff =
          new Date().getTime() - new Date(commentToDelete.timestamp).getTime();
        if (timeDiff > 60000) {
          return NextResponse.json(
            {
              status: "fail",
              message: "Comment can't be deleted after 1 minute",
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        commentToDelete.status = "deleted";

        // Add to activity log
        const activityEntry = {
          action: `delete-${commentToDelete.type}`,
          id: Date.now(),
          source: "comment",
          time: new Date().toISOString(),
          content: {
            commentId,
          },
          by: {
            name: sessionValidation.user.name,
            employeeCode: sessionValidation.user.employeeCode,
            connectionID: sessionValidation.user.connectionID,
            departmentId: sessionValidation.user.department.code,
            departmentName: sessionValidation.user.department.name,
          },
        };

        task.data.activity.push(activityEntry);

        // Remove the comment
        task.data.comments = task.data.comments.filter(
          (comment) => comment.id !== commentId
        );
        //update unarchive that task when new or any user comment in that 
        for (const key in task.perUserBoardMap) {
          // console.log('updating archive',key)
          task.perUserBoardMap[key].archive = false;
      }
      task.markModified("perUserBoardMap");

        task.markModified("data");
        await task.save();
      }
       // -------------------------------------
      if (data.type === "editTask") {

        const isTagged = task.tag.find(
          (code) => code === sessionValidation.user.employeeCode
        );

        if (isTagged) {
          return NextResponse.json(
            {
              status: "fail",
              message: "Followers can't edit task they only able to comment",
            },
            { status: StatusCodes.UNAUTHORIZED }
          );
        }

        const activityEntry = {
          action: "edit-task",
          id: Date.now(),
          source:'task',
          subType:'',
          time: new Date().toISOString(),
          content: {
            taskId: task.taskId,
            oldText: {
            },
            newText: {
            },
          },
          by: {
            name: sessionValidation.user.name,
            employeeCode: sessionValidation.user.employeeCode,
            connectionID: sessionValidation.user.connectionID,
            departmentId: sessionValidation.user.department.code,
            departmentName: sessionValidation.user.department.name,
          },
        };


        //update task
        if (data.data.name !== undefined) {

          // update activity
          activityEntry.subType = 'name';
          activityEntry.content.oldText.name = task.name;
          activityEntry.content.newText.name = data.data.name;

          // update task
          task.name = data.data.name;
        } 
        if (data.data.description !== undefined) {
          activityEntry.subType = 'description';
        
          // Save old value before update
          activityEntry.content.oldText.description = task.description || "";
        
          // Save new value
          activityEntry.content.newText.description = data.data.description;
        
          // Update task.description
          task.description = data.data.description;
        }
        if (data.data.priority !== undefined) {


          if (
            sessionValidation.user.employeeCode !==
            task.createdByDepartment.employeeId
          ) {
            return NextResponse.json(
              {
                status: "fail",
                message: "Only Creator can change priority",
              },
              { status: StatusCodes.UNAUTHORIZED }
            );
          }
          activityEntry.subType = 'priority';
        
          // Save old value before update
          activityEntry.content.oldText.priority = task.priority || "";
        
          // Save new value
          activityEntry.content.newText.priority = data.data.priority;
        
          // Update task.priority
          task.priority = data.data.priority;
        }
        if (data.data.boardId !== undefined) {
          const board = project.boards.find(
            (board) => board.boardId === data.data.boardId
          );

          if (task.frequency === "one-time") {
            // Check if task has userMap override for this user
            const userBoardMapEntry =
              task.perUserBoardMap?.[sessionValidation.user.employeeCode];

            if (
              userBoardMapEntry &&
              userBoardMapEntry.completedAt !== null &&
              board.name !== "Verified"
            ) {
              return NextResponse.json(
                {
                  status: "fail",
                  message: "You can't move task once completed",
                },
                { status: StatusCodes.BAD_REQUEST }
              );
            }

            if (board.name === "Verified") {
              // could not verify if completed At is null
              if (userBoardMapEntry.completedAt === null) {
                return NextResponse.json(
                  {
                    status: "fail",
                    message: "Task can't be verified if completedAt is null! kindly complete the task first",
                  },
                  { status: StatusCodes.BAD_REQUEST }
                );
              }

              if (userBoardMapEntry.verifiedAt !== null) {
                return NextResponse.json(
                  {
                    status: "fail",
                    message: "Task already verified",
                  },
                  { status: StatusCodes.BAD_REQUEST }
                );
              }







              if (task.files.length < 1 && projectGroup.title !== "Personal") {
                return NextResponse.json(
                  {
                    status: "fail",
                    message:
                      "At least one file is required to move this task to verified",
                  },
                  { status: StatusCodes.UNAUTHORIZED }
                );
              }

              if (
                sessionValidation.user.employeeCode !==
                task.createdByDepartment.employeeId
              ) {
                return NextResponse.json(
                  {
                    status: "fail",
                    message: "Only Creator can move this task to verified",
                  },
                  { status: StatusCodes.UNAUTHORIZED }
                );
              }

              if (task.status !== "Completed") {
                task.completedAt = dayjs().toISOString();
              }

              task.verifiedAt = dayjs().toISOString();

              const assignToUser = task.assignedTo[0];

              //get verified board
              const verifiedBoard = project.boards.find(
                (board) => board.name === "Verified"
              );



              if(projectGroup.title !== "Personal"){
                
                const assignToUserBoard =
                  task.perUserBoardMap[assignToUser].boardName;
  
                task.perUserBoardMap[assignToUser] = {
                  ...task.perUserBoardMap[assignToUser],
                  boardId: verifiedBoard.boardId,
                  boardName: verifiedBoard.name,
                  completedAt:
                    assignToUserBoard !== "Verified" ||
                    assignToUserBoard !== "Completed"
                      ? dayjs().toISOString()
                      : assignToUserBoard.completedAt,
                  verifiedAt: dayjs().toISOString(),
                  updatedAt: dayjs().toISOString(),
                };
              }

              task.perUserBoardMap[sessionValidation.user.employeeCode] = {
                ...task.perUserBoardMap[sessionValidation.user.employeeCode],
                boardId: data.data.boardId,
                boardName: board.name,
                updatedAt: dayjs().toISOString(),
                completedAt:
                  task.perUserBoardMap[sessionValidation.user.employeeCode]
                    .completedAt === null
                    ? dayjs().toISOString()
                    : task.perUserBoardMap[sessionValidation.user.employeeCode]
                        .completedAt,
                verifiedAt: dayjs().toISOString(),
              };
            }

            if (board.name === "Completed") {
              task.completedAt = dayjs().toISOString();

                 //creator cannot complete task
                 if( sessionValidation.user.employeeCode ===
                  task.createdByDepartment.employeeId && projectGroup.title !== "Personal") {
                    return NextResponse.json(
                      {
                        status: "fail",
                        message:
                          "Creator cannot complete task!only assignee can complete task",
                      },
                      { status: StatusCodes.UNAUTHORIZED }
                    );
                  }

              //check if task has any file
              if (task.files.length < 1 && projectGroup.title !== "Personal") {
                return NextResponse.json(
                  {
                    status: "fail",
                    message:
                      "At least one file is required to move this task to verified",
                  },
                  { status: StatusCodes.UNAUTHORIZED }
                );
              }

           

              const forwardedUser = task.forwardTo.find(
                (forwardTo) =>
                  forwardTo.by.employeeCode ===
                  sessionValidation.user.employeeCode
              );

              // also update board map to verified for that user
              if (forwardedUser) {
                //get verified board
                const verifiedBoard = project.boards.find(
                  (board) => board.name === "Verified"
                );
                const forwardedUserBoard =
                  task.perUserBoardMap[forwardedUser.to.employeeCode].boardName;

                task.perUserBoardMap[forwardedUser.to.employeeCode] = {
                  ...task.perUserBoardMap[forwardedUser.to.employeeCode],
                  boardId: verifiedBoard.boardId,
                  boardName: verifiedBoard.name,
                  completedAt:
                    forwardedUserBoard !== "Verified" ||
                    forwardedUserBoard !== "Completed"
                      ? dayjs().toISOString()
                      : forwardedUserBoard.completedAt,
                  verifiedAt: dayjs().toISOString(),
                  updatedAt: dayjs().toISOString(),
                };

                task.perUserBoardMap[sessionValidation.user.employeeCode] = {
                  ...task.perUserBoardMap[sessionValidation.user.employeeCode],
                  boardId: data.data.boardId,
                  boardName: board.name,
                  updatedAt: dayjs().toISOString(),
                  completedAt: dayjs().toISOString(),
                };
              } else {
                task.perUserBoardMap[sessionValidation.user.employeeCode] = {
                  ...task.perUserBoardMap[sessionValidation.user.employeeCode],
                  boardId: data.data.boardId,
                  boardName: board.name,
                  completedAt: dayjs().toISOString(),
                  updatedAt: dayjs().toISOString(),
                };
              }
            }

            if (board.name !== "Completed" && board.name !== "Verified") {
              if (userBoardMapEntry && userBoardMapEntry.boardId) {
                // Set user-specific board view, not global
                task.perUserBoardMap[sessionValidation.user.employeeCode] = {
                  ...userBoardMapEntry,
                  boardId: data.data.boardId,
                  boardName: board.name,
                  updatedAt: dayjs().toISOString(),
                };
              }
            }

            // also update board for creator because creator will not perform task he is a creator
            const assignToUser = task.assignedTo.some(
              (emp) => emp === sessionValidation.user.employeeCode
            );

            if (assignToUser) {
              // also update boardId for creator
              const creatorBoardMapEntry =
                task.perUserBoardMap?.[task.createdByDepartment.employeeId];

              if (creatorBoardMapEntry && creatorBoardMapEntry.boardId) {
                // Set user-specific board view, not global
                task.perUserBoardMap[task.createdByDepartment.employeeId] = {
                  ...creatorBoardMapEntry,
                  boardId: data.data.boardId,
                  boardName: board.name,
                  completedAt:
                    board.name === "Completed"
                      ? dayjs().toISOString()
                      : creatorBoardMapEntry.completedAt,
                  updatedAt: dayjs().toISOString(),
                };
              }
            }
          } else {
            const taskType = task.frequency;
            const history = task.frequencyHistory[taskType]?.history || [];
            const latestHistory = history[history.length - 1];
            // console.log("calling task projects", taskType, latestHistory);
            const now = dayjs();

            if (
              sessionValidation.user.employeeCode ===
              task.createdByDepartment.employeeId
            ) {
              return NextResponse.json(
                {
                  status: "fail",
                  message: "creator cannot perform this action for recurring tasks",
                },
                { status: StatusCodes.UNAUTHORIZED }
              );
            }


            if (!latestHistory) {
              console.log("calling add frequency first time");
              // Add new history
              task.frequencyHistory[taskType].history.push({
                date: now.toISOString(),
                boardId: data.data.boardId,
                boardName: board.name,
                start: now
                  .startOf(taskType === "weekly" ? "isoWeek" : taskType)
                  .toISOString(),
                end: now
                  .endOf(taskType === "weekly" ? "isoWeek" : taskType)
                  .toISOString(),
                completedAt: now.toISOString(),
                verifiedAt: now.toISOString(),
              });
            } else {
                // Frequency matching logic
            const frequencyMap = {
              daily: now.isSame(latestHistory?.date, "day"),
              weekly: now.isSame(latestHistory?.date, "isoWeek"),
              monthly: now.isSame(latestHistory?.date, "month"),
              yearly: now.isSame(latestHistory?.date, "year"),
            };
            console.log("frequencyMap", frequencyMap);
            const isSamePeriod = frequencyMap[taskType] ?? false;
            console.log("isSamePeriod", isSamePeriod);

            if (!isSamePeriod) {
              const newHistoryEntry = {
                date: now.toISOString(),
                boardId: data.data.boardId,
                boardName: board.name,
                start: now
                  .startOf(taskType === "weekly" ? "isoWeek" : taskType)
                  .toISOString(),
                end: now
                  .endOf(taskType === "weekly" ? "isoWeek" : taskType)
                  .toISOString(),
                completedAt: null,
                verifiedAt: null,
              };
              
              if (board.name === "Completed") {
                newHistoryEntry.completedAt = now.toISOString();
              }
              
              if (board.name === "Verified") {
                if (!newHistoryEntry.completedAt) {
                  newHistoryEntry.completedAt = now.toISOString();
                }
                newHistoryEntry.verifiedAt = now.toISOString();
              }
              
              task.frequencyHistory[taskType].history.push(newHistoryEntry);
            } else {
              console.log("calling update frequency");
              // Update existing latest history
              const updatedHistory = {
                ...latestHistory,
                boardId: data.data.boardId,
                boardName: board.name,
              };

              // Conditionally update completedAt and verifiedAt
              if (board.name === "Completed") {
                updatedHistory.completedAt = now.toISOString();
              }
              
              if (board.name === "Verified") {
                if (!updatedHistory.completedAt) {
                  updatedHistory.completedAt = now.toISOString();
                }
                updatedHistory.verifiedAt = now.toISOString();
              }

              if (board.name !== "Verified" && board.name !== "Completed") {
                updatedHistory.completedAt = null;
                updatedHistory.verifiedAt = null;
              }

              // Update existing latest history
              task.frequencyHistory[taskType].history[history.length - 1] =
                updatedHistory;
            }
        }

          
            task.markModified("frequencyHistory");
          }

          task.markModified("perUserBoardMap");
        }
        if (data.data.dueDate !== undefined) {
          if (task.frequency !== "one-time") {
            return NextResponse.json(
              {
                status: "fail",
                message: "You Cannot update due date of recurring task",
              },
              { status: StatusCodes.UNAUTHORIZED }
            );
          }

          if (
            task.dueDate !== null &&
            sessionValidation.user.employeeCode !==
              task.createdByDepartment.employeeId
          ) {
            return NextResponse.json(
              {
                status: "fail",
                message: "Only Creator can update due date",
              },
              { status: StatusCodes.UNAUTHORIZED }
            );
          }
          if (task.dueDate !== null && task.completedAt !== null) {
            return NextResponse.json(
              {
                status: "fail",
                message: "Once task is completed, due date cannot be updated",
              },
              { status: StatusCodes.UNAUTHORIZED }
            );
          }
          task.dueDate = data.data.dueDate;
        }
        if (data.data.forwardTo !== undefined) {

          console.log("calling forward to", data.data.forwardTo);
          if (task.assignedTo.length < 1) {
            return NextResponse.json(
              {
                status: "fail",
                message: "You Cannot Forward personal task",
              },
              { status: StatusCodes.UNAUTHORIZED }
            );
          }

          if (task.frequency !== "one-time") {
            return NextResponse.json(
              {
                status: "fail",
                message: "You Cannot Forward recurring task",
              },
              { status: StatusCodes.UNAUTHORIZED }
            );
          }

          const isCreator =
            sessionValidation.user.employeeCode ===
            task.createdByDepartment.employeeId;
          if (isCreator) {
            return NextResponse.json(
              {
                status: "fail",
                message:
                  "Creator cannot forward this task! Assignee can forward this task.",
              },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          const isSelfForward =
            data.data.forwardTo.employeeCode === task.assignedTo[0];
          if (isSelfForward) {
            return NextResponse.json(
              {
                status: "fail",
                message: "Cannot forward to assigned employee",
              },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          const isAlreadyForward = task.forwardTo.find(
            (forwardTo) =>
              forwardTo.by.employeeCode === sessionValidation.user.employeeCode
          );
          if (isAlreadyForward) {
            return NextResponse.json(
              {
                status: "fail",
                message: "You have already forwarded this task",
              },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          if (task.forwardTo.length === 3) {
            return NextResponse.json(
              { status: "fail", message: "Forward to limit reached" },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          // find if that employee already in forwardTo Array
          const isForwardToExist = task.forwardTo.find(
            (forwardTo) =>
              forwardTo.to.employeeCode === data.data.forwardTo.employeeCode
          );
          if (isForwardToExist) {
            return NextResponse.json(
              { status: "fail", message: "Employee already in forwardTo" },
              { status: StatusCodes.BAD_REQUEST }
            );
          }
          if (
            task.assignedTo.some(
              (emp) => emp === data.data.forwardTo.employeeCode
            )
          ) {
            return NextResponse.json(
              {
                status: "fail",
                message: "Cannot forward to assigned employee",
              },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          if (
            data.data.forwardTo.employeeCode ===
            task.createdByDepartment.employeeId
          ) {
            return NextResponse.json(
              { status: "fail", message: "Cannot forward to creator" },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          // console.log("forwardTo", data.data.forwardTo);
          const forwardData = {
            to: data.data.forwardTo,
            by: {
              name: sessionValidation.user.name,
              employeeCode: sessionValidation.user.employeeCode,
              connectionID: sessionValidation.user.connectionID,
              departmentId: sessionValidation.user.department.code,
              departmentName: sessionValidation.user.department.name,
            },
            status: "",
            completedAt: null,
            verifiedAt: null,
          };

          task.forwardTo.push(forwardData);

          // Ensure the forwarduser is also included
          const forwardUserCode = data.data.forwardTo.employeeCode;

          if (!task.perUserBoardMap[forwardUserCode]) {
            task.perUserBoardMap[forwardUserCode] = {
              boardId: project.boards.find((board) => board.order === 1)
                .boardId,
              boardName: project.boards.find((board) => board.order === 1).name,
              priority: data.priority || "medium",
              hidden: false,
              data:{
                base:''
              },
              archive: false,
              reminders: [],
              completedAt: null,
              verifiedAt: null,
              updatedAt: new Date().toISOString(),
            };
          }
          task.markModified("perUserBoardMap");
        }
         if (data.data.assignedTo !== undefined) {
          const isCreator =
            sessionValidation.user.employeeCode ===
            task.createdByDepartment.employeeId;
          if (!isCreator) {
            return NextResponse.json(
              {
                status: "fail",
                message: "Only creator can edit assignee.",
              },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          const isAlreadyForward = task.forwardTo.find(
            (forwardTo) =>
              forwardTo.by.employeeCode === sessionValidation.user.employeeCode
          );
          if (isAlreadyForward) {
            return NextResponse.json(
              {
                status: "fail",
                message:
                  "You Cannot Change Assignee once task is forwarded to other employee",
              },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          if (
            data.data.assignedTo.employeeCode ===
            task.createdByDepartment.employeeId
          ) {
            return NextResponse.json(
              { status: "fail", message: "Cannot change assignee to creator" },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          const oldEmployeeCode = task.assignedTo[0]; // or wherever the old code comes from
          const newEmployeeCode = data.data.assignedTo.employeeCode;

          // If there's an existing entry for the old employee
          if (task.perUserBoardMap[oldEmployeeCode]) {
            // Clone the existing data
            const oldData = { ...task.perUserBoardMap[oldEmployeeCode] };

            // Update with new values
            task.perUserBoardMap[newEmployeeCode] = {
              ...oldData,
              reminders: [],
            };

            // Optional: remove the old key if not needed
            delete task.perUserBoardMap[oldEmployeeCode];
          }

          task.assignedTo = [data.data.assignedTo.employeeCode];

          task.markModified("assignedTo");
          task.markModified("perUserBoardMap");
        }
        if (data.data.frequency !== undefined) {
          if (
            sessionValidation.user.employeeCode !==
            task.createdByDepartment.employeeId
          ) {
            return NextResponse.json(
              {
                status: "fail",
                message: "Only Creator can change frequency",
              },
              { status: StatusCodes.UNAUTHORIZED }
            );
          }
          if (data.data.frequency !== "one-time") {
            
            task.frequency = data.data.frequency;
            task.dueDate = null;
            task.completedAt = null;
            task.verifiedAt = null;

            // remove all forward user from perUserBoardMap
            task.forwardTo.forEach((forwardTo) => {
              delete task.perUserBoardMap[forwardTo.to.employeeCode];
            });

            task.forwardTo = [];
            task.tag = [];
          } else {
            task.frequency = data.data.frequency;
          }
        }
        if (data.data.delete !== undefined) {
          const isForward = task.forwardTo.find(
            (forwardTo) =>
              forwardTo.by.employeeCode === sessionValidation.user.employeeCode
          );
          if (isForward) {
            return NextResponse.json(
              {
                status: "fail",
                message: "You can't delete this task! It is forwarded by you",
              },
              { status: StatusCodes.BAD_REQUEST }
            );
          }
          // once verified or completed it not deleted and only creator can delete task
          const isCreator =
            sessionValidation.user.employeeCode ===
            task.createdByDepartment.employeeId;

          if (!isCreator) {
            return NextResponse.json(
              {
                status: "fail",
                message:
                  "You can't delete this task! It is not originated by you",
              },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          const usersNotInTodo = Object.entries(task.perUserBoardMap)
            .filter(([user, data]) => data.boardName !== "To-do")
            .map(([user]) => user);

          console.log("userNotinTodo", usersNotInTodo);

          if (usersNotInTodo.length > 0) {
            return NextResponse.json(
              {
                status: "fail",
                message: `You can't delete this task! someone has moved it to another board ${usersNotInTodo.join(
                  ", "
                )}`,
              },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          const deleteTask = await Task.findByIdAndDelete(data.task._id);
          if (!deleteTask) {
            return NextResponse.json(
              { status: "fail", message: "Task not found" },
              { status: StatusCodes.BAD_REQUEST }
            );
          }
          return NextResponse.json({
            status: "success",
            message: "return successfully",
          });
        }
        if (data.data.hidden !== undefined) {
           // Check if task has userMap override for this user
        const userBoardMapEntry =
        task.perUserBoardMap?.[sessionValidation.user.employeeCode];

      if (!userBoardMapEntry) {
        return NextResponse.json(
          { status: "fail", message: "UserMap entry not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      userBoardMapEntry.hidden = !userBoardMapEntry.hidden;
      task.markModified("perUserBoardMap");
       
        }
        if (data.data.tag !== undefined) {
       
          // step1: check if task is recurring then do not allow to add follower
          if (task.frequency !== "one-time") {
            return NextResponse.json(
              {
                status: "fail",
                message: "You Cannot add follower to recurring task",
              },
              { status: StatusCodes.UNAUTHORIZED }
            );
          }


          // step2: check if employee is already tagged then do not allow to add follower
          const isAlreadyTagged = task.tag.find(
            (code) => code === data.data.tag.employeeCode
          );

          if (isAlreadyTagged) {
            return NextResponse.json(
              {
                status: "fail",
                message: "Employee already tagged to this task",
              },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          // step3: check if employee is already in forward list then do not allow to add follower
          const isInForwardList = task.forwardTo.find(
            (forwardTo) =>
              forwardTo.to.employeeCode === data.data.tag.employeeCode
          );

          // step4: check if employee is creator or assignee then do not allow to add follower
          const isCreator = data.data.tag.employeeCode === task.createdByDepartment.employeeId;
          const isAssignee = task.assignedTo.some(
            (emp) => emp === data.data.tag.employeeCode
          );

          if (isInForwardList || isCreator || isAssignee) {
            return NextResponse.json(
              { status: "fail", message: "Employee already have access to this task" },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          task.tag.push(data.data.tag.employeeCode);
          task.markModified("tag");
        }
        if (data.data.deleteFollower !== undefined) {

          console.log('delete follower')
    
      

          // find memeber and update tag array
          const member = task.tag.find(
            (employeeCode) =>
              employeeCode=== data.data.member.employeeCode
          );
          if (member) {
            task.tag = task.tag.filter(
              (employeeCode) => employeeCode !== data.data.member.employeeCode
            );
          }

          task.markModified("tag");
        }
        //add members in project not in task  this properties related to project not task ------------------------------------------------
        if (data.data.members !== undefined) {
       

          // find if that employee already in forwardTo Array
          const isForwardToExist = project.members.find(
            (member) =>
              member.employeeCode === data.data.members.employeeCode
          );
          if (isForwardToExist) {
            return NextResponse.json(
              { status: "fail", message: "Employee already a member" },
              { status: StatusCodes.BAD_REQUEST }
            );
          }
      

          if (
            data.data.members.employeeCode ===
            task.createdByDepartment.employeeId
          ) {
            return NextResponse.json(
              { status: "fail", message: "Employee already a member" },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          project.members.push(data.data.members);
          project.markModified("members");
        }
        if (data.data.role !== undefined) {
    
      
          if (
            sessionValidation.user.employeeCode !==
            task.createdByDepartment.employeeId
          ) {
            return NextResponse.json(
              { status: "fail", message: "Only creator can update role" },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          // find memeber and update role
          const member = project.members.find(
            (member) =>
              member.employeeCode === data.data.member.employeeCode
          );
          if (member) {
            member.role = data.data.role;
          }

          project.markModified("members");
        }
        if (data.data.deleteMember !== undefined) {
        
    
      
          if (
            sessionValidation.user.employeeCode !==
            task.createdByDepartment.employeeId
          ) {
            return NextResponse.json(
              { status: "fail", message: "Only creator can remove member" },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          // find memeber and update role
          const member = project.members.find(
            (member) =>
              member.employeeCode === data.data.member.employeeCode
          );
          if (member) {
            project.members = project.members.filter(
              (member) => member.employeeCode !== data.data.member.employeeCode
            );
          }

          project.markModified("members");
        }

        task.data.activity.push(activityEntry);
        task.markModified("data");
       

        await task.save();
        await project.save();
      }
      if (data.type === "remove-attachment") {
 
              // Check if task has userMap override for this user
              const userBoardMapEntry =
              task.perUserBoardMap?.[sessionValidation.user.employeeCode];

            if (
              userBoardMapEntry &&
              userBoardMapEntry.completedAt !== null
            ) {
              return NextResponse.json(
                {
                  status: "fail",
                  message: "You can't remove attachments once task completed",
                },
                { status: StatusCodes.BAD_REQUEST }
              );
            }

        const attachmentId = data.attachmentId;

        // Find the comment once
        const attachmentToRemove = task.files.find(
          (file) => file.id === attachmentId
        );

        if (!attachmentToRemove) {
          throw new Error("Attachment not found");
        }
        console.log("deleting file", attachmentToRemove);

        attachmentToRemove.status = "deleted";

        // // //add activity
        const activityEntry = {
          action: data.type,
          id: Date.now(),
          time: new Date().toISOString(),
          content: {
            attachment: attachmentToRemove,
          },
          by: {
            name: sessionValidation.user.name,
            employeeCode: sessionValidation.user.employeeCode,
            connectionID: sessionValidation.user.connectionID,
            departmentId: sessionValidation.user.department.code,
            departmentName: sessionValidation.user.department.name,
          },
        };

        task.data.activity.push(activityEntry);
        task.markModified("files");
        task.markModified("data");
        await task.save();
      }
      if (data.type === "remove-forwarded-person") {
        console.log("calling remove forwarded person", data);

        const { employeeCode } = data;
        const forwardList = task.forwardTo;

        if (!Array.isArray(forwardList) || forwardList.length === 0) {
          return NextResponse.json(
            { status: "fail", message: "No forwarded persons found" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        const forwardedPersonToRemove = forwardList.find(
          (fp) => fp.to.employeeCode === employeeCode
        );

        if (!forwardedPersonToRemove) {
          throw new Error("Forwarded person not found");
        }

        const latestForwardedPerson = forwardList[forwardList.length - 1];
        const isLatest =
          forwardedPersonToRemove.to.employeeCode ===
          latestForwardedPerson.to.employeeCode;

        if (!isLatest) {
          return NextResponse.json(
            { status: "fail", message: "First remove latest forwarded person" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        // Only the person who forwarded the task can remove their own forwarding
        if (
          forwardedPersonToRemove.by.employeeCode !==
          sessionValidation.user.employeeCode
        ) {
          return NextResponse.json(
            {
              status: "fail",
              message: "You are not authorized to remove this forwarded person",
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        // Remove the forwarded person
        task.forwardTo = forwardList.filter(
          (fp) => fp.to.employeeCode !== employeeCode
        );

        // Add activity log
        const activityEntry = {
          action: data.type,
          id: Date.now(),
          time: new Date().toISOString(),
          content: {
            forwardedPerson: forwardedPersonToRemove,
          },
          by: {
            name: sessionValidation.user.name,
            employeeCode: sessionValidation.user.employeeCode,
            connectionID: sessionValidation.user.connectionID,
            departmentId: sessionValidation.user.department.code,
            departmentName: sessionValidation.user.department.name,
          },
        };

        task.data.activity.push(activityEntry);

        // also remove user from perUserBoardMap
        delete task.perUserBoardMap[employeeCode];
        task.markModified("perUserBoardMap");
        task.markModified("data");
        await task.save();
      }
      if (data.type === "archive-Unarchive-Task") {
        console.log("calling archive unarchive", data);

        // Check if task has userMap override for this user
        const userBoardMapEntry =
          task.perUserBoardMap?.[sessionValidation.user.employeeCode];

        if (!userBoardMapEntry) {
          return NextResponse.json(
            { status: "fail", message: "UserMap entry not found" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        userBoardMapEntry.archive = !userBoardMapEntry.archive;
        task.markModified("perUserBoardMap");
        await task.save();
      }
      if (data.type === "set-reminder") {
        const reminderFor = data?.reminder?.for;

        if (!reminderFor) {
          return NextResponse.json(
            { status: "fail", message: "Reminder 'for' field is required" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        const createReminderObject = () => ({
          dateTime: data?.reminder?.dateTime,
          for: data?.reminder?.for,
          on: data?.reminder?.on,
          id: Date.now(),
          by: {
            name: sessionValidation.user.name,
            employeeCode: sessionValidation.user.employeeCode,
            connectionID: sessionValidation.user.connectionID,
            departmentId: sessionValidation.user.department.code,
            departmentName: sessionValidation.user.department.name,
          },
        });

        const addReminderToUser = (userBoardMapEntry, reminderObject) => {
          if (!userBoardMapEntry.reminders) {
            userBoardMapEntry.reminders = [];
          }

          userBoardMapEntry.reminders.push(reminderObject);
        };

        try {
          if (reminderFor === "assignee") {
            if (!task.assignedTo || task.assignedTo.length === 0) {
              return NextResponse.json(
                { status: "fail", message: "No assignee found for this task" },
                { status: StatusCodes.BAD_REQUEST }
              );
            }

            const assignToUser = task.assignedTo[0];
            const userBoardMapEntry = task.perUserBoardMap?.[assignToUser];

            if (!userBoardMapEntry) {
              return NextResponse.json(
                {
                  status: "fail",
                  message: "UserMap entry not found for assignee",
                },
                { status: StatusCodes.BAD_REQUEST }
              );
            }

            if (userBoardMapEntry.reminders.length > 0) {
              return NextResponse.json(
                { status: "fail", message: "Only one reminder allowed" },
                { status: StatusCodes.BAD_REQUEST }
              );
            }

            const reminderObject = createReminderObject();
            addReminderToUser(userBoardMapEntry, reminderObject);

            task.markModified("perUserBoardMap");
            await task.save();
          } else if (reminderFor === "only_me") {
            console.log("only_me", sessionValidation.user.employeeCode);
            const userBoardMapEntry =
              task.perUserBoardMap?.[sessionValidation.user.employeeCode];
            console.log("userBoardMapEntry", task);

            if (!userBoardMapEntry) {
              return NextResponse.json(
                {
                  status: "fail",
                  message: "UserMap entry not found for current user",
                },
                { status: StatusCodes.BAD_REQUEST }
              );
            }

            if (userBoardMapEntry.reminders.length > 0) {
              return NextResponse.json(
                { status: "fail", message: "Only one reminder allowed" },
                { status: StatusCodes.BAD_REQUEST }
              );
            }

            const reminderObject = createReminderObject();
            addReminderToUser(userBoardMapEntry, reminderObject);

            task.markModified("perUserBoardMap");
            await task.save();
          } else if (reminderFor === "all") {
            const userBoardMap = task.perUserBoardMap;

            if (!userBoardMap) {
              return NextResponse.json(
                { status: "fail", message: "No user board map found" },
                { status: StatusCodes.BAD_REQUEST }
              );
            }

            const reminderObject = createReminderObject();

            // Add reminder to all users
            for (const key in userBoardMap) {
              if (Object.hasOwnProperty.call(userBoardMap, key)) {
                if (userBoardMap[key].reminders.length > 0) {
                  return NextResponse.json(
                    { status: "fail", message: "Only one reminder allowed" },
                    { status: StatusCodes.BAD_REQUEST }
                  );
                }
                addReminderToUser(userBoardMap[key], reminderObject);
              }
            }

            task.markModified("perUserBoardMap");
            await task.save();
          } else {
            return NextResponse.json(
              { status: "fail", message: "Invalid reminder type" },
              { status: StatusCodes.BAD_REQUEST }
            );
          }
        } catch (error) {
          console.error("Error handling reminder:", error);
          return NextResponse.json(
            { status: "fail", message: "Failed to set reminder" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
          );
        }
      }
      if (data.type === "remove-reminder") {
        try {
          const userBoardMap = task.perUserBoardMap;

          if (!userBoardMap) {
            return NextResponse.json(
              { status: "fail", message: "No user board map found" },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          let reminderRemoved = false;

          // Remove reminders from all users
          for (const key in userBoardMap) {
            if (Object.hasOwnProperty.call(userBoardMap, key)) {
              if (
                userBoardMap[key].reminders &&
                userBoardMap[key].reminders.length > 0
              ) {
                userBoardMap[key].reminders = [];
                reminderRemoved = true;
              }
            }
          }

          if (!reminderRemoved) {
            return NextResponse.json(
              { status: "fail", message: "No reminder found to remove" },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          task.markModified("perUserBoardMap");
          await task.save();

          return NextResponse.json(
            { status: "success", message: "Reminder removed successfully" },
            { status: StatusCodes.OK }
          );
        } catch (error) {
          console.error("Error removing reminder:", error);
          return NextResponse.json(
            { status: "fail", message: "Failed to remove reminder" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
          );
        }
      }
      if (data.type === "set-target") {
        try {
          console.log("data", data);
          const targetValue = data?.target?.value;
          const targetUnit = data?.target?.unit;
          const targetType = data?.target?.type;

          if (!targetValue || !targetUnit || !targetType) {
            return NextResponse.json(
              { status: "fail", message: "Target value and unit are required" },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          if (targetType === "target") {
            task.data.target = {
              value: targetValue,
              unit: targetUnit,
            };
            task.data.target.targetAchive = {
              value: 0,
            };
          } else if (targetType === "achive") {
            task.data.target.targetAchive = {
              value: targetValue,
              // unit: targetUnit,
            };
          }

          task.markModified("data.target");
          await task.save();
        } catch (error) {
          console.error("Error handling target:", error);
          return NextResponse.json(
            { status: "fail", message: "Failed to set target" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
          );
        }
      }

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: task,
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }

  if (reqBody.route === "swapTask") {
    try {
      const { activeTaskId, activeBoardId, overBoardId, projectId } =
        reqBody.data;

      //find task by id
      const task = await Task.findOne({ taskId: activeTaskId });
      // console.log(task)
      if (!task) {
        return NextResponse.json(
          { status: "fail", message: "Task not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // find project by id
      const project = await TaskProject.findById(projectId);
      if (!project) {
        return NextResponse.json(
          { status: "fail", message: "Project not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      // find over board from project
      const overBoard = project.boards.find(
        (board) => board.boardId === overBoardId
      );
      if (!overBoard) {
        return NextResponse.json(
          { status: "fail", message: "Over board not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // update perUserBoardMap for the current user
      const employeeCode = sessionValidation.user.employeeCode;

      if (!task.perUserBoardMap) task.perUserBoardMap = {};

      task.perUserBoardMap[employeeCode] = {
        ...(task.perUserBoardMap[employeeCode] || {}),
        boardId: overBoardId,
        updatedAt: new Date().toISOString(),
      };

      //update boardId of task with over Id
      // optionally update the global boardId (for fallback/default)
      task.boardId = overBoardId;
      task.status = overBoard.name;
      task.markModified("perUserBoardMap");
      await task.save();

      return NextResponse.json({
        status: "success",
        message: "return successfully",
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }

  if (reqBody.route === "getDepartmentEmployees") {
    try {
      //step 1: fetch all departments
      const departments = await Department.find({});
      const users = await User.find({});

      const deptWithEmployees = departments.map((dept) => {
        const allEmployees = dept.teams
          .flatMap((team) => team.attachedEmployees || [])
          .filter((emp) => {
            const alreadyExists = users.some(
              (user) => user.email === emp.email
            );
            return !alreadyExists && emp.status === "active";
          });

        return {
          departmentId: dept._id,
          departmentName: dept.name,
          employees: allEmployees,
        };
      });

      const employees = deptWithEmployees
        .flatMap((dept) =>
          dept.employees.map((emp) => ({
            name: emp.name,
            employeeCode: emp.employeeCode,
            connectionID: emp.connectionID,
            status: emp.status,
            departmentId: dept.departmentId.toString(),
            departmentName: dept.departmentName,
          }))
        )
        .filter((emp) => emp.status === "active");

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: employees,
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }

  if (reqBody.route === "getEmployeeAndProjects") {
    try {
      //step 1: fetch all departments
      const departments = await Department.find({});

      const deptWithEmployees = departments.map((dept) => {
        const allEmployees = dept.teams.flatMap(
          (team) => team.attachedEmployees || []
        );
        return {
          departmentId: dept._id,
          departmentName: dept.name,
          employees: allEmployees,
        };
      });

      const employees = deptWithEmployees
        .flatMap((dept) =>
          dept.employees.map((emp) => ({
            name: emp.name,
            employeeCode: emp.employeeCode,
            connectionID: emp.connectionID,
            status: emp.status,
            departmentId: dept.departmentId.toString(),
            departmentName: dept.departmentName,
          }))
        )
        .filter((emp) => emp.status === "active");

      // step 2: fetch all projects

      const projects = await TaskProject.find()
        .select("title folderId createdAt code boards") // space-separated field names
        .sort({ createdAt: -1 });

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: { employees, projects },
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }

  if (reqBody.route === "createBoard") {
    try {
      const { name, status, color, projectId } = reqBody.data;

      // Validate required fields
      if (!name || !status || !color || !projectId) {
        return NextResponse.json(
          { status: "fail", message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const project = await TaskProject.findById(projectId);
      if (!project) {
        return NextResponse.json(
          { status: "fail", message: "Project not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      console.log("project", project);

      // add board in boards array
      project.boards.push({
        name,
        boardId: generatCode(4, 3),
        order: project.boards.length + 1,
        color,
        data: {
          base: "",
        },
      });

      project.markModified("boards");
      await project.save();

      return NextResponse.json({
        status: "success",
        message: "return successfully",
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }
  if (reqBody.route === "updateSprint") {
    try {
      const { data } = reqBody;

      // find project by id
      const project = await TaskProject.findById(data.sprint);
      if (!project) {
        return NextResponse.json(
          { status: "fail", message: "Project not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      if (data.type === "delete") {
        // only creator can update sprint
        const isCreator =
          sessionValidation.user.employeeCode ===
          project.createdByDepartment.employeeId;
        if (!isCreator) {
          return NextResponse.json(
            {
              status: "fail",
              message:
                "You can't update this sprint! It is not originated by you",
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
        // delete project and all its connected tasks each task has projectId
        const deleteProject = await TaskProject.findByIdAndDelete(data.sprint);
        if (!deleteProject) {
          return NextResponse.json(
            { status: "fail", message: "Project not found" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        // delete all tasks connected to this project
        await Task.deleteMany({ projectId: data.sprint });
      }

      if (data.type === "updateColumn") {
        const payload = {
          user: sessionValidation.user.employeeCode,
          visibleColumns: data.data.visibleColumns,
        };

        console.log("project", payload);
        const existingEntryIndex = project.data.userColumns?.findIndex(
          (uc) => uc.user === sessionValidation.user.employeeCode
        );

        if (existingEntryIndex >= 0) {
          // Update existing
          project.data.userColumns[existingEntryIndex].visibleColumns =
            data.data.visibleColumns;
        } else {
          // Create new
          project.data.userColumns = project.data.userColumns || [];
          project.data.userColumns.push(payload);
        }
        project.markModified("data.userColumns");
        await project.save();
      }

      if (data.type === "groupBy") {
        const payload = {
          user: sessionValidation.user.employeeCode,
          groupBy: data.data.groupBy,
        };

        console.log("project", payload);
        const existingEntryIndex = project.data.userGroupBy?.findIndex(
          (uc) => uc.user === sessionValidation.user.employeeCode
        );

        if (existingEntryIndex >= 0) {
          // Update existing
          project.data.userGroupBy[existingEntryIndex].groupBy =
            data.data.groupBy;
        } else {
          // Create new
          project.data.userGroupBy = project.data.userGroupBy || [];
          project.data.userGroupBy.push(payload);
        }
        project.markModified("data.userGroupBy");
        await project.save();
      }

      if (data.type === "hiddenTasks") {
        const payload = {
          user: sessionValidation.user.employeeCode,
          hiddenTasks: data.data.hiddenTasks,
        };

        console.log("project", payload);
        const existingEntryIndex = project.data.hiddenTasks?.findIndex(
          (uc) => uc.user === sessionValidation.user.employeeCode
        );

        if (existingEntryIndex >= 0) {
          // Update existing
          project.data.hiddenTasks[existingEntryIndex].hiddenTasks =
            data.data.hiddenTasks;
        } else {
          // Create new
          project.data.hiddenTasks = project.data.hiddenTasks || [];
          project.data.hiddenTasks.push(payload);
        }
        project.markModified("data.hiddenTasks");
        await project.save();
      }

      if (data.type === "edit-sprint") {
        // only creator can update sprint
        const isCreator =
          sessionValidation.user.employeeCode ===
          project.createdByDepartment.employeeId;
        if (!isCreator) {
          return NextResponse.json(
            {
              status: "fail",
              message:
                "You can't update this sprint! It is not originated by you",
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
        if (data.data.name !== undefined) project.title = data.data.name;
        if (data.data.startDate !== undefined)
          project.startDate = data.data.startDate;
        if (data.data.endDate !== undefined)
          project.endDate = data.data.endDate;
        if (data.data.defaultView !== undefined)
          project.data.defaultView = data.data.defaultView;

        project.markModified("data");
        await project.save();
      }

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: project,
      });
    } catch (e) {
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  }
  // If no route is matched
  return NextResponse.json(
    {
      status: "fail",
      message: "Invalid route",
    },
    { status: StatusCodes.INTERNAL_SERVER_ERROR }
  );
}
