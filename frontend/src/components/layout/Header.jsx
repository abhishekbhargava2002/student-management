export default function Header({ onLogout }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="mb-0">Student Management System</h2>
        <p className="text-muted mb-0">Node.js + Express + PostgreSQL + React</p>
      </div>
      <button className="btn btn-outline-danger" onClick={onLogout}>Logout</button>
    </div>
  );
}
