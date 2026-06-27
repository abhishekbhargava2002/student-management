import EmptyState from '../common/EmptyState';

function formatDate(value) {
  if (!value) return '-';
  return String(value).slice(0, 10);
}

export default function MarksManagement({
  students,
  selectedStudent,
  marks,
  marksForm,
  setMarksForm,
  editingMarkId,
  setEditingMarkId,
  emptyMarks,
  onStudentChange,
  onSubmit,
  onEdit,
  onDelete,
}) {
  const assignedCoursesForMarks = selectedStudent?.courses?.filter((course) => course.status === 'ACTIVE') || [];

  return (
    <div className="card p-3 shadow-sm my-4">
      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-3">
        <div>
          <h4 className="mb-1">Marks Management</h4>
          <p className="text-muted mb-0">Select a student, choose one assigned course, then add/update/delete marks.</p>
        </div>
        {selectedStudent && <span className="badge text-bg-primary fs-6">{selectedStudent.first_name} {selectedStudent.last_name}</span>}
      </div>

      <form className="row g-2 mb-4" onSubmit={onSubmit}>
        <div className="col-md-3">
          <label className="form-label">Student</label>
          <select
            className="form-select"
            value={marksForm.studentId}
            onChange={(e) => onStudentChange(e.target.value)}
          >
            <option value="">Select student</option>
            {students.map((student) => <option key={student.id} value={student.id}>{student.first_name} {student.last_name}</option>)}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Assigned Course</label>
          <select className="form-select" value={marksForm.course_id} onChange={(e) => setMarksForm({ ...marksForm, course_id: e.target.value })} disabled={!selectedStudent}>
            <option value="">Select assigned course</option>
            {assignedCoursesForMarks.map((course) => <option key={course.id} value={course.id}>{course.course_code} - {course.name}</option>)}
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label">Exam</label>
          <input className="form-control" placeholder="Final" value={marksForm.exam_name} onChange={(e) => setMarksForm({ ...marksForm, exam_name: e.target.value })} />
        </div>

        <div className="col-md-1">
          <label className="form-label">Marks</label>
          <input className="form-control" type="number" min="0" step="0.01" value={marksForm.marks_obtained} onChange={(e) => setMarksForm({ ...marksForm, marks_obtained: e.target.value })} />
        </div>

        <div className="col-md-1">
          <label className="form-label">Max</label>
          <input className="form-control" type="number" min="1" step="0.01" value={marksForm.max_marks} onChange={(e) => setMarksForm({ ...marksForm, max_marks: e.target.value })} />
        </div>

        <div className="col-md-2">
          <label className="form-label">Exam Date</label>
          <input className="form-control" type="date" value={marksForm.exam_date} onChange={(e) => setMarksForm({ ...marksForm, exam_date: e.target.value })} />
        </div>

        <div className="col-12 d-flex gap-2">
          <button className="btn btn-warning">{editingMarkId ? 'Update Marks' : 'Add Marks'}</button>
          {editingMarkId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingMarkId(null); setMarksForm({ ...emptyMarks, studentId: marksForm.studentId }); }}>Cancel</button>}
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead><tr><th>Course</th><th>Exam</th><th>Marks</th><th>%</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {!selectedStudent && <EmptyState colSpan="6" message="Select a student to view marks." />}
            {selectedStudent && marks.length === 0 && <EmptyState colSpan="6" message="No marks found for selected student." />}
            {marks.map((mark) => (
              <tr key={mark.id}>
                <td><strong>{mark.course_code}</strong> - {mark.course_name}</td>
                <td>{mark.exam_name}</td>
                <td>{mark.marks_obtained} / {mark.max_marks}</td>
                <td>{mark.percentage || '-'}</td>
                <td>{formatDate(mark.exam_date)}</td>
                <td className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(mark)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(mark.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
