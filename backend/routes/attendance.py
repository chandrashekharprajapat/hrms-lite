from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from datetime import date
from models import AttendanceCreate, AttendanceResponse
from database import db_instance

router = APIRouter(prefix="/api/attendance", tags=["attendance"])

@router.post("", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
async def mark_attendance(attendance: AttendanceCreate):
    """Mark attendance for an employee"""
    db = db_instance.get_db()
    
    # Verify employee exists
    employee = await db.employees.find_one({"employee_id": attendance.employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{attendance.employee_id}' not found"
        )
    
    # Check if attendance already marked for this date
    existing = await db.attendance.find_one({
        "employee_id": attendance.employee_id,
        "date": attendance.date.isoformat()
    })
    
    if existing:
        # Update existing attendance
        await db.attendance.update_one(
            {"employee_id": attendance.employee_id, "date": attendance.date.isoformat()},
            {"$set": {"status": attendance.status}}
        )
    else:
        # Insert new attendance record
        attendance_dict = attendance.model_dump()
        attendance_dict["date"] = attendance.date.isoformat()
        await db.attendance.insert_one(attendance_dict)
    
    return AttendanceResponse(
        employee_id=attendance.employee_id,
        date=attendance.date,
        status=attendance.status
    )

@router.get("", response_model=List[AttendanceResponse])
async def get_all_attendance(
    date_filter: Optional[str] = Query(None, description="Filter by date (YYYY-MM-DD)")
):
    """Get all attendance records with optional date filter"""
    db = db_instance.get_db()
    
    query = {}
    if date_filter:
        query["date"] = date_filter
    
    records = await db.attendance.find(query).sort("date", -1).to_list(length=None)
    
    return [
        AttendanceResponse(
            employee_id=rec["employee_id"],
            date=date.fromisoformat(rec["date"]),
            status=rec["status"]
        )
        for rec in records
    ]

@router.get("/employee/{employee_id}", response_model=List[AttendanceResponse])
async def get_employee_attendance(employee_id: str):
    """Get attendance records for a specific employee"""
    db = db_instance.get_db()
    
    # Verify employee exists
    employee = await db.employees.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    records = await db.attendance.find(
        {"employee_id": employee_id}
    ).sort("date", -1).to_list(length=None)
    
    return [
        AttendanceResponse(
            employee_id=rec["employee_id"],
            date=date.fromisoformat(rec["date"]),
            status=rec["status"]
        )
        for rec in records
    ]
