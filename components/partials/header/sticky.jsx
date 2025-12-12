import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Eye,
  StickyNote,
  GripVertical,
  Calendar,
  Clock,
} from "lucide-react";
import { Loader2, Move } from "lucide-react";
import React, { useTransition, useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { useSession } from "next-auth/react";
import {
  createStickyNote,
  getStickyNotes,
  updateStickyNote,
} from "@/action/reqQ/controller";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { PropagateLoader } from "react-spinners";

// Zod schema for sticky note validation - title is still required but hidden
const stickyNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content too long"),
  color: z.string().default("#fbbf24"),
});

const STICKY_NOTE_COLORS = [
  {
    name: "Sunny Yellow",
    value: "#fbbf24",
    bg: "bg-gradient-to-br from-yellow-100 to-yellow-200",
    border: "border-yellow-300",
    shadow: "shadow-yellow-100",
  },
  {
    name: "Rose Pink",
    value: "#f472b6",
    bg: "bg-gradient-to-br from-pink-100 to-pink-200",
    border: "border-pink-300",
    shadow: "shadow-pink-100",
  },
  {
    name: "Mint Green",
    value: "#4ade80",
    bg: "bg-gradient-to-br from-green-100 to-green-200",
    border: "border-green-300",
    shadow: "shadow-green-100",
  },
  {
    name: "Ocean Blue",
    value: "#60a5fa",
    bg: "bg-gradient-to-br from-blue-100 to-blue-200",
    border: "border-blue-300",
    shadow: "shadow-blue-100",
  },
  {
    name: "Lavender Purple",
    value: "#a78bfa",
    bg: "bg-gradient-to-br from-purple-100 to-purple-200",
    border: "border-purple-300",
    shadow: "shadow-purple-100",
  },
  {
    name: "Coral Orange",
    value: "#fb923c",
    bg: "bg-gradient-to-br from-orange-100 to-orange-200",
    border: "border-orange-300",
    shadow: "shadow-orange-100",
  },
];

