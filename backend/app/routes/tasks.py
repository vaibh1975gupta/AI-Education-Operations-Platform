from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

from app.supabase_client import supabase


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


# =========================
# Pydantic Models
# =========================

class TaskCreate(BaseModel):
    issue_id: UUID
    title: str
    description: Optional[str] = None
    assigned_to: Optional[UUID] = None
    status: str = "pending"
    priority: str = "medium"
    due_date: Optional[datetime] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assigned_to: Optional[UUID] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None


# =========================
# Helper
# =========================

def convert_uuids(data: dict) -> dict:
    return {
        key: str(value)
        if isinstance(value, (UUID, datetime))
        else value
        for key, value in data.items()
    }


# =========================
# Create Task
# =========================

@router.post("/")
def create_task(task: TaskCreate):

    data = convert_uuids(task.model_dump())

    response = (
        supabase
        .table("tasks")
        .insert(data)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=500,
            detail="Failed to create task"
        )

    return {
        "message": "Task created successfully",
        "data": response.data
    }


# =========================
# Get All Tasks
# =========================

@router.get("/")
def get_tasks():

    response = (
        supabase
        .table("tasks")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )

    return {
        "data": response.data
    }


# =========================
# Get Single Task
# =========================

@router.get("/{task_id}")
def get_task(task_id: UUID):

    response = (
        supabase
        .table("tasks")
        .select("*")
        .eq("id", str(task_id))
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return {
        "data": response.data[0]
    }


# =========================
# Update Task
# =========================

@router.put("/{task_id}")
def update_task(
    task_id: UUID,
    task: TaskUpdate
):

    update_data = {
        key: value
        for key, value in task.model_dump().items()
        if value is not None
    }

    update_data = convert_uuids(update_data)

    if not update_data:
        raise HTTPException(
            status_code=400,
            detail="No fields provided for update"
        )

    response = (
        supabase
        .table("tasks")
        .update(update_data)
        .eq("id", str(task_id))
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return {
        "message": "Task updated successfully",
        "data": response.data
    }


# =========================
# Delete Task
# =========================

@router.delete("/{task_id}")
def delete_task(task_id: UUID):

    response = (
        supabase
        .table("tasks")
        .delete()
        .eq("id", str(task_id))
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return {
        "message": "Task deleted successfully",
        "data": response.data
    }