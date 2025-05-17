import { Child } from "@/types/user";

export const children: Child[] = [
  {
    id: "child-1",
    name: "Arjun Kumar",
    age: 7,
    gender: "male",
    tamilSchool: "Tamil Academy",
    tamilGrade: "Grade 2",
    photoUrl: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=500",
    division: "mottu",
    registeredGames: ["pambaram", "kolli-gundu"],
    scores: [],
    dateOfBirth: "2017-05-15",
    medicalInfo: "No allergies",
    notes: "Loves to play outdoor games",
    parentId: "parent-1"
  },
  {
    id: "child-2",
    name: "Priya Sharma",
    age: 10,
    gender: "female",
    tamilSchool: "Tamil Academy",
    tamilGrade: "Grade 4",
    photoUrl: "https://images.unsplash.com/photo-1628191139360-4083564d03fd?q=80&w=500",
    division: "mugai",
    registeredGames: ["nondi-ottam", "saakku-ottam"],
    scores: [],
    dateOfBirth: "2014-08-22",
    medicalInfo: "Mild peanut allergy",
    notes: "Enjoys drawing and painting",
    parentId: "parent-1"
  },
  {
    id: "child-3",
    name: "Vikram Patel",
    age: 8,
    gender: "male",
    tamilSchool: "Tamil Vidyalaya",
    tamilGrade: "Grade 3",
    photoUrl: "https://images.unsplash.com/photo-1595601827380-a3f606ea4fba?q=80&w=500",
    division: "mottu",
    registeredGames: ["pambaram", "kitti-pull"],
    scores: [],
    dateOfBirth: "2016-03-10",
    medicalInfo: "Asthma, carries inhaler",
    notes: "Loves cricket and traditional games",
    parentId: "parent-2"
  },
  {
    id: "child-4",
    name: "Meena Rajan",
    age: 12,
    gender: "female",
    tamilSchool: "Tamil Vidyalaya",
    tamilGrade: "Grade 6",
    photoUrl: "https://images.unsplash.com/photo-1615332579037-3c44b3660b53?q=80&w=500",
    division: "ilai",
    registeredGames: ["pallanguzhi", "uriyadi"],
    scores: [],
    dateOfBirth: "2012-11-05",
    medicalInfo: "None",
    notes: "Interested in traditional dance and music",
    parentId: "parent-2"
  }
];