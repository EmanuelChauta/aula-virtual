import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, User, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function GradesManagement({ user }) {
  const [assignments, setAssignments] = useState([]);
  const [editingGrade, setEditingGrade] = useState(null);
  const [gradeValue, setGradeValue] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const allAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    const teacherAssignments = allAssignments.filter(a => a.teacherId === user.id);
    setAssignments(teacherAssignments);
  }, [user.id]);

  const handleGradeSubmission = (assignmentId, submissionIndex) => {
    const allAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    const assignmentIndex = allAssignments.findIndex(a => a.id === assignmentId);
    
    if (assignmentIndex !== -1) {
      const grade = parseInt(gradeValue);
      const maxPoints = allAssignments[assignmentIndex].points;
      
      if (grade > maxPoints) {
        toast({
          title: "Invalid Grade",
          description: `Grade cannot exceed ${maxPoints} points.`,
          variant: "destructive",
        });
        return;
      }
      
      allAssignments[assignmentIndex].submissions[submissionIndex].grade = grade;
      allAssignments[assignmentIndex].submissions[submissionIndex].gradedAt = new Date().toISOString();
      
      localStorage.setItem('assignments', JSON.stringify(allAssignments));
      setAssignments(allAssignments.filter(a => a.teacherId === user.id));
      setEditingGrade(null);
      setGradeValue('');
      
      toast({
        title: "Grade Assigned",
        description: "Grade has been saved successfully!",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Grades Management</h2>
        
        {assignments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No assignments with submissions yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {assignments.map(assignment => (
              <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {assignment.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {assignment.subject} • Max Points: {assignment.points}
                </p>
                
                {assignment.submissions && assignment.submissions.length > 0 ? (
                  <div className="space-y-3">
                    {assignment.submissions.map((submission, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.01 }}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <User className="w-4 h-4 text-gray-600" />
                              <span className="font-medium text-gray-800">
                                {submission.studentName}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              Submitted: {new Date(submission.submittedAt).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                              {submission.content}
                            </p>
                          </div>
                          
                          <div className="ml-4">
                            {editingGrade === `${assignment.id}-${index}` ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  value={gradeValue}
                                  onChange={(e) => setGradeValue(e.target.value)}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-gray-800"
                                  placeholder="0"
                                  min="0"
                                  max={assignment.points}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleGradeSubmission(assignment.id, index)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Save className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="text-right">
                                {submission.grade !== undefined ? (
                                  <div>
                                    <div className="text-2xl font-bold text-blue-600">
                                      {submission.grade}/{assignment.points}
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setEditingGrade(`${assignment.id}-${index}`);
                                        setGradeValue(submission.grade.toString());
                                      }}
                                      className="text-xs mt-1"
                                    >
                                      <Edit2 className="w-3 h-3 mr-1" />
                                      Edit
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => setEditingGrade(`${assignment.id}-${index}`)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    <Award className="w-4 h-4 mr-2" />
                                    Grade
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No submissions yet.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default GradesManagement;