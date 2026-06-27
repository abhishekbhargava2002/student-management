import { useState } from 'react';
import { apiRequest } from '../utils/api';
import { setToken } from '../utils/auth';
import { showError, showSuccess } from '../utils/swal';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: 'admin@example.com', password: 'Admin@123' });
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setToken(response.data.token);
      onLogin(response.data.user);
      showSuccess('Login successful');
    } catch (error) {
      showError(error.message, 'Login Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="card p-4 shadow-sm login-card" onSubmit={submit}>
        <h3 className="mb-3">Student Management Login</h3>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input className="form-control" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn btn-primary" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
    </div>
  );
}
