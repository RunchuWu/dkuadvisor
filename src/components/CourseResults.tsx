
import React from 'react';
import CourseCard from './CourseCard';
import { Course } from '@/types/course';

interface CourseResultsProps {
  courses: Course[];
}

const CourseResults: React.FC<CourseResultsProps> = ({ courses }) => {
  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="py-4 px-4 md:px-8 lg:px-16">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-lg font-medium mb-3 text-duke-blue">Relevant Courses</h3>
        <div className="space-y-4">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseResults;
