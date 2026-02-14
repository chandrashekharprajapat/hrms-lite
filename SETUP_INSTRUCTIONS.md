# Backend Setup Complete! ✅

## Virtual Environment Created

Your backend virtual environment has been successfully created and all dependencies are installed.

## Running the Backend Server

The backend server is currently running on **http://127.0.0.1:8000**

### To run the server in the future:

```bash
cd /Users/chandrashekhar/Desktop/my_project/backend

# Activate virtual environment
source venv/bin/activate

# Run the server
uvicorn main:app --reload --port 8000
```

Or use the venv directly:
```bash
cd /Users/chandrashekhar/Desktop/my_project/backend
./venv/bin/uvicorn main:app --reload --port 8000
```

## API Documentation

Visit **http://127.0.0.1:8000/docs** in your browser to see the interactive API documentation (Swagger UI).

## Next Steps

1. **Keep this terminal running** for the backend server
2. **Open a new terminal** to set up and run the frontend
3. Follow the frontend setup instructions below

---

# Frontend Setup

Open a **new terminal** and run:

```bash
cd /Users/chandrashekhar/Desktop/my_project/frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be available at **http://localhost:3000**

## Testing the Application

Once both servers are running:
1. Open http://localhost:3000 in your browser
2. Test adding employees
3. Test marking attendance
4. Test viewing and filtering records

## Important Notes

- **MongoDB**: The backend is configured to connect to `mongodb://localhost:27017`
  - If you don't have MongoDB installed locally, you can use MongoDB Atlas (cloud)
  - Update the `.env` file with your MongoDB connection string

- **Environment File**: A `.env` file has been created in the backend directory
  - Modify it if you need to change the MongoDB URL

## Troubleshooting

If you encounter any issues:
1. Make sure MongoDB is running (if using local MongoDB)
2. Check that ports 8000 and 3000 are not already in use
3. Verify all dependencies are installed correctly

Happy coding! 🚀
