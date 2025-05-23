// src/components/layout/Header.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "../theme/theme-toggle";
import { auth } from "../../lib/firebase"; // Import auth
import { onAuthStateChanged, signOut, User } from "firebase/auth"; // Import onAuthStateChanged, signOut, and User type
import { useRouter } from "next/navigation"; // Import useRouter

const GreekColumnIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-8 h-8 text-primary group-hover:text-accent transition-colors duration-300"
    aria-hidden="true"
    data-ai-hint="greek column"
  >
    <path d="M5 21V3H7V21H5Z" />
    <path d="M10 21V3H12V21H10Z" />
    <path d="M15 21V3H17V21H15Z" />
    <path
      d="M3 2H19C19.5523 2 20 2.44772 20 3V4H2V3C2 2.44772 2.44772 2 3 2Z"
      strokeWidth="2"
      fill="currentColor"
      className="text-primary group-hover:text-accent transition-colors duration-300"
    />
    <path
      d="M2 20V21C2 21.5523 2.44772 22 3 22H19C19.5523 22 20 21.5523 20 21V20H2Z"
      strokeWidth="2"
      fill="currentColor"
      className="text-primary group-hover:text-accent transition-colors duration-300"
    />
  </svg>
);

// Define the types for auth links
type AuthLink = {
  href: string;
  label: string;
  action?: "logout"; // 'action' is optional and specifically 'logout' if present
};

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null); // State to hold user information
  const router = useRouter();

  const navLinks = [
    { href: "/", label: "INÍCIO" },
    { href: "/postagens", label: "POSTAGENS" },
    { href: "/integrantes", label: "INTEGRANTES" },
    { href: "#contato", label: "CONTATO" },
  ];

  // Define authLinks with the specified type
  const authLinks: AuthLink[] = user
    ? [
        { href: "/logout", label: "SAIR", action: "logout" }, // Added action for logout
      ]
    : [
        { href: "/login", label: "LOGIN" },
        // { href: "/signup", label: "CADASTRO" }, // Uncomment if you have a signup page
      ];

  const handleScrollToFooter = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const footer = document.getElementById("contato");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state
      router.push("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout error, e.g., show a message
    } finally {
      if (isMenuOpen) setIsMenuOpen(false); // Close mobile menu after logout
    }
  };

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubscribe(); // Clean up the auth state listener
    };
  }, [auth]); // Added auth to dependencies

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/90 shadow-lg backdrop-blur-sm" : "bg-background/80"}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link href="/" className="flex items-center gap-3 group">
            <GreekColumnIcon />
            <h1 className="text-3xl md:text-4xl font-bold uppercase-ancient text-primary group-hover:text-accent transition-colors duration-300">
              ΣΤΑΣΙΣ
            </h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={
                  link.href === "#contato" ? handleScrollToFooter : () => {}
                }
                className={`uppercase-ancient text-sm font-medium transition-all duration-200 hover:text-accent hover:scale-105 ${
                  pathname === link.href && link.href !== "#contato"
                    ? "text-accent scale-110 border-b-2 border-accent"
                    : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* Add authentication-dependent links */}
            {authLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={link.action === "logout" ? handleLogout : () => {}}
                className={`uppercase-ancient text-sm font-medium transition-all duration-200 hover:text-accent hover:scale-105 ${
                  pathname === link.href && link.href !== "/logout" // Fix: Don't highlight /logout as active
                    ? "text-accent scale-110 border-b-2 border-accent"
                    : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-accent focus:outline-none p-2 md:hidden" // Show only on mobile
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-background shadow-xl z-40 transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? "max-h-screen py-4 opacity-100" : "max-h-0 py-0 opacity-0"}`}
      >
        <nav className="flex flex-col items-center space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={
                link.href === "#contato"
                  ? handleScrollToFooter
                  : () => setIsMenuOpen(false)
              }
              className={`uppercase-ancient text-lg font-medium transition-colors hover:text-accent ${
                pathname === link.href && link.href !== "#contato"
                  ? "text-accent"
                  : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {/* Add authentication-dependent links for mobile menu */}
          {authLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={
                link.action === "logout"
                  ? handleLogout
                  : () => setIsMenuOpen(false)
              } // Close menu on click unless logout
              className={`uppercase-ancient text-lg font-medium transition-colors hover:text-accent ${
                pathname === link.href && link.href !== "/logout" // Fix: Don't highlight /logout as active
                  ? "text-accent"
                  : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {/* Theme Toggle for Mobile */}
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
