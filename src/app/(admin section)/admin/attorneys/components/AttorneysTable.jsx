/**
 * Attorneys Table Component
 */

import React, { useState } from "react";
import { useAttorneys } from "../../../../../hooks/useAttorneys";
import { AttorneyRow } from "./AttorneyRow";
import { AttorneyModal } from "./AttorneyModal";
import { Button } from "../../../../../components/ui/Button";
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

export const AttorneysTable = ({ pageSize = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAttorney, setSelectedAttorney] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error, isError } = useAttorneys({
    page: currentPage,
    pageSize,
  });

  const handleDetailsClick = (attorney) => {
    setSelectedAttorney(attorney);
    setIsModalOpen(true);
  };

  const handleNextPage = () => {
    if (data?.pagination?.has_next) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (data?.pagination?.has_previous) {
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading attorneys...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-400 mb-2">
          Error Loading Attorneys
        </h3>
        <p className="text-red-300 mb-4">
          {error?.message || "An unexpected error occurred"}
        </p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Empty State
  if (!data?.results || data.results.length === 0) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-12 text-center">
        <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-400 mb-2">
          No Attorneys Found
        </h3>
        <p className="text-gray-500">No attorneys available at this time.</p>
      </div>
    );
  }

  const { pagination, results } = data;
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, pagination.total);

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800/20">
        {/* Table Header Stats */}
        <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                All Attorneys
              </h3>
              <p className="text-sm text-gray-400">
                Showing {startIndex} to {endIndex} of {pagination.total} attorneys
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Total Attorneys
              </p>
              <p className="text-2xl font-bold text-white">{pagination.total}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-800/50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Full Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Gender
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Verification
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Tier
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Joined
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((attorney) => (
              <AttorneyRow
                key={attorney.id}
                attorney={attorney}
                onDetailsClick={handleDetailsClick}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination.total_pages > 1 && (
        <div className="mt-6 flex items-center justify-between p-4 rounded-lg border border-gray-700 bg-gray-800/20">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!pagination.has_previous}
              icon={<ChevronLeft className="h-4 w-4" />}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2 px-4">
              <span className="text-sm text-gray-400">
                Page <span className="font-semibold text-white">{currentPage}</span> of{" "}
                <span className="font-semibold text-white">
                  {pagination.total_pages}
                </span>
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!pagination.has_next}
              icon={<ChevronRight className="h-4 w-4" />}
            >
              Next
            </Button>
          </div>

          <div className="text-sm text-gray-400">
            Total: <span className="font-semibold text-white">{pagination.total}</span> items
          </div>
        </div>
      )}

      {/* Details Modal */}
      <AttorneyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        attorney={selectedAttorney}
      />
    </>
  );
};

export default AttorneysTable;
