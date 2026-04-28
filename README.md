# Student Task Manager (STM)

A premium SaaS-style Task Management application designed for high-performance students and professionals. Built with the MEAN stack (MongoDB, Express.js, Angular, Node.js).

## 🚀 Features

- **User Authentication:** Secure JWT-based login and registration system.
- **Task Management:** Full CRUD operations for tasks with Priority (Low, Medium, High) and Status (Pending, In Progress, Completed).
- **Kanban Board & List Views:** Toggle between a traditional list view and a visual Kanban board.
- **Real-time Search & Filtering:** Global search bar that works across the app, plus status/priority filters.
- **Analytics Dashboard:** Visual representation of task completion rates, upcoming deadlines, and productivity metrics.
- **Dynamic Theming:** Built-in support for multiple color themes (Dark Navy, Midnight, Slate) with live preview.
- **Responsive Design:** A clean, modern, and elite UI optimized for productivity.

## 🛠️ Tech Stack

- **Frontend:** Angular 17+, TypeScript, CSS3 (Custom Variables for Theming)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT), bcryptjs

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- Angular CLI (`npm install -g @angular/cli`)
- MongoDB (running locally or via MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/vishwajit2006/student.git
cd student
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory (do not commit this to Git) and add your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/studenttasks  # Or your MongoDB Atlas URI
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend server:
   ```bash
   npx nodemon server.js
   ```
   The backend should now be running on `http://localhost:5000`.

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npx ng serve
   ```
   The frontend should now be running on `http://localhost:4200`.

### 4. Open the App

Navigate to `http://localhost:4200` in your web browser. You can register a new account to start using the application.

## 📁 Project Structure

- `/backend` - Node.js Express server, API routes, Mongoose models, and authentication logic.
- `/frontend` - Angular standalone components, services, and routing.

## 📄 License

This project is licensed under the MIT License.
