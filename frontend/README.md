# Candidate Referral Management System - Frontend

A modern React frontend application built with Vite and Tailwind CSS for managing candidate referrals.

## 🚀 Features

- **User Authentication** - Login and signup with JWT tokens
- **Dashboard** - Overview of referral statistics and recent activity
- **Candidate Management** - Add, view, and manage candidate referrals
- **File Upload** - PDF resume upload functionality
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Real-time Updates** - Dynamic status updates and filtering

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management for authentication

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Integration

This frontend connects to a Node.js/Express backend API running on `http://localhost:5002`.

### Environment Variables

The application expects the backend API to be running on port 5002. You can modify the API base URL in `src/services/api.js`.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar
│   └── ProtectedRoute.jsx # Route protection wrapper
├── context/            # React Context providers
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Main application pages
│   ├── Login.jsx       # Login page
│   ├── Signup.jsx      # User registration
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Candidates.jsx  # Candidates list
│   └── ReferCandidate.jsx # Add new candidate
├── services/           # API service layer
│   └── api.js         # Axios configuration and API calls
├── App.jsx            # Main application component
└── main.jsx           # Application entry point
```

## 🎨 UI Components

The application uses custom Tailwind CSS utilities defined in `src/index.css`:

- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.input-field` - Form input styling
- `.card` - Card container styling

## 🔐 Authentication Flow

1. User signs up or logs in
2. JWT access token is stored in localStorage
3. API requests include the token in Authorization headers
4. Automatic token refresh on expiration
5. Redirect to login on authentication failure

## 📱 Features Overview

### Dashboard
- Overview statistics (total candidates, by status)
- Quick action buttons
- Recent candidate referrals
- Success rate calculation

### Candidate Management
- List all referred candidates
- Search and filter functionality
- Status updates (Pending → Reviewed → Hired/Rejected)
- Resume download capability

### Refer Candidate
- Add new candidate referrals
- PDF resume upload (optional)
- Form validation
- Success notifications

## 🚦 Getting Started

1. Ensure the backend API is running on port 5002
2. Install frontend dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open `http://localhost:3000` in your browser
5. Sign up for a new account or login
6. Start referring candidates!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
