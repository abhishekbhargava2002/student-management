export default function StudentsList({ students, studentMeta, studentPage, setStudentPage, onViewMarks, onEdit, onDelete }) {
  return (
    <div className="card p-3 shadow-sm">
      <h4>Students</h4>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead><tr><th>Name</th><th>Email</th><th>Courses</th><th>Actions</th></tr></thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.first_name} {student.last_name}</td>
                <td>{student.email}</td>
                <td>{student.assigned_courses_count}</td>
                <td className="d-flex gap-2 flex-wrap">
                  <button className="btn btn-sm btn-outline-success" onClick={() => onViewMarks(student)}>View Marks</button>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(student)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(student.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <span>Page {studentMeta.page} of {studentMeta.totalPages || 1}</span>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" disabled={studentPage <= 1} onClick={() => setStudentPage((page) => page - 1)}>Previous</button>
          <button className="btn btn-outline-secondary btn-sm" disabled={studentPage >= (studentMeta.totalPages || 1)} onClick={() => setStudentPage((page) => page + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}
