import { Division } from "@/constants/divisions";
import { ScoringType } from "@/constants/scoring";

export type GameStatus = "scheduled" | "live" | "complete";

export interface Game {
  id: string;
  name: {
    en: string;
    ta: string;
  };
  description: {
    en: string;
    ta: string;
  };
  imageUrl: string;
  divisions: Division[];
  scoringType: ScoringType;
  maxPlayers: number;
  location: string;
  status: GameStatus;
}

export const games: Game[] = [
  {
    id: "pambaram",
    name: {
      en: "Pambaram",
      ta: "பம்பரம்",
    },
    description: {
      en: "Spinning top game where players compete to keep their tops spinning the longest.",
      ta: "பம்பரம் சுழற்றும் விளையாட்டு, வீரர்கள் தங்கள் பம்பரங்களை நீண்ட நேரம் சுழற்றுவதற்காக போட்டியிடுகிறார்கள்.",
    },
    imageUrl: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/games/pamparam.jpg",
    divisions: ["arumbu", "mottu", "mugai", "malar"],
    scoringType: "time",
    maxPlayers: 10,
    location: "Field A",
    status: "scheduled",
  },
  {
    id: "kolli-gundu",
    name: {
      en: "Kolli Gundu",
      ta: "கோலி குண்டு",
    },
    description: {
      en: "A traditional marble game where players aim to hit and collect other marbles.",
      ta: "ஒரு பாரம்பரிய கோலி விளையாட்டு, வீரர்கள் மற்ற கோலிகளை அடித்து சேகரிக்க இலக்கு வைக்கிறார்கள்.",
    },
    imageUrl: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/games/golli.jpg",
    divisions: ["mottu", "mugai", "malar"],
    scoringType: "points",
    maxPlayers: 8,
    location: "Field B",
    status: "scheduled",
  },
  {
    id: "kitti-pull",
    name: {
      en: "Kitti Pull",
      ta: "கிட்டிப் புல்",
    },
    description: {
      en: "A stick and peg game where players hit a small piece of wood to score points.",
      ta: "ஒரு குச்சி மற்றும் முளை விளையாட்டு, வீரர்கள் புள்ளிகளைப் பெற ஒரு சிறிய மரத்துண்டை அடிக்கிறார்கள்.",
    },
    imageUrl: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/games/gilli.jpg",
    divisions: ["mugai", "malar"],
    scoringType: "points",
    maxPlayers: 6,
    location: "Field C",
    status: "scheduled",
  },
  {
    id: "nondi-ottam",
    name: {
      en: "Nondi Ottam",
      ta: "நொண்டி ஓட்டம்",
    },
    description: {
      en: "Hopping race where players hop on one leg to reach the finish line.",
      ta: "ஒரு காலில் குதித்து முடிவு கோட்டை அடைய வீரர்கள் போட்டியிடும் ஓட்டப் பந்தயம்.",
    },
    imageUrl: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/games/nondi.jpg",
    divisions: ["arumbu", "mottu", "mugai", "malar"],
    scoringType: "time",
    maxPlayers: 8,
    location: "Track A",
    status: "scheduled",
  },
  {
    id: "saakku-ottam",
    name: {
      en: "Saakku Ottam",
      ta: "சாக்கு ஓட்டம்",
    },
    description: {
      en: "Sack race where players jump in gunny sacks to reach the finish line.",
      ta: "சாக்கு ஓட்டம், வீரர்கள் சாக்குப் பைகளில் குதித்து முடிவு கோட்டை அடைகிறார்கள்.",
    },
    imageUrl: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/games/sakku.jpg",
    divisions: ["arumbu", "mottu", "mugai", "malar"],
    scoringType: "time",
    maxPlayers: 10,
    location: "Track B",
    status: "scheduled",
  },
  {
    id: "elumichai-ottam",
    name: {
      en: "Elumichai Ottam",
      ta: "எலுமிச்சை ஓட்டம்",
    },
    description: {
      en: "Lemon and spoon race where players balance a lemon on a spoon while racing.",
      ta: "எலுமிச்சை மற்றும் கரண்டி ஓட்டம், வீரர்கள் ஓடும்போது கரண்டியில் எலுமிச்சையை சமநிலைப்படுத்துகிறார்கள்.",
    },
    imageUrl: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/games/lemon.jpg",
    divisions: ["arumbu", "mottu", "mugai"],
    scoringType: "time",
    maxPlayers: 8,
    location: "Track C",
    status: "scheduled",
  },
  {
    id: "vilambu",
    name: {
      en: "Vil Ambu",
      ta: "வில் அம்பு",
    },
    description: {
      en: "A traditional game involving throwing sticks to knock down targets.",
      ta: "இலக்குகளை வீழ்த்த குச்சிகளை வீசும் ஒரு பாரம்பரிய விளையாட்டு.",
    },
    imageUrl: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/games/vilambu.jpg",
    divisions: ["mottu", "mugai", "malar"],
    scoringType: "points",
    maxPlayers: 6,
    location: "Field D",
    status: "scheduled",
  },
  {
    id: "undi-vil",
    name: {
      en: "Undi Vil",
      ta: "உண்டி வில்",
    },
    description: {
      en: "Traditional bow and arrow game testing accuracy and skill.",
      ta: "துல்லியம் மற்றும் திறமையை சோதிக்கும் பாரம்பரிய வில் மற்றும் அம்பு விளையாட்டு.",
    },
    imageUrl: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/games/undivil.jpg",
    divisions: ["mugai", "malar"],
    scoringType: "points",
    maxPlayers: 8,
    location: "Field E",
    status: "scheduled",
  },
  {
    id: "uriyadi",
    name: {
      en: "Uriyadi",
      ta: "உரியடி",
    },
    description: {
      en: "Pot breaking game where blindfolded players try to break a hanging pot.",
      ta: "கண்கட்டப்பட்ட வீரர்கள் தொங்கும் பானையை உடைக்க முயற்சிக்கும் பானை உடைக்கும் விளையாட்டு.",
    },
    imageUrl: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/games/uriyadi.jpg",
    divisions: ["mottu", "mugai", "malar"],
    scoringType: "points",
    maxPlayers: 10,
    location: "Field F",
    status: "scheduled",
  }
];