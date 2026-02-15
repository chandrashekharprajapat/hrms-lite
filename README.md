# HRMS - Human Resource Management System

A modern, lightweight HR management system built with FastAPI and React. Streamline employee management and attendance tracking with an intuitive interface and powerful features.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)

## ✨ Features

### 👥 Employee Management
- **Add & Manage Employees** - Create employee profiles with ID, name, email, and department
- **Smart Search** - Search employees by name, ID, department, or email
- **Bulk Delete** - Select multiple employees and delete them at once with checkboxes
- **Cascade Delete** - Automatically removes all attendance records when an employee is deleted
- **Department Badges** - Visual gradient badges for easy department identification
- **Quick Navigation** - Click on any employee to view their attendance history

### 📊 Attendance Tracking
- **Mark Attendance** - Record daily attendance (Present/Absent) for employees
- **Edit Records** - Fix mistakes by editing attendance status with a simple modal
- **Advanced Filtering** - Filter by date, employee, and status (Present/Absent)
- **URL Parameters** - Share filtered views with persistent URL parameters
- **Real-time Stats** - Dashboard shows today's present/absent counts
- **Clickable Stats** - Click dashboard cards to view filtered attendance records

### 🎨 Modern UI/UX
- **Light/Dark Theme** - Toggle between light and dark modes with preference saved
- **Gradient Header** - Beautiful purple gradient header in light mode
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Loading States** - Smooth loading spinners and error handling
- **Empty States** - Helpful messages when no data is available
- **Smooth Animations** - Fade-in effects and hover transitions

## � Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database with Motor async driver
- **Pydantic** - Data validation and settings management
- **Uvicorn** - ASGI server for production

### Frontend
- **React 18** - UI library with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server
- **CSS Variables** - Theme system with light/dark modes

## � Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "MONGODB_URL=mongodb://localhost:27017" > .env

# Run the server
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## � Usage

### Managing Employees

1. **Add Employee** - Click "Add Employee" button and fill in the form
2. **Search** - Use the search box to filter employees
3. **Bulk Delete** - Check employees and click "Delete Selected"
4. **View Attendance** - Click on any employee row or the 📊 button

### Tracking Attendance

1. **Mark Attendance** - Click "Mark Attendance" and select employee, date, and status
2. **Edit Record** - Click the ✏️ button on any attendance record
3. **Filter Records** - Use date, employee, and status filters
4. **Dashboard Stats** - Click "Present Today" or "Absent Today" cards for filtered view

### Theme Switching

- Click the 🌙/☀️ button in the header to toggle between light and dark themes
- Your preference is automatically saved in browser storage

## 🏗️ Project Structure

```
my_project/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Pydantic models
│   ├── database.py          # MongoDB connection
│   ├── routes/
│   │   ├── employees.py     # Employee endpoints
│   │   └── attendance.py    # Attendance endpoints
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service
│   │   └── index.css        # Global styles & themes
│   ├── package.json         # Node dependencies
│   └── vite.config.js       # Vite configuration
└── README.md
```

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for:
- Backend: Render
- Frontend: Vercel
- Database: MongoDB Atlas

## 🔑 Environment Variables

### Backend (.env)
```
MONGODB_URL=your_mongodb_connection_string
```

### Frontend (Vercel)
```
VITE_API_URL=your_backend_url/api
```

## � API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/{id}` - Get employee by ID
- `POST /api/employees` - Create new employee
- `DELETE /api/employees/{id}` - Delete employee (cascade deletes attendance)

### Attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/employee/{id}` - Get employee attendance
- `POST /api/attendance` - Mark attendance
- `PUT /api/attendance/{id}/{date}` - Update attendance record
- `DELETE /api/attendance/{id}/{date}` - Delete attendance record
- `POST /api/attendance/bulk-delete` - Bulk delete records

## 🎨 Features Highlights

### Recent Updates
- ✅ Light/Dark theme switcher with localStorage persistence
- ✅ Gradient header in light mode with white text
- ✅ Department badges with gradient backgrounds
- ✅ Edit attendance records functionality
- ✅ Bulk delete employees with checkboxes
- ✅ Cascade delete: attendance records deleted with employees
- ✅ URL parameter support for filtered views
- ✅ Clickable dashboard statistics
- ✅ Improved confirmation modals with detailed warnings

## � Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## � License

This project is licensed under the MIT License.

## � Acknowledgments

- Built with FastAPI and React
- Icons from Unicode Emoji
- Styled with modern CSS gradients and animations

---

**Note**: Remember to update the live demo URLs after deployment!