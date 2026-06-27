export default function StudentForm({ studentForm, setStudentForm, editingStudentId, onSubmit, onCancel }) {
  return (
    <div className="card p-3 shadow-sm h-100">
      <h4>{editingStudentId ? 'Update Student' : 'Add Student'}</h4>
      <form onSubmit={onSubmit}>
        <div className="row g-2">
          <div className="col-md-6"><input className="form-control" placeholder="First name" value={studentForm.first_name} onChange={(e) => setStudentForm({ ...studentForm, first_name: e.target.value })} required /></div>
          <div className="col-md-6"><input className="form-control" placeholder="Last name" value={studentForm.last_name} onChange={(e) => setStudentForm({ ...studentForm, last_name: e.target.value })} required /></div>
          <div className="col-md-6"><input className="form-control" placeholder="Email" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} required /></div>
          <div className="col-md-6"><input className="form-control" placeholder="Phone" value={studentForm.phone} onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })} /></div>
          <div className="col-md-6"><input className="form-control" type="date" value={studentForm.date_of_birth} onChange={(e) => setStudentForm({ ...studentForm, date_of_birth: e.target.value })} /></div>
          <div className="col-md-6">
            <select className="form-select" value={studentForm.gender} onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}>
              <option value="">Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="col-12"><textarea className="form-control" placeholder="Address" value={studentForm.address} onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })} /></div>
        </div>
        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-primary">{editingStudentId ? 'Update' : 'Create'}</button>
          {editingStudentId && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}
