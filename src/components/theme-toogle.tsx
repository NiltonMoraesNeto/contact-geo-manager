import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded hover:text-gray-300 dark:bg-indigo-900 dark:text-white"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}
