import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { HomeIcon, MessageSquareIcon, CalendarIcon, ClipboardListIcon, BookOpenIcon } from "lucide-react";

const BottomNavigation = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const navItems = [
    {
      title: "Home",
      icon: <HomeIcon className="h-5 w-5" />,
      href: "/",
    },
    {
      title: "Chat",
      icon: <MessageSquareIcon className="h-5 w-5" />,
      href: "/chat",
    },
    {
      title: "Homework",
      icon: <ClipboardListIcon className="h-5 w-5" />,
      href: "/homework",
    },
    {
      title: "Timetable",
      icon: <CalendarIcon className="h-5 w-5" />,
      href: "/timetable",
    },
    {
      title: "Learning",
      icon: <BookOpenIcon className="h-5 w-5" />,
      href: "/learning",
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center py-2 px-4 z-10">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <div
            className={cn(
              "flex flex-col items-center px-2 py-1 text-xs cursor-pointer",
              isActive(item.href)
                ? "text-primary"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            {item.icon}
            <span className="mt-1">{item.title}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNavigation;
