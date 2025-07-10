# Candidate Referral Management System - Backend

## 🎯 **Assignment: Build a Candidate Referral Management System**

This project simulates a part of Worko's functionality by building a complete Candidate Referral Management System backend with authentication, candidate management, and file upload capabilities.

## ✅ **Assignment Requirements Status**

### **Backend Requirements (Node.js + Express):**

- ✅ **POST /candidates** - Save a new candidate's data
- ✅ **GET /candidates** - Fetch all referred candidates
- ✅ **PUT /candidates/:id/status** - Update candidate status
- ✅ **DELETE /candidates/:id** - Delete a candidate
- ✅ **MongoDB Database** - Store candidate details with validation
- ✅ **Email & Phone Validation** - Regex validation for correct formats
- ✅ **PDF Resume Upload** - Restricted to .pdf files only
- ✅ **Error Handling** - Comprehensive error responses

### **Bonus Features Implemented:**

- ✅ **JWT Authentication** - Complete user authentication system
- ✅ **Resume Upload** - Local file storage with download capability
- ✅ **Metrics Dashboard** - Statistics for total candidates, status breakdown
- ✅ **Role-Based Access** - User, Employee, HR, Admin roles
- ✅ **Advanced Features** - Search, filtering, pagination

## 🚀 **Features Implemented**

### **🔐 Authentication System**

- User registration and login
- JWT access tokens (15 min) and refresh tokens (7 days)
- Role-based authorization (user, employee, HR, admin)
- Secure password hashing with Argon2
- HTTP-only cookies for refresh tokens

### **👥 User Management**

- Complete CRUD operations for users
- Profile management
- Password change functionality
- User statistics and analytics

### **🎯 Candidate Management**

- **Create candidates** with resume upload
- **View all candidates** with filtering and search
- **Update candidate status** (Pending → Reviewed → Hired)
- **Delete candidates** (Admin only)
- **Download resumes** securely
- **Candidate statistics** and metrics

### **📄 File Upload System**

- PDF-only resume uploads
- 5MB file size limit
- Secure file storage
- Resume download functionality

### **🛡️ Validation & Security**

- Email format validation
- Phone number format validation
- File type restrictions (PDF only)
- Input sanitization
- Comprehensive error handling

## 📊 **Database Schema**

### **User Model:**

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["user", "employee", "HR", "admin"]),
  skills: [String],
  createdAt: Date
}
```

### **Candidate Model:**

```javascript
{
  name: String (required, 2-100 chars),
  email: String (required, unique, validated),
  phone: String (required, validated format),
  jobTitle: String (required, 2-100 chars),
  status: String (enum: ["Pending", "Reviewed", "Hired", "Rejected"]),
  resumeUrl: String (file path),
  resumeFileName: String,
  referredBy: ObjectId (ref: Users),
  referredDate: Date,
  notes: String (max 500 chars),
  lastUpdated: Date,
  timestamps: true
}
```

## 🏗️ **Project Structure**

```
Backend/
├── controller/
│   ├── authController.js          # Authentication logic
│   ├── userController.js          # User management
│   └── candidateController.js     # Candidate management
├── middleware/
│   ├── auth.js                    # Authentication & authorization
│   └── candidateValidation.js    # Input validation
├── models/
│   ├── user.js                    # User schema
│   └── candidate.js               # Candidate schema
├── routes/
│   ├── authRoutes.js              # Auth endpoints
│   ├── userRoutes.js              # User endpoints
│   └── candidateRoutes.js         # Candidate endpoints
├── uploads/resumes/               # Resume file storage
├── database/
│   └── db.js                      # Database connection
├── utils/
│   └── tokenGen.js                # JWT token generation
├── .env                           # Environment variables
├── server.js                      # Main server file
└── package.json                   # Dependencies
```

## 📡 **API Endpoints**

### **Authentication (`/api/auth`)**

- `POST /signup` - User registration
- `POST /login` - User login
- `POST /refresh-token` - Refresh JWT token
- `POST /logout` - User logout

### **Candidates (`/api/candidates`)**

- `POST /` - Create new candidate (with resume upload)
- `GET /` - Get all candidates (with filtering/search/pagination)
- `GET /:id` - Get candidate by ID
- `GET /:id/resume` - Download candidate resume
- `PUT /:id/status` - Update candidate status (HR/Admin)
- `PUT /:id` - Update candidate details (Admin)
- `DELETE /:id` - Delete candidate (Admin)
- `GET /stats` - Get candidate statistics (HR/Admin)

### **Users (`/api/users`)**

- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `GET /` - Get all users (HR/Admin)
- `GET /stats` - Get user statistics (HR/Admin)

## 🛠️ **Setup Instructions**

### **Prerequisites:**

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### **1. Clone the Repository:**

```bash
git clone <repository-url>
cd "Referral Management System/Backend"
```

### **2. Install Dependencies:**

```bash
npm install
```

### **3. Environment Setup:**

Create a `.env` file in the Backend directory:

```env
PORT=5001
MONGODB_URI=mongodb+srv://your-connection-string
ACCESS_TOKEN_SECRET=your-secure-access-token-secret
REFRESH_TOKEN_SECRET=your-secure-refresh-token-secret
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### **4. Create Upload Directory:**

