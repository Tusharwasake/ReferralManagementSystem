# Referral Management System

A modern, full-stack web application built with the MERN stack for managing employee referrals and candidate tracking.

## 🚀 Features

- **User Authentication**: Secure login/signup with JWT tokens
- **Dashboard**: Real-time statistics and analytics
- **Candidate Management**: Add, view, edit, and track candidates
- **Role-based Access**: Different permissions for different user roles
- **File Upload**: Resume upload and management
- **Responsive Design**: Modern UI with Tailwind CSS
- **Protected Routes**: Secure navigation with authentication checks

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload middleware
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Tusharwasake/ReferralManagementSystem.git
cd ReferralManagementSystem
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/referral_management
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
PORT=5002
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd Backend
npm start
```
Backend will run on: http://localhost:5002

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:3000

## 🔑 Login Credentials

Use the following credentials to access the application:

**Email**: `admin@gmail.com`  
**Password**: `123456`

## 📁 Project Structure

```
ReferralManagementSystem/
├── Backend/
│   ├── controller/
│   │   ├── authController.js
│   │   ├── candidateController.js
│   │   └── userController.js
│   ├── database/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── candidateValidation.js
│   │   └── validation.js
│   ├── models/
│   │   ├── candidate.js
│   │   └── user.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── candidateRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/
│   │   └── resumes/
│   ├── utils/
│   │   └── tokenGen.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Candidates.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── ReferCandidate.jsx
    │   │   └── Signup.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token

### Candidates
- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Create new candidate
- `GET /api/candidates/:id` - Get candidate by ID
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate
- `GET /api/candidates/stats` - Get dashboard statistics
- `PUT /api/candidates/:id/status` - Update candidate status
- `GET /api/candidates/:id/resume` - Download resume

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🔒 Authentication Flow

1. User logs in with email and password
2. Server validates credentials and returns JWT token
3. Token is stored in localStorage
4. All subsequent API calls include the token in Authorization header
5. Token is automatically refreshed when expired
6. Protected routes redirect to login if no valid token

## 🎨 UI Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Interactive Dashboard**: Real-time stats and charts
- **Form Validation**: Client-side and server-side validation
- **File Upload**: Drag-and-drop resume upload
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## 🧪 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Tushar Wasake** - *Initial work* - [Tusharwasake](https://github.com/Tusharwasake)

## 🐛 Known Issues

- File upload size limit: 10MB
- Supported file types for resumes: PDF, DOC, DOCX
- Internet connection required for some features

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the existing [Issues](https://github.com/Tusharwasake/ReferralManagementSystem/issues)
2. Create a new issue with detailed description
3. Include steps to reproduce the problem

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Deploy using Git
3. Configure MongoDB Atlas

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables

---

**Happy Coding! 🎉**
