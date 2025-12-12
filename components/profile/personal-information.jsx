import { Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/loading";
import { useState } from "react";

export default function ProfileForm({ profile = {}, handleSaveProfile }) {
  console.log('profile', profile);

  if (!profile) {
    return <Loader />;
  }

  // Store initial profile data for reset functionality
  const initialProfile = {
    gender: (profile?.gender?.toLowerCase() || "male"),
    name: (profile?.name || ""),
    email: (profile?.email || ""),
    officialEmail: (profile?.officialEmail || ""),
    address: (profile?.address || ""),
    phone: (profile?.contactNumber || ""),
    dob: (profile?.dateOfBirth || ""),
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const [formData, setFormData] = useState(initialProfile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleDiscard = () => {
    setFormData(initialProfile); // Reset to initial profile values
  };

  return (
    <div className="bg-white flex-1 p-8">
      <h2 className="font-semibold text-gray-900 text-sm mb-6">
        Personal Information
      </h2>
      <form className="space-y-6">
        <div>
          <div className="flex items-center space-x-6 text-xs text-gray-700 font-semibold">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={() => handleGenderChange("male")}
              />
              <Label htmlFor="male" className="font-semibold cursor-pointer">
                Male
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={() => handleGenderChange("female")}
              />
              <Label htmlFor="female" className="font-semibold cursor-pointer">
                Female
              </Label>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0">
          <div className="flex-1">
            <Label className="block text-xs text-gray-500 font-semibold mb-1">Name</Label>
            <Input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 text-gray-700 text-xs rounded-lg py-2 px-3 focus:outline-none border-transparent focus:border-orange-400 focus:ring-0 h-auto"
            />
          </div>
        </div>

        <div>
          <Label className="block text-xs text-gray-500 font-semibold mb-1">Email</Label>
          <div className="flex items-center space-x-3">
            <Input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              disabled
              className="flex-1 bg-gray-200 text-gray-700 text-xs rounded-lg px-3 focus:outline-none border-transparent h-auto cursor-not-allowed"
            />
            <div className="flex items-center space-x-1 text-green-500 text-xs font-semibold">
              <CheckCircle className="h-4 w-4" />
              <span>Verified</span>
            </div>
          </div>
        </div>
        <div>
          <Label className="block text-xs text-gray-500 font-semibold mb-1">Official Email</Label>
          <div className="flex items-center space-x-3">
            <Input
              type="email"
              name="officialEmail"
              value={formData.officialEmail || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 text-gray-700 text-xs rounded-lg py-2 px-3 focus:outline-none border-transparent focus:border-orange-400 focus:ring-0 h-auto"
            />
          </div>
        </div>
        

        <div>
          <Label className="block text-xs text-gray-500 font-semibold mb-1">Address</Label>
          <Input
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            className="w-full bg-gray-100 text-gray-700 text-xs rounded-lg py-2 px-3 focus:outline-none border-transparent focus:border-orange-400 focus:ring-0 h-auto"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0">
          <div className="flex-1">
            <Label className="block text-xs text-gray-500 font-semibold mb-1">Phone Number</Label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 text-gray-700 text-xs rounded-lg py-2 px-3 focus:outline-none border-transparent focus:border-orange-400 focus:ring-0 h-auto"
            />
          </div>
          <div className="flex-1">
            <Label className="block text-xs text-gray-500 font-semibold mb-1">Date of Birth</Label>
            <div className="relative">
              <Input
                type="date"
                name="dob"
                value={formData.dob || ""}
                onChange={handleChange}
                className="w-full bg-gray-100 text-gray-700 text-xs rounded-lg py-2 px-3 pr-8 focus:outline-none border-transparent focus:border-orange-400 focus:ring-0 h-auto"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-semibold text-gray-900 text-sm mt-6">
            Reset Password
          </h2>
          <div>
            <Label className="block text-xs text-gray-500 font-semibold mb-1">Current Password</Label>
            <Input
              type="password"
              name="currentPassword"
              value={formData.currentPassword || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 text-gray-700 text-xs rounded-lg py-2 px-3 focus:outline-none border-transparent focus:border-orange-400 focus:ring-0 h-auto"
            />
          </div>
          <div>
            <Label className="block text-xs text-gray-500 font-semibold mb-1">New Password</Label>
            <Input
              type="password"
              name="newPassword"
              value={formData.newPassword || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 text-gray-700 text-xs rounded-lg py-2 px-3 focus:outline-none border-transparent focus:border-orange-400 focus:ring-0 h-auto"
            />
          </div>
          <div>
            <Label className="block text-xs text-gray-500 font-semibold mb-1">Confirm New Password</Label>
            <Input
              type="password"
              name="confirmNewPassword"
              value={formData.confirmNewPassword || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 text-gray-700 text-xs rounded-lg py-2 px-3 focus:outline-none border-transparent focus:border-orange-400 focus:ring-0 h-auto"
            />
          </div>
        </div>

        <div className="flex space-x-4 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleDiscard}
            className="flex-1 border-orange-400 text-orange-500 text-xs font-semibold rounded-lg py-2 hover:bg-orange-50 hover:text-orange-600 transition h-auto"
          >
            Discard Changes
          </Button>
          <Button
            type="button"
            className="flex-1 bg-orange-500 text-white text-xs font-semibold rounded-lg py-2 hover:bg-orange-600 transition h-auto"
            onClick={() => handleSaveProfile({
              type: 'profile',
              data: formData
            })}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}