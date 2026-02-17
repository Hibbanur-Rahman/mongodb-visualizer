import { useNavigate, useLocation } from "react-router-dom";
import {
  Database,
  LayoutDashboard,
  Zap,
  Puzzle,
  Users,
  Settings,
  MessageCircle,
  FileText,
  Share2,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  badge?: string;
  external?: boolean;
}

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const primaryNavItems: NavItem[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: Database,
      label: "Models",
      path: "/",
    },
  ];

  const secondaryNavItems: NavItem[] = [
    {
      icon: Zap,
      label: "Optimize",
      path: "#",
    },
    {
      icon: Puzzle,
      label: "Integrations",
      path: "#",
    },
    {
      icon: Users,
      label: "Team",
      path: "#",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "#",
    },
  ];

  const bottomNavItems: NavItem[] = [
    {
      icon: MessageCircle,
      label: "Ask AI",
      path: "#",
    },
    {
      icon: MessageSquare,
      label: "Contact Support",
      path: "#",
    },
    {
      icon: FileText,
      label: "Documentation",
      path: "#",
      external: true,
    },
    {
      icon: Share2,
      label: "Share feedback",
      path: "#",
    },
    {
      icon: MessageSquare,
      label: "Discord",
      path: "#",
      external: true,
    },
  ];

  const handleNavigation = (path?: string) => {
    if (path && path !== "#") {
      navigate(path);
    }
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-[#F7F8FA] border-r border-gray-200">
      {/* Workspace Selector */}
      <div className="p-4 border-b border-gray-200">
        <button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <span className="text-sm font-medium text-gray-900">
              MongoDB Visualizer
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-3 space-y-1">
          <div className="mb-4">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-3"></div>

          {/* Secondary Navigation */}
          <div className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-white/50 hover:text-gray-900 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 p-3 space-y-1">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-white/50 hover:text-gray-900 transition-colors"
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">User</p>
            <p className="text-xs text-gray-500 truncate">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
