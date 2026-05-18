import PageHeader from "@/components/ui/PageHeader";
import AdminTable from "@/components/ui/AdminTable";

const universities = [
  {
    name: "University of Melbourne",
    country: "Australia",
    students: "245",
  },
  {
    name: "University of Sydney",
    country: "Australia",
    students: "198",
  },
  {
    name: "University of Toronto",
    country: "Canada",
    students: "163",
  },
];

export default function UniversitiesPage() {
  return (
    <div className="space-y-6">
      
      <PageHeader
        title="Universities"
        description="Manage partnered universities."
        buttonText="Add University"
      />

      <AdminTable>
        
        <div className="overflow-x-auto">
          
          <div className="grid min-w-[700px] grid-cols-4 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600 dark:border-gray-800 dark:bg-[#222530] dark:text-gray-300">
            
            <div>University</div>

            <div>Country</div>

            <div>Students</div>

            <div>Action</div>
          </div>

          {universities.map((university, index) => (
            <div
              key={index}
              className="grid min-w-[700px] grid-cols-4 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-[#1a1d25]"
            >
              
              <div className="font-semibold text-gray-900 dark:text-white">
                {university.name}
              </div>

              <div className="text-gray-700 dark:text-gray-300">
                {university.country}
              </div>

              <div className="text-gray-700 dark:text-gray-300">
                {university.students}
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