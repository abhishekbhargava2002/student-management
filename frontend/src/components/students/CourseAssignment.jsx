export default function CourseAssignment({ students, courses, assignment, setAssignment, onSubmit }) {
  return (
    <div className="card p-3 shadow-sm my-4">
      <h4>Assign Course to Student</h4>
      <form className="row g-2" onSubmit={onSubmit}>
        <div className="col-md-5">
          <select className="form-select" value={assignment.studentId} onChange={(e) => setAssignment({ ...assignment, studentId: e.target.value })}>
            <option value="">Select student</option>
            {students.map((student) => <option key={student.id} value={student.id}>{student.first_name} {student.last_name}</option>)}
          </select>
        </div>
        <div className="col-md-5">
          <select className="form-select" value={assignment.courseId} onChange={(e) => setAssignment({ ...assignment, courseId: e.target.value })}>
            <option value="">Select course</option>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.course_code} - {course.name}</option>)}
          </select>
        </div>
        <div className="col-md-2"><button className="btn btn-success w-100">Assign</button></div>
      </form>
    </div>
  );
}
