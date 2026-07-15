"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/api/userService";
import { format } from "date-fns";
import { FiUser, FiMail, FiShield, FiClock, FiCheckCircle, FiActivity, FiXCircle, FiEdit2, FiCamera, FiX, FiSave, FiLoader } from "react-icons/fi";
import Image from "next/image";
import { toast } from "sonner";

export default function ProfilePageClient() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userService.getMe,
  });

  const profile = response?.data;

  const updateProfileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await userService.updateProfile(formData);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update profile.");
    },
  });

  useEffect(() => {
    // Cleanup preview URL to avoid memory leaks
    return () => {
      if (previewUrl && selectedFile) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, selectedFile]);

  if (isLoading) {
    return (
      <div className="flex-1 p-6 md:p-8 animate-pulse">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-48 bg-[#1E3A5A] rounded-2xl border border-[#47596E]"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-[#1E3A5A] rounded-2xl border border-[#47596E]"></div>
            <div className="h-64 bg-[#1E3A5A] rounded-2xl border border-[#47596E]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center text-[#ff6b6b]">
          <p className="text-lg">Failed to load profile details.</p>
        </div>
      </div>
    );
  }

  const handleEditClick = () => {
    setEditName(profile.name);
    setSelectedFile(null);
    setPreviewUrl(profile.profileImage || null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clean up previous preview URL
      if (previewUrl && selectedFile) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    const formData = new FormData();
    formData.append("userName", editName);
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    updateProfileMutation.mutate(formData);
  };

  const avatarDisplayUrl = isEditing ? previewUrl : profile.profileImage;

  return (
    <div className="flex-1 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header / Banner Card */}
        <div className="relative bg-[#1E3A5A] rounded-2xl p-8 border border-[#47596E] shadow-xl overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6 group transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          
          <div className="relative group/avatar shrink-0">
            <div className={`relative w-32 h-32 rounded-full border-4 ${isEditing ? 'border-[#0a9396] shadow-[0_0_15px_rgba(10,147,150,0.4)]' : 'border-[#0a9396]/20'} bg-[#15273b] flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-300`}>
              {avatarDisplayUrl ? (
                <Image src={avatarDisplayUrl} alt={profile.name} fill className="object-cover" />
              ) : (
                <span className="text-4xl font-bold text-[#0a9396]">
                  {(isEditing && editName ? editName : profile.name).charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            {isEditing && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 bg-[#0a9396] hover:bg-[#087a7c] text-white rounded-full shadow-lg border-2 border-[#1E3A5A] transition-colors z-10"
                title="Change Photo"
              >
                <FiCamera className="w-5 h-5" />
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>
          
          <div className="flex-1 text-center sm:text-left mt-2 flex flex-col sm:flex-row justify-between w-full">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-3">
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-2xl sm:text-3xl font-bold text-white tracking-tight bg-[#15273b] border border-[#0a9396]/50 rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-[#0a9396]/50 transition-all w-full max-w-[250px]"
                    placeholder="Enter your name"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-white tracking-tight">{profile.name}</h1>
                )}
                {!isEditing && profile.isVerified && (
                  <FiCheckCircle className="text-[#0a9396] w-6 h-6 shrink-0" title="Verified Account" />
                )}
              </div>
              
              <p className="text-[#89a8c7] mt-2 text-lg flex items-center justify-center sm:justify-start gap-2">
                <FiMail className="w-5 h-5 shrink-0" />
                <span className="truncate">{profile.email}</span>
              </p>
              
              <div className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span className="px-4 py-1.5 rounded-full bg-[#0a9396]/10 text-[#0a9396] border border-[#0a9396]/20 text-sm font-semibold tracking-wide flex items-center gap-2 shadow-sm">
                  <FiShield className="w-4 h-4" />
                  {profile.role}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide flex items-center gap-2 border shadow-sm ${
                  profile.status === "ACTIVE" 
                    ? "bg-green-500/10 text-green-400 border-green-500/20" 
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}>
                  {profile.status === "ACTIVE" ? <FiActivity className="w-4 h-4" /> : <FiXCircle className="w-4 h-4" />}
                  {profile.status}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 sm:mt-0 flex justify-center sm:justify-end shrink-0">
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelEdit}
                    disabled={updateProfileMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-[#23354a] transition-colors border border-transparent hover:border-[#47596E] font-medium"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0a9396] hover:bg-[#087a7c] text-white transition-all shadow-lg font-medium disabled:opacity-70"
                  >
                    {updateProfileMutation.isPending ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#23354a] hover:bg-[#2a405a] border border-[#47596E] text-white transition-all shadow-lg font-medium h-fit"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Account Details */}
          <div className="bg-[#1E3A5A]/50 rounded-2xl p-6 border border-[#47596E]/60 backdrop-blur-sm shadow-lg hover:border-[#47596E] transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <FiUser className="text-[#0a9396]" />
              Account Details
            </h2>
            <div className="space-y-5">
              <InfoRow label="User ID" value={profile.userId} />
              <InfoRow label="Provider" value={profile.provider} />
              <InfoRow label="Registration Date" value={format(new Date(profile.createdAt), "PPP p")} />
              <InfoRow label="Last Updated" value={format(new Date(profile.updatedAt), "PPP p")} />
            </div>
          </div>

          {/* Activity & Status */}
          <div className="bg-[#1E3A5A]/50 rounded-2xl p-6 border border-[#47596E]/60 backdrop-blur-sm shadow-lg hover:border-[#47596E] transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <FiClock className="text-[#0a9396]" />
              Activity & Status
            </h2>
            <div className="space-y-5">
              <InfoRow label="Last Active" value={format(new Date(profile.lastActive), "PPP p")} />
              <InfoRow 
                label="Account Verified" 
                value={profile.isVerified ? "Yes" : "No"} 
                valueColor={profile.isVerified ? "text-green-400" : "text-yellow-400"}
              />
              <InfoRow 
                label="Currently Active" 
                value={profile.isActive ? "Yes" : "No"} 
                valueColor={profile.isActive ? "text-green-400" : "text-red-400"}
              />
              <InfoRow 
                label="Deleted" 
                value={profile.isDeleted ? "Yes" : "No"} 
                valueColor={profile.isDeleted ? "text-red-400" : "text-gray-300"}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, valueColor = "text-white" }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-2 border-b border-[#47596E]/30 last:border-0 last:pb-0">
      <span className="text-[#89a8c7] text-sm font-medium">{label}</span>
      <span className={`text-sm font-semibold truncate ${valueColor}`}>{value}</span>
    </div>
  );
}
