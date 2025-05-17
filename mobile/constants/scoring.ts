export type ScoringType = "time" | "points" | "distance";

interface ScoringTypeInfo {
  name: {
    en: string;
    ta: string;
  };
  unit: {
    en: string;
    ta: string;
  };
  description?: {
    en: string;
    ta: string;
  };
  isLowerBetter?: boolean;
}

export const scoringTypes: Record<ScoringType, ScoringTypeInfo> = {
  time: {
    name: {
      en: "Time",
      ta: "நேரம்"
    },
    unit: {
      en: "seconds",
      ta: "வினாடிகள்"
    },
    description: {
      en: "Measured in seconds. Lower is better.",
      ta: "வினாடிகளில் அளவிடப்படுகிறது. குறைவாக இருப்பது சிறந்தது."
    },
    isLowerBetter: true
  },
  points: {
    name: {
      en: "Points",
      ta: "புள்ளிகள்"
    },
    unit: {
      en: "points",
      ta: "புள்ளிகள்"
    },
    description: {
      en: "Measured in points. Higher is better.",
      ta: "புள்ளிகளில் அளவிடப்படுகிறது. அதிகமாக இருப்பது சிறந்தது."
    },
    isLowerBetter: false
  },
  distance: {
    name: {
      en: "Distance",
      ta: "தூரம்"
    },
    unit: {
      en: "meters",
      ta: "மீட்டர்கள்"
    },
    description: {
      en: "Measured in meters. Higher is better.",
      ta: "மீட்டர்களில் அளவிடப்படுகிறது. அதிகமாக இருப்பது சிறந்தது."
    },
    isLowerBetter: false
  }
};