const StickyNotes = () => {
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState(STICKY_NOTE_COLORS[0]);
  const [draggedNote, setDraggedNote] = useState(null);
  const [deletingNoteId, setDeletingNoteId] = useState(null);
  const [isCreatingAndEditing, setIsCreatingAndEditing] = useState(false); // New state to track creation flow
  const session = useSession();

  // Query to fetch sticky notes
  const {
    data: stickyData,
    isLoading: stickyLoading,
    error: stickyError,
    refetch: stickyRefetch,
  } = useQuery({
    queryKey: ["sticky-Query", session?.data?.user?.email],
    queryFn: () => getStickyNotes(session?.data),
    enabled: !!session?.data,
  });

  console.log("stickyData", stickyData);

  // Update notes when query data changes
  useEffect(() => {
    if (stickyData?.status === "success" && stickyData?.data) {
      setNotes(stickyData.data);
    }
  }, [stickyData]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(stickyNoteSchema),
    defaultValues: {
      title: "Untitled Note",
      content: "Start writing here...",
      color: STICKY_NOTE_COLORS[0].value,
    },
  });

  const onClose = () => {
    setOpen(false);
    setSearchQuery("");
    reset();
  };

  const onDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedNote(null);
  };

  const onEditClose = () => {
    setEditOpen(false);
    setSelectedNote(null);
    setIsCreatingAndEditing(false);
    reset();
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (note) => {
    setSelectedNote(note);
    setDetailsOpen(true);
  };

  const handleEditClick = (note) => {
    setSelectedNote(note);
    setValue("title", note.title);
    setValue("content", note.content);
    setValue("color", note.color);
    const color = STICKY_NOTE_COLORS.find((c) => c.value === note.color);
    setSelectedColor(color || STICKY_NOTE_COLORS[0]);
    setDetailsOpen(false);
    setEditOpen(true);
  };

  // Generate a title from content (first few words)
  const generateTitleFromContent = (content) => {
    if (!content || content.trim() === "") {
      return "Untitled Note";
    }
    
    // Take first 50 characters and add ellipsis if longer
    const firstLine = content.split('\n')[0];
    const title = firstLine.length > 50 ? firstLine.substring(0, 50) + "..." : firstLine;
    return title || "Untitled Note";
  };

  // Modified quick add note function - creates note and opens for editing immediately
  const handleQuickAddNote = async () => {
    const randomColor = STICKY_NOTE_COLORS[Math.floor(Math.random() * STICKY_NOTE_COLORS.length)];
    
    const noteData = {
      title: "Untitled Note", // Default title, will be updated based on content
      content: "Start writing here...", // Start with empty content
      color: randomColor.value,
    };

    console.log("noteData", noteData);

    startTransition(async () => {
      try {
        setLoading(true);
        // Call the API to create sticky note
        const response = await createStickyNote(noteData, session?.data);

        if (response.status === "success") {
          console.log("response", response?.data);
          
          // Show success message
          toast.success("Note created! Add your content...", {
            duration: 1500,
          });

          // Refetch the data to get updated list
          await stickyRefetch();
          
          // Set up for immediate editing
          const newNote = response.data;
          setSelectedNote(newNote);
          setValue("title", newNote.title);
          setValue("content", "");
          setValue("color", newNote.color);
          setSelectedColor(randomColor);
          setIsCreatingAndEditing(true);
          setEditOpen(true);
          
          setLoading(false);
        }
        if (response.status === "fail" || response.status === "error") {
          toast.error(response.message, {
            duration: 3000,
          });
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Something went wrong", {
          duration: 3000,
        });
        setLoading(false);
      }
    });
  };

  const handleEditNote = async (data) => {
    if (!selectedNote) return;

    // Generate title from content if it's empty or default
    const titleFromContent = generateTitleFromContent(data.content);
    
    const noteData = {
      ...data,
      title: titleFromContent, // Auto-generate title from content
      id: selectedNote._id,
      updatedAt: new Date().toISOString(),
    };
    
    const payload = {
      type: "update",
      data: noteData,
    };

    startTransition(async () => {
      try {
        setLoading(true);

        const response = await updateStickyNote(payload, session?.data);
        if (response.status === "success") {
          const successMessage = isCreatingAndEditing 
            ? "Note created successfully!" 
            : "Note updated successfully!";
          
          toast.success(successMessage, { duration: 1000 });
          stickyRefetch();
          setEditOpen(false);
          setSelectedNote(null);
          setIsCreatingAndEditing(false);
          reset();
          setLoading(false);
        }
        if (response.status === "fail" || response.status === "error") {
          toast.error(response.message, {
            duration: 3000,
          });
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Something went wrong", {
          duration: 3000,
        });
        setLoading(false);
      }
    });
  };

  // Quick delete function for card delete button
  const handleQuickDelete = async (e, noteId, noteTitle) => {
    e.stopPropagation();
    
    // Get first 30 chars of content for confirmation
    const note = notes.find(n => n._id === noteId);
    const displayText = note?.content?.substring(0, 30) + (note?.content?.length > 30 ? "..." : "") || "this note";
    
    if (!window.confirm(`Are you sure you want to delete "${displayText}"?`)) {
      return;
    }

    setDeletingNoteId(noteId);

    try {
      const payload = {
        type: "delete",
        data: {
          id: noteId,
        },
      };

      const response = await updateStickyNote(payload, session?.data);
      if (response.status === "success") {
        toast.success("Note deleted successfully", { duration: 1000 });
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note._id !== noteId)
        );
      }
      if (response.status === "fail" || response.status === "error") {
        toast.error(response.message, {
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong", {
        duration: 3000,
      });
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handleDeleteNote = async (noteId) => {
    startTransition(async () => {
      try {
        setLoading(true);
        const payload = {
          type: "delete",
          data: {
            id: noteId,
          },
        };

        const response = await updateStickyNote(payload, session?.data);
        if (response.status === "success") {
          toast.success("Note deleted successfully", { duration: 1000 });
          setNotes((prevNotes) =>
            prevNotes.filter((note) => note._id !== noteId)
          );
          setDetailsOpen(false);
          setSelectedNote(null);
          setLoading(false);
        }
        if (response.status === "fail" || response.status === "error") {
          toast.error(response.message, {
            duration: 3000,
          });
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Something went wrong", {
          duration: 3000,
        });
        setLoading(false);
      }
    });
  };

  const getColorClass = (colorValue) => {
    const color = STICKY_NOTE_COLORS.find((c) => c.value === colorValue);
    return color ? color : STICKY_NOTE_COLORS[0];
  };

  // Drag and Drop handlers
  const handleDragStart = (e, note) => {
    setDraggedNote(note);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetNote) => {
    e.preventDefault();

    if (!draggedNote || draggedNote._id === targetNote._id) return;

    const draggedIndex = notes.findIndex(
      (note) => note._id === draggedNote._id
    );
    const targetIndex = notes.findIndex((note) => note._id === targetNote._id);

    const newNotes = [...notes];
    newNotes.splice(draggedIndex, 1);
    newNotes.splice(targetIndex, 0, draggedNote);

    setNotes(newNotes);
    setDraggedNote(null);
    toast.success("Note reordered successfully", { duration: 1000 });
  };

  // Show loading state while fetching data
  if (stickyLoading) {
    return (
      <div className="relative">
        <Button
          type="button"
          size="icon"
          className="h-10 w-10 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => setOpen(true)}
        >
          <Icon icon="heroicons:document-text" className="w-5 h-5 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <Button
          type="button"
          size="icon"
          className="h-6 w-6 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => setOpen(true)}
        >
          <Icon icon="heroicons:document-text" className="w-4 h-4 text-white" />
        </Button>
        {notes.length > 0 && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
            {notes.length}
          </div>
        )}
      </div>

      {/* Main Dialog */}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent hiddenCloseIcon size="xl" className="max-w-4xl">
          {stickyLoading ? (
            <div className="h-[500px] flex items-center justify-center flex-col space-y-2">
              <span className="inline-flex gap-1">
                <PropagateLoader
                  color="#2db9c2"
                  size={20}
                  loading={stickyLoading}
                />
              </span>
              <p className="text-gray-500 text-sm">Loading your notes...</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[90vh] overflow-y-auto p-2">
              <div className="mb-2 px-2">
                <div className="-mx-6 -mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200 px-6 py-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 mt-2">
                      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-xl shadow-lg">
                        <StickyNote className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                          Sticky Notes
                        </DialogTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="px-2 py-1">
                            {notes.length} notes
                          </Badge>
                          <span className="text-sm">
                            Capture your thoughts instantly
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 rounded-full hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                      onClick={onClose}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Search Bar */}
                  <div className="mt-6 flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="Search your notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-12 bg-white/80 backdrop-blur border-gray-200 rounded-xl shadow-sm focus:shadow-md transition-all duration-200"
                      />
                    </div>
                    <Button
                      onClick={handleQuickAddNote}
                      disabled={isPending || loading}
                      className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isPending || loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5 mr-2" />
                          New Note
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Show loader when creating note */}
              {(loading || isPending) && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center flex-col space-y-2">
                  <span className="inline-flex gap-1">
                    <PropagateLoader
                      color="#2db9c2"
                      size={15}
                      loading={loading || isPending}
                    />
                  </span>
                  <p className="text-gray-500 text-sm">
                    {loading ? "Creating your note..." : "Working on it..."}
                  </p>
                </div>
              )}

              <div className="space-y-8">
                {/* Notes List */}
                {filteredNotes.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Your Notes
                    </h3>
                    <ScrollArea className="h-[500px] w-full">
                      <div className="space-y-4 pr-4">
                        {filteredNotes.map((note) => {
                          const colorClasses = getColorClass(note.color);
                          const isDeleting = deletingNoteId === note._id;

                          return (
                            <div
                              key={note._id}
                              draggable={!isDeleting}
                              onDragStart={(e) => handleDragStart(e, note)}
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, note)}
                              className={cn(
                                "group relative p-5 rounded-2xl border-2 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1",
                                colorClasses.bg,
                                colorClasses.border,
                                colorClasses.shadow,
                                draggedNote?._id === note._id
                                  ? "opacity-50 scale-95"
                                  : "",
                                isDeleting ? "opacity-50 pointer-events-none" : ""
                              )}
                              onClick={(e) => {
                                if (!isDeleting) {
                                  e.stopPropagation();
                                  handleCardClick(note);
                                }
                              }}
                            >
                              {/* Quick Action Buttons */}
                              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="w-8 h-8 bg-white/80 hover:bg-blue-500 hover:text-white rounded-lg shadow-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(note);
                                  }}
                                  disabled={isDeleting}
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </Button>

                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="w-8 h-8 bg-white/80 hover:bg-red-500 hover:text-white rounded-lg shadow-sm"
                                  onClick={(e) => handleQuickDelete(e, note._id, note.title)}
                                  disabled={isDeleting}
                                >
                                  {isDeleting ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-3.5 h-3.5" />
                                  )}
                                </Button>

                                <div className="w-8 h-8 bg-white/80 rounded-lg shadow-sm flex items-center justify-center">
                                  <GripVertical className="w-3.5 h-3.5 text-gray-400 cursor-grab active:cursor-grabbing" />
                                </div>
                              </div>

                              {/* Content - Only show content, no title */}
                              <p className="text-gray-700 text-sm leading-relaxed line-clamp-6 mb-4 pr-20 min-h-[20px]">
                                {note.content || "Empty note - click to add content"}
                              </p>

                              {/* Footer */}
                              <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-300/50 pt-3">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {dayjs(note.createdAt).format("MMM D, YYYY")}
                                </div>
                                {note.updatedAt &&
                                  note.updatedAt !== note.createdAt && (
                                    <div className="flex items-center gap-1 text-blue-600">
                                      <Clock className="w-3 h-3" />
                                      Edited
                                    </div>
                                  )}
                              </div>

                              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl pointer-events-none" />

                              {isDeleting && (
                                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                  <div className="flex items-center gap-2 text-red-600">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm font-medium">Deleting...</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {/* Empty States */}
                {filteredNotes.length === 0 && (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-xl">
                      <StickyNote className="w-12 h-12 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {searchQuery
                        ? "No matching notes found"
                        : "Ready to capture your first thought?"}
                    </h3>
                    <p className="text-gray-500 text-base mb-6 max-w-md mx-auto">
                      {searchQuery
                        ? "Try different keywords or create a new note"
                        : "Click 'New Note' to start writing instantly - no titles needed, just your thoughts"}
                    </p>
                    {searchQuery ? (
                      <Button
                        variant="outline"
                        onClick={() => setSearchQuery("")}
                        className="px-6 h-12 rounded-xl"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear Search
                      </Button>
                    ) : (
                      <Button
                        onClick={handleQuickAddNote}
                        disabled={isPending || loading}
                        className="px-8 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl shadow-lg"
                      >
                        {isPending || loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus className="w-5 h-5 mr-2" />
                            Start Writing
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <DialogDescription className="py-0 px-1"></DialogDescription>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Note Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={onDetailsClose}>
        <DialogContent hiddenCloseIcon size="lg" className="max-w-2xl">
          <ScrollArea className="max-h-[80vh] overflow-y-auto p-2">
            {selectedNote && (
              <div className="space-y-6 relative">
                {(loading || isPending) && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center flex-col space-y-2">
                    <span className="inline-flex gap-1">
                      <PropagateLoader
                        color="#2db9c2"
                        size={15}
                        loading={loading || isPending}
                      />
                    </span>
                    <p className="text-gray-500 text-sm">Deleting note...</p>
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full",
                        getColorClass(selectedNote.color)
                          .bg.replace("bg-gradient-to-br from-", "bg-")
                          .replace(/-100 to-.*/, "-400")
                      )}
                    ></div>
                    <h2 className="text-xl font-semibold text-gray-800 leading-tight">
                      Note Details
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-red-50 hover:text-red-500"
                    onClick={onDetailsClose}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-base">
                    {selectedNote.content || "This note is empty"}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Created{" "}
                        {dayjs(selectedNote.createdAt).format("MMM D, YYYY")}
                      </span>
                    </div>
                    {selectedNote.updatedAt &&
                      selectedNote.updatedAt !== selectedNote.createdAt && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            Last edited{" "}
                            {dayjs(selectedNote.updatedAt).format(
                              "MMM D, YYYY"
                            )}
                          </span>
                        </div>
                      )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteNote(selectedNote._id)}
                    disabled={loading || isPending}
                    className="px-6 h-11 text-red-600 border-red-200 hover:bg-red-500 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    onClick={() => handleEditClick(selectedNote)}
                    className="px-6 h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Note
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog - Title field hidden */}
      <Dialog open={editOpen} onOpenChange={onEditClose}>
        <DialogContent hiddenCloseIcon size="lg" className="max-w-2xl">
          <ScrollArea className="max-h-[80vh] overflow-y-auto p-2">
            <div className="space-y-2 px-2 relative">
              {(loading || isPending) && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center flex-col space-y-2">
                  <span className="inline-flex gap-1">
                    <PropagateLoader
                      color="#2db9c2"
                      size={15}
                      loading={loading || isPending}
                    />
                  </span>
                  <p className="text-gray-500 text-sm">
                    {isCreatingAndEditing ? "Creating note..." : "Saving changes..."}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isCreatingAndEditing ? "Write Your Note" : "Edit Note"}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-red-50 hover:text-red-500"
                  onClick={onEditClose}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form
                onSubmit={handleSubmit(handleEditNote)}
                className="space-y-6"
              >
                {/* Hidden title field - still registered for form validation */}
                <input
                  type="hidden"
                  {...register("title")}
                />

                {/* Content field - main focus */}
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-content"
                    className="text-sm font-medium text-gray-700"
                  >
                    {isCreatingAndEditing ? "What's on your mind?" : "Content"}
                  </Label>
                  <Textarea
                    id="edit-content"
                    {...register("content")}
                    placeholder="Start typing your note here..."
                    rows={8}
                    className="rounded-xl text-base leading-relaxed"
                    autoFocus
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm">
                      {errors.content.message}
                    </p>
                  )}
                </div>

                {/* Color selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Color Theme
                  </Label>
                  <div className="flex gap-3 flex-wrap">
                    {STICKY_NOTE_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={cn(
                          "w-10 h-10 rounded-xl border-2 transition-all duration-200",
                          color.bg,
                          selectedColor.value === color.value
                            ? "border-gray-800 scale-110"
                            : "border-gray-300"
                        )}
                        onClick={() => {
                          setSelectedColor(color);
                          setValue("color", color.value);
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onEditClose}
                    className="px-6 h-11 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || isPending}
                    className="px-6 h-11 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl"
                  >
                    {loading || isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {isCreatingAndEditing ? "Creating..." : "Saving..."}
                      </>
                    ) : (
                      <>{isCreatingAndEditing ? "Create Note" : "Save Changes"}</>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StickyNotes;
