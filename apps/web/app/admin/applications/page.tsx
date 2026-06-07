"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import AdminTable from "@/components/ui/AdminTable";
import { trpc } from "@/lib/trpc-client";
import Link from "next/link";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function ApplicationsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState<any>("");
  const [cursor, setCursor] = useState<string | null>(null);

  const { data, isLoading } = trpc.admin.applications.list.useQuery({
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    cursor: cursor,
    limit: 20,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Manage all student applications."
      />

      {/* SEARCH + FILTER */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCursor(null);
          }}
          placeholder="Search applications..."
          className="w-full lg:w-2/3 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-gray-900 outline-none transition-all focus:border-primary dark:border-gray-800 dark:bg-[#1a1d25] dark:text-white dark:placeholder:text-gray-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCursor(null);
          }}
          className="w-full lg:w-1/3 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 outline-none transition-all dark:border-gray-800 dark:bg-[#1a1d25] dark:text-white"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="DOCUMENTS_REQUIRED">Documents Required</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
          <option value="WAITLISTED">Waitlisted</option>
          <option value="WITHDRAWN">Withdrawn</option>
        </select>
      </div>

      {/* TABLE */}
      <AdminTable>
        <div className="overflow-x-auto">
          {/* HEADER */}
          <div className="grid min-w-[850px] grid-cols-5 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600 dark:border-gray-800 dark:bg-[#222530] dark:text-gray-300">
            <div>Student</div>
            <div>University</div>
            <div>Course</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {/* ROWS */}
          {isLoading ? (
            <div className="py-10 text-center">Loading...</div>
          ) : data?.items.length === 0 ? (
            <div className="py-10 text-center">No applications found</div>
          ) : (
            data?.items.map((application: any) => (
              <div
                key={application.id}
                className="grid min-w-[850px] grid-cols-5 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-[#1a1d25]"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {application.student?.user?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {application.student?.user?.email}
                  </p>
                </div>

                <div className="text-gray-700 dark:text-gray-300 truncate">
                  {application.course?.university?.name || "N/A"}
                </div>

                <div className="text-gray-700 dark:text-gray-300 truncate">
                  {application.course?.name || "N/A"}
                </div>

                <div>
                  <StatusBadge status={application.status} />
                </div>

                <div>
                  <Link href={`/admin/applications/${application.id}`}>
                    <button className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 dark:bg-[#222530] dark:text-white dark:hover:bg-[#2d3340]">
                      View
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </AdminTable>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2">
        <button 
          disabled={!cursor}
          onClick={() => setCursor(null)} 
          className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
        >
          First Page
        </button>
        <button
          disabled={!data?.nextCursor}
          onClick={() => data?.nextCursor && setCursor(data.nextCursor)}
          className="rounded-xl bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
