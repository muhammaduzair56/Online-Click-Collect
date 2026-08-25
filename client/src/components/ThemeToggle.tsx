/*
  Online Click & Collect — universal theme control.
  Design reminder: compact, high-contrast, terracotta-on-paper control that stays
  reachable without competing with page-specific navigation or WhatsApp actions.
*/
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button type="button" onClick={() => toggleTheme?.()} className="fixed bottom-5 left-5 z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-[#d8c7b8] bg-[#fffaf3]/95 text-[#6b5e56] shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#c95b63] dark:border-[#5b4a46] dark:bg-[#302627]/95 dark:text-[#f5ede3] dark:hover:bg-[#3a2f30]" aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>{theme === "dark" ? <Sun size={18} strokeWidth={1.8} /> : <Moon size={18} strokeWidth={1.8} />}</button>;
}
