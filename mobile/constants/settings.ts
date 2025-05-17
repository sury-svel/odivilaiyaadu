import { Division } from "./divisions";

// Configurable settings for the application
export const settings = {
  // Maximum number of games a volunteer can assign to
  maxVolunteerGames: 3,
  
  // Event registration window in days (3 months)
  eventRegistrationWindow: 90,
  
  // Food preference options
  foodPreferences: [
    { id: "kids_meal", name: { en: "Kids Meal", ta: "குழந்தைகள் உணவு" } },
    { id: "adult_veg", name: { en: "Adult Vegetarian Meal", ta: "பெரியவர்கள் சைவ உணவு" } },
    { id: "adult_non_veg", name: { en: "Adult Non-Vegetarian Meal", ta: "பெரியவர்கள் அசைவ உணவு" } }
  ],
  
  // Waiver agreement text
  waiverAgreement: {
    en: "In consideration of being permitted to participate in AmChaTS/APS Odi Vilayaadu Kids event, I hereby waive, release and discharge any and all claims for damages for personal injury, death, or property damage which I may have, or which may hereafter accrue to me, against AmChaTS/APS as a result of my participation in the event. This release is intended to discharge the organizers, sponsors, and volunteers from and against any and all liability arising out of or connected in any way with my participation in the event, even though that liability may arise out of the negligence or carelessness on the part of persons or entities mentioned above. I understand that this waiver and release is binding on my heirs, assigns, and legal representatives. I SIGN IT OF MY OWN FREE WILL.",
    ta: "AmChaTS/APS ஓடி விளையாடு குழந்தைகள் நிகழ்ச்சியில் பங்கேற்க அனுமதிக்கப்படுவதைக் கருத்தில் கொண்டு, நிகழ்ச்சியில் எனது பங்கேற்பின் விளைவாக ஏற்படும் தனிப்பட்ட காயம், மரணம் அல்லது சொத்து சேதத்திற்கான எந்தவொரு மற்றும் அனைத்து இழப்பீட்டு கோரிக்கைகளையும் நான் இதன்மூலம் தள்ளுபடி செய்கிறேன், விடுவிக்கிறேன் மற்றும் விலக்குகிறேன். இந்த விடுவிப்பு ஏற்பாட்டாளர்கள், ஸ்பான்சர்கள் மற்றும் தன்னார்வலர்களை நிகழ்ச்சியில் எனது பங்கேற்புடன் தொடர்புடைய அல்லது எந்தவிதத்திலும் தொடர்புடைய எந்தவொரு மற்றும் அனைத்து பொறுப்புகளிலிருந்தும் விடுவிக்க உத்தேசிக்கப்பட்டுள்ளது, மேலே குறிப்பிடப்பட்டுள்ள நபர்கள் அல்லது நிறுவனங்களின் அலட்சியம் அல்லது கவனக்குறைவால் அந்த பொறுப்பு எழுந்தாலும். இந்த தள்ளுபடி மற்றும் விடுவிப்பு எனது வாரிசுகள், ஒதுக்கீடுகள் மற்றும் சட்ட பிரதிநிதிகளைக் கட்டுப்படுத்துகிறது என்பதை நான் புரிந்துகொள்கிறேன். நான் இதை எனது சொந்த விருப்பத்தின் பேரில் கையெழுத்திடுகிறேன்."
  },
  
  // Game scoring types
  scoringTypes: [
    { id: "points", name: { en: "Points", ta: "புள்ளிகள்" } },
    { id: "time_position", name: { en: "Time and Position", ta: "நேரம் மற்றும் நிலை" } }
  ],
  
  // Game details
  gameDetails: {
    "goli-gundu": {
      divisions: ["arumbu", "mottu", "mugai", "malar"],
      location: "C1",
      scoringType: "points"
    },
    "kitti-pull": {
      divisions: ["mottu", "mugai", "malar"],
      location: "C8",
      scoringType: "points"
    },
    "nondi-ottam": {
      divisions: ["arumbu", "mottu", "mugai", "malar"],
      location: "C3",
      scoringType: "time_position"
    },
    "saakku-ottam": {
      divisions: ["arumbu", "mottu", "mugai"],
      location: "C2",
      scoringType: "time_position"
    },
    "elumichai-ottam": {
      divisions: ["arumbu", "mottu", "mugai", "malar"],
      location: "C2",
      scoringType: "time_position"
    },
    "vil-ambu": {
      divisions: ["mottu", "mugai", "malar"],
      location: "C5",
      scoringType: "points"
    },
    "undi-vil": {
      divisions: ["mottu", "mugai", "malar"],
      location: "C7",
      scoringType: "points"
    },
    "uriyadi": {
      divisions: ["mottu", "mugai", "malar", "semmal"],
      location: "C7",
      scoringType: "points"
    }
  }
};

// Helper function to check if a game is eligible for a specific division
export const isGameEligibleForDivision = (gameId: string, division: Division): boolean => {
  const gameConfig = settings.gameDetails[gameId as keyof typeof settings.gameDetails];
  if (!gameConfig) return false;
  return gameConfig.divisions.includes(division);
};

// Helper function to check if an event is within registration window
export const isEventWithinRegistrationWindow = (eventDate: string): boolean => {
  const currentDate = new Date();
  const eventDateObj = new Date(eventDate);
  
  // Event date is in the past
  if (eventDateObj < currentDate) return false;
  
  // Calculate days difference
  const diffTime = eventDateObj.getTime() - currentDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= settings.eventRegistrationWindow;
};

// Helper function to determine event status based on date
export const getEventStatus = (eventDate: string): "upcoming" | "active" | "completed" => {
  const currentDate = new Date();
  const eventDateObj = new Date(eventDate);
  
  // Event date is in the past
  if (eventDateObj < currentDate) return "completed";
  
  // Calculate days difference
  const diffTime = eventDateObj.getTime() - currentDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Event is within registration window
  if (diffDays <= settings.eventRegistrationWindow) return "active";
  
  // Event is beyond registration window
  return "upcoming";
};