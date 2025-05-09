import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChartArea,
  Home,
  Menu,
  NotebookPen,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import { Divider } from "@mui/material";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const { dataUser } = useAuth();

  interface OpenSubmenus {
    [key: string]: boolean;
  }

  const toggleSubmenu = (menu: string): void => {
    setOpenSubmenus((prev: OpenSubmenus) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  function getGreeting() {
    const now = new Date();
    const hours = now.getHours();

    if (hours < 12) {
      return "Bom Dia";
    } else if (hours < 18) {
      return "Boa Tarde";
    } else {
      return "Boa Noite";
    }
  }

  return (
    <div className="flex h-auto">
      <div className="fixed top-13 left-0 p-4 min-md:hidden text-indigo-600">
        <button className="focus:outline-none" onClick={toggleSidebar}>
          {isOpen ? <ArrowLeft size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <div
        className={`
      fixed inset-y-0 left-0 transform text-white
      ${isOpen ? "translate-x-0" : "-translate-x-full sm:w-16 sm:translate-x-0"}
      ransition-transform duration-300 ease-in-out bg-indigo-600 dark:bg-indigo-950 text-indigo-300 w-64 p-4 h-full md:relative md:translate-x-0 md:transform-none
    `}
      >
        <button className="focus:outline-none" onClick={toggleSidebar}>
          {isOpen ? <ArrowLeft size={24} /> : <Menu size={24} />}
        </button>
        <h2
          className={`text-2xl mb-6 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="">{getGreeting()}</div>
          <div className="">{dataUser?.nome}</div>
        </h2>
        <nav>
          <ul>
            <Divider sx={{ my: 2, borderColor: "grey.300" }} />
            <li className="mb-4">
              <Link to="/home" className="text-lg hover:text-gray-300">
                {isOpen ? (
                  <div className="flex items-center">
                    <Home /> <span className="ml-2">Home</span>
                  </div>
                ) : (
                  <Home />
                )}
              </Link>
            </li>
            <Divider sx={{ my: 2, borderColor: "grey.300" }} />
            <li className="mb-4">
              <Link to="/dashboard" className="text-lg hover:text-gray-300">
                {isOpen ? (
                  <div className="flex items-center">
                    <ChartArea /> <span className="ml-2">Dashboard</span>
                  </div>
                ) : (
                  <ChartArea />
                )}
              </Link>
            </li>
            <Divider sx={{ my: 2, borderColor: "grey.300" }} />
            <li className="mb-4">
              <div
                className="text-lg hover:text-gray-300 cursor-pointer"
                onClick={() => toggleSubmenu("cadastros")}
              >
                {isOpen ? (
                  <div className="flex items-center">
                    <NotebookPen />
                    <span className="ml-2 flex">
                      Cadastros{" "}
                      <span className="absolute right-4">
                        {openSubmenus["cadastros"] ? (
                          <ArrowUp />
                        ) : (
                          <ArrowDown />
                        )}
                      </span>
                    </span>
                  </div>
                ) : (
                  <NotebookPen />
                )}
              </div>
              {openSubmenus["cadastros"] && (
                <ul className="ml-8 mt-2">
                  <li className="mb-2">
                    <Link to="/user" className="text-md hover:text-gray-300">
                      Usuário
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <Divider sx={{ my: 2, borderColor: "grey.300" }} />
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
