
import { Course } from "@/types/course";
import { courses } from "@/data/courses";

// A simple scoring function that computes similarity between query and course data
const computeScore = (query: string, course: Course): number => {
  query = query.toLowerCase();
  
  // Check for exact matches in code or title (high priority)
  if (course.code.toLowerCase() === query || course.title.toLowerCase() === query) {
    return 1.0;
  }

  // Compute content-based relevancy score
  let score = 0;
  
  // Search in title
  if (course.title.toLowerCase().includes(query)) {
    score += 0.8;
  }
  
  // Search in code
  if (course.code.toLowerCase().includes(query)) {
    score += 0.7;
  }
  
  // Search in description
  if (course.description.toLowerCase().includes(query)) {
    score += 0.6;
  }
  
  // Search in department
  if (course.department.toLowerCase().includes(query)) {
    score += 0.5;
  }
  
  // Search in keywords
  if (course.keywords?.some(keyword => keyword.toLowerCase().includes(query))) {
    score += 0.4;
  }

  // Check for query words
  const queryWords = query.split(/\s+/);
  for (const word of queryWords) {
    if (word.length > 2) { // Skip very short words
      if (course.title.toLowerCase().includes(word)) score += 0.3;
      if (course.description.toLowerCase().includes(word)) score += 0.2;
      if (course.keywords?.some(keyword => keyword.toLowerCase().includes(word))) score += 0.1;
    }
  }
  
  return score;
};

// Detect if a query might be related to courses
export const isCourseRelatedQuery = (query: string): boolean => {
  const courseRelatedTerms = [
    'course', 'class', 'schedule', 'register', 'enroll', 'credit', 'department', 
    'professor', 'instructor', 'teach', 'study', 'subject', 'major', 'minor',
    'degree', 'semester', 'lecture', 'prerequisite', 'syllabus', 'exam', 'final',
    'midterm', 'grade', 'assessment', 'compsci', 'bio', 'math', 'psy', 'dance', 'nutr'
  ];
  
  const normalizedQuery = query.toLowerCase();
  return courseRelatedTerms.some(term => normalizedQuery.includes(term));
};

// Retrieve courses based on a query
export const findRelevantCourses = (query: string): Course[] => {
  // Score each course based on relevance to the query
  const scoredCourses = courses.map(course => ({
    course,
    score: computeScore(query, course)
  }));
  
  // Filter out courses with too low scores
  const relevantCourses = scoredCourses.filter(item => item.score > 0.1);
  
  // Sort by score (descending)
  relevantCourses.sort((a, b) => b.score - a.score);
  
  // Return only courses, limited to top 3
  return relevantCourses.slice(0, 3).map(item => item.course);
};

// Generate a response that includes course information
export const generateCourseResponse = (userQuery: string): string => {
  const relevantCourses = findRelevantCourses(userQuery);
  
  if (relevantCourses.length === 0) {
    return "I couldn't find any specific courses matching your query. Could you provide more details about what you're looking for?";
  }
  
  let response = "Here's what I found about the courses you mentioned:\n\n";
  
  relevantCourses.forEach(course => {
    response += `**${course.code}: ${course.title}**\n`;
    response += `Department: ${course.department}\n`;
    response += `Credits: ${course.credits}\n`;
    response += `${course.description}\n\n`;
    
    if (course.schedule) {
      response += `Schedule: ${course.schedule.days.join(', ')} at ${course.schedule.time}, ${course.schedule.location}\n\n`;
    }
    
    if (course.instructors && course.instructors.length > 0) {
      response += `Instructors: ${course.instructors.join(', ')}\n\n`;
    }
    
    if (course.prerequisites && course.prerequisites.length > 0) {
      response += `Prerequisites: ${course.prerequisites.join(', ')}\n\n`;
    }
  });
  
  response += "Is there anything specific about these courses you'd like to know more about?";
  
  return response;
};
