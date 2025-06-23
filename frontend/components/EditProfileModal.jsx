"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { useUserContext } from "@/hooks/userContext";

export const EditProfileModal = ({ open, onOpenChange, user, onSuccess }) => {
  const [name, setName] = useState(user.name || "");
  const [imageUrl, setImageUrl] = useState(user.imageUrl || "");
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserContext();
  const fileInputRef = useRef(null);

  const handleSave = async () => {
    if (!name.trim()) return toast("Name is required");

    setLoading(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${user._id}`,
        {
          name,
          imageUrl,
        }
      );
      if (res.data.success) {
        toast("Profile updated successfully");
        setUser(res?.data?.user)
        onSuccess();
        onOpenChange(false);
      }
    } catch (err) {
      console.error(err);
      toast("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await handleUpload(file); // custom upload function
      setImageUrl(url);
    }
  };

  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Stay-finder");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/yashdesh/image/upload",
        formData
      );

      if (response.data.secure_url) {
        return response.data.secure_url;
      } else {
        throw new Error("No secure_url returned from Cloudinary");
      }
    } catch (error) {
      console.log("Error in uploading file", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Avatar with Upload Overlay */}
          <div className="relative w-fit mx-auto">
            <Avatar className="w-24 h-24">
              <AvatarImage src={imageUrl} />
              <AvatarFallback>
                {user.name?.[0] || <span className="text-lg">👤</span>}
              </AvatarFallback>
            </Avatar>

            {/* Upload icon overlay */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-white rounded-full p-1 border shadow cursor-pointer"
              title="Change profile image"
            >
              <Upload size={16} className="text-gray-700" />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Name Field */}
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button disabled={loading} onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
