# HRMS Lite - Lightweight Human Resource Management System

A modern, full-stack web application for managing employee records and tracking daily attendance. Built with FastAPI, MongoDB, and React.

## 🚀 Live Demo

- **Frontend**: [Deployed on Vercel - To be added after deployment]
- **Backend API**: [Deployed on Render - To be added after deployment]
- **API Documentation**: [Backend URL]/docs (FastAPI auto-generated Swagger UI)

## ✨ Features

### Employee Management
- ➕ Add new employees with validation
- 📋 View all employees in a searchable table
- 🗑️ Delete employees (with cascade deletion of attendance records)
- 🔍 Search by name, ID, email, or department
- ✅ Duplicate employee ID and email prevention

### Attendance Management
- 📝 Mark daily attendance (Present/Absent)
- 📊 View attendance records with filtering
- 📅 Filter by date
- 👤 Filter by employee
- 🔄 Update attendance if already marked for a date

### User Experience
- 🎨 Modern, premium dark theme with glassmorphism
- 🌈 Gradient accents and smooth animations
- 📱 Fully responsive design
- ⚡ Real-time validation and error handling
- 🔄 Loading, empty, and error states
- 📈 Dashboard with live statistics

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.109.0
- **Database**: MongoDB (Motor async driver)
- **Validation**: Pydantic v2
- **Server**: Uvicorn with ASGI

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS with modern design system

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas (recommended for production)

## 📦 Project Structure

```
my_project/
├── backend/
│   ├── routes/
│   │   ├── employees.py      # Employee API endpoints
│   │   └── attendance.py     # Attendance API endpoints
│   ├── main.py               # FastAPI application
│   ├── database.py           # MongoDB connection
│   ├── models.py             # Pydantic models
│   ├── requirements.txt      # Python dependencies
│   ├── Procfile             # Render deployment config
│   └── .env.example         # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles & design system
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json          # Vercel deployment config
│   └── .env.example         # Environment variables template
│
├── .gitignore
└── README.md
```

## 🚀 Local Development Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB (local installation or MongoDB Atlas account)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your MongoDB connection string:
   ```
   MONGODB_URL=mongodb://localhost:27017
   # Or for MongoDB Atlas:
   # MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/hrms_lite
   ```

5. **Run the backend server**
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   
   Backend will be available at: `http://localhost:8000`
   API docs at: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Frontend will be available at: `http://localhost:3000`

The frontend is configured to proxy API requests to `http://localhost:8000` during development.

## 🌐 Deployment

### Backend Deployment (Render)

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**:
     - `MONGODB_URL`: Your MongoDB Atlas connection string

4. **Deploy** - Render will automatically deploy your backend

### Frontend Deployment (Vercel)

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy from the frontend directory**
   ```bash
   cd frontend
   vercel
   ```

3. **Set environment variable in Vercel dashboard:**
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://your-app.onrender.com/api`)

4. **Redeploy** after setting the environment variable

Alternatively, connect your GitHub repository to Vercel for automatic deployments.

## 📚 API Documentation

### Employee Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/employees` | Create a new employee |
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/{employee_id}` | Get employee by ID |
| DELETE | `/api/employees/{employee_id}` | Delete employee |

### Attendance Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance` | Mark attendance |
| GET | `/api/attendance` | Get all attendance records |
| GET | `/api/attendance?date_filter=YYYY-MM-DD` | Filter by date |
| GET | `/api/attendance/employee/{employee_id}` | Get employee attendance |

### Example Request (Create Employee)

```bash
curl -X POST "http://localhost:8000/api/employees" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "email": "john.doe@company.com",
    "department": "Engineering"
  }'
```

## 🎨 Design Features

- **Dark Theme**: Modern dark color scheme with high contrast
- **Glassmorphism**: Frosted glass effect on cards
- **Gradient Accents**: Vibrant purple-to-pink gradients
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Responsive**: Mobile-first design that works on all devices
- **Typography**: Inter font family for clean, modern text

## ✅ Validation & Error Handling

### Backend Validation
- Required field validation
- Email format validation
- Duplicate employee ID/email prevention
- Employee existence checks for attendance
- Proper HTTP status codes (400, 404, 201, 204)

### Frontend Validation
- Client-side form validation
- Real-time error feedback
- API error display
- Loading states during operations
- Success confirmations

## 🔒 Assumptions & Limitations

### Assumptions
- Single admin user (no authentication required)
- All times are in local timezone
- Attendance can be updated if already marked for a date

### Limitations
- No user authentication/authorization
- No role-based access control
- No payroll or leave management
- No attendance reports/analytics
- No employee profile pictures
- No bulk operations

### Future Enhancements
- User authentication (JWT)
- Role-based permissions
- Attendance reports and analytics
- Employee profile management
- Leave management system
- Payroll integration
- Email notifications
- Export to CSV/PDF

## 🧪 Testing

### Backend Testing
Visit `http://localhost:8000/docs` for interactive API testing with Swagger UI.

### Frontend Testing
1. Start both backend and frontend servers
2. Test complete user flows:
   - Add employees
   - Mark attendance
   - View and filter records
   - Delete employees
   - Test validation errors

## 📝 License

This project is created as a coding assignment and is free to use.

## 👨‍💻 Developer

Built with ❤️ for efficient HR management.

---

**Note**: Remember to update the live demo URLs after deployment!
