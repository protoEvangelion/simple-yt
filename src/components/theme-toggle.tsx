import { Button } from "@heroui/react";
import { MoonStar, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";
import { DEFAULT_THEME, getCurrentTheme, setTheme, type AppTheme } from "../lib/theme";

export function ThemeToggle() {
  const [theme, updateTheme] = useState<AppTheme>(DEFAULT_THEME);

  useEffect(() => {
    updateTheme(getCurrentTheme());
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <Button
      isIconOnly
      aria-label={`Switch to ${nextTheme} mode`}
      className="border border-white/10 bg-white/10 text-current backdrop-blur-md data-[hover=true]:bg-white/16 dark:border-white/10 dark:bg-white/6"
      radius="full"
      size="sm"
      variant="flat"
      onPress={() => {
        const updatedTheme = theme === "dark" ? "light" : "dark";

        setTheme(updatedTheme);
        updateTheme(updatedTheme);
      }}
    >
      {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
    </Button>
  );
}
