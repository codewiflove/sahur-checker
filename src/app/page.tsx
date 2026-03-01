"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Thermometer, 
  Banana, 
  Droplet, 
  Zap, 
  Wind, 
  CheckCircle2,
  AlertCircle,
  Shield,
  Heart
} from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
  labelMs: string;
  description: string;
  descriptionMs: string;
  icon: React.ReactNode;
  weight: number;
  checked: boolean;
}

const checklistItems: Omit<ChecklistItem, "checked">[] = [
  {
    id: "nasi-sejuk",
    label: "Nasi Sejuk / Resistant Starch",
    labelMs: "Nasi Sejuk / Kanji Rendah",
    description: "Rice cooled for 12+ hours",
    descriptionMs: "Nasi yang telah sejuk 12+ jam",
    icon: <Thermometer className="w-5 h-5" />,
    weight: 25,
  },
  {
    id: "pisang-muda",
    label: "Pisang Muda / Fiber",
    labelMs: "Pisang Muda / Serat",
    description: "Green bananas or plantains",
    descriptionMs: "Pisang hijau atau plantain",
    icon: <Banana className="w-5 h-5" />,
    weight: 20,
  },
  {
    id: "ghee",
    label: "Ghee / Healthy Fat",
    labelMs: "Ghee / Lemak Sihat",
    description: "Grass-fed ghee for butyrate",
    descriptionMs: "Ghee daripada rumput untuk butirat",
    icon: <Droplet className="w-5 h-5" />,
    weight: 20,
  },
  {
    id: "kurang-gula",
    label: "Kurang Gula",
    labelMs: "Kurang Gula",
    description: "Minimal added sugar",
    descriptionMs: "Gula tambahan yang minima",
    icon: <Zap className="w-5 h-5" />,
    weight: 15,
  },
  {
    id: "air-kosong",
    label: "Air Kosong",
    labelMs: "Air Kosong",
    description: "Plain water intake",
    descriptionMs: "Pengambilan air kosong",
    icon: <Wind className="w-5 h-5" />,
    weight: 20,
  },
];

