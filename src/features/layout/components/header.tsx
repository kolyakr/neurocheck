"use client";
import { APP_INFO } from "@/shared/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Clock, LogOut, User, Book } from "lucide-react";
import { useAuth } from "@/features/auth";
import { Button } from "@/shared/components/ui/button";

const navigationLinks = [
  {
    href: "/diagnosis",
    label: "Diagnosis",
    icon: Activity,
  },
  {
    href: "/history",
    label: "History",
    icon: Clock,
  },
  {
    href: "/docs",
    label: "Docs",
    icon: Book,
  },
];

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white/70 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-100">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2"
        >
          <span className="text-2xl">🏥</span>
          {APP_INFO.NAME}
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/diagnosis"
                className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition-colors"
              >
                Start diagnosis
              </Link>
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User className="w-4 h-4" />
                  <span>{user?.name || user?.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/sign-in"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/sign-up"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
