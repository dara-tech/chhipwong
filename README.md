# Crypto Project

A full-stack web application with a React (Vite) frontend and a Node.js/Express backend.

---

## Project Structure

- `frontend/` — React + Vite app (user/admin dashboard, client pages, etc.)
- `backend/` — Node.js/Express API (authentication, company management, payments, etc.)

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (for backend database)

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd crypto
```

### 2. Install dependencies
#### Frontend
```bash
cd frontend
npm install
```
#### Backend
```bash
cd ../backend
npm install
```

---

## Running the Project

### 1. Start the backend server
```bash
cd backend
# For development (with auto-reload):
npm run dev
# Or for production:
npm start
```

- The backend will start on the port specified in your `.env` or default to 5000.

### 2. Start the frontend app
```bash
cd ../frontend
npm run dev
```
- The frontend will start on [http://localhost:5173](http://localhost:5173) by default.

---

## Environment Variables

- Backend: Copy `.env.example` to `.env` in the `backend/` directory and fill in your environment variables (MongoDB URI, JWT secret, etc.).
- Frontend: If needed, create a `.env` in `frontend/` for API URLs, etc.

---

## Useful Scripts

- **Frontend**
  - `npm run dev` — Start development server
  - `npm run build` — Build for production
  - `npm run preview` — Preview production build
  - `npm run test` — Run tests
- **Backend**
  - `npm run dev` — Start backend in development mode
  - `npm start` — Start backend in production mode
  - `npm run test` — Run backend tests
  - `npm run seed:users` — Seed initial users

---

## Project Assets
- Frontend logo: `frontend/public/logo.png`
- Other assets: see `frontend/public/`

---

## License

This project is licensed under the MIT License. 