import { Division } from "@/constants/divisions";
import { Medal } from "@/types/event";

export type UserRole = "parent" | "volunteer" | "admin";

export type FoodPreference = "kids_meal" | "adult_veg" | "adult_non_veg";

export interface User {
  id: string;
  email: string;
  fullName: string;
  name?: string; // Added for backward compatibility
  address: string;
  phone: string;
  role: UserRole;
  agreedToSafety: boolean;
  createdAt: string;
  language: "ta" | "en";
  foodPreference?: FoodPreference;
  assignedGames?: string[]; // Added for volunteer assignments
}

export interface VolunteerUser extends User {
  role: "volunteer";
  age: number;
  gender: "male" | "female" | "other";
  schoolOrCollege: string;
  assignedGames: string[];
  couponCode?: string;
  foodPreference?: FoodPreference;
}

export interface ParentUser extends User {
  role: "parent";
  children: string[]; // IDs of children
  foodPreference?: FoodPreference;
}

export interface AdminUser extends User {
  role: "admin";
  permissions: string[];
  foodPreference?: FoodPreference;
}

export interface Child {
  id: string;
  parentId: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  tamilSchool: string;
  tamilGrade: string;
  photoUrl?: string;
  division: Division;
  registeredGames: string[];
  results: {
    gameId: string;
    score: number;
    position?: number;
    medal: Medal;
  }[];
  medicalInfo?: string;
  notes?: string;
  foodPreference?: FoodPreference;
}