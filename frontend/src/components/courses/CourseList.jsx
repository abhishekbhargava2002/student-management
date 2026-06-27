export default function CourseList({ courses, onEdit, onDelete }) {
  return (
    <div className="card p-3 shadow-sm">
      <h4>Courses</h4>
      <div className="list-group">
        {courses.map((course) => (
          <div key={course.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{course.course_code}</strong> - {course.name}
              <div className="small text-muted">Credits: {course.credits} | Students: {course.assigned_students_count}</div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(course)}>Edit</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(course.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
