import { useState, useEffect } from "react";
import { Bell, Languages, LogOut, Menu, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setShowMenu(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return (
    <nav className="bg-white text-black shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <span className="text-2xl font-bold tracking-wide">myUstad.ai</span>

          {!isMobile && (
            <div className="flex-grow mx-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to learn?"
                className="w-[20vw] max-w-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
              />
            </div>
          )}
        </div>

        {!isMobile && (
          <div className="flex space-x-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-gray-800 transition-colors">
              Home
            </a>
            <a href="#" className="hover:text-gray-800 transition-colors">
              Courses
            </a>
            <a href="#" className="hover:text-gray-800 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-gray-800 transition-colors">
              Contact
            </a>
          </div>
        )}

        <div className="flex items-center space-x-4">
          {!isMobile && (
            <>
              <button className="flex items-center space-x-2 text-gray-900 hover:text-gray-700 transition-colors duration-200 cursor-pointer">
                <Languages className="w-5 h-5" />
                <span className="text-sm font-medium">English</span>
              </button>

              <button className="cursor-pointer bg-[#f5f5f5] hover:bg-[#e5e5e5] text-gray-800 p-2 rounded-full border border-gray-300 shadow-sm transition duration-200">
                <Bell className="w-4 h-4" />
              </button>

              <div className="relative inline-block text-left z-50">
                <button
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  className="cursor-pointer bg-[#f5f5f5] hover:bg-[#e5e5e5] text-gray-800 p-2 rounded-full border border-gray-300 shadow-sm transition duration-200"
                >
                  <User className="w-4 h-4" />
                </button>

                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-2 min-w-[180px] max-w-[220px] bg-white text-black rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                    style={{ overflowWrap: "break-word" }} // ensure long content wraps
                  >
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-x-2 px-4 py-3 hover:bg-red-100 transition text-sm text-red-500 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="font-mono">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {isMobile && (
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 ml-2"
            >
              {showMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {isMobile && (
        <>
          <div
            onClick={() => setShowMenu(false)}
            className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300 ${
              showMenu
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          />
          <div
            className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transition-all duration-500 ease-in-out ${
              showMenu
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            <div className="px-6 py-4 flex justify-between items-center border-b">
              <span className="text-xl font-bold">Menu</span>
              <button
                onClick={() => setShowMenu(false)}
                className="text-gray-600 hover:text-blue-600"
              >
                <X />
              </button>
            </div>

            <nav className="px-6 space-y-4 mt-4 text-sm">
              {["Home", "Courses", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={() => setShowMenu(false)}
                  className="block hover:text-blue-600"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="px-6 mt-6 space-y-4 text-sm">
              <button className="flex items-center space-x-2 hover:text-blue-600">
                <Languages className="w-5 h-5" />
                <span>English</span>
              </button>

              <button className="p-2">
                <Bell className="w-4 h-4" />
              </button>
              <div className="p-2">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
