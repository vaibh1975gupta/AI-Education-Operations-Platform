from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from uuid import UUID

from app.supabase_client import supabase


router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


class StudentCreate(BaseModel):
    name: str
    email: Optional[str] = None
    class_name: Optional[str] = None
    school_id: UUID
    teacher_id: Optional[UUID] = None
    status: str = "active"


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    class_name: Optional[str] = None
    school_id: Optional[UUID] = None
    teacher_id: Optional[UUID] = None
    status: Optional[str] = None


@router.post("/")
def create_student(student: StudentCreate):
    data = student.model_dump()

    # Convert UUID values to strings for Supabase
    data = {
        key: str(value) if isinstance(value, UUID) else value
        for key, value in data.items()
    }

    response = (
        supabase
        .table("students")
        .insert(data)
        .execute()
    )

    return {
        "message": "Student created successfully",
        "data": response.data
    }


@router.get("/")
def get_students():
    response = (
        supabase
        .table("students")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )

    return {
        "data": response.data
    }


@router.get("/{student_id}")
def get_student(student_id: UUID):
    response = (
        supabase
        .table("students")
        .select("*")
        .eq("id", str(student_id))
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return {
        "data": response.data[0]
    }


@router.put("/{student_id}")
def update_student(
    student_id: UUID,
    student: StudentUpdate
):
    update_data = {
        key: value
        for key, value in student.model_dump().items()
        if value is not None
    }

    # Convert UUID values to strings
    update_data = {
        key: str(value) if isinstance(value, UUID) else value
        for key, value in update_data.items()
    }

    if not update_data:
        raise HTTPException(
            status_code=400,
            detail="No fields provided for update"
        )

    response = (
        supabase
        .table("students")
        .update(update_data)
        .eq("id", str(student_id))
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return {
        "message": "Student updated successfully",
        "data": response.data
    }


@router.delete("/{student_id}")
def delete_student(student_id: UUID):
    response = (
        supabase
        .table("students")
        .delete()
        .eq("id", str(student_id))
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return {
        "message": "Student deleted successfully",
        "data": response.data
    }