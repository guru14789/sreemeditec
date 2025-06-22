import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ShoppingCart, X, UserCircle } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuthStatus } from "@/hooks/use-authstatus";

const Header = () => {
  const { getTotalItems } = useCart();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isAuthenticated, isAdmin } = useAuthStatus();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Store", path: "/store" },
    { label: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container max-w-[1200px] mx-auto px-4 flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-[#1d7d69] hover:text-[#166353] transition-colors">
            <img src="/favicon.ico" alt="Sreemeditec" className="h-6 w-auto" />
            <span className="text-xl font-bold">Sreemeditec</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-6">
            {navLinks.map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                className="text-sm font-medium text-gray-700 hover:text-[#1d7d69] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {!isMobile && <ThemeToggle />}

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-[#f0fdfa]">
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#1d7d69] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <UserCircle className="h-5 w-5 text-gray-700" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}

            {/* Hamburger */}
            {isMobile && (
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(true)}
              >
                <span className="sr-only">Toggle menu</span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                >
                  <path
                    d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                    fill="currentColor"
                  />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end md:hidden">
          <div className="bg-white dark:bg-zinc-900 w-3/4 max-w-xs h-full p-6 shadow-2xl animate-slide-in-right flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-[#1d7d69]"></span>
              <button onClick={() => setIsMenuOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {navLinks.map(({ label, path }) => (
                <Link
                  key={label}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 px-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-[#e0f2f1] dark:hover:bg-zinc-800 hover:text-[#1d7d69] transition-colors"
                >
                  {label}
                </Link>
              ))}
              {!isAuthenticated ? (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full mt-4" variant="outline">
                    Login
                  </Button>
                </Link>
              ) : (
                <div className="mt-4 flex flex-col gap-2">
                  <Button onClick={() => { navigate("/profile"); setIsMenuOpen(false); }}>Profile</Button>
                  <Button onClick={() => { navigate("/orders"); setIsMenuOpen(false); }}>Orders</Button>
                  <Button onClick={() => { handleLogout(); setIsMenuOpen(false); }} variant="destructive">Logout</Button>
                </div>
              )}
            </div>

            {/* ThemeToggle visible only in mobile drawer */}
            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-zinc-700">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
