import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { ThemeToggle } from "./theme-toogle";

const Header: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-indigo-600 dark:bg-indigo-950 text-white dark:text-blue-600 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link
          to="/home"
          className="text-2xl font-bold hover:text-gray-300 text-indigo-300"
        >
          NM
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        {/* <ModalProfileUser /> */}
        <button
          className="focus:outline-none hover:text-gray-300 dark:bg-indigo-900 dark:text-white"
          onClick={handleLogout}
        >
          <LogOut size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
