"use client";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Lock, LogOut, Pencil, Network } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ProfileInformation from "./personal-information";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  getUserProfile,
  editProfile,
  updateProfileImage,
} from "@/action/reqQ/controller";

const Profile = () => {
  const isActive = true;
  const session = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);



  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
    refetch: profileRefetch,
  } = useQuery({
    queryKey: ["profile-Query", session],
    queryFn: () => getUserProfile(session?.data),
    enabled: session.status === "authenticated",
  });

  useEffect(() => {
    if (profileData) {
      // console.log("profileData", profileData?.data);
      setProfile(profileData?.data);
    }
  }, [profileData]);

  // Handle file selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleEditImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (fileInputRef.current) {
      try {
        fileInputRef.current.click();
      } catch (error) {
        console.error("Error clicking file input:", error);
      }
    } else {
      console.error("File input ref is null");
    }
  };

  // Upload image
  const handleImageUpload = async () => {
    if (!selectedImage) return;

    try {
      setLoading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", selectedImage);

      const response = await updateProfileImage(formData, session?.data);

      if (response.status === "success") {
        toast.success("item created successfully", {
          autoClose: 1000,
        });
        setSelectedImage(null);
        setImagePreview(null);
        profileRefetch();
      }
      if (response.status === "fail") {
        toast.error(response.message, {
          autoClose: 1000,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response.data.msg, {
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Cancel image selection
  const handleCancelImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async (data) => {
    // console.log('called save function');
    try {
      setLoading(true);
      const payload = {
        type: data.type,
        data: data.data,
      };

      // console.log('payload send', payload);

      const response = await editProfile(payload, session?.data);
      if (response.status === "success") {
        toast.success("Updated successfully", {
          autoClose: 1000,
        });
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

  return (
    <>
      <Card className="flex items-center justify-center p-4 md:p-6">
        <CardContent className="md:flex-row w-full rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-white">
          <div className="flex flex-col md:flex-row w-full bg-white rounded-3xl overflow-hidden">
            <div className="w-full md:w-64 flex flex-col items-center py-10 space-y-6 flex-shrink-0 border-b md:border-b-0 md:border-r">
              <div className="relative inline-block">
                <Avatar className="h-[96px] w-[96px]">
                  <AvatarImage
                    src={
                      profile?.image ||
                      imagePreview ||
                      session?.data?.user?.image
                    }
                  />
                  <AvatarFallback>
                    {profile?.name || session?.data?.user?.name || "User"}
                  </AvatarFallback>
                </Avatar>

                <div
                  className="absolute bottom-0 right-0 bg-orange-400 p-2 rounded-full border-2 border-white cursor-pointer hover:bg-orange-500 transition-colors"
                  onClick={handleEditImageClick}
                >
                  <Pencil className="h-3 w-3 text-white" />
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  aria-label="Upload profile image"
                />
              </div>

              {/* Image upload controls - show when image is selected */}
              {selectedImage && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handleImageUpload}
                    disabled={loading}
                    className="bg-orange-400 hover:bg-orange-500 text-white"
                  >
                    {loading ? "Uploading..." : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelImage}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              <div className="text-center">
                <p className="font-bold text-sm text-gray-900 capitalize">
                  {profile?.name}
                </p>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {profile?.department?.name}
                </p>
              </div>

              <nav className="w-full mt-6 space-y-3 px-6">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full flex items-center justify-start space-x-2 rounded-full py-2 px-4 text-xs font-semibold h-auto",
                    isActive
                      ? "bg-orange-100 text-orange-600 hover:bg-orange-200 hover:text-orange-700"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-600",
                    false &&
                      "text-gray-400 cursor-not-allowed hover:bg-transparent hover:text-gray-400"
                  )}
                  disabled={false}
                >
                  <User className="h-4 w-4" />
                  <span>Personal Information</span>
                </Button>
              </nav>
            </div>

            <div className="flex-1">
              <ProfileInformation
                profile={profile}
                handleSaveProfile={handleSaveProfile}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Profile;
