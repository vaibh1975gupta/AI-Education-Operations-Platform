from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime
import json

from app.supabase_client import supabase
from app.agents.issue_analyzer import analyze_student_issue


router = APIRouter(
    prefix="/issues",
    tags=["Issues"]
)


# =========================================================
# Pydantic Models
# =========================================================

class IssueCreate(BaseModel):
    student_id: UUID
    title: str
    description: str
    category: Optional[str] = None
    priority: str = "medium"
    status: str = "open"
    assigned_to: Optional[UUID] = None
    due_date: Optional[datetime] = None
    ai_analysis: Optional[str] = None


class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[UUID] = None
    due_date: Optional[datetime] = None
    ai_analysis: Optional[str] = None


# =========================================================
# Helper
# =========================================================

def convert_uuids(data: dict) -> dict:
    return {
        key: str(value)
        if isinstance(value, (UUID, datetime))
        else value
        for key, value in data.items()
    }


# =========================================================
# Create Issue + AI Analysis + Automatic Task
# =========================================================

@router.post("/")
def create_issue(issue: IssueCreate):

    try:
        # -------------------------------------------------
        # Step 1: AI analyzes the issue
        # -------------------------------------------------

        ai_result = analyze_student_issue(
            title=issue.title,
            description=issue.description
        )

        # AI result example:
        #
        # {
        #   "category": "attendance",
        #   "priority": "high",
        #   "recommended_action": "...",
        #   "ai_analysis": "..."
        # }

        ai_category = ai_result.get("category")
        ai_priority = ai_result.get("priority")
        recommended_action = ai_result.get("recommended_action")
        ai_explanation = ai_result.get("ai_analysis")

        # -------------------------------------------------
        # Step 2: Prepare issue data
        # -------------------------------------------------

        issue_data = {
            "student_id": issue.student_id,
            "title": issue.title,
            "description": issue.description,

            # AI values override default values
            "category": ai_category or issue.category,
            "priority": ai_priority or issue.priority,

            "status": issue.status,
            "assigned_to": issue.assigned_to,
            "due_date": issue.due_date,

            # Store complete AI analysis as JSON string
            "ai_analysis": json.dumps(ai_result)
        }

        issue_data = convert_uuids(issue_data)

        # -------------------------------------------------
        # Step 3: Save issue in Supabase
        # -------------------------------------------------

        issue_response = (
            supabase
            .table("issues")
            .insert(issue_data)
            .execute()
        )

        if not issue_response.data:
            raise HTTPException(
                status_code=500,
                detail="Failed to create issue"
            )

        created_issue = issue_response.data[0]

        issue_id = created_issue["id"]

        # -------------------------------------------------
        # Step 4: Automatically create task
        # -------------------------------------------------

        task_data = {
            "issue_id": issue_id,

            "title": (
                f"Follow up: {issue.title}"
            ),

            "description": (
                recommended_action
                or "Review and resolve the reported student issue."
            ),

            # Keep unassigned until staff assignment
            "assigned_to": (
                str(issue.assigned_to)
                if issue.assigned_to
                else None
            ),

            "status": "pending",

            # Use AI priority
            "priority": ai_priority or issue.priority,

            "due_date": (
                issue.due_date.isoformat()
                if issue.due_date
                else None
            )
        }

        task_response = (
            supabase
            .table("tasks")
            .insert(task_data)
            .execute()
        )

        # -------------------------------------------------
        # Step 5: Handle task creation failure
        # -------------------------------------------------

        if not task_response.data:

            return {
                "message": "Issue created, but task creation failed",
                "ai_analysis_completed": True,
                "data": created_issue
            }

        created_task = task_response.data[0]

        # -------------------------------------------------
        # Step 6: Final response
        # -------------------------------------------------

        return {
            "message": "Issue created successfully",
            "ai_analysis_completed": True,
            "task_created": True,

            "issue": created_issue,

            "ai_analysis": ai_result,

            "task": created_task
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to create issue: {str(e)}"
        )


# =========================================================
# Get All Issues
# =========================================================

@router.get("/")
def get_issues():

    response = (
        supabase
        .table("issues")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )

    return {
        "data": response.data
    }


# =========================================================
# Get Single Issue
# =========================================================

@router.get("/{issue_id}")
def get_issue(issue_id: UUID):

    response = (
        supabase
        .table("issues")
        .select("*")
        .eq("id", str(issue_id))
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Issue not found"
        )

    return {
        "data": response.data[0]
    }


# =========================================================
# Update Issue
# =========================================================

@router.put("/{issue_id}")
def update_issue(
    issue_id: UUID,
    issue: IssueUpdate
):

    update_data = {
        key: value
        for key, value in issue.model_dump().items()
        if value is not None
    }

    update_data = convert_uuids(update_data)

    if not update_data:
        raise HTTPException(
            status_code=400,
            detail="No fields provided for update"
        )

    update_data["updated_at"] = datetime.utcnow().isoformat()

    response = (
        supabase
        .table("issues")
        .update(update_data)
        .eq("id", str(issue_id))
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Issue not found"
        )

    return {
        "message": "Issue updated successfully",
        "data": response.data
    }


# =========================================================
# Delete Issue
# =========================================================

@router.delete("/{issue_id}")
def delete_issue(issue_id: UUID):

    response = (
        supabase
        .table("issues")
        .delete()
        .eq("id", str(issue_id))
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Issue not found"
        )

    return {
        "message": "Issue deleted successfully",
        "data": response.data
    }