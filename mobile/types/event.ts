export type EventStatus = "active" | "upcoming" | "past";
export type GameStatus = "scheduled" | "live" | "completed";
export type Medal = "gold" | "silver" | "bronze" | "none";
export type ScoringType =  "points"|"time"|"distance";

export interface LocalizedText {
  en: string;
  ta: string;
  [key: string]: string; // Add index signature for language keys
}

export interface Sponsor {
  name: string | LocalizedText;
  logoUrl: string;
  websiteUrl: string;
}

export interface Event {
  id: string;
  code: string;
  name: string | LocalizedText;
  description: string | LocalizedText;
  date: string;
  venueName: string | LocalizedText;
  address: string;
  fieldMapUrl: string;
  status: EventStatus;
  games?: string[];
  gameIds?: string[]; // Added for compatibility
  registrationEndDate?: string;
  imageUrl?: string;
  sponsors?: Sponsor[];
  associates?: Sponsor[];
  createdAt?: string;
  updatedAt?: string;
  registeredCount ?: number;
}

export interface Game {
  id: string;
  eventId: string;
  name: string | LocalizedText;
  description: string | LocalizedText;
  rules?: string | LocalizedText;
  imageUrl?: string;
  status: GameStatus;
  divisions?: Division[];
  registeredParticipants?: string[];
  assignedVolunteers?: string[];
  mapLocation?: string;
  scoringType?: ScoringType;
}

export interface ScoreCard {
  childId: string;
  divisionId: string;
  name: string;
  age: number;
  score: number | null;
  position: number;
  medal: Medal;
}

export interface Division {
  id: string;
  name: string | LocalizedText;
  minAge: number;
  maxAge: number;
  registrationCount: number;
  scoreCards: ScoreCard[];
}

export interface ScoreCardProps {
  childName?: string;
  gameName?: string;
  score?: number;
  position?: number;
  scoringType?: ScoringType;
  result?: {
    gameId: string;
    score: number;
    position?: number;
    medal: Medal;    
  };
  game?: Game;
}