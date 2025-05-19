
import { Course } from "@/types/course";

export const courses: Course[] = [
  {
    id: "cs101",
    code: "COMPSCI 101",
    title: "Introduction to Computer Science",
    description: "An introduction to programming and problem solving using Python. Covers concepts including variables, functions, control structures, and basic data structures. No prior programming experience required.",
    department: "Computer Science",
    credits: 3,
    instructors: ["Dr. Susan Rodger", "Dr. Robert Duvall"],
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      time: "10:05 AM - 11:20 AM",
      location: "LSRC D106"
    },
    keywords: ["programming", "python", "algorithms", "computer science", "beginner"]
  },
  {
    id: "cs201",
    code: "COMPSCI 201",
    title: "Data Structures and Algorithms",
    description: "Analysis, use, and design of data structures and algorithms using object-oriented programming with Java. Emphasis on abstract data type design and implementation. Prerequisite: CompSci 101.",
    department: "Computer Science",
    credits: 4,
    prerequisites: ["COMPSCI 101"],
    instructors: ["Dr. Owen Astrachan", "Dr. Salman Azhar"],
    schedule: {
      days: ["Tuesday", "Thursday"],
      time: "1:25 PM - 2:40 PM",
      location: "Hudson Hall 125"
    },
    keywords: ["java", "data structures", "algorithms", "computer science", "intermediate"]
  },
  {
    id: "bio101",
    code: "BIO 101",
    title: "Introductory Biology",
    description: "Introduction to the major concepts of biology and scientific methodology. Covers molecular basis of life, genetics, evolution, and ecology.",
    department: "Biology",
    credits: 4,
    instructors: ["Dr. Emily Williams", "Dr. Michael Johnson"],
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      time: "9:10 AM - 10:00 AM",
      location: "French Science 2231"
    },
    keywords: ["biology", "life sciences", "genetics", "ecology", "beginner"]
  },
  {
    id: "math201",
    code: "MATH 201",
    title: "Multivariable Calculus",
    description: "Partial derivatives, multiple integrals, and topics in vector calculus, including Green's theorem, Stokes's theorem, and the divergence theorem.",
    department: "Mathematics",
    credits: 3,
    prerequisites: ["MATH 122"],
    instructors: ["Dr. David Kraines", "Dr. Linda Johnson"],
    schedule: {
      days: ["Tuesday", "Thursday"],
      time: "3:05 PM - 4:20 PM",
      location: "Physics 130"
    },
    keywords: ["calculus", "mathematics", "vectors", "multivariable", "intermediate"]
  },
  {
    id: "psych101",
    code: "PSY 101",
    title: "Introductory Psychology",
    description: "Survey of modern psychology including neuroscience, cognitive, social, developmental, abnormal, and clinical psychology.",
    department: "Psychology & Neuroscience",
    credits: 3,
    instructors: ["Dr. Angela Duckworth", "Dr. Robert Thompson"],
    schedule: {
      days: ["Monday", "Wednesday"],
      time: "11:45 AM - 1:00 PM",
      location: "Sociology-Psychology 126"
    },
    keywords: ["psychology", "neuroscience", "behavior", "mental health", "beginner"]
  },
  {
    id: "dance101",
    code: "DANCE 101",
    title: "Introduction to Dance",
    description: "An introduction to dance as a performing art, focusing on the history, aesthetics, and cultural contexts of various dance forms.",
    department: "Dance",
    credits: 3,
    instructors: ["Prof. Barbara Dickinson", "Prof. Tyler Walters"],
    schedule: {
      days: ["Monday", "Wednesday"],
      time: "2:30 PM - 3:45 PM",
      location: "Rubenstein Arts Center 224"
    },
    keywords: ["dance", "performance", "arts", "movement", "beginner"]
  },
  {
    id: "nutr301",
    code: "NUTR 301",
    title: "Nutrition Science and Application",
    description: "Covers principles of nutrition science and their applications to health and wellness. Topics include macronutrients, micronutrients, metabolism, and nutrition through the life cycle.",
    department: "Health Sciences",
    credits: 4,
    prerequisites: ["BIO 101"],
    instructors: ["Dr. Sarah Johnson", "Dr. Michael Chen"],
    schedule: {
      days: ["Tuesday", "Thursday"],
      time: "10:05 AM - 11:20 AM",
      location: "Trent Hall 040"
    },
    keywords: ["nutrition", "health", "diet", "metabolism", "intermediate"]
  }
];
