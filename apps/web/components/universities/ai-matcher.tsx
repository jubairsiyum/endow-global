"use client";

import { motion } from "framer-motion";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { calculateAIMatch } from "@/lib/universities/utils";
import { universities } from "@/lib/universities/data";
import type { UserProfile } from "@/lib/universities/types";

interface AIMatcherProps {
  onClose?: () => void;
}

export default function AIMatcher({ onClose }: AIMatcherProps) {
  const [step, setStep] = useState<"input" | "results">("input");
  const [profile, setProfile] = useState<UserProfile>({
    gpa: 3.2,
    ielts: 6.0,
    budget: 50000,
    preferredCountry: "South Korea",
    studyLevel: "bachelor",
  });
  const [results, setResults] = useState<any[]>([]);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleMatch = () => {
    const matches = universities
      .map((uni) => calculateAIMatch(uni, profile))
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 3);
    setResults(matches);
    setStep("results");
  };

  if (step === "results") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-gray-900">Your Top Matches</h3>
          <p className="text-sm text-gray-600">
            Based on your profile: GPA {profile.gpa}, IELTS {profile.ielts}
          </p>
        </div>

        <div className="space-y-3">
          {results.map((match, idx) => (
            <motion.div
              key={match.universityId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-colors hover:border-red-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">
                    {match.universityName}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {match.reasons[0]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-[#C41E3A]">
                    {match.matchPercentage}%
                  </p>
                  <p className="text-xs text-gray-500">Match</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-2.5">
                  <p className="text-gray-500">Scholarship Chance</p>
                  <p className="font-semibold text-gray-900">
                    {match.scholarshipChance}%
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-2.5">
                  <p className="text-gray-500">Visa Success</p>
                  <p className="font-semibold text-gray-900">
                    {match.visaSuccessProbability}%
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={() => setStep("input")}
            className="h-11 flex-1 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
          >
            Adjust Profile
          </button>
          <button className="h-11 flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(196,30,58,0.18)] transition-shadow hover:shadow-red-200">
            Compare Details
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-[#C41E3A] ring-1 ring-red-100">
          <MessageCircle className="h-4 w-4" />
        </span>
        <h3 className="text-xl font-bold text-gray-900">Smart Finder</h3>
      </div>

      <div className="space-y-3.5">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Your GPA: {profile.gpa.toFixed(1)}
          </label>
          <input
            type="range"
            min="1.0"
            max="4.0"
            step="0.1"
            value={profile.gpa}
            onChange={(e) =>
              handleInputChange("gpa", parseFloat(e.target.value))
            }
            className="w-full accent-[#C41E3A]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            IELTS Score: {profile.ielts.toFixed(1)}
          </label>
          <input
            type="range"
            min="3.0"
            max="9.0"
            step="0.5"
            value={profile.ielts}
            onChange={(e) =>
              handleInputChange("ielts", parseFloat(e.target.value))
            }
            className="w-full accent-[#C41E3A]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Annual Budget: ${profile.budget.toLocaleString()}
          </label>
          <input
            type="range"
            min="5000"
            max="100000"
            step="5000"
            value={profile.budget}
            onChange={(e) =>
              handleInputChange("budget", parseFloat(e.target.value))
            }
            className="w-full accent-[#C41E3A]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Preferred Country
          </label>
          <select
            value={profile.preferredCountry}
            onChange={(e) =>
              handleInputChange("preferredCountry", e.target.value)
            }
            className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#C41E3A]"
          >
            <option>South Korea</option>
            <option>USA</option>
            <option>UK</option>
            <option>Canada</option>
            <option>Australia</option>
            <option>Japan</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Study Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["bachelor", "master", "phd"].map((level) => (
              <button
                key={level}
                onClick={() =>
                  handleInputChange("studyLevel", level as any)
                }
                className={`h-10 rounded-xl px-3 text-sm font-semibold transition-colors ${
                  profile.studyLevel === level
                    ? "bg-[#C41E3A] text-white shadow-[0_8px_20px_rgba(196,30,58,0.18)]"
                    : "border border-gray-200 bg-gray-50 text-gray-900 hover:border-red-200 hover:bg-red-50"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleMatch}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(196,30,58,0.18)] transition-shadow hover:shadow-red-200"
      >
        <CheckCircle2 className="h-4 w-4" />
        Get AI Recommendations
      </motion.button>

      <p className="text-center text-xs text-gray-500">
        Takes less than 1 minute. No commitment required.
      </p>
    </motion.div>
  );
}
