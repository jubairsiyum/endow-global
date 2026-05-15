import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import AdminTable from "@/components/ui/AdminTable";

const students = [
  {
    name: "Rahim Ahmed",
    email: "rahim@gmail.com",
    country: "Bangladesh",
    university: "University of Melbourne",
    status: "Active",
  },
  {
    name: "Nusrat Jahan",
    email: "nusrat@gmail.com",
    country: "Nepal",
    university: "University of Sydney",
    status: "Pending",
  },
  {
    name: "Tanvir Hasan",
    email: "tanvir@gmail.com",
    country: "India",
    university: "Seoul National University",
    status: "Approved",
  },
];

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      
      {/* PAGE HEADER */}
      <PageHeader
        title="Students"
        description="Manage all registered students."
        buttonText="Add Student"
      />

      {/* SEARCH + FILTER */}
      <div className="flex flex-col gap-4 lg:flex-row">
        
        <input
          type="text"
          placeholder="Search students..."
          className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3 text-gray-900 outline-none transition-all focus:border-primary dark:border-gray-800 dark:bg-[#1a1d25] dark:text-white dark:placeholder:text-gray-500"
        />

        <button className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-[#1a1d25] dark:text-white dark:hover:bg-[#222530]">
          Filter
        </button>
      </div>

      {/* TABLE */}
      <AdminTable>
        
        <div className="overflow-x-auto">
          
          {/* TABLE HEADER */}
          <div className="grid min-w-[900px] grid-cols-5 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600 dark:border-gray-800 dark:bg-[#222530] dark:text-gray-300">
            
            <div>Student</div>

            <div>Country</div>

            <div>University</div>

            <div>Status</div>

            <div>Action</div>
          </div>

          {/* TABLE ROWS */}
          {students.map((student, index) => (
            <div
              key={index}
              className="grid min-w-[900px] grid-cols-5 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-[#1a1d25]"
            >
              
              {/* STUDENT INFO */}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {student.name}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {student.email}
                </p>
              </div>

              {/* COUNTRY */}
              <div className="text-gray-700 dark:text-gray-300">
                {student.country}
              </div>

              {/* UNIVERSITY */}
              <div className="text-gray-700 dark:text-gray-300">
                {student.university}
              </div>

              {/* STATUS */}
              <div>
                <StatusBadge status={student.status} />
              </div>

              {/* ACTION */}
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