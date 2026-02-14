from fastapi import APIRouter, HTTPException, status
from typing import List
from models import EmployeeCreate, EmployeeResponse
from database import db_instance

router = APIRouter(prefix="/api/employees", tags=["employees"])

@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: EmployeeCreate):
    """Create a new employee"""
    db = db_instance.get_db()
    
    # Check if employee_id already exists
    existing = await db.employees.find_one({"employee_id": employee.employee_id})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee with ID '{employee.employee_id}' already exists"
        )
    
    # Check if email already exists
    existing_email = await db.employees.find_one({"email": employee.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee with email '{employee.email}' already exists"
        )
    
    # Insert employee
    employee_dict = employee.model_dump()
    await db.employees.insert_one(employee_dict)
    
    return EmployeeResponse(**employee_dict)

@router.get("", response_model=List[EmployeeResponse])
async def get_all_employees():
    """Get all employees"""
    db = db_instance.get_db()
    
    employees = await db.employees.find().sort("full_name", 1).to_list(length=None)
    return [EmployeeResponse(**emp) for emp in employees]

@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(employee_id: str):
    """Get a specific employee by ID"""
    db = db_instance.get_db()
    
    employee = await db.employees.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    return EmployeeResponse(**employee)

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(employee_id: str):
    """Delete an employee and their attendance records"""
    db = db_instance.get_db()
    
    # Check if employee exists
    employee = await db.employees.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    # Delete employee
    await db.employees.delete_one({"employee_id": employee_id})
    
    # Delete all attendance records for this employee
    await db.attendance.delete_many({"employee_id": employee_id})
    
    return None
