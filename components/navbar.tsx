"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, MenuIcon, XIcon } from "lucide-react";
import { useTheme } from "next-themes";
import UnofficialDisclaimer from "@/components/unofficial";

const routes = [
  { name: "Home", path: "/" },
  { name: "Artists", path: "/artists" },
  { name: "Schedule", path: "/schedule" },
  { name: "Vote", path: "/vote" },
  { name: "News", path: "/news" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [disclaimerHeight, setDisclaimerHeight] = useState(0);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamically calculate disclaimer height and hide after 10 seconds
  useEffect(() => {
    const disclaimer = document.querySelector(".disclaimer-container");
    if (disclaimer) {
      const height = disclaimer.getBoundingClientRect().height;
      setDisclaimerHeight(height);
      const handleResize = () => {
        setDisclaimerHeight(disclaimer.getBoundingClientRect().height);
      };
      window.addEventListener("resize", handleResize);

      // Hide disclaimer after 10 seconds
      const timer = setTimeout(() => {
        setShowDisclaimer(false);
        setDisclaimerHeight(0); // Reset height when hidden
      }, 10000); // 10 seconds

      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(timer); // Cleanup timer on unmount
      };
    }
  }, []);

  return (
    <>
      {/* Fixed Disclaimer with fade-out */}
      {showDisclaimer && (
        <div
          className="fixed top-0 left-0 w-full z-50 disclaimer-container transition-opacity duration-500"
          style={{ opacity: showDisclaimer ? 1 : 0 }}
        >
          <UnofficialDisclaimer />
        </div>
      )}

      {/* Adjusted Header with dynamic top offset */}
      <header
        className={cn(
          "fixed left-0 w-full z-40 transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b"
            : "bg-transparent"
        )}
        style={{ top: `${disclaimerHeight}px` }} // Dynamic offset, 0 when disclaimer is hidden
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-1 bg-background rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold"></span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === route.path
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {route.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden md:flex"
              >
                {theme === "dark" ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <XIcon className="h-5 w-5" />
                ) : (
                  <MenuIcon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            className="md:hidden bg-background/95 backdrop-blur-sm border-b"
            style={{ top: `${disclaimerHeight}px` }} // Offset mobile menu, 0 when disclaimer is hidden
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                      pathname === route.path
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {route.name}
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="justify-start"
                >
                  {theme === "dark" ? (
                    <SunIcon className="h-4 w-4 mr-2" />
                  ) : (
                    <MoonIcon className="h-4 w-4 mr-2" />
                  )}
                  <span>Toggle theme</span>
                </Button>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}