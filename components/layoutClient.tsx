"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ThemeSwitch } from "@/components/theme-switch";
import { IconSvgProps } from "@/types";
import { Home, BarChart3, Folder, Settings, ChevronLeft} from "lucide-react";

// Logo component (unchanged)
export const Logo: React.FC<IconSvgProps> = ({
  size = 36,
  width,
  height,
  ...props
}) => (
  <svg
    fill="none"
    height={size || height}
    viewBox="0 0 32 32"
    width={size || width}
    {...props}
  >
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

// Navbar (unchanged)
const Navbar = () => (
  <nav
    className="fixed top-0 left-0 right-0 z-40 h-9 border-b border-separator bg-background/70 backdrop-blur-lg"
    suppressHydrationWarning
    
  >
    <header className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
      <NextLink className="flex items-center gap-2" href="/">
        <Logo />
        <p className="font-bold text-inherit">B3TT</p>
      </NextLink>
      <ThemeSwitch />
    </header>
  </nav>
);

// Sidebar (using Lucide icons with dynamic fill/stroke)
const Sidebar = ({
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
}) => {
  const pathname = usePathname();
  const items = [
    { label: "Dashboard", href: "/", icon: Home },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Projects", href: "/projects", icon: Folder },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={clsx(
        "pt-6 fixed left-0 z-30 h-[calc(100vh-2rem)] border-r bg-background",
        "transition-[width] duration-300 ease-in-out",
        isCollapsed ? "w-14" : "w-48",
      )}
      style={{ top: "2rem" }}
      suppressHydrationWarning
    >
      <button
        aria-label={isCollapsed ? "Expand" : "Collapse"}
        className="mt-10 absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-separator bg-background shadow-sm hover:bg-default/10 transition-colors"
        onClick={onToggle}
      >
        <ChevronLeft
          className={clsx(
            "h-3 w-3 transition-transform",
            isCollapsed && "rotate-180",
          )}
        />
      </button>
      <nav className="flex flex-col  gap-2 p-3 pt-4">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <NextLink
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                isActive
                  ? "bg-white shadow-sm dark:bg-neutral-800 text-inherit"
                  : "hover:bg-default/40 hover:text-foreground",
                isCollapsed && "justify-center px-2",
              )}
            >
              <Icon
                className={clsx(
                  "h-5 w-5 shrink-0 transition-all",
                  isActive && "fill-current stroke-current",
                )}
              />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NextLink>
          );
        })}
      </nav>
    </aside>
  );
};

// --- MAIN LAYOUT: simplified for easy centering ---
export const LayoutClient = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) setIsCollapsed(saved === "true");
    setMounted(true);
  }, []);

  const toggle = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebar-collapsed", String(newState));
      return newState;
    });
  };

  // Skeleton while mounting (mirrors final structure)
  if (!mounted) {
    return (
      <>
        <Navbar />
        <div className="flex h-[calc(100vh-2rem)] mt-8">
          <div className="fixed left-0 top-8 z-30 w-48 h-[calc(100vh-2rem)] border-r border-separator bg-background" />
          <div className="flex-1 ml-48">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
              <div className="animate-pulse bg-default/20 rounded-lg h-96" />
            </div>
          </div>
        </div>
      </>
    );
  }

  const marginLeft = isCollapsed ? "ml-14" : "ml-48";

  return (
    <>
      <Navbar />
      <div className="flex h-[calc(100vh-2rem)] mt-8">
        <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />
        {/* Main content area – simplified: flex column + full height */}
        <div
          className={clsx(
            "flex-1 overflow-y-auto flex flex-col transition-[margin] duration-300 ease-in-out",
            marginLeft,
          )}
        >
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};
