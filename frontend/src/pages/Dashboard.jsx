import { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import StudentForm from '../components/students/StudentForm';
import StudentsList from '../components/students/StudentsList';
import CourseAssignment from '../components/students/CourseAssignment';
import CourseForm from '../components/courses/CourseForm';
import CourseList from '../components/courses/CourseList';
import MarksManagement from '../components/marks/MarksManagement';
import { apiRequest } from '../utils/api';
import { removeToken } from '../utils/auth';
import { confirmDialog, showError, showSuccess, showWarning } from '../utils/swal';

const emptyStudent = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  gender: '',
  address: '',
  status: 'ACTIVE',
};

const emptyCourse = {
  course_code: '',
  name: '',
  description: '',
  credits: 0,
  is_active: true,
};

const emptyMarks = {
  studentId: '',
  course_id: '',
  exam_name: '',
  marks_obtained: '',
  max_marks: 100,
  exam_date: '',
};

export default function Dashboard({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentForm, setStudentForm] = useState(emptyStudent);
  const [courseForm, setCourseForm] = useState(emptyCourse);
  const [marksForm, setMarksForm] = useState(emptyMarks);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingMarkId, setEditingMarkId] = useState(null);
  const [studentPage, setStudentPage] = useState(1);
  const [studentMeta, setStudentMeta] = useState({ page: 1, totalPages: 1 });
  const [assignment, setAssignment] = useState({ studentId: '', courseId: '' });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    loadStudents(studentPage);
    loadCourses();
  }, [studentPage]);

  async function loadStudents(page = 1) {
    try {
      const response = await apiRequest(`/students?page=${page}&limit=5`);
      setStudents(response.data || []);
      setStudentMeta(response.meta || { page: 1, totalPages: 1 });
    } catch (error) {
      handleApiError(error);
    }
  }

  async function loadCourses() {
    try {
      const response = await apiRequest('/courses?page=1&limit=100');
      setCourses(response.data || []);
    } catch (error) {
      handleApiError(error);
    }
  }

  async function loadStudentDetails(studentId) {
    if (!studentId) {
      setSelectedStudent(null);
      setMarks([]);
      return;
    }

    try {
      const response = await apiRequest(`/students/${studentId}`);
      setSelectedStudent(response.data);
      setMarks(response.data.marks || []);
      setMarksForm((prev) => ({ ...prev, studentId: String(studentId) }));
    } catch (error) {
      handleApiError(error);
    }
  }

  function handleApiError(error) {
    if (error.message.toLowerCase().includes('unauthorized')) {
      removeToken();
      onLogout();
    }
    showError(error.message);
  }

  async function saveStudent(event) {
    event.preventDefault();
    try {
      const path = editingStudentId ? `/students/${editingStudentId}` : '/students';
      const method = editingStudentId ? 'PUT' : 'POST';
      await apiRequest(path, { method, body: JSON.stringify(studentForm) });
      showSuccess(`Student ${editingStudentId ? 'updated' : 'created'} successfully`);
      setStudentForm(emptyStudent);
      setEditingStudentId(null);
      loadStudents(studentPage);
      if (selectedStudent?.id === editingStudentId) loadStudentDetails(editingStudentId);
    } catch (error) {
      showError(error.message);
    }
  }

  async function saveCourse(event) {
    event.preventDefault();
    try {
      const payload = { ...courseForm, credits: Number(courseForm.credits || 0) };
      const path = editingCourseId ? `/courses/${editingCourseId}` : '/courses';
      const method = editingCourseId ? 'PUT' : 'POST';
      await apiRequest(path, { method, body: JSON.stringify(payload) });
      showSuccess(`Course ${editingCourseId ? 'updated' : 'created'} successfully`);
      setCourseForm(emptyCourse);
      setEditingCourseId(null);
      loadCourses();
      if (selectedStudent) loadStudentDetails(selectedStudent.id);
    } catch (error) {
      showError(error.message);
    }
  }

  async function saveMarks(event) {
    event.preventDefault();

    if (!marksForm.studentId || !marksForm.course_id || !marksForm.exam_name || marksForm.marks_obtained === '') {
      showWarning('Select student, course, exam name and marks');
      return;
    }

    try {
      const payload = {
        course_id: Number(marksForm.course_id),
        exam_name: marksForm.exam_name,
        marks_obtained: Number(marksForm.marks_obtained),
        max_marks: Number(marksForm.max_marks || 100),
        exam_date: marksForm.exam_date || null,
      };

      const path = editingMarkId
        ? `/students/${marksForm.studentId}/marks/${editingMarkId}`
        : `/students/${marksForm.studentId}/marks`;
      const method = editingMarkId ? 'PUT' : 'POST';

      await apiRequest(path, { method, body: JSON.stringify(payload) });
      showSuccess(`Marks ${editingMarkId ? 'updated' : 'created'} successfully`);
      setEditingMarkId(null);
      setMarksForm({ ...emptyMarks, studentId: marksForm.studentId });
      await loadStudentDetails(marksForm.studentId);
    } catch (error) {
      showError(error.message);
    }
  }

  function editStudent(student) {
    setEditingStudentId(student.id);
    setStudentForm({
      first_name: student.first_name || '',
      last_name: student.last_name || '',
      email: student.email || '',
      phone: student.phone || '',
      date_of_birth: student.date_of_birth ? student.date_of_birth.slice(0, 10) : '',
      gender: student.gender || '',
      address: student.address || '',
      status: student.status || 'ACTIVE',
    });
  }

  function editCourse(course) {
    setEditingCourseId(course.id);
    setCourseForm({
      course_code: course.course_code || '',
      name: course.name || '',
      description: course.description || '',
      credits: course.credits || 0,
      is_active: course.is_active,
    });
  }

  function editMark(mark) {
    setEditingMarkId(mark.id);
    setMarksForm({
      studentId: String(mark.student_id || selectedStudent.id),
      course_id: String(mark.course_id || ''),
      exam_name: mark.exam_name || '',
      marks_obtained: mark.marks_obtained || '',
      max_marks: mark.max_marks || 100,
      exam_date: mark.exam_date ? mark.exam_date.slice(0, 10) : '',
    });
  }

  async function deleteStudent(id) {
    const confirm = await confirmDialog({ title: 'Delete student?', text: 'Related course assignments and marks will also be deleted.' });
    if (!confirm.isConfirmed) return;
    try {
      await apiRequest(`/students/${id}`, { method: 'DELETE' });
      showSuccess('Student deleted successfully', 'Deleted');
      if (selectedStudent?.id === id) {
        setSelectedStudent(null);
        setMarks([]);
        setMarksForm(emptyMarks);
      }
      loadStudents(studentPage);
    } catch (error) {
      showError(error.message);
    }
  }

  async function deleteCourse(id) {
    const confirm = await confirmDialog({ title: 'Delete course?', text: 'Related course assignments and marks will also be deleted.' });
    if (!confirm.isConfirmed) return;
    try {
      await apiRequest(`/courses/${id}`, { method: 'DELETE' });
      showSuccess('Course deleted successfully', 'Deleted');
      loadCourses();
      if (selectedStudent) loadStudentDetails(selectedStudent.id);
    } catch (error) {
      showError(error.message);
    }
  }

  async function deleteMark(markId) {
    if (!selectedStudent?.id) return;
    const confirm = await confirmDialog({ title: 'Delete marks?' });
    if (!confirm.isConfirmed) return;
    try {
      await apiRequest(`/students/${selectedStudent.id}/marks/${markId}`, { method: 'DELETE' });
      showSuccess('Marks deleted successfully', 'Deleted');
      if (editingMarkId === markId) {
        setEditingMarkId(null);
        setMarksForm({ ...emptyMarks, studentId: String(selectedStudent.id) });
      }
      loadStudentDetails(selectedStudent.id);
    } catch (error) {
      showError(error.message);
    }
  }

  async function assignCourse(event) {
    event.preventDefault();
    if (!assignment.studentId || !assignment.courseId) {
      showWarning('Select both student and course');
      return;
    }
    try {
      await apiRequest(`/students/${assignment.studentId}/courses/${assignment.courseId}`, { method: 'POST' });
      showSuccess('Course assigned successfully');
      const assignedStudentId = assignment.studentId;
      setAssignment({ studentId: '', courseId: '' });
      loadStudents(studentPage);
      await loadStudentDetails(assignedStudentId);
    } catch (error) {
      showError(error.message);
    }
  }

  function logout() {
    removeToken();
    onLogout();
  }

  function handleMarksStudentChange(studentId) {
    setEditingMarkId(null);
    setMarksForm({ ...emptyMarks, studentId });
    loadStudentDetails(studentId);
  }

  return (
    <div className="container py-4">
      <Header onLogout={logout} />

      <div className="row g-4">
        <div className="col-lg-6">
          <StudentForm
            studentForm={studentForm}
            setStudentForm={setStudentForm}
            editingStudentId={editingStudentId}
            onSubmit={saveStudent}
            onCancel={() => { setEditingStudentId(null); setStudentForm(emptyStudent); }}
          />
        </div>

        <div className="col-lg-6">
          <CourseForm
            courseForm={courseForm}
            setCourseForm={setCourseForm}
            editingCourseId={editingCourseId}
            onSubmit={saveCourse}
            onCancel={() => { setEditingCourseId(null); setCourseForm(emptyCourse); }}
          />
        </div>
      </div>

      <CourseAssignment
        students={students}
        courses={courses}
        assignment={assignment}
        setAssignment={setAssignment}
        onSubmit={assignCourse}
      />

      <MarksManagement
        students={students}
        selectedStudent={selectedStudent}
        marks={marks}
        marksForm={marksForm}
        setMarksForm={setMarksForm}
        editingMarkId={editingMarkId}
        setEditingMarkId={setEditingMarkId}
        emptyMarks={emptyMarks}
        onStudentChange={handleMarksStudentChange}
        onSubmit={saveMarks}
        onEdit={editMark}
        onDelete={deleteMark}
      />

      <div className="row g-4">
        <div className="col-lg-7">
          <StudentsList
            students={students}
            studentMeta={studentMeta}
            studentPage={studentPage}
            setStudentPage={setStudentPage}
            onViewMarks={(student) => { setMarksForm({ ...emptyMarks, studentId: String(student.id) }); loadStudentDetails(student.id); }}
            onEdit={editStudent}
            onDelete={deleteStudent}
          />
        </div>

        <div className="col-lg-5">
          <CourseList courses={courses} onEdit={editCourse} onDelete={deleteCourse} />
        </div>
      </div>
    </div>
  );
}
