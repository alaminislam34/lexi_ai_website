/**
 * Attorney Details Modal Component
 */

import React from "react";
import Image from "next/image"; // ১. Next.js Image ইমপোর্ট করুন
import { Modal } from "../../../../../components/ui/Modal";
import { formatDistanceToNow } from "date-fns";
import { Shield, Mail, Phone, Calendar, MapPin, FileText } from "lucide-react";

export const AttorneyModal = ({ isOpen, onClose, attorney }) => {
  if (!attorney) return null;

  const createdDate = new Date(attorney.created_at);
  const formattedDate = createdDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  const getTierColor = (tier) => {
    switch (tier) {
      case "one":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "two":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "three":
        return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const getTierLabel = (tier) => {
    switch (tier) {
      case "one":
        return "Tier One";
      case "two":
        return "Tier Two";
      case "three":
        return "Tier Three";
      default:
        return "Unassigned";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Attorney Details" size="lg">
      <div className="space-y-6">
        {/* Header with Name and Avatar */}
        <div className="flex items-start gap-4 pb-6 border-b border-gray-700">
          {attorney.profile_image && (
            <div className="relative h-16 w-16">
              {" "}
              {/* ২. কন্টেইনার অ্যাড করুন */}
              <Image
                src={attorney.profile_image}
                alt={attorney.full_name}
                fill // ৩. fill প্রপ ব্যবহার করলে ইমেজ কন্টেইনার অনুযায়ী সাইজ হবে
                className="rounded-full object-cover border-2 border-gray-600"
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-1">
              {attorney.full_name}
            </h3>
            <p className="text-sm text-gray-400">
              {attorney.preferred_legal_area || "General Practice"}
            </p>
          </div>
        </div>

        {/* ... বাকি কোড একই থাকবে */}
        {/* Tier Badge */}
        <div>
          <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
            <Shield className="inline h-3 w-3 mr-1" />
            Tier Status
          </p>
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getTierColor(
              attorney.tier,
            )}`}
          >
            {getTierLabel(attorney.tier)}
          </span>
        </div>

        {/* Email Status */}
        <div>
          <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
            <Mail className="inline h-3 w-3 mr-1" />
            Verification Status
          </p>
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${
              attorney.email_verified
                ? "bg-green-500/10 text-green-400 border-green-500/30"
                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
            }`}
          >
            {attorney.email_verified ? "✓ Verified" : "Pending Verification"}
          </span>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
              Email
            </p>
            <p className="text-white break-all">{attorney.email}</p>
          </div>

          {attorney.phone && (
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
                <Phone className="inline h-3 w-3 mr-1" />
                Phone
              </p>
              <p className="text-white">{attorney.phone}</p>
            </div>
          )}

          {attorney.gender && (
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
                Gender
              </p>
              <p className="text-white capitalize">{attorney.gender}</p>
            </div>
          )}

          {attorney.location && (
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
                <MapPin className="inline h-3 w-3 mr-1" />
                Location
              </p>
              <p className="text-white">{attorney.location}</p>
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
              <Calendar className="inline h-3 w-3 mr-1" />
              Joined
            </p>
            <p className="text-white text-sm">{formattedDate}</p>
            <p className="text-gray-500 text-xs mt-1">{timeAgo}</p>
          </div>

          {attorney.updated_at && (
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
                Last Updated
              </p>
              <p className="text-white text-sm">
                {new Date(attorney.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>

        {/* Bio */}
        {attorney.bio && (
          <div className="pt-4 border-t border-gray-700">
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
              <FileText className="inline h-3 w-3 mr-1" />
              Bio
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {attorney.bio}
            </p>
          </div>
        )}

        {/* Status */}
        <div className="pt-4 border-t border-gray-700">
          <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
            Account Status
          </p>
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${
              attorney.is_active
                ? "bg-green-500/10 text-green-400 border-green-500/30"
                : "bg-red-500/10 text-red-400 border-red-500/30"
            }`}
          >
            {attorney.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default AttorneyModal;
