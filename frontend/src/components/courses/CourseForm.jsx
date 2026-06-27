export default function CourseForm({ courseForm, setCourseForm, editingCourseId, onSubmit, onCancel }) {
  return (
    <div className="card p-3 shadow-sm h-100">
      <h4>{editingCourseId ? 'Update Course' : 'Add Course'}</h4>
      <form onSubmit={onSubmit}>
        <div className="row g-2">
          <div className="col-md-4"><input className="form-control" placeholder="Code" value={courseForm.course_code} onChange={(e) => setCourseForm({ ...courseForm, course_code: e.target.value })} required /></div>
          <div className="col-md-5"><input className="form-control" placeholder="Course name" value={courseForm.name} onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })} required /></div>
          <div className="col-md-3"><input className="form-control" type="number" min="0" placeholder="Credits" value={courseForm.credits} onChange={(e) => setCourseForm({ ...courseForm, credits: e.target.value })} /></div>
          <div className="col-12"><textarea className="form-control" placeholder="Description" value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} /></div>
        </div>
        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-primary">{editingCourseId ? 'Update' : 'Create'}</button>
          {editingCourseId && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}
