import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function StudentAssignments({ userId, userName }) {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    const allAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    const enrollments = JSON.parse(localStorage.getItem(`enrollments_${userId}`) || '[]');
    const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    
    const enrolledSubjects = new Set();
    enrollments.forEach(courseId => {
      const course = allCourses.find(c => c.id === courseId);
      if (course) {
        enrolledSubjects.add(course.subject);
      }
    });

    const relevantAssignments = allAssignments.filter(a => enrolledSubjects.has(a.subject));
    setAssignments(relevantAssignments);

    const savedSubmissions = JSON.parse(localStorage.getItem(`submissions_${userId}`) || '{}');
    setSubmissions(savedSubmissions);
  }, [userId]);

  const handleSubmit = (assignmentId) => {
    const submission = {
      studentId: userId,
      studentName: userName,
      submittedAt: new Date().toISOString(),
      content: submissions[assignmentId] || '',
      status: 'submitted'
    };

    const allAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    const assignmentIndex = allAssignments.findIndex(a => a.id === assignmentId);
    
    if (assignmentIndex !== -1) {
      if (!allAssignments[assignmentIndex].submissions) {
        allAssignments[assignmentIndex].submissions = [];
      }
      
      const existingIndex = allAssignments[assignmentIndex].submissions.findIndex(
        s => s.studentId === userId
      );
      
      if (existingIndex !== -1) {
        allAssignments[assignmentIndex].submissions[existingIndex] = submission;
      } else {
        allAssignments[assignmentIndex].submissions.push(submission);
      }
      
      localStorage.setItem('assignments', JSON.stringify(allAssignments));
      
      const updatedSubmissions = { ...submissions };
      delete updatedSubmissions[assignmentId];
      setSubmissions(updatedSubmissions);
      localStorage.setItem(`submissions_${userId}`, JSON.stringify(updatedSubmissions));
      
      toast({
        title: "Assignment Submitted",
        description: "Your assignment has been submitted successfully!",
      });
    }
  };

  const hasSubmitted = (assignmentId) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    return assignment?.submissions?.some(s => s.studentId === userId);
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Assignments</h2>
        
        {assignments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No assignments available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map(assignment => (
              <motion.div
                key={assignment.id}
                whileHover={{ scale: 1.01 }}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {assignment.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{assignment.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {assignment.subject}
                      </span>
                      <span className="text-gray-600">
                        Instructor: {assignment.teacherName}
                      </span>
                      <span className="text-gray-600">
                        Points: {assignment.points}
                      </span>
                    </div>
                  </div>
                  
                  {hasSubmitted(assignment.id) ? (
                    <div className="bg-green-100 text-green-700 px-3 py-2 rounded-lg flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Submitted</span>
                    </div>
                  ) : isOverdue(assignment.dueDate) ? (
                    <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Overdue</span>
                    </div>
                  ) : (
                    <div className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Pending</span>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()} at {new Date(assignment.dueDate).toLocaleTimeString()}
                </div>

                {!hasSubmitted(assignment.id) && (
                  <div className="space-y-3">
                    <textarea
                      value={submissions[assignment.id] || ''}
                      onChange={(e) => setSubmissions({
                        ...submissions,
                        [assignment.id]: e.target.value
                      })}
                      placeholder="Enter your submission here..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                      rows={3}
                    />
                    <Button
                      onClick={() => handleSubmit(assignment.id)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      disabled={!submissions[assignment.id]}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Assignment
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default StudentAssignments;