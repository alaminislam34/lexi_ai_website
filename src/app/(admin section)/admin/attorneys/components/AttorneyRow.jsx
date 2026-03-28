/**
 * Attorney Table Row Component
 */

import React, { useState } from "react";
import Image from "next/image"; // ১. Next.js Image ইমপোর্ট করুন
import { useUpdateTier } from "../../../../../hooks/useUpdateTier";
import { Button } from "../../../../../components/ui/Button";
import { Select } from "../../../../../components/ui/Select";
import { formatDistanceToNow } from "date-fns";
import { Eye } from "lucide-react";

const TIER_OPTIONS = [
  { value: "", label: "Unassigned" },
  { value: "one", label: "Tier One" },
  { value: "two", label: "Tier Two" },
  { value: "three", label: "Tier Three" },
];

// ... (getTierColor এবং getTierLabel ফাংশন একই থাকবে)

export const AttorneyRow = ({
  attorney,
  onDetailsClick,
  isLoading = false,
}) => {
  const [localTier, setLocalTier] = useState(attorney.tier);

  const { mutate: updateTier, isPending } = useUpdateTier({
    attorneyId: attorney.id,
    onSuccess: (data) => {
      setLocalTier(data.tier);
    },
  });

  const handleTierChange = (e) => {
    const newTier = e.target.value || null;
    setLocalTier(newTier);
    updateTier({ tier: newTier });
  };

  const createdDate = new Date(attorney.created_at);
  const formattedDate = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
      {/* Full Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {attorney.profile_image && (
            <div className="relative h-8 w-8 shrink-0">
              <Image
                src={attorney.profile_image}
                alt={attorney.full_name}
                fill
                sizes="32px"
                className="rounded-full object-cover"
              />
            </div>
          )}
          <span className="text-white font-medium">{attorney.full_name}</span>
        </div>
      </td>

      {/* Email */}
      <td className="px-6 py-4">
        <span className="text-gray-300 text-sm">{attorney.email}</span>
      </td>

      {/* Gender */}
      <td className="px-6 py-4">
        <span className="text-gray-300 text-sm capitalize">
          {attorney.gender || "—"}
        </span>
      </td>

      {/* Email Verified */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
            attorney.email_verified
              ? "bg-green-500/10 text-green-400 border-green-500/30"
              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
          }`}
        >
          {attorney.email_verified ? "✓ Verified" : "Pending"}
        </span>
      </td>

      {/* Tier */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Select
            value={localTier || ""}
            options={TIER_OPTIONS}
            onChange={handleTierChange}
            disabled={isPending || isLoading}
            className="flex-1"
          />
        </div>
      </td>

      {/* Created At */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-gray-300 text-sm">
            {new Date(attorney.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="text-gray-500 text-xs">{formattedDate}</span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDetailsClick(attorney)}
          disabled={isPending || isLoading}
          icon={<Eye className="h-4 w-4" />}
        >
          Details
        </Button>
      </td>
    </tr>
  );
};

export default AttorneyRow;
