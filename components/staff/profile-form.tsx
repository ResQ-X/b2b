"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhotoUpload } from "./photo-upload";
import type { StaffProfile } from "@/types/staff";

interface ProfileFormProps {
  profile: StaffProfile;
  type: "responder" | "admin";
  mode: "view" | "edit";
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: (profile: StaffProfile) => void;
}

export function ProfileForm({
  profile: initialProfile,
  // type,
  mode,
}: // onEdit,
// onDelete,
// onSave,
ProfileFormProps) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [photo, setPhoto] = useState<string>();

  // const handleSave = async () => {
  //   if (onSave) {
  //     onSave({ ...profile, photo });
  //   }
  // };

  console.log("profile:", profile);

  const shortenId = (id: string) => {
    return `prof-${id.split("-")[0].substring(0, 5)}`;
  };

  // const getStatusText = (isOnline: boolean | null | undefined) => {
  //   return isOnline ? "Online" : "Offline";
  // };

  // const getIsVerified = (isVerified: boolean | null | undefined) => {
  //   return isVerified ? "Yes" : "No";
  // };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl p-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="flex items-center gap-6 mb-8">
        <PhotoUpload currentPhoto={photo} onPhotoChange={setPhoto} />
        <div>
          <h1 className="text-2xl font-semibold">{profile?.name}</h1>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-gray-500">ID: {shortenId(profile?.id)}</span>
            <span className="text-gray-500">Role: {profile?.userType}</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Email Address</label>
            <Input
              value={profile?.email}
              disabled={mode === "view"}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Contact Number</label>
            <Input
              value={profile?.phone}
              disabled={mode === "view"}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Address</label>
            <Input
              value={profile?.address || "null"}
              disabled={mode === "view"}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Status</label>
            {/* {mode === "view" ? (
              <Input value={getStatusText(profile?.is_online)} disabled />
            ) : (
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={profile?.is_online ? "true" : "false"}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    is_online: e.target.value === "true",
                  })
                }
              >
                <option value="true">Online</option>
                <option value="false">Offline</option>
              </select>
            )} */}
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Verified</label>
            {/* {mode === "view" ? (
              <Input value={getIsVerified(profile?.is_verified)} disabled />
            ) : (
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={profile?.is_verified ? "true" : "false"}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    is_verified: e.target.value === "true",
                  })
                }
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            )} */}
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Country</label>
            <Input
              value={profile?.country || "null"}
              disabled={mode === "view"}
              onChange={(e) =>
                setProfile({ ...profile, country: e.target.value })
              }
            />
          </div>
        </div>

        {/* <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Start Date</label>
            <Input
              value={profile.startDate}
              disabled={mode === "view"}
              onChange={(e) =>
                setProfile({ ...profile, startDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">End Date</label>
            <Input
              value={profile.endDate}
              disabled={mode === "view"}
              onChange={(e) =>
                setProfile({ ...profile, endDate: e.target.value })
              }
            />
          </div>
          {type === "responder" && (
            <div className="space-y-2">
              <label className="text-sm text-gray-500">Assigned Vehicle</label>
              <Input
                value={profile.assignedVehicle}
                disabled={mode === "view"}
                onChange={(e) =>
                  setProfile({ ...profile, assignedVehicle: e.target.value })
                }
              />
            </div>
          )}
        </div> */}

        <div>
          <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-500">Bank Name</label>
              <Input
                value={profile?.payment?.bankName}
                disabled={mode === "view"}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    payment: { ...profile.payment, bankName: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-500">Account Number</label>
              <Input
                value={profile?.payment?.accountNumber}
                disabled={mode === "view"}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    payment: {
                      ...profile.payment,
                      accountNumber: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-500">Frequency</label>
              <Input
                value={profile?.payment?.frequency}
                disabled={mode === "view"}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    payment: { ...profile.payment, frequency: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Assigned Items</h2>
          <textarea
            className="w-full h-32 p-3 border rounded-lg resize-none disabled:bg-transparent disabled:border-none"
            value={profile?.assignedItems?.join("\n")}
            disabled={mode === "view"}
            onChange={(e) =>
              setProfile({
                ...profile,
                assignedItems: e.target.value.split("\n"),
              })
            }
          />
        </div>

        {/* <div className="flex justify-end gap-4">
          {mode === "view" ? (
            <>
              <Button className="bg-orange hover:bg-orange/90" onClick={onEdit}>
                Edit Profile
              </Button>
              <Button
                variant="outline"
                className="border-orange text-orange hover:bg-orange/10"
                onClick={onDelete}
              >
                Delete Profile
              </Button>
            </>
          ) : (
            <Button
              className="bg-orange hover:bg-orange/90"
              onClick={handleSave}
            >
              Save
            </Button>
          )}
        </div> */}
      </div>
    </div>
  );
}
