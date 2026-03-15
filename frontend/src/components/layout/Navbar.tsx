import React, { useState } from "react";
import Link from "next/link";

interface NavbarProps {
  brandName?: string;
  logo?: React.ReactNode;
  menuItems?: NavMenuItem[];
  userMenu?: React.ReactNode;
  sticky?: boolean;
}

interface NavMenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({
  brandName = "Waste Recycling Platform",
  logo,
  menuItems = [],
  userMenu,
  sticky = true,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={`bg-white shadow-md ${sticky ? "sticky top-0 z-40" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3">
            {logo && <div className="w-8 h-8">{logo}</div>}
            <span className="text-xl font-bold text-amber-700">
              {brandName}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-amber-600 font-medium transition-colors flex items-center gap-2"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {userMenu && <div>{userMenu}</div>}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-md font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
