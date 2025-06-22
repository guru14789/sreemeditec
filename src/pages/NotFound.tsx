import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0fdfa] via-white to-[#e0f2f1] px-4">
      <div className="text-center p-10 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-6xl font-extrabold text-[#1d7d69] mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Page Not Found
        </p>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Sorry, we couldn't find the page you were looking for.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-[#1d7d69] hover:bg-[#166353] text-white px-5 py-2 rounded-full font-medium transition duration-200 shadow-md"
        >
          <Home size={18} />
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
