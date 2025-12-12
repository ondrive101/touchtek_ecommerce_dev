"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Edit,
  Trash2,
  UserPlus,
  Users,
  Building,
  UserCheck,
  ChevronDown,
  ChevronRight,
  Search,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  PlusCircle,
} from "lucide-react";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import {
  attachEmployee,
  detachEmployee,
  createTeam,
  deleteTeam,
  editTeam,
  editTeamMember,
  deleteDepartment
} from "@/action/superadmin/controller";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const TeamViewModel = ({ session, department, employeeList }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTeam, setActiveTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("details");

  // State for employee attachment with login credentials
  const [attachEmployeeModal, setAttachEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeCode, setEmployeeCode] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [foundEmployee, setFoundEmployee] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailUsername, setEmailUsername] = useState("");
  const [emailDepartment, setEmailDepartment] = useState("");
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");
  const [createTeamModal, setCreateTeamModal] = useState(false);
  const [newTeamTitle, setNewTeamTitle] = useState("");
  const [createTeamLoading, setCreateTeamLoading] = useState(false);
  const [editTeamModal, setEditTeamModal] = useState(false);
  const [editTeamData, setEditTeamData] = useState({
    title: "",
    status: "active",
  });
  const [editMemberModal, setEditMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editMemberData, setEditMemberData] = useState({
    email: "",
    password: "",
    status: "active",
    rights: {
      dashboard: true,
      employees: true,
      teams: false,
      departments: false,
      settings: false,
      reports: false,
      admin: false,
      finance: false,
    },
  });
  const [deleteTeamConfirm, setDeleteTeamConfirm] = useState(false);
  const [deleteDepartmentConfirm, setDeleteDepartmentConfirm] = useState(false);
  const [memberTabValue, setMemberTabValue] = useState("credentials");

  // CSS classes for toggles to ensure they work properly
  const toggleWrapperClass = "flex items-center space-x-2 relative z-[1000]";

  // Initialize with the first team if available
  useEffect(() => {
    if (department?.teams && department.teams.length > 0) {
      setActiveTeam(department.teams[0]);
    }
  }, [department]);

  const handleTeamSelect = (team) => {
    setActiveTeam(team);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedTab("details");
    setLoading(false);

    // reload page
    window.location.reload();
  };

  const handleEditTeamClick = () => {
    if (!activeTeam) return;

    if (activeTeam.title === "admin") {
      toast.error("Cannot edit Admin team");
      return;
    }

    setEditTeamData({
      title: activeTeam.title,
      status: activeTeam.status || "active",
    });

    setEditTeamModal(true);
  };

  const handleEditTeamSubmit = async () => {
    if (!editTeamData.title.trim()) {
      toast.error("Team title is required");
      return;
    }

    try {
      setLoading(true);

      // Check if team with same title already exists (excluding current team)
      const teamExists = department?.teams?.some(
        (team) =>
          team.title.toLowerCase() === editTeamData.title.toLowerCase() &&
          team.title.toLowerCase() !== activeTeam.title.toLowerCase()
      );

      if (teamExists) {
        toast.error("Team with this title already exists");
        setLoading(false);
        return;
      }

      // Create payload for updating team
      const payload = {
        departmentId: department._id,
        team: activeTeam,
        title: editTeamData.title,
        status: editTeamData.status,
      };

      // Replace this with actual API call
      const response = await editTeam(payload, session);
      if (response.status === "success") {
        toast.success("Team updated successfully", {
          autoClose: 1000,
        });

        // Update team in local state
        const updatedTeams = department?.teams?.map((team) => {
          if (team.title === activeTeam.title) {
            return {
              ...team,
              title: editTeamData.title,
              status: editTeamData.status,
              updatedAt: new Date().toISOString(),
            };
          }
          return team;
        });

        // Update department with updated teams
        if (department?.teams) {
          department.teams = updatedTeams;

          // Update active team
          const updatedActiveTeam = {
            ...activeTeam,
            title: editTeamData.title,
            status: editTeamData.status,
            updatedAt: new Date().toISOString(),
          };

          setActiveTeam(updatedActiveTeam);
        }

        setEditTeamModal(false);
        setLoading(false);
      }
      if (response.status === "fail") {
        toast.error(response.message, {
          autoClose: 1000,
        });
        setError(response.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.message || "Something went wrong", {
        autoClose: 1000,
      });
    }
  };

  const handleDeleteTeam = async () => {
    if (!activeTeam) return;
    if (activeTeam.title === "admin") {
      toast.error("Cannot delete Admin team");
      return;
    }

    try {
      setLoading(true);

      // Create payload for deleting team
      const payload = {
        departmentId: department._id,
        team: activeTeam,
      };

      // Replace this with actual API call
      const response = await deleteTeam(payload, session);
      if (response.status === "success") {
        toast.success("Team deleted successfully", {
          autoClose: 1000,
        });
        // Remove team from local state
        const updatedTeams = department?.teams?.filter(
          (team) => team.title !== activeTeam.title
        );

        console.log("Updated teams:", updatedTeams);

        // Update department with updated teams
        if (department?.teams) {
          department.teams = updatedTeams;

          // Set active team to first team or null
          setActiveTeam(updatedTeams.length > 0 ? updatedTeams[0] : null);
        }

        setDeleteTeamConfirm(false);
        setLoading(false);
      }
      if (response.status === "fail") {
        toast.error(response.message, {
          autoClose: 1000,
        });
        setError(response.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.message || "Something went wrong", {
        autoClose: 1000,
      });
    }
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setEditMemberData({
      email: member.email || "",
      password: "",
      status: member.status || "active",
      rights: member.rights || {
        dashboard: true,
        employees: true,
        teams: false,
        departments: false,
        settings: false,
        reports: false,
        admin: false,
        finance: false,
      },
    });
    setEditMemberModal(true);
  };

  const handleEditMemberSubmit = async () => {
    if (!selectedMember) return;

    try {
      setLoading(true);

      // Create payload for updating team member
      const payload = {
        departmentId: department._id,
        team: activeTeam,
        employeeCode: selectedMember.employeeCode,
        email: editMemberData.email,
        status: editMemberData.status,
        rights: editMemberData.rights,
      };

      console.log("Payload action:", payload);

      // Add password to payload only if it's provided
      if (editMemberData.password) {
        payload.password = editMemberData.password;
      }

      // Replace this with actual API call
      const response = await editTeamMember(payload, session);
      if (response.status === "success") {
        toast.success("Team member updated successfully");

        // Update team member in local state
        const updatedMembers = activeTeam.attachedEmployees.map((emp) => {
          if (emp._id === selectedMember._id) {
            return {
              ...emp,
              email: editMemberData.email,
              status: editMemberData.status,
              rights: editMemberData.rights,
            };
          }
          return emp;
        });

        // Update active team with updated members
        setActiveTeam({
          ...activeTeam,
          attachedEmployees: updatedMembers,
        });

        // handleClose();
        setLoading(false);
        setEditMemberModal(false);
      }
      if (response.status === "fail") {
        toast.error(response.message, {
          autoClose: 1000,
        });
        setError(response.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.message || "Something went wrong", {
        autoClose: 1000,
      });
    }
  };

  const handleDeleteEmployee = async (employee) => {
    try {
      setLoading(true);

      // Create payload for attaching employee
      const payload = {
        employeeCode: employee.employeeCode,
        departmentId: department._id,
        team: activeTeam.title,
      };

      // Replace this with actual API call
      const response = await detachEmployee(payload, session);
      if (response.status === "success") {
        toast.success("Employee detached successfully", {
          autoClose: 1000,
        });
        const latestActiveMember = activeTeam.attachedEmployees.filter(
          (emp) => emp.employeeCode !== employee.employeeCode
        );
        setActiveTeam({
          ...activeTeam,
          attachedEmployees: latestActiveMember,
        });

        //update department locally
        const updatedTeams = department?.teams?.map((team) => {
          if (team.title === activeTeam.title) {
            return {
              ...team,
              attachedEmployees: latestActiveMember,
            };
          }
          return team;
        });

        if (department?.teams) {
          department.teams = updatedTeams;
        }

        // handleClose();
        setLoading(false);
      }
      if (response.status === "fail") {
        toast.error(response.message, {
          autoClose: 1000,
        });
        setError(response.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.message || "Something went wrong", {
        autoClose: 1000,
      });
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleInputChange = (name, value) => {
    if (name === "email") return; // Email is handled separately

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEmailUsernameChange = (value) => {
    // Only update the username part
    setEmailUsername(value);

    // Reconstruct the full email
    updateFullEmail(value, emailDepartment);
  };

  const updateFullEmail = (username, departmentName) => {
    const email = `${username}.${departmentName}@touchtek.net`;
    setFormData((prev) => ({
      ...prev,
      email: email,
    }));
  };

  // Generate email based on employee name and department
  const generateEmail = (employee) => {
    if (!employee || !employee.name || !department?.name) return;

    // Get first word of name (lowercase)
    const firstName = employee.name.split(" ")[0].toLowerCase();

    // Get department name (lowercase)
    const departmentName = department.name.toLowerCase();

    // Store the parts separately
    setEmailUsername(firstName);
    setEmailDepartment(departmentName);

    // Combine to create email
    const email = `${firstName}.${departmentName}@touchtek.net`;

    // Update form data with generated email
    setFormData((prev) => ({
      ...prev,
      email: email,
    }));
  };

  // Generate a random password
  const generatePassword = () => {
    // Define character sets
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_-+=<>?";

    // Ensure at least one character from each set
    let password = "";
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += special.charAt(Math.floor(Math.random() * special.length));

    // Add more random characters to reach desired length (8-12 chars)
    const allChars = lowercase + uppercase + numbers + special;
    const remainingLength = 8 + Math.floor(Math.random() * 5); // Random length between 8-12

    for (let i = 4; i < remainingLength; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the password characters
    password = password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    // Update form data
    setFormData((prev) => ({
      ...prev,
      password: password,
      confirmPassword: password,
    }));
  };

  const toggleEmailEdit = () => {
    setIsEmailEditable(!isEmailEditable);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleAddToTeam = (employee) => {
    setSelectedEmployee(employee);
    setAttachEmployeeModal(true);
    // Set the found employee directly since we already have it
    setFoundEmployee(employee);
    // Reset form data
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError("");

    // Generate email for the employee
    generateEmail(employee);
  };

  const closeAttachModal = () => {
    setAttachEmployeeModal(false);
    setSelectedEmployee(null);
    setFoundEmployee(null);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
  };

  const validateForm = () => {
    // Reset error
    setError("");

    // Check if employee is found
    if (!foundEmployee) {
      setError("Please search for a valid employee first");
      return false;
    }

    // Check email
    if (!formData.email) {
      setError("Email is required");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Check password
    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    // Password strength validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    // Check confirm password
    if (!formData.confirmPassword) {
      setError("Please confirm your password");
      return false;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleAttachSubmit = async () => {
    // Validate form
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Create payload for attaching employee
      const payload = {
        employeeId: foundEmployee._id,
        departmentId: department._id,
        team: activeTeam,
        email: formData.email,
        password: formData.password,
      };

      console.log("payload", payload);

      // Check if member already exists in team
      const team = activeTeam;
      const memberExists = team.attachedEmployees.some(
        (emp) => emp._id === foundEmployee._id
      );
      if (memberExists) {
        toast.error("Employee already exists in team");
        setLoading(false);
        return;
      }

      // Replace this with actual API call
      const response = await attachEmployee(payload, session);
      if (response.status === "success") {
        toast.success("Employee attached successfully", {
          autoClose: 1000,
        });

        // Update the active team with the newly attached employee
        if (activeTeam && activeTeam.attachedEmployees) {
          setActiveTeam({
            ...activeTeam,
            attachedEmployees: [...activeTeam.attachedEmployees, foundEmployee],
          });
        }

        //update department locally
        const updatedTeams = department?.teams?.map((team) => {
          if (team.title === activeTeam.title) {
            return {
              ...team,
              attachedEmployees: [
                ...activeTeam.attachedEmployees,
                foundEmployee,
              ],
            };
          }
          return team;
        });

        if (department?.teams) {
          department.teams = updatedTeams;
        }

        closeAttachModal();
        setLoading(false);
      }
      if (response.status === "fail") {
        toast.error(response.message, {
          autoClose: 1000,
        });
        setError(response.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.message || "Something went wrong", {
        autoClose: 1000,
      });
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamTitle.trim()) {
      toast.error("Team title is required");
      return;
    }

    try {
      setLoading(true);

      // Check if team with same title already exists
      const teamExists = department?.teams?.some(
        (team) => team.title.toLowerCase() === newTeamTitle.toLowerCase()
      );

      if (teamExists) {
        toast.error("Team with this title already exists");
        setLoading(false);
        return;
      }

      // Create payload for creating team
      const payload = {
        departmentId: department._id,
        title: newTeamTitle,
      };

      // Replace this with actual API call
      const response = await createTeam(payload, session);
      if (response.status === "success") {
        toast.success("Team created successfully", {
          autoClose: 1000,
        });

        // Simulate successful response
        const newTeam = {
          title: newTeamTitle,
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          attachedEmployees: [],
        };

        // Update department with new team
        if (department?.teams) {
          department.teams = [...department.teams, newTeam];
          setActiveTeam(newTeam);
        }

        setCreateTeamModal(false);
        setNewTeamTitle("");
        setLoading(false);
      }
      if (response.status === "fail") {
        toast.error(response.message, {
          autoClose: 1000,
        });
        setError(response.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.message || "Something went wrong", {
        autoClose: 1000,
      });
    }
  };

  const handleDeleteDepartment = async () => {
    if (!department) return;

    try {
      setLoading(true);

      // Create payload for deleting department
      const payload = {
        departmentId: department._id,
      };

 
       // Replace this with actual API call
       const response = await deleteDepartment(payload, session);
       if (response.status === "success") {
         toast.success("Department deleted successfully", {
           autoClose: 1000,
         });
 
       
         setLoading(false);
         setShowModal(false);
       }
       if (response.status === "fail") {
         toast.error(response.message, {
           autoClose: 1000,
         });
         setError(response.message);
         setLoading(false);
       }

    
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.message || "Something went wrong", {
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Manage</span>
          </Button>
        </DialogTrigger>
        <DialogContent size="full">
          <DialogHeader>
            <div className="flex items-center gap-3 p-2">
              <div className="h-12 w-12 rounded-sm border border-border grid place-content-center">
                <Icon
                  icon="heroicons:user-plus"
                  className="w-5 h-5 text-default-500"
                />
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-default-700 mb-1 capitalize">
                  {department?.name || "Department"} - Team Management
                </div>
                <p className="text-xs text-default-500">
                  Attach an existing employee to this team
                </p>
              </div>
              <Button
                variant="ghost"
                type="button"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                onClick={() => setDeleteDepartmentConfirm(true)}
                title="Delete Department"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-12 gap-4 h-[calc(90vh-120px)]">
            {/* Left sidebar - Teams list */}
            <div className="col-span-4 border-r pr-4">
              <div className="font-medium text-lg mb-2 flex items-center justify-between">
                <span className="capitalize text-lg font-semibold text-default-700">
                  Teams
                </span>
                <div className="flex items-center gap-2">
                  <Badge className="w-5 h-5 p-0 items-center justify-center">
                    {department?.teams?.length || 0}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-primary hover:text-primary/90 hover:bg-primary/10"
                    onClick={() => setCreateTeamModal(true)}
                    title="Create New Team"
                  >
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[calc(90vh-180px)]">
                {department?.teams?.map((t, index) => (
                  <div
                    key={`team-${index}`}
                    className={`p-3 rounded-md mb-2 cursor-pointer transition-all ${
                      activeTeam?.title === t.title
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => handleTeamSelect(t)}
                  >
                    <div className="font-medium text-default-800 flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{t.title}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 flex items-center justify-between">
                      <span>Members: {t.attachedEmployees?.length || 0}</span>
                      <Badge
                        variant="outline"
                        className={`${
                          t.status === "active"
                            ? "text-green-600 bg-green-50"
                            : "text-yellow-600 bg-yellow-50"
                        }`}
                      >
                        {t.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>

            {/* Right content - Team details */}
            <div className="col-span-8">
              {activeTeam ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-default-700 capitalize">
                        {activeTeam.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Created on{" "}
                        {dayjs(activeTeam.createdAt).format("MMM DD, YYYY")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditTeamClick}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit Team</span>
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        color="destructive"
                        className="h-8 w-8"
                        onClick={() => setDeleteTeamConfirm(true)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Tabs
                    defaultValue="details"
                    className="w-full"
                    onValueChange={setSelectedTab}
                  >
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="details">Team Details</TabsTrigger>
                      <TabsTrigger value="members">Team Members</TabsTrigger>
                    </TabsList>

                    <ScrollArea className="h-[calc(90vh-280px)]">
                      <TabsContent value="details" className="mt-0">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold text-default-700">
                              Team Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-muted-foreground">
                                  Team Name
                                </Label>
                                <p className="font-medium">
                                  {activeTeam.title}
                                </p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">
                                  Status
                                </Label>
                                <p>
                                  <Badge
                                    variant="outline"
                                    className={`${
                                      activeTeam.status === "active"
                                        ? "text-green-600 bg-green-50"
                                        : "text-yellow-600 bg-yellow-50"
                                    }`}
                                  >
                                    {activeTeam.status}
                                  </Badge>
                                </p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">
                                  Created At
                                </Label>
                                <p className="font-medium">
                                  {dayjs(activeTeam.createdAt).format(
                                    "MMM DD, YYYY HH:mm"
                                  )}
                                </p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">
                                  Updated At
                                </Label>
                                <p className="font-medium">
                                  {dayjs(activeTeam.updatedAt).format(
                                    "MMM DD, YYYY HH:mm"
                                  )}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <Label className="text-muted-foreground">
                                  Department
                                </Label>
                                <p className="font-medium flex items-center gap-2">
                                  <Building className="h-4 w-4 text-primary" />
                                  <span>
                                    {department?.name} ({department?.code})
                                  </span>
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="mt-4">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold text-default-700">
                              Department Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-muted-foreground">
                                  Department Name
                                </Label>
                                <p className="font-medium">
                                  {department?.name}
                                </p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">
                                  Department Code
                                </Label>
                                <p className="font-medium">
                                  {department?.code}
                                </p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">
                                  Series
                                </Label>
                                <p className="font-medium">
                                  {department?.series}
                                </p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">
                                  Status
                                </Label>
                                <p>
                                  <Badge
                                    variant="outline"
                                    className={`${
                                      department?.status === "active"
                                        ? "text-green-600 bg-green-50"
                                        : "text-yellow-600 bg-yellow-50"
                                    }`}
                                  >
                                    {department?.status}
                                  </Badge>
                                </p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">
                                  Created At
                                </Label>
                                <p className="font-medium">
                                  {dayjs(department?.createdAt).format(
                                    "MMM DD, YYYY HH:mm"
                                  )}
                                </p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">
                                  Updated At
                                </Label>
                                <p className="font-medium">
                                  {dayjs(department?.updatedAt).format(
                                    "MMM DD, YYYY HH:mm"
                                  )}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="members" className="mt-0">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium">
                            Team Members (
                            {activeTeam.attachedEmployees?.length || 0})
                          </h3>
                        </div>

                        {activeTeam.attachedEmployees &&
                        activeTeam.attachedEmployees.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                  Actions
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {activeTeam.attachedEmployees.map(
                                (employee, index) => (
                                  <TableRow key={`employee-${index}`}>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                          <AvatarImage src="" />
                                          <AvatarFallback>
                                            {getInitials(employee.name)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium capitalize">
                                            {employee.name}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {employee.employeeCode}
                                          </p>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>
                                      <Badge
                                        variant="outline"
                                        className={`${
                                          employee.status === "active"
                                            ? "text-green-600 bg-green-50"
                                            : "text-yellow-600 bg-yellow-50"
                                        }`}
                                      >
                                        {employee.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <Button
                                          variant="ghost"
                                          type="button"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={() =>
                                            handleEditMember(employee)
                                          }
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>

                                        {/* remove delete button from first member in admin means developer */}
                                        {employee.name !== "developer" && (
                                          <Button
                                            variant="ghost"
                                            type="button"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                            onClick={() =>
                                              handleDeleteEmployee(employee)
                                            }
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        ) : (
                          <Card className="bg-muted/50">
                            <CardContent className="flex flex-col items-center justify-center py-8">
                              <Users className="h-12 w-12 text-muted-foreground mb-3" />
                              <h3 className="text-lg font-medium">
                                No Team Members
                              </h3>
                              <p className="text-muted-foreground text-center mt-1 mb-4 max-w-md">
                                This team doesn't have any members attached yet.
                              </p>
                            </CardContent>
                          </Card>
                        )}

                        <div className="mt-6">
                          <h3 className="font-medium mb-3">
                            Available Employees
                          </h3>
                          <div className="mb-4">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="text"
                                placeholder="Search by name or employee code..."
                                className="pl-9"
                                value={employeeSearchQuery}
                                onChange={(e) =>
                                  setEmployeeSearchQuery(e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                          >
                            <AccordionItem value="employees">
                              <AccordionTrigger className="py-2">
                                <span className="flex items-center gap-2">
                                  <UserCheck className="h-4 w-4 text-primary" />
                                  <span>
                                    Employee List ({employeeList?.length || 0})
                                  </span>
                                </span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="max-h-[300px] overflow-y-auto pr-2">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Code</TableHead>
                                        <TableHead className="text-right">
                                          Action
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {employeeList
                                        ?.filter((employee) => {
                                          if (!employeeSearchQuery) return true;
                                          const query =
                                            employeeSearchQuery.toLowerCase();
                                          return (
                                            employee.name
                                              ?.toLowerCase()
                                              .includes(query) ||
                                            employee.employeeCode
                                              ?.toLowerCase()
                                              .includes(query)
                                          );
                                        })
                                        ?.slice(0, 10)
                                        .map((employee, index) => (
                                          <TableRow
                                            key={`available-employee-${index}`}
                                          >
                                            <TableCell>
                                              <div className="flex items-center gap-2">
                                                <Avatar className="h-7 w-7">
                                                  <AvatarImage src="" />
                                                  <AvatarFallback>
                                                    {getInitials(employee.name)}
                                                  </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                  <p className="font-medium">
                                                    {employee.name}
                                                  </p>
                                                  <p className="text-xs text-muted-foreground">
                                                    {employee.email}
                                                  </p>
                                                </div>
                                              </div>
                                            </TableCell>
                                            <TableCell>
                                              {employee.department}
                                            </TableCell>
                                            <TableCell>
                                              {employee.employeeCode}
                                            </TableCell>
                                            <TableCell className="text-right">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7"
                                                onClick={() =>
                                                  handleAddToTeam(employee)
                                                }
                                              >
                                                Add to Team
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        ))}

                                      {/* No Data Found component */}
                                      {employeeSearchQuery &&
                                        employeeList?.filter((employee) => {
                                          const query =
                                            employeeSearchQuery.toLowerCase();
                                          return (
                                            employee.name
                                              ?.toLowerCase()
                                              .includes(query) ||
                                            employee.employeeCode
                                              ?.toLowerCase()
                                              .includes(query)
                                          );
                                        })?.length === 0 && (
                                          <TableRow>
                                            <TableCell
                                              colSpan={4}
                                              className="text-center py-8"
                                            >
                                              <div className="flex flex-col items-center justify-center">
                                                <Icon
                                                  icon="heroicons:magnifying-glass"
                                                  className="h-12 w-12 text-muted-foreground mb-3"
                                                />
                                                <h3 className="text-lg font-medium">
                                                  No Employees Found
                                                </h3>
                                                <p className="text-muted-foreground text-center mt-1 mb-4 max-w-md">
                                                  No employees match your search
                                                  criteria. Try a different
                                                  search term.
                                                </p>
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        )}
                                    </TableBody>
                                  </Table>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      </TabsContent>
                    </ScrollArea>
                  </Tabs>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Users className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium">No Team Selected</h3>
                  <p className="text-muted-foreground text-center mt-2 mb-6 max-w-md">
                    Please select a team from the list to view its details and
                    manage team members.
                  </p>
                  {department?.teams?.length > 0 ? (
                    <Button
                      onClick={() => setActiveTeam(department.teams[0])}
                      className="flex items-center gap-2"
                    >
                      <Users className="h-4 w-4" />
                      <span>Select First Team</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCreateTeamModal(true)}
                      className="flex items-center gap-2"
                    >
                      <Icon icon="heroicons:plus" className="h-4 w-4" />
                      <span>Create New Team</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4 border-t pt-4">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={attachEmployeeModal} onOpenChange={setAttachEmployeeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attach Employee to Team</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Employee Information
                  </CardTitle>
                </CardHeader>
                <ScrollArea className="h-[calc(80vh-220px)]">
                  <CardContent>
                    {selectedEmployee && (
                      <div className="mb-4 p-3 bg-muted/50 rounded-md">
                        <p className="font-medium">{selectedEmployee.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedEmployee.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedEmployee.employeeCode}
                        </p>
                      </div>
                    )}

                    <div className="space-y-6">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center space-x-3">
                        <UserCheck className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium text-green-800">
                            Employee Selected
                          </p>
                          <p className="text-sm text-green-700">
                            {foundEmployee?.name} -{" "}
                            {foundEmployee?.employeeCode}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label className="font-medium">Email Address</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={toggleEmailEdit}
                              className="h-7 px-2"
                            >
                              {isEmailEditable ? "Lock" : "Edit"}
                              {isEmailEditable ? (
                                <Lock className="ml-1 h-3 w-3" />
                              ) : (
                                <Edit className="ml-1 h-3 w-3" />
                              )}
                            </Button>
                          </div>

                          {isEmailEditable ? (
                            <div className="flex space-x-2 items-center">
                              <Input
                                value={emailUsername}
                                onChange={(e) =>
                                  handleEmailUsernameChange(e.target.value)
                                }
                                className="flex-1"
                              />
                              <span className="text-sm text-muted-foreground">
                                .
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {emailDepartment}@touchtek.net
                              </span>
                            </div>
                          ) : (
                            <Input
                              value={formData.email}
                              readOnly
                              className="bg-muted/50"
                            />
                          )}
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label className="font-medium">Password</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={generatePassword}
                            >
                              Generate
                              <RefreshCw className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              value={formData.password}
                              onChange={(e) =>
                                handleInputChange("password", e.target.value)
                              }
                              className="rounded-md border-default-200 focus:border-primary pr-10"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-default-500 hover:text-default-700"
                              onClick={togglePasswordVisibility}
                              tabIndex="-1"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <Label className="mb-2 font-medium">
                            Confirm Password
                          </Label>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm Password"
                              value={formData.confirmPassword}
                              onChange={(e) =>
                                handleInputChange(
                                  "confirmPassword",
                                  e.target.value
                                )
                              }
                              className="rounded-md border-default-200 focus:border-primary pr-10"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-default-500 hover:text-default-700"
                              onClick={toggleConfirmPasswordVisibility}
                              tabIndex="-1"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </ScrollArea>
              </Card>
            </div>
          </div>
          <DialogFooter className="flex justify-center mt-6 border-t pt-4">
            <Button variant="outline" type="button" onClick={closeAttachModal}>
              Cancel
            </Button>

            {loading ? (
              <Button className="rounded-md bg-primary hover:bg-primary/90 ml-3">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait ...
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleAttachSubmit}
                disabled={!foundEmployee}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Attach Employee
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createTeamModal} onOpenChange={setCreateTeamModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Create New Team
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Create a new team for the {department?.name} department.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Team Title</Label>
                <Input
                  value={newTeamTitle}
                  onChange={(e) => setNewTeamTitle(e.target.value)}
                  placeholder="Enter team title"
                  className="mt-1.5"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Team Status</Label>
                <div className={toggleWrapperClass}>
                  <Switch id="create-team-status" checked={true} disabled />
                  <Label
                    htmlFor="create-team-status"
                    className="text-sm cursor-pointer"
                  >
                    Active
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-end mt-6 pt-4 border-t">
            <Button
              variant="outline"
              type="button"
              onClick={() => setCreateTeamModal(false)}
              size="sm"
            >
              Cancel
            </Button>

            {createTeamLoading ? (
              <Button size="sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </Button>
            ) : (
              <Button type="button" onClick={handleCreateTeam} size="sm">
                <Icon icon="heroicons:plus" className="mr-2 h-4 w-4" />
                Create Team
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editTeamModal} onOpenChange={setEditTeamModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Edit Team
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Update team information for {editTeamData.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Team Title</Label>
                <Input
                  value={editTeamData.title}
                  onChange={(e) =>
                    setEditTeamData({
                      ...editTeamData,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter team title"
                  className="mt-1.5"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Team Status</Label>
                <div className={toggleWrapperClass}>
                  <Switch
                    id="edit-team-status"
                    checked={editTeamData.status === "active"}
                    onCheckedChange={(checked) =>
                      setEditTeamData({
                        ...editTeamData,
                        status: checked ? "active" : "inactive",
                      })
                    }
                  />
                  <Label
                    htmlFor="edit-team-status"
                    className="text-sm cursor-pointer"
                  >
                    {editTeamData.status === "active" ? "Active" : "Inactive"}
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-end mt-6 pt-4 border-t">
            <Button
              variant="outline"
              type="button"
              onClick={() => setEditTeamModal(false)}
              size="sm"
            >
              Cancel
            </Button>

            {loading ? (
              <Button size="sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </Button>
            ) : (
              <Button type="button" onClick={handleEditTeamSubmit} size="sm">
                <Icon icon="heroicons:check" className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editMemberModal} onOpenChange={setEditMemberModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Edit Team Member
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Update login credentials and status for {selectedMember?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Tabs
              defaultValue="credentials"
              value={memberTabValue}
              onValueChange={setMemberTabValue}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
                <TabsTrigger value="rights">Rights</TabsTrigger>
              </TabsList>
              <div className="space-y-4">
                {selectedMember && (
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-md flex items-center space-x-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(selectedMember.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-default-800 capitalize">
                        {selectedMember.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedMember.employeeCode}
                      </p>
                    </div>
                  </div>
                )}
                <TabsContent value="credentials" className="mt-0">
                  <div className="space-y-2 mb-4">
                    <Label className="text-sm font-medium">Email Address</Label>
                    <Input
                      value={editMemberData.email}
                      onChange={(e) =>
                        setEditMemberData({
                          ...editMemberData,
                          email: e.target.value,
                        })
                      }
                      placeholder="Enter email address"
                      className="mt-1.5"
                      disabled={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <Label className="text-sm font-medium">Password</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-primary"
                        onClick={generatePassword}
                        type="button"
                      >
                        Generate
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password (leave empty to keep current)"
                        value={editMemberData.password}
                        onChange={(e) =>
                          setEditMemberData({
                            ...editMemberData,
                            password: e.target.value,
                          })
                        }
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex="-1"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty to keep the current password.
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <Label className="text-sm font-medium">Member Status</Label>
                    <div className={toggleWrapperClass}>
                      <Switch
                        id="edit-member-status"
                        checked={editMemberData.status === "active"}
                        onCheckedChange={(checked) =>
                          setEditMemberData({
                            ...editMemberData,
                            status: checked ? "active" : "inactive",
                          })
                        }
                      />
                      <Label
                        htmlFor="edit-member-status"
                        className="text-sm cursor-pointer"
                      >
                        {editMemberData.status === "active"
                          ? "Active"
                          : "Inactive"}
                      </Label>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="rights" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Dashboard</Label>
                      <div className={toggleWrapperClass}>
                        <Switch
                          id="edit-member-dashboard"
                          checked={editMemberData.rights.dashboard}
                          onCheckedChange={(checked) =>
                            setEditMemberData({
                              ...editMemberData,
                              rights: {
                                ...editMemberData.rights,
                                dashboard: checked,
                              },
                            })
                          }
                        />
                        <Label
                          htmlFor="edit-member-dashboard"
                          className="text-sm cursor-pointer"
                        >
                          {editMemberData.rights.dashboard
                            ? "Enabled"
                            : "Disabled"}
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Employees</Label>
                      <div className={toggleWrapperClass}>
                        <Switch
                          id="edit-member-employees"
                          checked={editMemberData.rights.employees}
                          onCheckedChange={(checked) =>
                            setEditMemberData({
                              ...editMemberData,
                              rights: {
                                ...editMemberData.rights,
                                employees: checked,
                              },
                            })
                          }
                        />
                        <Label
                          htmlFor="edit-member-employees"
                          className="text-sm cursor-pointer"
                        >
                          {editMemberData.rights.employees
                            ? "Enabled"
                            : "Disabled"}
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Teams</Label>
                      <div className={toggleWrapperClass}>
                        <Switch
                          id="edit-member-teams"
                          checked={editMemberData.rights.teams}
                          onCheckedChange={(checked) =>
                            setEditMemberData({
                              ...editMemberData,
                              rights: {
                                ...editMemberData.rights,
                                teams: checked,
                              },
                            })
                          }
                        />
                        <Label
                          htmlFor="edit-member-teams"
                          className="text-sm cursor-pointer"
                        >
                          {editMemberData.rights.teams ? "Enabled" : "Disabled"}
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Departments</Label>
                      <div className={toggleWrapperClass}>
                        <Switch
                          id="edit-member-departments"
                          checked={editMemberData.rights.departments}
                          onCheckedChange={(checked) =>
                            setEditMemberData({
                              ...editMemberData,
                              rights: {
                                ...editMemberData.rights,
                                departments: checked,
                              },
                            })
                          }
                        />
                        <Label
                          htmlFor="edit-member-departments"
                          className="text-sm cursor-pointer"
                        >
                          {editMemberData.rights.departments
                            ? "Enabled"
                            : "Disabled"}
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Settings</Label>
                      <div className={toggleWrapperClass}>
                        <Switch
                          id="edit-member-settings"
                          checked={editMemberData.rights.settings}
                          onCheckedChange={(checked) =>
                            setEditMemberData({
                              ...editMemberData,
                              rights: {
                                ...editMemberData.rights,
                                settings: checked,
                              },
                            })
                          }
                        />
                        <Label
                          htmlFor="edit-member-settings"
                          className="text-sm cursor-pointer"
                        >
                          {editMemberData.rights.settings
                            ? "Enabled"
                            : "Disabled"}
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Reports</Label>
                      <div className={toggleWrapperClass}>
                        <Switch
                          id="edit-member-reports"
                          checked={editMemberData.rights.reports}
                          onCheckedChange={(checked) =>
                            setEditMemberData({
                              ...editMemberData,
                              rights: {
                                ...editMemberData.rights,
                                reports: checked,
                              },
                            })
                          }
                        />
                        <Label
                          htmlFor="edit-member-reports"
                          className="text-sm cursor-pointer"
                        >
                          {editMemberData.rights.reports
                            ? "Enabled"
                            : "Disabled"}
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Admin</Label>
                      <div className={toggleWrapperClass}>
                        <Switch
                          id="edit-member-admin"
                          checked={editMemberData.rights.admin}
                          onCheckedChange={(checked) =>
                            setEditMemberData({
                              ...editMemberData,
                              rights: {
                                ...editMemberData.rights,
                                admin: checked,
                              },
                            })
                          }
                        />
                        <Label
                          htmlFor="edit-member-admin"
                          className="text-sm cursor-pointer"
                        >
                          {editMemberData.rights.admin ? "Enabled" : "Disabled"}
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Finance</Label>
                      <div className={toggleWrapperClass}>
                        <Switch
                          id="edit-member-finance"
                          checked={editMemberData.rights.finance}
                          onCheckedChange={(checked) =>
                            setEditMemberData({
                              ...editMemberData,
                              rights: {
                                ...editMemberData.rights,
                                finance: checked,
                              },
                            })
                          }
                        />
                        <Label
                          htmlFor="edit-member-finance"
                          className="text-sm cursor-pointer"
                        >
                          {editMemberData.rights.finance
                            ? "Enabled"
                            : "Disabled"}
                        </Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
          <DialogFooter className="flex justify-end mt-6 pt-4 border-t">
            <Button
              variant="outline"
              type="button"
              onClick={() => setEditMemberModal(false)}
              size="sm"
            >
              Cancel
            </Button>

            {loading ? (
              <Button size="sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </Button>
            ) : (
              <Button type="button" onClick={handleEditMemberSubmit} size="sm">
                <Icon icon="heroicons:check" className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteTeamConfirm} onOpenChange={setDeleteTeamConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Team</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Are you sure you want to delete this team? This action cannot be
                undone.
              </p>
            </div>
          </div>
          <DialogFooter className="flex justify-center mt-6 border-t pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setDeleteTeamConfirm(false)}
            >
              Cancel
            </Button>

            {loading ? (
              <Button className="rounded-md bg-primary hover:bg-primary/90 ml-3">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait ...
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleDeleteTeam}
                className="rounded-md bg-destructive hover:bg-destructive/90 ml-3"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Team
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDepartmentConfirm} onOpenChange={setDeleteDepartmentConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Are you sure you want to delete this department? This action
                cannot be undone.
              </p>
            </div>
          </div>
          <DialogFooter className="flex justify-center mt-6 border-t pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setDeleteDepartmentConfirm(false)}
            >
              Cancel
            </Button>

            {loading ? (
              <Button className="rounded-md bg-primary hover:bg-primary/90 ml-3">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait ...
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleDeleteDepartment}
                className="rounded-md bg-destructive hover:bg-destructive/90 ml-3"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Department
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeamViewModel;
