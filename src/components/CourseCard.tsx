
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from '@/types/course';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Card className="mb-4 border-2 border-gray-200 hover:border-duke-blue transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-duke-blue">{course.code}</CardTitle>
            <CardDescription className="text-gray-500">{course.department}</CardDescription>
          </div>
          <div className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">
            {course.credits} {course.credits === 1 ? 'credit' : 'credits'}
          </div>
        </div>
        <h3 className="font-semibold text-lg mt-1">{course.title}</h3>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-duke-text text-sm">{course.description}</p>
        
        {course.schedule && (
          <div className="mt-3 text-sm">
            <p className="font-medium">Schedule:</p>
            <p className="text-duke-text">
              {course.schedule.days.join(', ')} at {course.schedule.time}
              <br />
              Location: {course.schedule.location}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex-col items-start pt-0">
        {course.instructors && course.instructors.length > 0 && (
          <div className="text-sm w-full">
            <p className="font-medium">Instructors:</p>
            <p className="text-duke-text">{course.instructors.join(', ')}</p>
          </div>
        )}
        
        {course.prerequisites && course.prerequisites.length > 0 && (
          <div className="text-sm mt-2 w-full">
            <p className="font-medium">Prerequisites:</p>
            <p className="text-duke-text">{course.prerequisites.join(', ')}</p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
