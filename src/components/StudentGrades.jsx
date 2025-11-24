import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Calendar } from 'lucide-react';

function StudentGrades({ userId }) {
  const [gradedAssignments, setGradedAssignments] = useState([]);
  const [stats, setStats] = useState({ total: 0, average: 0, graded: 0 });

  useEffect(() => {
    const allAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    
    const myGrades = [];
    let totalPoints = 0;
    let earnedPoints = 0;
    let gradedCount = 0;

    allAssignments.forEach(assignment => {
      if (assignment.submissions) {
        const mySubmission = assignment.submissions.find(s => s.studentId === userId);
        if (mySubmission && mySubmission.grade !== undefined) {
          myGrades.push({
            ...assignment,
            submission: mySubmission
          });
          totalPoints += assignment.points;
          earnedPoints += mySubmission.grade;
          gradedCount++;
        }
      }
    });

    setGradedAssignments(myGrades);
    setStats({
      total: totalPoints,
      average: gradedCount > 0 ? ((earnedPoints / totalPoints) * 100).toFixed(1) : 0,
      graded: gradedCount
    });
  }, [userId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Grades</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Overall Average</p>
                <p className="text-3xl font-bold text-blue-800">{stats.average}%</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Graded Assignments</p>
                <p className="text-3xl font-bold text-purple-800">{stats.graded}</p>
              </div>
              <Award className="w-10 h-10 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Points Earned</p>
                <p className="text-3xl font-bold text-green-800">
                  {gradedAssignments.reduce((sum, a) => sum + a.submission.grade, 0)}
                </p>
              </div>
              <Award className="w-10 h-10 text-green-600" />
            </div>
          </div>
        </div>

        {gradedAssignments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No graded assignments yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {gradedAssignments.map(assignment => (
              <motion.div
                key={assignment.id}
                whileHover={{ scale: 1.01 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {assignment.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {assignment.subject}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Graded: {new Date(assignment.submission.gradedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {assignment.submission.grade}/{assignment.points}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {((assignment.submission.grade / assignment.points) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default StudentGrades;