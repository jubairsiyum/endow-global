import { University, countries } from "./data";
import type { AIMatchResult, UserProfile } from "./types";

export function calculateAIMatch(
  university: University,
  profile: UserProfile
): AIMatchResult {
  let matchScore = 50;

  // GPA matching
  if (profile.gpa >= university.gpaRequirement) {
    matchScore += (profile.gpa - university.gpaRequirement) * 10;
  }

  // IELTS matching
  if (profile.ielts >= university.ieltsRequirement) {
    matchScore += (profile.ielts - university.ieltsRequirement) * 5;
  }

  // Budget matching
  if (profile.budget >= university.tuition.max) {
    matchScore += 20;
  } else if (profile.budget >= university.tuition.min) {
    matchScore += 10;
  }

  // Country preference
  if (university.country === profile.preferredCountry) {
    matchScore += 15;
  }

  // Cap at 100
  matchScore = Math.min(matchScore, 100);

  // Calculate scholarship chance
  let scholarshipChance = university.scholarship;
  if (profile.gpa >= 3.5 && profile.ielts >= 6.5) {
    scholarshipChance = Math.min(scholarshipChance + 20, 100);
  }

  // Calculate visa success probability
  const visaSuccess = university.visaSuccessRate + (profile.gpa > 3.0 ? 2 : 0);

  const reasons: string[] = [];
  if (profile.gpa >= university.gpaRequirement) {
    reasons.push(`Your GPA (${profile.gpa}) exceeds requirements`);
  }
  if (profile.ielts >= university.ieltsRequirement) {
    reasons.push(
      `Your IELTS (${profile.ielts}) meets standards with margin`
    );
  }
  if (profile.budget >= university.tuition.max) {
    reasons.push("Your budget comfortably covers tuition fees");
  }
  if (university.country === profile.preferredCountry) {
    reasons.push(`Located in your preferred country: ${profile.preferredCountry}`);
  }

  return {
    universityId: university.id,
    universityName: university.name,
    matchPercentage: Math.round(matchScore),
    scholarshipChance: Math.round(scholarshipChance),
    visaSuccessProbability: Math.min(visaSuccess, 100),
    reasons,
  };
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getCountryByName(name: string) {
  return countries.find((c) => c.name === name);
}

export function calculateDaysRemaining(deadline: string): number {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 0);
}

export function getDayColor(days: number): string {
  if (days <= 7) return "text-red-600";
  if (days <= 14) return "text-amber-600";
  return "text-green-600";
}

export function getMatchColor(percentage: number): string {
  if (percentage >= 85) return "text-green-600";
  if (percentage >= 70) return "text-blue-600";
  if (percentage >= 50) return "text-amber-600";
  return "text-red-600";
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
