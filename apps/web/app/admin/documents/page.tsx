import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import AdminTable from "@/components/ui/AdminTable";

const documents = [
  {
    student: "Rahim Ahmed",
    type: "Passport",
    uploaded: "2 hours ago",
    status: "Approved",
  },
  {
    student: "Nusrat Jahan",
    type: "Transcript",
    uploaded: "5 hours ago",
    status: "Pending",
  },
  {
    student: "Tanvir Hasan",
    type: "Bank Statement",
    uploaded: "Yesterday",
    status: "Rejected",
  },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      
      <PageHeader
        title="Documents"
        description="Manage uploaded student documents."
        buttonText="Upload Document"
      />

      {/* SEARCH */}
      <div className="flex flex-col gap-4 lg:flex-row">
        
        <input
          type="text"
          placeholder="Search documents..."
          className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3 text-gray-900 outline-none transition-all focus:border-primary dark:border-gray-800 dark:bg-[#1a1d25] dark:text-white dark:placeholder:text-gray-500"
        />

        <button className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-[#1a1d25] dark:text-white dark:hover:bg-[#222530]">
          Filter
        </button>
      </div>

      {/* TABLE */}
      <AdminTable>
        
        <div className="overflow-x-auto">
          
          <div className="grid min-w-[850px] grid-cols-5 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600 dark:border-gray-800 dark:bg-[#222530] dark:text-gray-300">
            
            <div>Student</div>

            <div>Document Type</div>

            <div>Uploaded</div>

            <div>Status</div>

            <div>Action</div>
          </div>

          {documents.map((doc, index) => (
            <div
              key={index}
              className="grid min-w-[850px] grid-cols-5 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-[#1a1d25]"
            >
              
              <div className="font-semibold text-gray-900 dark:text-white">
                {doc.student}
              </div>

              <div className="text-gray-700 dark:text-gray-300">
                {doc.type}
              </div>

              <div className="text-gray-700 dark:text-gray-300">
                {doc.uploaded}
              </div>

              <div>
                <StatusBadge status={doc.status} />
              </div>

              <div>
                <button className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 dark:bg-[#222530] dark:text-white dark:hover:bg-[#2d3340]">
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </AdminTable>
    </div>
  );
}