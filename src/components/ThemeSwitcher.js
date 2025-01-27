import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-x-4 my-3">
      <p className="text-gray-600 dark:text-gray-100">Dark Mode: </p>
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          class="sr-only peer"
          value=""
          type="checkbox"
          onChange={() =>
            setTheme(theme === "dark" || theme === "system" ? "light" : "dark")
          }
        />
        <div class="group peer ring-2  bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600  rounded-full outline-none duration-1000 after:duration-300 w-20 h-7  shadow-md  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute after:[background:#0D2B39]   peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)]  after:outline-none after:h-6 after:w-6 after:top-1 after:left-1   peer-checked:after:translate-x-12 peer-hover:after:scale-125"></div>
      </label>
    </div>
  );
};