function ToggleSwitch({ 
  checked, 
  onChange 
}: { 
  checked: boolean; 
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`toggle-switch ${checked ? "active" : ""}`}
      role="switch"
      aria-checked={checked}
      aria-label="Toggle"
    >
      <span className="sr-only">Toggle</span>
    </button>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const isExcellent = score >= 80;
  const isPoor = score < 50;
  
  return (
    <motion.div 
      className={`relative w-44 h-44 score-circle ${isExcellent ? "score-excellent" : ""}`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", duration: 0.8, bounce: 0.5 }}
    >
      <motion.div 
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.span 
          className="text-5xl font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
        >
          {score}
        </motion.span>
        <span className="text-sm text-[#8e8e93]">Gut Score</span>
      </motion.div>
    </motion.div>
  );
}

function Verdict({ score }: { score: number }) {
  const getVerdict = () => {
    if (score >= 80) {
      return {
        title: "Usus Besi! 🛡️",
        subtitle: "Your gut is iron-clad!",
        subtitleMs: "Usus anda kukuh seperti besi!",
        icon: <Shield className="w-8 h-8" />,
        color: "#30d158",
        bgGradient: "from-green-500/20 to-emerald-500/10",
      };
    } else if (score >= 50) {
      return {
        title: "Usus Baik 👍",
        subtitle: "Decent gut health",
        subtitleMs: "Kesihatan usus yang sederhana",
        icon: <Heart className="w-8 h-8" />,
        color: "#0a84ff",
        bgGradient: "from-blue-500/20 to-cyan-500/10",
      };
    } else {
      return {
        title: "Usus Tisu... 🤧",
        subtitle: "Your gut needs love",
        subtitleMs: "Usus anda perlukan perhatian",
        icon: <AlertCircle className="w-8 h-8" />,
        color: "#ff453a",
        bgGradient: "from-red-500/20 to-orange-500/10",
      };
    }
  };

  const verdict = getVerdict();

  return (
    <motion.div
      className={`glass-card p-6 text-center bg-gradient-to-br ${verdict.bgGradient}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div 
        className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
        style={{ backgroundColor: `${verdict.color}20`, color: verdict.color }}
      >
        {verdict.icon}
      </div>
      <h2 
        className="text-2xl font-bold mb-2"
        style={{ color: verdict.color }}
      >
        {verdict.title}
      </h2>
      <p className="text-[#8e8e93]">{verdict.subtitle}</p>
    </motion.div>
  );
}

export default function SahurChecker() {
  const [items, setItems] = useState<ChecklistItem[]>(
    checklistItems.map((item) => ({ ...item, checked: false }))
  );
  const [isEnglish, setIsEnglish] = useState(true);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const score = items.reduce((acc, item) => acc + (item.checked ? item.weight : 0), 0);

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sahur-checker-state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.items) {
          setItems(parsed.items);
        }
        if (parsed.language !== undefined) {
          setIsEnglish(parsed.language === "en");
        }
      } catch (e) {
        console.error("Failed to load saved state:", e);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(
      "sahur-checker-state",
      JSON.stringify({
        items,
        language: isEnglish ? "en" : "ms",
      })
    );
  }, [items, isEnglish]);

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 glass-card mx-4 mt-4 px-5 py-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
              <span className="text-xl">🌙</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">Sahur Checker</h1>
              <p className="text-xs text-[#8e8e93]">
                {isEnglish ? "Gut-Friendly Checklist" : "Senarai Semak Usus Sihat"}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsEnglish(!isEnglish)}
            className="px-3 py-1.5 rounded-lg bg-[#2c2c2e] text-sm font-medium text-[#8e8e93] hover:text-white transition-colors"
          >
            {isEnglish ? "MS" : "EN"}
          </button>
        </div>
      </motion.header>

      <main className="px-4 pt-6 max-w-md mx-auto">
        {/* Score Section */}
        <div className="flex flex-col items-center mb-8">
          <ScoreCircle score={score} />
        </div>

        {/* Verdict */}
        <Verdict score={score} />

        {/* Checklist */}
        <motion.div 
          className="mt-8 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-medium text-[#8e8e93] uppercase tracking-wider mb-4">
            {isEnglish ? "Sahur Checklist" : "Senarai Semak Sahur"}
          </h3>

          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                className="glass-card p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        item.checked 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-[#2c2c2e] text-[#8e8e93]"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {isEnglish ? item.label : item.labelMs}
                      </h4>
                      <p className="text-sm text-[#8e8e93]">
                        {isEnglish ? item.description : item.descriptionMs}
                      </p>
                    </div>
                  </div>
                  
                  <ToggleSwitch
                    checked={item.checked}
                    onChange={() => toggleItem(item.id)}
                  />
                </div>
                
                {item.checked && (
                  <motion.div 
                    className="mt-3 pt-3 border-t border-[#2c2c2e] flex items-center gap-2 text-green-400 text-sm"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>+{item.weight}%</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Tips Section */}
        <motion.div 
          className="mt-8 glass-card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>💡</span>
            {isEnglish ? "Quick Tips" : "Tips Pantas"}
          </h3>
          <ul className="space-y-2 text-sm text-[#8e8e93]">
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              {isEnglish 
                ? "Cool rice for 12+ hours to maximize resistant starch"
                : "Sejukkan nasi selama 12+ jam untuk maksimum kanji rendah"
              }
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              {isEnglish 
                ? "Green bananas have more resistant starch than ripe ones"
                : "Pisang hijau mengandungi lebih banyak kanji rendah berbanding pisang masak"
              }
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              {isEnglish 
                ? "Ghee helps produce butyrate for gut health"
                : "Ghee membantu menghasilkan butirat untuk kesihatan usus"
              }
            </li>
          </ul>
        </motion.div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-[#8e8e93] pb-4">
          <p>{isEnglish ? "Based on Butyrate/Nasi Sejuk Research" : "Berdasarkan Penyelidikan Butirat/Nasi Sejuk"}</p>
        </footer>
      </main>
    </div>
  );
}
