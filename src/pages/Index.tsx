import { useState, useEffect } from "react";
import { MapPin, TrendingUp, Users, Briefcase, DollarSign, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DistrictSelector from "@/components/DistrictSelector";
import PerformanceDashboard from "@/components/PerformanceDashboard";
import LanguageToggle from "@/components/LanguageToggle";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [districtName, setDistrictName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Auto-detect location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location detected:", position.coords);
          toast.success(language === "en" ? "Location detected" : "स्थान का पता चला");
        },
        (error) => {
          console.log("Location permission denied or unavailable", error);
        }
      );
    }
  }, [language]);

  const content = {
    en: {
      title: "Our Voice, Our Rights",
      subtitle: "MGNREGA Performance Dashboard - Maharashtra",
      selectDistrict: "Select Your District",
      aboutMgnrega: "About MGNREGA",
      aboutText: "The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) provides at least 100 days of guaranteed wage employment to rural households. Check your district's performance below.",
      loading: "Loading...",
      noDistrict: "Please select a district to view performance data"
    },
    hi: {
      title: "हमारी आवाज़, हमारे अधिकार",
      subtitle: "मनरेगा प्रदर्शन डैशबोर्ड - महाराष्ट्र",
      selectDistrict: "अपना जिला चुनें",
      aboutMgnrega: "मनरेगा के बारे में",
      aboutText: "महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (मनरेगा) ग्रामीण परिवारों को कम से कम 100 दिनों के गारंटीकृत मजदूरी रोजगार प्रदान करता है। नीचे अपने जिले का प्रदर्शन देखें।",
      loading: "लोड हो रहा है...",
      noDistrict: "प्रदर्शन डेटा देखने के लिए कृपया एक जिला चुनें"
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Activity className="h-10 w-10" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1>
                <p className="text-sm md:text-base opacity-90">{t.subtitle}</p>
              </div>
            </div>
            <LanguageToggle language={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* About MGNREGA Card */}
        <Card className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-green-50 border-2 border-primary/20">
          <h2 className="text-xl md:text-2xl font-bold mb-3 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            {t.aboutMgnrega}
          </h2>
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
            {t.aboutText}
          </p>
        </Card>

        {/* District Selector */}
        <div className="mb-8">
          <DistrictSelector
            language={language}
            selectedDistrict={selectedDistrict}
            onDistrictSelect={(districtId, name) => {
              setSelectedDistrict(districtId);
              setDistrictName(name);
            }}
          />
        </div>

        {/* Performance Dashboard */}
        {selectedDistrict ? (
          <PerformanceDashboard
            districtId={selectedDistrict}
            districtName={districtName}
            language={language}
          />
        ) : (
          <Card className="p-12 text-center">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">{t.noDistrict}</p>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-foreground/5 mt-16 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            {language === "en"
              ? "Data sourced from data.gov.in | Built for the people of Maharashtra"
              : "डेटा data.gov.in से लिया गया | महाराष्ट्र के लोगों के लिए बनाया गया"}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
