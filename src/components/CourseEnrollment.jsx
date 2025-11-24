import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function CourseEnrollment({ userId, onEnrollmentChange }) {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    
    const uniqueCourses = allCourses.reduce((acc, course) => {
      const key = `${course.subject}-${course.teacherId}`;
      if (!acc[key]) {
        acc[key] = {
          subject: course.subject,
          teacherName: course.teacherName,
          teacherId: course.teacherId,
          materialCount: 0,
          courses: []
        };
      }
      acc[key].materialCount++;
      acc[key].courses.push(course);
      return acc;
    }, {});

    setAvailableCourses(Object.values(uniqueCourses));
    
    const enrollments = JSON.parse(localStorage.getItem(`enrollments_${userId}`) || '[]');
    setEnrolledIds(enrollments);
  }, [userId]);

  const handleEnroll = (courseGroup) => {
    const courseIds = courseGroup.courses.map(c => c.id);
    const newEnrollments = [...enrolledIds, ...courseIds];
    localStorage.setItem(`enrollments_${userId}`, JSON.stringify(newEnrollments));
    setEnrolledIds(newEnrollments);
    onEnrollmentChange();
    
    toast({
      title: "Enrolled Successfully",
      description: `You are now enrolled in ${courseGroup.subject}!`,
    });
  };

  const isEnrolled = (courseGroup) => {
    return courseGroup.courses.some(course => enrolledIds.includes(course.id));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Courses</h2>
      
      {availableCourses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>No courses available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableCourses.map((courseGroup, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-lg border border-blue-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                {isEnrolled(courseGroup) && (
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center">
                    <Check className="w-3 h-3 mr-1" />
                    Enrolled
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {courseGroup.subject}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                Instructor: {courseGroup.teacherName}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {courseGroup.materialCount} materials available
              </p>
              
              {!isEnrolled(courseGroup) && (
                <Button
                  onClick={() => handleEnroll(courseGroup)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Enroll Now
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseEnrollment;