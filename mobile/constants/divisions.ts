export type Division = "arumbu" | "mottu" | "mugai" | "malar" | "mazhalai";

export const divisions = {
  mazhalai: {
    id: "mazhalai",
    name: {
      en: "Mazhalai",
      ta: "மழலை",
    },
    ageRange: {
      en: "Ages 1-3",
      ta: "வயது 1-3",
    },
    minAge: 1,
    maxAge: 3
  },
  arumbu: {
    id: "arumbu",
    name: {
      en: "Arumbu",
      ta: "அரும்பு",
    },
    ageRange: {
      en: "Ages 4-6",
      ta: "வயது 4-6",
    },
    minAge: 4,
    maxAge: 6
  },
  mottu: {
    id: "mottu",
    name: {
      en: "Mottu",
      ta: "மொட்டு",
    },
    ageRange: {
      en: "Ages 7-9",
      ta: "வயது 7-9",
    },
    minAge: 7,
    maxAge: 9
  },
  mugai: {
    id: "mugai",
    name: {
      en: "Mugai",
      ta: "முகை",
    },
    ageRange: {
      en: "Ages 10-12",
      ta: "வயது 10-12",
    },
    minAge: 10,
    maxAge: 12
  },
  malar: {
    id: "malar",
    name: {
      en: "Malar",
      ta: "மலர்",
    },
    ageRange: {
      en: "Ages 13-15",
      ta: "வயது 13-15",
    },
    minAge: 13,
    maxAge: 15
  }
};

// Helper function to determine division based on age
export const getDivisionByAge = (age: number): Division | null => {
  for (const [key, value] of Object.entries(divisions)) {
    if (age >= value.minAge && age <= value.maxAge) {
      return key as Division;
    }
  }
  return null;
};