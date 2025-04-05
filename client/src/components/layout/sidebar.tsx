import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { 
  BookOpenIcon, 
  MessageSquareIcon, 
  CalendarIcon, 
  HomeIcon, 
  UserIcon, 
  SettingsIcon, 
  LogOutIcon,
  ClipboardListIcon
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [location] = useLocation();
  const { currentUser, logout } = useAuth();

  const isActive = (path: string) => {
    return location === path;
  };

  const navItems = [
    {
      title: "Home",
      icon: <HomeIcon className="h-5 w-5" />,
      href: "/",
      section: "Main"
    },
    {
      title: "Chat",
      icon: <MessageSquareIcon className="h-5 w-5" />,
      href: "/chat",
      section: "Collaborate"
    },
    {
      title: "Homework",
      icon: <ClipboardListIcon className="h-5 w-5" />,
      href: "/homework",
      section: "Collaborate"
    },
    {
      title: "Timetable",
      icon: <CalendarIcon className="h-5 w-5" />,
      href: "/timetable",
      section: "Collaborate"
    },
    {
      title: "Learning",
      icon: <BookOpenIcon className="h-5 w-5" />,
      href: "/learning",
      section: "Explore"
    },
  ];

  const accountItems = [
    {
      title: "Profile",
      icon: <UserIcon className="h-5 w-5" />,
      href: "/profile",
    },
    {
      title: "Settings",
      icon: <SettingsIcon className="h-5 w-5" />,
      href: "/settings",
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const groupedNavItems = navItems.reduce((groups, item) => {
    const section = item.section || "Main";
    if (!groups[section]) {
      groups[section] = [];
    }
    groups[section].push(item);
    return groups;
  }, {} as Record<string, typeof navItems>);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:relative md:z-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full py-4">
        <div className="px-4 py-2 mb-2 md:hidden">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            &times; Close
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
          {Object.entries(groupedNavItems).map(([section, items]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                {section}
              </h3>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <a
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                          isActive(item.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                        )}
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            onClose();
                          }
                        }}
                      >
                        {item.icon}
                        <span className="ml-3">{item.title}</span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {currentUser && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Account
              </h3>
              <ul className="space-y-1">
                {accountItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <a
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                          isActive(item.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                        )}
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            onClose();
                          }
                        }}
                      >
                        {item.icon}
                        <span className="ml-3">{item.title}</span>
                      </a>
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOutIcon className="h-5 w-5" />
                    <span className="ml-3">Log out</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
