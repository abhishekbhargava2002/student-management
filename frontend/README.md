# Frontend Architecture

React + Vite frontend for Student Management System.

## Structure

```text
frontend
├── Images
├── public
├── src
│   ├── assets
│   ├── components
│   │   ├── common
│   │   ├── layout
│   │   ├── students
│   │   ├── courses
│   │   └── marks
│   ├── constants
│   ├── hooks
│   ├── pages
│   ├── redux
│   ├── routes
│   └── utils
├── index.html
└── vite.config.js
```

## Run

```powershell
copy .env.example .env
npm install
npm run dev
```

## Environment

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Notes

- `pages/Login.jsx` handles login.
- `pages/Dashboard.jsx` manages main page state.
- Components are split by feature: students, courses, marks, layout, common.
- `utils/api.js` handles API calls and JWT header.
- `utils/auth.js` manages token storage.
- `utils/swal.js` centralizes SweetAlert calls.
