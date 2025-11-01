import { Button } from "@/components/ui/button";

interface LanguageToggleProps {
  language: "en" | "hi";
  onLanguageChange: (lang: "en" | "hi") => void;
}

const LanguageToggle = ({ language, onLanguageChange }: LanguageToggleProps) => {
  return (
    <div className="flex items-center gap-2 bg-white/20 rounded-lg p-1">
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLanguageChange("en")}
        className={language === "en" ? "bg-white text-primary hover:bg-white/90" : "text-white hover:bg-white/10"}
      >
        English
      </Button>
      <Button
        variant={language === "hi" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLanguageChange("hi")}
        className={language === "hi" ? "bg-white text-primary hover:bg-white/90" : "text-white hover:bg-white/10"}
      >
        हिन्दी
      </Button>
    </div>
  );
};

export default LanguageToggle;
