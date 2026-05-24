"use client";

import { motion } from "framer-motion";
import { MessageCircle, CheckCircle2, ArrowRight } from "lucide-react";
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
        initial={{ opacity: 0, y: 20 }}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 p-3.5 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {match.universityName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {match.reasons[0]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-blue-600">
                    {match.matchPercentage}%
                  </p>
                  <p className="text-xs text-gray-600">Match Score</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded bg-white/50 p-2">
                  <p className="text-gray-600">Scholarship Chance</p>
                  <p className="font-semibold text-green-600">
                    {match.scholarshipChance}%
                  </p>
                </div>
                <div className="rounded bg-white/50 p-2">
                  <p className="text-gray-600">Visa Success</p>
                  <p className="font-semibold text-purple-600">
                    {match.visaSuccessProbability}%
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setStep("input")}
            className="flex-1 h-11 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Adjust Profile
          </button>
          <button className="flex-1 h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            Compare Details
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Smart Finder</h3>
      </div>

      <div className="space-y-3.5">
        {/* GPA Input */}
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
            onChange={(e) => handleInputChange("gpa", parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* IELTS Input */}
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
            className="w-full"
          />
        </div>

        {/* Budget Input */}
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
            className="w-full"
          />
        </div>

        {/* Country Select */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Preferred Country
          </label>
          <select
            value={profile.preferredCountry}
            onChange={(e) =>
              handleInputChange("preferredCountry", e.target.value)
            }
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900"
          >
            <option>South Korea</option>
            <option>USA</option>
            <option>UK</option>
            <option>Canada</option>
            <option>Australia</option>
            <option>Japan</option>
          </select>
        </div>

        {/* Study Level */}
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
                className={`h-10 rounded-lg px-3 text-sm font-semibold transition-colors ${
                  profile.studyLevel === level
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleMatch}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="h-4 w-4" />
        Get AI Recommendations
      </motion.button>

      <p className="text-xs text-center text-gray-600">
        Takes less than 1 minute • No commitment required
      </p>
    </motion.div>
  );
}
