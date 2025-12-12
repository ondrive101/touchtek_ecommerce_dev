import React, { useState, useEffect, useMemo } from "react";
import {
  revalidateCurrentPath,
  deleteProject,
  createUpdateProject,
  createUpdateTodo,
  deleteTodo,
} from "@/action/task/controller";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import {
  Calendar as CalendarIcon,
  Check,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Star,
  Trash2,
  X,
  BarChart3,
  FolderPlus,
  Users,
  Briefcase,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
} from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";


const PersonalTodo = ({ session, projects, pathname }) => {
  // Active project state
  const [activeProject, setActiveProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showProjectShareModal, setShowProjectShareModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newMember, setNewMember] = useState("");

  // Project form data
  const [projectFormData, setProjectFormData] = useState({
    id: null,
    title: "",
    description: "",
    color: "#4f46e5",
    members: [],
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    dueDate: "",
    createdAt: "",
    isStarred: false,
    tags: [],
    sharedWith: [],
    projectId: null,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Filters and search
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");

  // Share functionality
  const [shareEmail, setShareEmail] = useState("");

  const getProjectColor = (projectId) => {
    const project = projects.find((p) => p._id === projectId);
    return project ? project.color : "#ccc";
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "default";
      default:
        return "default";
    }
  };

  const getContrastColor = (color) => {
    const rgb = color.replace("#", "");
    const r = parseInt(rgb.substring(0, 2), 16);
    const g = parseInt(rgb.substring(2, 4), 16);
    const b = parseInt(rgb.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#000000" : "#FFFFFF";
  };

  const getProjectTitle = (projectId) => {
    const project = projects.find((p) => p._id === projectId);
    return project ? project.title : "Unknown Project";
  };

  // Stats calculation - defined once using useMemo
  const stats = useMemo(() => {
    // Filter todos based on active project
    const activeFullProject = projects?.find(
      (project) => project._id === activeProject
    );

    const projectTodos = activeFullProject?.tasks?.filter((todo) => {
      // If we have projects but none selected, don't show any todos
      if (projects.length > 0 && activeProject === null) {
        return false;
      }
      // If a project is selected, show todos for that project
      else if (activeProject !== null) {
        return todo.projectId === activeProject;
      }
      // If no projects exist yet, don't show any todos
      else {
        return false;
      }
    }) || [];

    const total = projectTodos.length;
    const completed = projectTodos.filter(
      (todo) => todo.status === "completed"
    ).length;

  
    const pending = projectTodos.filter(
      (todo) => todo.status === "pending" || todo.status === "inProgress"
    ).length;

    const highPriority = projectTodos.filter(
      (todo) => todo.priority === "high"
    ).length;
 
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    // Project-specific stats
    const projectStats = {};
    if (activeProject) {
      const currentProject = projects.find((p) => p._id === activeProject);
      if (currentProject) {
        projectStats.title = currentProject.title;
        projectStats.color = currentProject.color;
        projectStats.memberCount = currentProject.members.length;
      }
    }

    return {
      total,
      completed,
      pending,
      highPriority,
      completionRate,
      projectStats,
    };
  }, [activeProject, projects]);

  // Pagination and filtering logic is handled with useMemo

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTagInput = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      const newTag = e.target.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag],
        });
      }
      e.target.value = "";
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleClose = () => {
    setShowModal(false);
    setShowEditModal(false);
    setEditMode(false);
    setFormData({
      id: null,
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      dueDate: "",
      createdAt: "",
      isStarred: false,
      tags: [],
      sharedWith: [],
      projectId: activeProject,
    });
    setLoading(false);
  };

  //************************************* */
  const handleAddProject = () => {
    setProjectFormData({
      id: null,
      title: "",
      description: "",
      color: "#4f46e5",
      members: [],
    });
    setShowProjectModal(true);
  };
  const handleSubmitProject = async () => {
    try {
      setLoading(true);

      // Validate form
      if (!projectFormData.title) {
        toast.error("Project title is required");
        setLoading(false);
        return;
      }
      let payload = {};
      if (projectFormData.id === null) {
        payload = {
          ...projectFormData,
          type: "create",
        };
      }
      if (projectFormData.id !== null) {
        payload = {
          ...projectFormData,
          type: "update",
        };
      }

      const response = await createUpdateProject(payload, session);

      if (response.status === "success") {
        toast.success("Project saved successfully", {
          autoClose: 1000,
        });
        await revalidateCurrentPath(pathname);
        setShowProjectModal(false);
        setLoading(false);
      }
      if (response.status === "fail" || response.status === "error") {
        toast.error(response.message, {
          autoClose: 1000,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.message, {
        autoClose: 1000,
      });
    }
  };
  const handleDeleteProject = async (projectId) => {
    try {
      setLoading(true);
      const response = await deleteProject(projectId, session);

      if (response.status === "success") {
        toast.success("Project deleted successfully", {
          autoClose: 1000,
        });
        await revalidateCurrentPath(pathname);

        // Reset active project if it was the deleted one
        if (activeProject === projectId) {
          setActiveProject(null);
        }
        setLoading(false);
      }
      if (response.status === "fail" || response.status === "error") {
        toast.error(response.message, {
          autoClose: 1000,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.message, {
        autoClose: 1000,
      });
    }
  };
  const handleEditProject = async (project) => {
    setProjectFormData({ ...project });
    setShowProjectModal(true);
  };
  const handleShareProject = (project) => {
    setSelectedProject(project);
    setShowProjectShareModal(true);
  };
  const handleAddMember = () => {
    if (!newMember || !selectedProject) return;

    if (selectedProject.members.includes(newMember)) {
      toast.error("This member is already added to the project");
      return;
    }

    const updatedProject = {
      ...selectedProject,
      members: [...selectedProject.members, newMember],
    };

    setSelectedProject(updatedProject);
    setNewMember("");
    toast.success(`${newMember} added to project`);
  };

  const handleRemoveMember = (memberEmail) => {
    if (!selectedProject) return;

    const updatedProject = {
      ...selectedProject,
      members: selectedProject.members.filter((m) => m !== memberEmail),
    };

    setSelectedProject(updatedProject);
    toast.success(`${memberEmail} removed from project`);
  };
  //************************************* */

  const handleAddTodo = () => {
    setEditMode(false);
    setFormData({
      id: null,
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      dueDate: "",
      createdAt: new Date().toISOString().split("T")[0],
      isStarred: false,
      tags: [],
      sharedWith: [],
      projectId: activeProject,
    });
    setShowEditModal(true);
  };
   const handleEditTodo = (todo) => {
    setEditMode(true);
    setFormData({ ...todo });
    setShowEditModal(true);
  };

  const handleDeleteTodo = async (id) => {
     try {
      setLoading(true);
   
      const response = await deleteTodo({id,projectId: activeProject}, session);

      if (response.status === "success") {
        toast.success("Todo deleted successfully", {
          autoClose: 1000,
        });
        await revalidateCurrentPath(pathname);
        setLoading(false);
      }
      if (response.status === "fail" || response.status === "error") {
        toast.error(response.message, {
          autoClose: 1000,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.message, {
        autoClose: 1000,
      });
    }
  };

  const handleUpdateTask = async (data) => {
 
    try {
      setLoading(true);
   
      const response = await createUpdateTodo(data, session);

      if (response.status === "success") {
        toast.success("Todo updated successfully", {
          autoClose: 1000,
        });
        await revalidateCurrentPath(pathname);
        setLoading(false);
      }
      if (response.status === "fail" || response.status === "error") {
        toast.error(response.message, {
          autoClose: 1000,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.message, {
        autoClose: 1000,
      });
    }
    
    
  };

  const handleShareTodo = (id) => {
    const activeFullProject = projects.find(
      (project) => project._id === activeProject
    );

    setFormData(activeFullProject?.tasks?.find((todo) => todo.id === id));
    setShowShareModal(true);
  };

  const handleSubmitShare = () => {
    if (!shareEmail) {
      toast.error("Please enter an email address");
      return;
    }

    toast.success(`Todo shared with ${shareEmail}`);
    setShareEmail("");
    setShowShareModal(false);
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Validate form
    if (!formData.title) {
      toast.error("Title is required");
      setLoading(false);
      return;
    }

    if (editMode) {
      toast.success("Todo updated successfully");
    } else {
      try {
        const payload = {
          ...formData,
          projectId: activeProject,
          type: "create",
        };

        setLoading(true);
        const response = await createUpdateTodo(payload, session);

        if (response.status === "success") {
          toast.success("Todo saved successfully", {
            autoClose: 1000,
          });
          await revalidateCurrentPath(pathname);
          setLoading(false);
          handleClose();
        }
        if (response.status === "fail" || response.status === "error") {
          toast.error(response.message, {
            autoClose: 1000,
          });
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error(error.message, {
          autoClose: 1000,
        });
      }
    }
  };

  const getDueDateColor = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);

    // Calculate days difference
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-600"; // Overdue
    if (diffDays <= 2) return "text-orange-600"; // Due soon
    return "text-green-600"; // Due later
  };

  // Filter and sort todos - defined once using useMemo
  const filteredTodos = useMemo(() => {
    const activeFullProject = projects.find(
      (project) => project._id === activeProject
    );

    console.log("activeFullProject", activeFullProject);
    return (activeFullProject?.tasks ?? [])
    .filter((todo) => {
      if (activeProject !== null && todo.projectId !== activeProject)
        return false;
      if (activeProject === null && todo.projectId !== null) return false;

      if (activeTab === "pending" && todo.status !== "pending")
        return false;
      if (activeTab === "completed" && todo.status !== "completed")
        return false;
      if (activeTab === "starred" && !todo.isStarred) return false;

      if (priorityFilter !== "all" && todo.priority !== priorityFilter)
        return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          todo.title.toLowerCase().includes(query) ||
          todo.description.toLowerCase().includes(query) ||
          todo.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        const dateA = a.dueDate ? new Date(a.dueDate) : null;
        const dateB = b.dueDate ? new Date(b.dueDate) : null;
        if (!dateA) return sortOrder === "asc" ? 1 : -1;
        if (!dateB) return sortOrder === "asc" ? -1 : 1;
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (sortBy === "priority") {
        const priorityValues = { low: 1, medium: 2, high: 3 };
        return sortOrder === "asc"
          ? priorityValues[a.priority] - priorityValues[b.priority]
          : priorityValues[b.priority] - priorityValues[a.priority];
      }

      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });
}, [
  activeProject,
  activeTab,
  priorityFilter,
  searchQuery,
  sortBy,
  sortOrder,
  projects, // add this if it’s external
]);;

  // Calculate pagination values using useMemo to avoid duplicate declarations
  const { totalPages, currentTodos } = useMemo(() => {
    const totalPages = Math.ceil(filteredTodos?.length / itemsPerPage);
    const currentTodos = filteredTodos?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    return { totalPages, currentTodos };
  }, [filteredTodos, currentPage, itemsPerPage]);

  return (
    <>
      {/* Main Todo Interface */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            // size="md"
            // color="secondary"
            variant="outline"
            className="rounded-lg"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
            Personal Task
          </Button>
        </DialogTrigger>
        <DialogContent size="5xl">
          <DialogHeader>
            <div className="flex items-center gap-3 p-2">
              <div className="h-12 w-12 rounded-sm border border-border grid place-content-center">
                <Icon
                  icon="heroicons:square-3-stack-3d"
                  className="w-5 h-5 text-default-500"
                />
              </div>
              <div>
                <div className="text-base font-semibold text-default-700  mb-1">
                  To do List
                </div>
                <p className="text-xs text-default-500 ">Task Details</p>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            {/* Project Selector */}
            <div className="mb-4 p-3 bg-muted/30 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Project</h3>
                </div>

                <div className="flex flex-1 sm:max-w-[300px] items-center gap-2">
                  {projects.length === 0 ? (
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        No projects yet
                      </span>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleAddProject}
                        className="shrink-0"
                      >
                        <FolderPlus className="h-4 w-4 mr-2" />
                        Create First Project
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Select
                        value={activeProject}
                        onValueChange={setActiveProject}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent className="z-[1000]">
                          {projects.map((project) => (
                            <SelectItem key={project._id} value={project._id}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: project.color }}
                                />
                                <span>{project.title}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleAddProject}
                        className="shrink-0"
                      >
                        <FolderPlus className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {activeProject && (
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    {projects.find((p) => p._id === activeProject) && (
                      <div className="flex flex-col">
                        <h3 className="font-medium">
                          {projects.find((p) => p._id === activeProject)?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {
                            projects.find((p) => p._id === activeProject)
                              ?.description
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleShareProject(
                          projects.find((p) => p._id === activeProject)
                        )
                      }
                      className="flex items-center gap-1"
                    >
                      <Users className="h-4 w-4" />
                      <span>Share</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleEditProject(
                          projects.find((p) => p._id === activeProject)
                        )
                      }
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProject(activeProject)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Header with Stats and Add Button */}

            {projects.length > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-bold">
                      {projects.length === 0
                        ? "Create Your First Project"
                        : activeProject
                        ? "Project Tasks"
                        : "Select a Project"}
                    </h2>
                    {projects.length > 0 && (
                      <Badge variant="outline" className="ml-2">
                        {stats.total} tasks
                      </Badge>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {projects.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowStatsModal(true)}
                        className="flex items-center gap-1"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>Stats</span>
                      </Button>
                    )}

                    <Button
                      onClick={handleAddTodo}
                      className="bg-primary hover:bg-primary/90"
                      disabled={
                        projects.length === 0 ||
                        (projects.length > 0 && activeProject === null)
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between bg-muted/40 p-3 rounded-lg">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tasks..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                    <Select
                      value={priorityFilter}
                      onValueChange={setPriorityFilter}
                    >
                      <SelectTrigger className="w-[130px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <span>Priority</span>
                      </SelectTrigger>
                      <SelectContent className="z-[1000]">
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[130px]">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        <span>Sort By</span>
                      </SelectTrigger>
                      <SelectContent className="z-[1000]">
                        <SelectItem value="dueDate">Due Date</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                      className="w-10 h-10"
                    >
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </Button>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs
                  defaultValue="all"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="starred">Starred</TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab} className="mt-0">
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Progress</span>
                        <span>{stats.completionRate}%</span>
                      </div>
                      <Progress value={stats.completionRate} className="h-2" />
                    </div>

                    {/* Todo Cards Grid */}
                    {currentTodos.length === 0 ? (
                      <div className="text-center py-10 border border-dashed rounded-lg">
                        <Icon
                          icon="heroicons:document-text"
                          className="w-12 h-12 mx-auto text-muted-foreground"
                        />
                        <h3 className="mt-4 text-lg font-medium">
                          No tasks found
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          Add a new task or change your filters
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentTodos.map((todo) => (
                          <Card 
                            key={todo.id} 
                            className={`overflow-hidden relative group transition-all duration-200 hover:shadow-md ${todo.status === "completed" ? "bg-muted/30" : ""}`}
                          >
                            {/* Left color indicator based on priority */}
                            <div 
                              className={`absolute left-0 top-0 w-1 h-full ${todo.priority === "high" ? "bg-red-500" : todo.priority === "medium" ? "bg-amber-500" : "bg-blue-400"}`}
                            />
                            
                            {/* Star indicator */}
                            {todo.isStarred && (
                              <div className="absolute right-0 top-0">
                                <div className="w-0 h-0 border-t-[20px] border-r-[20px] border-t-yellow-500 border-r-transparent transform rotate-90" />
                              </div>
                            )}

                            <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start pl-6">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Checkbox
                                    checked={todo.status === "completed"}
                                    onCheckedChange={() => handleUpdateTask({id: todo.id, projectId: todo.projectId,type: "update", data: {type: "status", status: todo.status === "completed" ? "pending" : "completed"}})}
                                    className="h-5 w-5 rounded-full transition-all"
                                  />
                                  <h3
                                    className={`font-medium text-base capitalize ${todo.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                                  >
                                    {todo.title}
                                  </h3>
                                </div>

                                {/* Project Badge */}
                                {todo.projectId && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs mb-2 rounded-full px-2 py-0"
                                    style={{
                                      backgroundColor: getProjectColor(todo.projectId),
                                      borderColor: getProjectColor(todo.projectId),
                                      color: getContrastColor(getProjectColor(todo.projectId)),
                                    }}
                                  >
                                    {getProjectTitle(todo.projectId)}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-7 w-7 rounded-full ${todo.isStarred ? "text-yellow-500" : "text-muted-foreground opacity-0 group-hover:opacity-100"}`}
                                  onClick={() => handleUpdateTask({id: todo.id, projectId: todo.projectId,type: "update", data: {type: "starred", isStarred: todo.isStarred ? false : true}})}
                                >
                                  {todo.isStarred ? (
                                    <Star className="h-4 w-4 fill-current" />
                                  ) : (
                                    <Star className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </CardHeader>

                            <CardContent className="p-4 pt-1 pl-6">
                              {todo.description && (
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2 capitalize">
                                  {todo.description}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-1 mt-2">
                                {todo.tags.slice(0, 3).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs rounded-full px-2 py-0"
                                  >
                                    #{tag}
                                  </Badge>
                                ))}
                                {todo.tags.length > 3 && (
                                  <Badge variant="secondary" className="text-xs rounded-full px-2 py-0">
                                    +{todo.tags.length - 3}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex justify-between items-center mt-3">
                                {todo.dueDate && (
                                  <div
                                    className={`flex items-center text-xs ${getDueDateColor(todo.dueDate)}`}
                                  >
                                    <span>
                                      {new Date(todo.dueDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}

                                {/* Priority badge - moved to right side */}
                                <Badge
                                  variant={getPriorityVariant(todo.priority)}
                                  className="capitalize text-xs rounded-full"
                                >
                                  {todo.priority}
                                </Badge>
                              </div>

                              {todo.sharedWith.length > 0 && (
                                <div className="flex items-center mt-3 border-t border-border/30 pt-2">
                                  <span className="text-xs text-muted-foreground mr-2">
                                    Shared with:
                                  </span>
                                  <div className="flex -space-x-2">
                                    {todo.sharedWith
                                      .slice(0, 3)
                                      .map((email, i) => (
                                        <Avatar
                                          key={i}
                                          className="h-6 w-6 border-2 border-background"
                                        >
                                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                            {email
                                              .substring(0, 2)
                                              .toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                      ))}
                                    {todo.sharedWith.length > 3 && (
                                      <Avatar className="h-6 w-6 border-2 border-background">
                                        <AvatarFallback className="text-[10px] bg-muted">
                                          +{todo.sharedWith.length - 3}
                                        </AvatarFallback>
                                      </Avatar>
                                    )}
                                  </div>
                                </div>
                              )}
                            </CardContent>

                            {/* Action buttons - now appear on hover with cleaner look */}
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                                onClick={() => handleShareTodo(todo.id)}
                              >
                                <Share2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100"
                                onClick={() => handleEditTodo(todo)}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                                onClick={() => handleDeleteTodo(todo.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Todo Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Task" : "Add New Task"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Task title"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Task description"
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleInputChange("priority", value)
                  }
                >
                  <SelectTrigger id="priority" className="mt-1">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="z-[1000]">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger id="status" className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="z-[1000]">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="projectSelect" className="text-sm font-medium">
                Project
              </Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => handleInputChange("projectId", value)}
              >
                <SelectTrigger id="projectSelect" className="mt-1">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent className="z-[1000]">
                  <SelectItem value={null}>Personal Task</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project._id} value={project._id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span>{project.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dueDate" className="text-sm font-medium">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center justify-between">
                <span>Tags</span>
                <span className="text-xs text-muted-foreground">
                  Press Enter to add
                </span>
              </Label>
              <Input
                placeholder="Add tags..."
                className="mt-1"
                onKeyDown={handleTagInput}
              />

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-2 py-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-transparent"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isStarred"
                checked={formData.isStarred}
                onChange={(e) =>
                  handleInputChange("isStarred", e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <Label
                htmlFor="isStarred"
                className="text-sm font-medium cursor-pointer"
              >
                Mark as important
              </Label>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>

            {loading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                {editMode ? "Update Task" : "Add Task"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Todo Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Share Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="shareEmail" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="shareEmail"
                type="email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                placeholder="Enter email address"
                className="mt-1"
              />
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">{formData.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {formData.description}
              </p>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowShareModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitShare}>Share</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Modal */}
      <Dialog open={showProjectModal} onOpenChange={setShowProjectModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {projectFormData.id ? "Edit Project" : "Create New Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="projectTitle" className="text-sm font-medium">
                Project Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="projectTitle"
                value={projectFormData.title}
                onChange={(e) =>
                  setProjectFormData({
                    ...projectFormData,
                    title: e.target.value,
                  })
                }
                placeholder="Enter project title"
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="projectDescription"
                className="text-sm font-medium"
              >
                Description
              </Label>
              <Textarea
                id="projectDescription"
                value={projectFormData.description}
                onChange={(e) =>
                  setProjectFormData({
                    ...projectFormData,
                    description: e.target.value,
                  })
                }
                placeholder="Project description"
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="projectColor" className="text-sm font-medium">
                Project Color
              </Label>
              <div className="flex items-center gap-3 mt-1">
                <Input
                  id="projectColor"
                  type="color"
                  value={projectFormData.color}
                  onChange={(e) =>
                    setProjectFormData({
                      ...projectFormData,
                      color: e.target.value,
                    })
                  }
                  className="w-12 h-10 p-1"
                />
                <div
                  className="w-full h-8 rounded-md"
                  style={{ backgroundColor: projectFormData.color }}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowProjectModal(false)}
            >
              Cancel
            </Button>

            {loading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </Button>
            ) : (
              <Button onClick={handleSubmitProject}>
                {projectFormData.id ? "Update Project" : "Create Project"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Share Modal */}
      <Dialog
        open={showProjectShareModal}
        onOpenChange={setShowProjectShareModal}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Project</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {selectedProject && (
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-1">{selectedProject.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedProject.description}
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="newMember" className="text-sm font-medium">
                Add Team Member
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="newMember"
                  type="email"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1"
                />
                <Button onClick={handleAddMember}>Add</Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Team Members
              </Label>

              {selectedProject && selectedProject.members.length > 0 ? (
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2 p-1">
                    {selectedProject.members.map((member) => (
                      <div
                        key={member}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {member.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600"
                          onClick={() => handleRemoveMember(member)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-6 border border-dashed rounded-lg">
                  <Users className="w-10 h-10 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No team members yet
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button onClick={() => setShowProjectShareModal(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Modal */}
      <Dialog open={showStatsModal} onOpenChange={setShowStatsModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {activeProject ? (
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: stats.projectStats?.color || "#4f46e5",
                    }}
                  />
                  <span>
                    {stats.projectStats?.title || "Project"} Statistics
                  </span>
                </div>
              ) : (
                "Personal Task Statistics"
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {activeProject && stats.projectStats && (
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-medium">
                        {stats.projectStats.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {
                          projects.find((p) => p._id === activeProject)
                            ?.description
                        }
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Users className="h-3 w-3" />
                        <span>{stats.projectStats.memberCount} members</span>
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.completionRate}%
                  </div>
                  <Progress value={stats.completionRate} className="h-2 mt-2" />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-green-600">
                    {stats.completed}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-yellow-600">
                    {stats.pending}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    High Priority
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-red-600">
                    {stats.highPriority}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="font-medium mb-3">Task Distribution</h3>
              <div className="h-8 w-full rounded-full overflow-hidden flex">
                <div
                  className="bg-green-500 h-full transition-all duration-500"
                  style={{ width: `${stats.completionRate}%` }}
                />
                <div
                  className="bg-yellow-500 h-full transition-all duration-500"
                  style={{ width: `${100 - stats.completionRate}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                  <span>Pending</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button onClick={() => setShowStatsModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PersonalTodo;