The server will automatically create the uploads directory, but you can create it manually:

```bash
mkdir -p uploads/resumes
```

### **5. Start the Server:**

```bash
npm run dev
```

The server will start on `http://localhost:5001`

## 🧪 **Testing the API**

### **1. Health Check:**

```bash
curl http://localhost:5001/
```

### **2. Register a User:**

```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### **3. Login:**

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### **4. Create a Candidate:**

```bash
curl -X POST http://localhost:5001/api/candidates \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "name=Jane Smith" \
  -F "email=jane@example.com" \
  -F "phone=+1234567890" \
  -F "jobTitle=Software Engineer" \
  -F "resume=@/path/to/resume.pdf"
```

### **5. Get All Candidates:**

```bash
curl -X GET "http://localhost:5001/api/candidates?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📋 **Postman Collection**

Import the provided Postman collection file:

- `Candidate_Referral_API.postman_collection.json`

Set the following variables in Postman:

- `baseUrl`: `http://localhost:5001`
- `accessToken`: (obtained after login)
- `candidateId`: (obtained after creating a candidate)

## 🔒 **Security Features**

### **Authentication:**

- JWT tokens with expiration
- Refresh token mechanism
- Password hashing with Argon2

### **Authorization:**

- Role-based access control
- Protected routes
- Admin-only operations

### **Validation:**

- Email format validation: `/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/`
- Phone format validation: `/^[\+]?[1-9][\d]{0,15}$/`
- File type validation (PDF only)
- Input length validation

### **File Security:**

- File type restrictions
- File size limits (5MB)
- Secure file storage
- Controlled file access

## 📊 **API Response Examples**

### **Success Response:**

```json
{
  "message": "Candidate referred successfully",
  "candidate": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "jobTitle": "Software Engineer",
    "status": "Pending",
    "resumeUrl": "/uploads/resumes/resume-123456.pdf",
    "referredBy": { "name": "John Doe", "email": "john@example.com" },
    "referredDate": "2025-01-10T10:30:00.000Z"
  }
}
```

### **Error Response:**

```json
{
  "error": "Validation failed",
  "details": ["Email format invalid", "Phone number invalid"]
}
```

## 🎯 **Assignment Completion Summary**

### **✅ All Required Features:**

1. **POST /candidates** - ✅ Implemented with file upload
2. **GET /candidates** - ✅ With filtering and pagination
3. **PUT /candidates/:id/status** - ✅ Status updates with validation
4. **DELETE /candidates/:id** - ✅ Admin-only deletion
5. **MongoDB Database** - ✅ Complete schema with validation
6. **Email/Phone Validation** - ✅ Regex validation implemented
7. **PDF Upload Restriction** - ✅ File type validation
8. **Error Handling** - ✅ Comprehensive error responses

### **✅ All Bonus Features:**

1. **JWT Authentication** - ✅ Complete auth system
2. **Resume Upload** - ✅ File storage and download
3. **Metrics Dashboard** - ✅ Statistics and analytics
4. **Deployment Ready** - ✅ Production-ready configuration

## 🚀 **Next Steps**

The backend is complete and ready for:

1. **Frontend Integration** - React frontend can consume these APIs
2. **Deployment** - Ready for cloud deployment
3. **Production Use** - Includes all security and validation features

## 🤝 **Contributing**

This project was built as part of a technical assignment. The implementation follows industry best practices and includes comprehensive testing capabilities.

## 📞 **Support**

For questions or issues, please refer to the API documentation or test using the provided Postman collection.
