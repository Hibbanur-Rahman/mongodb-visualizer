import type { ReactNode } from "react";
import Sidebar from "@/components/sidebar";
import { Database, ChevronDown } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="h-14 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-gray-600" />
            <h1 className="text-lg font-semibold text-gray-900">MongoDB-analyzer</h1>
            <span className="text-gray-400">/</span>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">Development</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </div>

        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#FAFBFC]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
