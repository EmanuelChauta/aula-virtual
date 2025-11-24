import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Upload, Users, MessageSquare, Award, LogOut, Plus, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UploadMaterialDialog from '@/components/UploadMaterialDialog';
import CreateAssignmentDialog from '@/components/CreateAssignmentDialog';
import GradesManagement from '@/components/GradesManagement';
import DiscussionForums from '@/components/DiscussionForums';

function TeacherDashboard({ user, onLogout }) {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    setCourses(savedCourses.filter(c => c.teacherId === user.id));
    
    const savedAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    setAssignments(savedAssignments.filter(a => a.teacherId === user.id));
  }, [user.id]);

  const handleUploadMaterial = (materialData) => {
    const newMaterial = {
      id: Date.now().toString(),
      ...materialData,
      teacherId: user.id,
      teacherName: user.name,
      uploadedAt: new Date().toISOString()
    };

    const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    allCourses.push(newMaterial);
    localStorage.setItem('courses', JSON.stringify(allCourses));
    
    setCourses(allCourses.filter(c => c.teacherId === user.id));
    setUploadDialogOpen(false);
    
    toast({
      title: "Material Uploaded",
      description: "Course material has been uploaded successfully!",
    });
  };

  const handleCreateAssignment = (assignmentData) => {
    const newAssignment = {
      id: Date.now().toString(),
      ...assignmentData,
      teacherId: user.id,
      teacherName: user.name,
      createdAt: new Date().toISOString(),
      submissions: []
    };

    const allAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    allAssignments.push(newAssignment);
    localStorage.setItem('assignments', JSON.stringify(allAssignments));
    
    setAssignments(allAssignments.filter(a => a.teacherId === user.id));
    setAssignmentDialogOpen(false);
    
    toast({
      title: "Assignment Created",
      description: "Assignment has been created successfully!",
    });
  };

  const handleDeleteCourse = (courseId) => {
    const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    const updatedCourses = allCourses.filter(c => c.id !== courseId);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    setCourses(updatedCourses.filter(c => c.teacherId === user.id));
    
    toast({
      title: "Course Deleted",
      description: "Course material has been removed.",
    });
  };

  const groupedCourses = courses.reduce((acc, course) => {
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
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Teacher Dashboard</h2>
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
              <Upload className="w-4 h-4" />
              <span>Course Materials</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Assignments</span>
            </TabsTrigger>
            <TabsTrigger value="grades" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Grades</span>
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
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Course Materials</h2>
                  <Button
                    onClick={() => setUploadDialogOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Material
                  </Button>
                </div>

                {Object.keys(groupedCourses).length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>No course materials uploaded yet.</p>
                    <p className="text-sm mt-2">Click "Upload Material" to get started!</p>
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
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-gray-800">{material.title}</h4>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteCourse(material.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{material.type}</span>
                                <span>{new Date(material.uploadedAt).toLocaleDateString()}</span>
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Assignments</h2>
                  <Button
                    onClick={() => setAssignmentDialogOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Assignment
                  </Button>
                </div>

                {assignments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>No assignments created yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map(assignment => (
                      <motion.div
                        key={assignment.id}
                        whileHover={{ scale: 1.01 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">{assignment.title}</h3>
                            <p className="text-gray-600 mt-1">{assignment.description}</p>
                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{assignment.subject}</span>
                              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                              <span>{assignment.submissions?.length || 0} submissions</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="grades">
            <GradesManagement user={user} />
          </TabsContent>

          <TabsContent value="forums">
            <DiscussionForums user={user} />
          </TabsContent>
        </Tabs>
      </div>

      <UploadMaterialDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUpload={handleUploadMaterial}
      />

      <CreateAssignmentDialog
        open={assignmentDialogOpen}
        onOpenChange={setAssignmentDialogOpen}
        onCreate={handleCreateAssignment}
      />
    </div>
  );
}

export default TeacherDashboard;