from fastapi import FastAPI

from app.supabase_client import supabase

from app.routes.schools import router as schools_router
from app.routes.students import router as students_router
from app.routes.issues import router as issues_router
from app.routes.tasks import router as tasks_router
from app.agents.issue_analyzer import analyze_student_issue


# Create FastAPI application
app = FastAPI(
    title="AI Education Operations API",
    version="1.0.0"
)


# Register API routers
app.include_router(schools_router)
app.include_router(students_router)
app.include_router(issues_router)
app.include_router(tasks_router)

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "AI Education Operations API",
        "status": "running"
    }


# Health check
@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# Supabase database test
@app.get("/db-test")
def db_test():
    response = (
        supabase
        .table("schools")
        .select("id, name")
        .limit(5)
        .execute()
    )

    return {
        "status": "database connected",
        "data": response.data
    }


# Gemini + LangGraph AI test
@app.get("/ai-test")
def ai_test():
    result = analyze_student_issue(
        title="Student attendance issue",
        description=(
            "Aman has missed several classes "
            "and attendance is below the required level."
        )
    )

    return {
        "status": "AI analysis completed",
        "analysis": result
    }