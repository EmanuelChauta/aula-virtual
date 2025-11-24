import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, FileText, Award, MessageSquare, LogOut, BookOpen, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseEnrollment from '@/components/CourseEnrollment';
import StudentAssignments from '@/components/StudentAssignments';
import StudentGrades from '@/components/StudentGrades';
import DiscussionForums from '@/components/DiscussionForums';

function StudentDashboard({ user, onLogout }) {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    const userEnrollments = JSON.parse(localStorage.getItem(`enrollments_${user.id}`) || '[]');
    const enrolled = allCourses.filter(course => userEnrollments.includes(course.id));
    setEnrolledCourses(enrolled);
  }, [user.id]);

  const groupedCourses = enrolledCourses.reduce((acc, course) => {
    if (!acc[course.subject]) {
      acc[course.subject] = [];
    }
    acc[course.subject].push(course);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Student Dashboard</h2>
                <p className="text-sm text-gray-600">Welcome, {user.name}</p>
              </div>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="flex items-center space-x-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white rounded-lg p-1 shadow-sm">
            <TabsTrigger value="courses" className="flex items-center space-x-2">
              <Book className="w-4 h-4" />
              <span>My Courses</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Assignments</span>
            </TabsTrigger>
            <TabsTrigger value="grades" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>My Grades</span>
            </TabsTrigger>
            <TabsTrigger value="forums" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Forums</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <CourseEnrollment 
                userId={user.id} 
                onEnrollmentChange={() => {
                  const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
                  const userEnrollments = JSON.parse(localStorage.getItem(`enrollments_${user.id}`) || '[]');
                  const enrolled = allCourses.filter(course => userEnrollments.includes(course.id));
                  setEnrolledCourses(enrolled);
                }}
              />

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Enrolled Course Materials</h2>
                
                {Object.keys(groupedCourses).length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Book className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>No courses enrolled yet.</p>
                    <p className="text-sm mt-2">Enroll in courses to access materials!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedCourses).map(([subject, materials]) => (
                      <div key={subject} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <Book className="w-5 h-5 mr-2 text-blue-600" />
                          {subject}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {materials.map(material => (
                            <motion.div
                              key={material.id}
                              whileHover={{ scale: 1.02 }}
                              className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-all"
                            >
                              <h4 className="font-semibold text-gray-800 mb-2">{material.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{material.type}</span>
                                <span className="text-blue-600">By: {material.teacherName}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="assignments">
            <StudentAssignments userId={user.id} userName={user.name} />
          </TabsContent>

          <TabsContent value="grades">
            <StudentGrades userId={user.id} />
          </TabsContent>

          <TabsContent value="forums">
            <DiscussionForums user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default StudentDashboard;