import PageHeader from "@/components/ui/PageHeader";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      
      <PageHeader
        title="Settings"
        description="Manage platform preferences and system settings."
      />

      {/* SETTINGS CARD */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
        
        <div className="flex items-center justify-between">
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Theme Preferences
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Switch between dark and light mode.
            </p>
          </div>

          <ThemeToggle />
        </div>
      </div>

      {/* PROFILE SETTINGS */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Admin Profile
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>

            <input
              type="text"
              defaultValue="Super Admin"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>

            <input
              type="email"
              defaultValue="admin@endowglobal.com"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white"
            />
          </div>
        </div>

        <button className="mt-6 rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#920715]">
          Save Changes
        </button>
      </div>
    </div>
  );
}