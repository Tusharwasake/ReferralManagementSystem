# Candidate Referral Management System - Backend API

## 🎯 **Assignment Complete: Candidate Referral Management System**

### **✅ All Requirements Implemented:**

## **📡 API Endpoints**

### **Authentication Routes (`/api/auth`)**

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/logout` - User logout (protected)

### **User Management Routes (`/api/users`)**

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users/stats` - User statistics (Admin/HR)
- `GET /api/users/` - Get all users (Admin/HR)
- `GET /api/users/:userId` - Get user by ID (Admin/HR)
- `PUT /api/users/:userId/role` - Update role (Admin)
- `DELETE /api/users/:userId` - Delete user (Admin)

### **🎯 Candidate Management Routes (`/api/candidates`)**

#### **✅ Required Endpoints:**

#### **1. POST /api/candidates** - Save a new candidate's data

```http
POST /api/candidates
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Form Data:
- name: "John Doe"
- email: "john.doe@example.com"
- phone: "+1234567890"
- jobTitle: "Software Engineer"
- notes: "Excellent candidate with 5 years experience"
- resume: [PDF file] (optional)
```

#### **2. GET /api/candidates** - Fetch all referred candidates

```http
GET /api/candidates?page=1&limit=10&status=Pending&jobTitle=Engineer&search=john
Authorization: Bearer <access_token>
```

#### **3. PUT /api/candidates/:id/status** - Update candidate status

```http
PUT /api/candidates/:id/status
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "Reviewed",
  "notes": "Initial screening completed"
}
```

#### **4. DELETE /api/candidates/:id** - Delete a candidate (Admin only)

```http
DELETE /api/candidates/:id
Authorization: Bearer <access_token>
```

#### **✅ Additional Endpoints:**

#### **5. GET /api/candidates/:id** - Get specific candidate

```http
GET /api/candidates/:id
Authorization: Bearer <access_token>
```

#### **6. PUT /api/candidates/:id** - Update candidate details (Admin only)

```http
PUT /api/candidates/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "phone": "+1234567891",
  "jobTitle": "Senior Software Engineer",
  "notes": "Updated information"
}
```

#### **7. GET /api/candidates/stats** - Get candidate statistics (Admin/HR)

```http
GET /api/candidates/stats
Authorization: Bearer <access_token>
```

#### **8. GET /api/candidates/:id/resume** - Download candidate resume

```http
GET /api/candidates/:id/resume
Authorization: Bearer <access_token>
```

## **🗄️ Database Schema**

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

## **✅ Validation Implemented:**

### **Email Validation:**

- Regex: `/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/`
- Case insensitive storage

### **Phone Validation:**

- Regex: `/^[\+]?[1-9][\d]{0,15}$/`
- International format support

### **Resume Upload Validation:**

- Only PDF files allowed
- 5MB file size limit
- Secure file storage in `/uploads/resumes/`

### **Data Validation:**

- Name: 2-100 characters
- Job Title: 2-100 characters
- Notes: Max 500 characters
- Status: Enum validation
- Required fields validation

## **🛡️ Error Handling:**

### **Input Validation Errors (400):**

```json
{
  "error": "Validation failed",
  "details": ["Email format invalid", "Phone number invalid"]
}
```

### **Authentication Errors (401):**

```json
{
  "error": "Access token required"
}
```

### **Authorization Errors (403):**

```json
{
  "error": "Insufficient permissions"
}
```

### **Not Found Errors (404):**

```json
{
  "error": "Candidate not found"
}
```

### **Server Errors (500):**

```json
{
  "error": "Internal server error",
  "message": "Detailed error message"
}
```

## **🎁 Bonus Features Implemented:**

### **✅ Authentication:**

- JWT-based authentication
- Role-based authorization (user, employee, HR, admin)
- Refresh token mechanism
- Secure password hashing with Argon2

### **✅ Resume Upload:**

- File upload with multer
- PDF format restriction
- File size limits (5MB)
- Secure file storage
- Resume download endpoint

### **✅ Metrics Dashboard:**

- Total candidates referred
- Candidates by status (Pending/Reviewed/Hired/Rejected)
- Candidates by job title
- Recent referrals (last 30 days)
- Recent candidates list

## **🚀 API Server Details:**

- **URL:** http://localhost:5001
- **Database:** MongoDB Atlas (NoSQL)
- **File Storage:** Local filesystem (`/uploads/resumes/`)
- **Authentication:** JWT tokens
- **Validation:** Comprehensive input validation
- **Error Handling:** Detailed error responses

## **📊 Response Examples:**

### **Candidate Creation Success:**

```json
{
  "message": "Candidate referred successfully",
  "candidate": {
    "_id": "candidate_id",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "jobTitle": "Software Engineer",
    "status": "Pending",
    "resumeUrl": "/uploads/resumes/resume-123456789.pdf",
    "resumeFileName": "john_doe_resume.pdf",
    "referredBy": {
      "_id": "user_id",
      "name": "Jane Referrer",
      "email": "jane@company.com"
    },
    "referredDate": "2025-01-10T10:30:00.000Z",
    "notes": "Excellent candidate",
    "createdAt": "2025-01-10T10:30:00.000Z",
    "updatedAt": "2025-01-10T10:30:00.000Z"
  }
}
```

### **Candidate List with Pagination:**

```json
{
  "message": "Candidates retrieved successfully",
  "candidates": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCandidates": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### **Candidate Statistics:**

```json
{
  "message": "Candidate statistics retrieved successfully",
  "stats": {
    "totalCandidates": 100,
    "candidatesByStatus": {
      "Pending": 45,
      "Reviewed": 30,
      "Hired": 20,
      "Rejected": 5
    },
    "candidatesByJobTitle": [
      {"_id": "Software Engineer", "count": 25},
      {"_id": "Data Scientist", "count": 15}
    ],
    "recentReferralsLast30Days": 12,
    "recentCandidates": [...]
  }
}
```

## **🎯 Assignment Requirements Status:**

### **Backend Requirements:**

- ✅ POST /candidates - Save candidate data
- ✅ GET /candidates - Fetch all candidates
- ✅ PUT /candidates/:id/status - Update status
- ✅ DELETE /candidates/:id - Delete candidate
- ✅ MongoDB database with candidate schema
- ✅ Email and phone validation
- ✅ PDF resume upload restriction
- ✅ Comprehensive error handling

### **Bonus Features:**

- ✅ JWT Authentication system
- ✅ Resume upload with cloud-ready storage
- ✅ Metrics dashboard with statistics
- ✅ Role-based authorization
- ✅ Advanced filtering and search
- ✅ Pagination support

## **🏁 Ready for Frontend Integration!**

Your Candidate Referral Management System backend is fully implemented and ready for React frontend integration. All assignment requirements have been met with additional bonus features for a production-ready system.
