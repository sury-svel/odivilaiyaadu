export interface Event {
  id: string;
  name: {
    en: string;
    ta: string;
  };
  date: string;
  location: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  sponsors: {
    name: string;
    logo: string;
  }[];
  status: "upcoming" | "active" | "past";
  description: {
    en: string;
    ta: string;
  };
  registrationDeadline: string;
  gameIds: string[];
}

export const events: Event[] = [
  {
    id: "odi-vilayaadu-2025-connecticut",
    name: {
      en: "Odi Vilayaadu 2025 - Connecticut",
      ta: "ஓடி விளையாடு 2025 - கனெக்டிகட்",
    },
    date: "2025-06-01",
    location: {
      name: "Mixville Park",
      address: "1300 Notch Rd",
      city: "Cheshire",
      state: "CT",
      zipCode: "06410",
      coordinates: {
        latitude: 41.5034,
        longitude: -72.9279,
      },
    },
    sponsors: [
      {
        name: "CT Tamil Sangam",
        logo: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/events/CT/ctts-logo.jpg",
      },
      {
        name: "Jey Manickam Realtor",
        logo: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/events/CT/jeym.jpg",
      },
    ],
    status: "active",
    description: {
      en: "Join us for the Cheshire edition of Odi Vilayaadu 2025. Experience traditional Tamil games and cultural activities for children.",
      ta: "அனைத்து வயதினருக்கும் ஆண்டு பாரம்பரிய தமிழ் விளையாட்டு நிகழ்வு. போட்டி மற்றும் பண்பாட்டுக் கொண்டாட்டத்திற்கான நாளில் எங்களுடன் இணையுங்கள்.",
    },
    registrationDeadline: "2025-05-15",
    gameIds: ["pambaram", "kolli-gundu", "kitti-pull", "nondi-ottam", "saakku-ottam", "elumichai-ottam", "vilambu", "undi-vil", "uriyadi"],
  },
  {
    id: "odi-vilayaadu-2025-atlanta",
    name: {
      en: "Odi Vilayaadu 2025 - Atlanta",
      ta: "ஓடி விளையாடு 2025 - அட்லாண்டா",
    },
    date: "2025-08-01",
    location: {
      name: "Fowler Park",
      address: "4110 Carolene Way",
      city: "Cumming",
      state: "GA",
      zipCode: "30040",
      coordinates: {
        latitude: 34.1954,
        longitude: -84.1409,
      },
    },
    sponsors: [
      {
        name: "Atlanta Tamil Sangam",
        logo: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=500",
      },
      {
        name: "Tamil Language School",
        logo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=500",
      },
    ],
    status: "upcoming",
    description: {
      en: "Odi Vilayaadu comes to Cumming, GA! Register your children for a day of traditional Tamil games and cultural activities.",
      ta: "ஓடி விளையாடு 2025 அட்லாண்டா பதிப்பில் எங்களுடன் இணையுங்கள். குழந்தைகளுக்கான பாரம்பரிய தமிழ் விளையாட்டுகள் மற்றும் பண்பாட்டு நடவடிக்கைகளை அனுபவியுங்கள்.",
    },
    registrationDeadline: "2025-07-15",
    gameIds: ["pambaram", "kolli-gundu", "nondi-ottam", "saakku-ottam", "elumichai-ottam", "uriyadi"],
  },
  {
    id: "odi-vilayaadu-2024-atlanta",
    name: {
      en: "Odi Vilayaadu 2024 - Cumming",
      ta: "ஓடி விளையாடு 2024 - கம்மிங்",
    },
    date: "2024-06-30",
    location: {
      name: "Fowler Park",
      address: "4110 Carolene Way",
      city: "Cumming",
      state: "GA",
      zipCode: "30040",
      coordinates: {
        latitude: 34.1954,
        longitude: -84.1409,
      },
    },
    sponsors: [
      {
        name: "Atlanta Tamil Sangam",
        logo: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=500",
      },
      {
        name: "Tamil Language School",
        logo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=500",
      },
    ],
    status: "past",
    description: {
      en: "Annual traditional Tamil games event for children of all ages. Join us for a day of fun, competition, and cultural celebration.",
      ta: "அனைத்து வயதினருக்கும் ஆண்டு பாரம்பரிய தமிழ் விளையாட்டு நிகழ்வு. மகிழ்ச்சி, போட்டி மற்றும் கலாச்சார கொண்டாட்டத்திற்கான ஒரு நாளில் எங்களுடன் இணையுங்கள்.",
    },
    registrationDeadline: "2024-06-15",
    gameIds: ["pambaram", "kolli-gundu", "kitti-pull", "nondi-ottam", "saakku-ottam"],
  },
  {
    id: "odi-vilayaadu-2024-connecticut",
    name: {
      en: "Odi Vilayaadu 2024 - Cheshire",
      ta: "ஓடி விளையாடு 2024 - செஷயர்",
    },
    date: "2024-06-01",
    location: {
      name: "Mixville Park",
      address: "1300 Notch Rd",
      city: "Cheshire",
      state: "CT",
      zipCode: "06410",
      coordinates: {
        latitude: 41.5034,
        longitude: -72.9279,
      },
    },
    sponsors: [
      {
        name: "Tamil Community Center",
        logo: "https://images.unsplash.com/photo-1568822617270-2c1579f8dfe2?q=80&w=500",
      },
      {
        name: "South Indian Restaurant",
        logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=500",
      },
    ],
    status: "past",
    description: {
      en: "Join us for the Cheshire edition of Odi Vilayaadu 2024. Experience traditional Tamil games and cultural activities for children.",
      ta: "ஓடி விளையாடு 2024 செஷயர் பதிப்பில் எங்களுடன் இணையுங்கள். குழந்தைகளுக்கான பாரம்பரிய தமிழ் விளையாட்டுகள் மற்றும் கலாச்சார நடவடிக்கைகளை அனுபவியுங்கள்.",
    },
    registrationDeadline: "2024-05-15",
    gameIds: ["pambaram", "kolli-gundu", "kitti-pull", "nondi-ottam", "saakku-ottam", "elumichai-ottam", "vilambu", "undi-vil", "uriyadi"],
  },
];