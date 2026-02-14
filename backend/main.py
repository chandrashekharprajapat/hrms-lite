from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import db_instance
from routes import employees, attendance
import os
from dotenv import load_dotenv

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await db_instance.connect_db()
    yield
    # Shutdown
    await db_instance.close_db()

app = FastAPI(
    title="HRMS Lite API",
    description="Lightweight Human Resource Management System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(employees.router)
app.include_router(attendance.router)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "HRMS Lite API is running",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected"
    }
