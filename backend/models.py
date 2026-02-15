from pydantic import BaseModel, EmailStr, Field, validator
from datetime import date

class EmployeeCreate(BaseModel):
    employee_id: str = Field(..., min_length=1)
    full_name: str = Field(..., min_length=1)
    email: EmailStr
    department: str = Field(..., min_length=1)

class EmployeeResponse(BaseModel):
    employee_id: str
    full_name: str
    email: str
    department: str
    
    class Config:
        orm_mode = True

class AttendanceCreate(BaseModel):
    employee_id: str = Field(..., min_length=1)
    date: date
    status: str = Field(..., regex="^(Present|Absent)$")

class AttendanceResponse(BaseModel):
    employee_id: str
    date: date
    status: str
    
    class Config:
        orm_mode = True
