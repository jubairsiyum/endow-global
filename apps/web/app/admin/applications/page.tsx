import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import AdminTable from "@/components/ui/AdminTable";

const applications = [
  {
    student: "Rahim Ahmed",
    university: "University of Melbourne",
    country: "Australia",
    status: "Approved",
  },
  {
    student: "Nusrat Jahan",
    university: "University of Sydney",
    country: "Australia",
    status: "Pending",
  },
  {
    student: "Tanvir Hasan",
    university: "University of Toronto",
    country: "Canada",
    status: "Processing",
  },
];

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      
      {/* PAGE HEADER */}
      <PageHeader
        title="Applications"
        description="Manage all student applications."
        buttonText="New Application"
      />

      {/* SEARCH */}
      <div className="flex flex-col gap-4 lg:flex-row">
        
        <input
          type="text"
          placeholder="Search applications..."
          className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3 text-gray-900 outline-none transition-all focus:border-primary dark:border-gray-800 dark:bg-[#1a1d25] dark:text-white dark:placeholder:text-gray-500"
        />

        <button className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-[#1a1d25] dark:text-white dark:hover:bg-[#222530]">
          Filter
        </button>
      </div>

      {/* TABLE */}
      <AdminTable>
        
        <div className="overflow-x-auto">
          
          {/* HEADER */}
          <div className="grid min-w-[850px] grid-cols-5 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600 dark:border-gray-800 dark:bg-[#222530] dark:text-gray-300">
            
            <div>Student</div>

            <div>University</div>

            <div>Country</div>

            <div>Status</div>

            <div>Action</div>
          </div>

          {/* ROWS */}
          {applications.map((application, index) => (
            <div
              key={index}
              className="grid min-w-[850px] grid-cols-5 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-[#1a1d25]"
            >
              
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {application.student}
                </p>
              </div>

              <div className="text-gray-700 dark:text-gray-300">
                {application.university}
              </div>

              <div className="text-gray-700 dark:text-gray-300">
                {application.country}
              </div>

              <div>
                <StatusBadge
                  status={application.status}
                />
              </div>

              <div>
                <button className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 dark:bg-[#222530] dark:text-white dark:hover:bg-[#2d3340]">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </AdminTable>
    </div>
  );
}