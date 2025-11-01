import { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface District {
  id: string;
  district_name: string;
  district_name_hi: string;
  district_code: string;
}

interface DistrictSelectorProps {
  language: "en" | "hi";
  selectedDistrict: string | null;
  onDistrictSelect: (districtId: string, name: string) => void;
}

const DistrictSelector = ({ language, selectedDistrict, onDistrictSelect }: DistrictSelectorProps) => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [detectingLocation, setDetectingLocation] = useState(false);

  useEffect(() => {
    loadDistricts();
  }, []);

  const loadDistricts = async () => {
    try {
      const { data, error } = await supabase
        .from("districts")
        .select("*")
        .eq("state_code", "27")
        .order("district_name");

      if (error) throw error;
      setDistricts(data || []);
    } catch (error) {
      console.error("Error loading districts:", error);
      toast.error(language === "en" ? "Failed to load districts" : "जिले लोड करने में विफल");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoDetect = () => {
    setDetectingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // In a real implementation, you would use reverse geocoding
          // For now, we'll just show a success message
          toast.success(
            language === "en"
              ? "Location detected! Please select your district from the list."
              : "स्थान का पता चला! कृपया सूची से अपना जिला चुनें।"
          );
          setDetectingLocation(false);
        },
        (error) => {
          toast.error(
            language === "en"
              ? "Unable to detect location. Please select manually."
              : "स्थान का पता नहीं लगा सका। कृपया मैन्युअल रूप से चुनें।"
          );
          setDetectingLocation(false);
        }
      );
    } else {
      toast.error(
        language === "en"
          ? "Geolocation not supported. Please select manually."
          : "भू-स्थान समर्थित नहीं है। कृपया मैन्युअल रूप से चुनें।"
      );
      setDetectingLocation(false);
    }
  };

  const content = {
    en: {
      title: "Select Your District",
      autoDetect: "Auto-Detect Location",
      selectPlaceholder: "Choose a district...",
      detecting: "Detecting...",
    },
    hi: {
      title: "अपना जिला चुनें",
      autoDetect: "स्थान का पता लगाएं",
      selectPlaceholder: "एक जिला चुनें...",
      detecting: "पता लगा रहे हैं...",
    },
  };

  const t = content[language];

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>{language === "en" ? "Loading districts..." : "जिले लोड हो रहे हैं..."}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-2">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1 w-full">
          <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {t.title}
          </label>
          <Select
            value={selectedDistrict || undefined}
            onValueChange={(value) => {
              const district = districts.find((d) => d.id === value);
              if (district) {
                onDistrictSelect(
                  value,
                  language === "hi" ? district.district_name_hi : district.district_name
                );
              }
            }}
          >
            <SelectTrigger className="w-full h-14 text-lg border-2">
              <SelectValue placeholder={t.selectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district.id} value={district.id} className="text-lg py-3">
                  {language === "hi" ? district.district_name_hi : district.district_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleAutoDetect}
          disabled={detectingLocation}
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground h-14 min-w-[200px]"
        >
          {detectingLocation ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t.detecting}
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-5 w-5" />
              {t.autoDetect}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default DistrictSelector;
