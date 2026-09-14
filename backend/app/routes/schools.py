from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from uuid import UUID

from app.supabase_client import supabase


router = APIRouter(
    prefix="/schools",
    tags=["Schools"]
)


class SchoolCreate(BaseModel):
    name: str
    location: Optional[str] = None
    coordinator_name: Optional[str] = None
    status: str = "active"


class SchoolUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    coordinator_name: Optional[str] = None
    status: Optional[str] = None


@router.post("/")
def create_school(school: SchoolCreate):
    response = (
        supabase
        .table("schools")
        .insert(school.model_dump())
        .execute()
    )

    return {
        "message": "School created successfully",
        "data": response.data
    }


@router.get("/")
def get_schools():
    response = (
        supabase
        .table("schools")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )

    return {
        "data": response.data
    }


@router.get("/{school_id}")
def get_school(school_id: UUID):
    response = (
        supabase
        .table("schools")
        .select("*")
        .eq("id", str(school_id))
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="School not found"
        )

    return {
        "data": response.data[0]
    }


@router.put("/{school_id}")
def update_school(
    school_id: UUID,
    school: SchoolUpdate
):
    update_data = {
        key: value
        for key, value in school.model_dump().items()
        if value is not None
    }

    if not update_data:
        raise HTTPException(
            status_code=400,
            detail="No fields provided for update"
        )

    response = (
        supabase
        .table("schools")
        .update(update_data)
        .eq("id", str(school_id))
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="School not found"
        )

    return {
        "message": "School updated successfully",
        "data": response.data
    }


@router.delete("/{school_id}")
def delete_school(school_id: UUID):
    response = (
        supabase
        .table("schools")
        .delete()
        .eq("id", str(school_id))
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="School not found"
        )

    return {
        "message": "School deleted successfully",
        "data": response.data
    }