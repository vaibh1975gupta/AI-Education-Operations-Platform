from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.supabase_client import supabase


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# -----------------------------------------
# Request Model
# -----------------------------------------

class NotificationCreate(BaseModel):
    user_id: Optional[str] = None
    issue_id: Optional[str] = None
    message: str
    type: str = "info"


# -----------------------------------------
# Get All Notifications
# -----------------------------------------

@router.get("/")
def get_notifications():
    try:
        response = (
            supabase
            .table("notifications")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        return {
            "data": response.data or []
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch notifications: {str(e)}"
        )


# -----------------------------------------
# Create Notification
# -----------------------------------------

@router.post("/")
def create_notification(notification: NotificationCreate):
    try:
        notification_data = {
            "message": notification.message,
            "type": notification.type,
            "is_read": False
        }

        # Add optional fields only when provided
        if notification.user_id:
            notification_data["user_id"] = notification.user_id

        if notification.issue_id:
            notification_data["issue_id"] = notification.issue_id

        response = (
            supabase
            .table("notifications")
            .insert(notification_data)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=500,
                detail="Notification was not created"
            )

        return {
            "message": "Notification created successfully",
            "notification": response.data[0]
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create notification: {str(e)}"
        )