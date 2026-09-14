from typing import TypedDict
import json
import re

from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
from pydantic import BaseModel, Field


# =========================================================
# AI OUTPUT MODEL
# =========================================================

class IssueAnalysis(BaseModel):
    category: str = Field(
        description=(
            "Issue category: attendance, academic, behavioral, "
            "technical, administrative, or other"
        )
    )

    priority: str = Field(
        description=(
            "Priority level: low, medium, high, or critical"
        )
    )

    recommended_action: str = Field(
        description="Recommended next action for school staff"
    )

    ai_analysis: str = Field(
        description=(
            "Short explanation of why this category and "
            "priority were selected"
        )
    )


# =========================================================
# LANGGRAPH STATE
# =========================================================

class IssueState(TypedDict):
    title: str
    description: str
    analysis: dict


# =========================================================
# GEMINI MODEL
# =========================================================

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    max_output_tokens=500,
    max_retries=2,
)


# =========================================================
# JSON PARSER
# =========================================================

def extract_json(text: str) -> dict:
    """
    Extract JSON safely from Gemini response.

    Handles:
    1. Normal JSON
    2. JSON inside ```json ... ```
    3. Extra text around JSON
    """

    if not text:
        raise ValueError("Empty response received from Gemini")

    text = text.strip()

    # Remove markdown code fences
    text = re.sub(
        r"```json\s*",
        "",
        text,
        flags=re.IGNORECASE
    )

    text = re.sub(
        r"```\s*",
        "",
        text
    )

    text = text.strip()

    # Try direct JSON parsing first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Find JSON object inside the response
    match = re.search(
        r"\{.*\}",
        text,
        flags=re.DOTALL
    )

    if not match:
        raise ValueError(
            f"Gemini did not return valid JSON: {text}"
        )

    try:
        return json.loads(match.group(0))
    except json.JSONDecodeError as e:
        raise ValueError(
            f"Could not parse Gemini JSON response: {e}"
        )


# =========================================================
# AI ANALYSIS NODE
# =========================================================

def analyze_issue(state: IssueState):

    prompt = f"""
You are an AI education operations assistant.

Analyze the following student issue.

TITLE:
{state["title"]}

DESCRIPTION:
{state["description"]}

Your task is to classify the issue.

Allowed categories:
- attendance
- academic
- behavioral
- technical
- administrative
- other

Allowed priority levels:
- low
- medium
- high
- critical

Return ONLY valid JSON.

Do not use markdown.
Do not use ```json.
Do not add any explanation outside the JSON.

Use exactly this JSON structure:

{{
    "category": "attendance",
    "priority": "high",
    "recommended_action": "Recommended action for school staff",
    "ai_analysis": "Short explanation of the classification"
}}

Rules:
1. Do not invent facts.
2. Base the classification only on the title and description.
3. Use "critical" only for issues requiring immediate attention.
4. Use "high" for significant issues that should be addressed promptly.
5. Keep recommended_action practical.
6. Keep ai_analysis short and clear.
"""

    # -----------------------------------------------------
    # Call Gemini directly
    # -----------------------------------------------------

    response = llm.invoke(prompt)

    # -----------------------------------------------------
    # Extract response content
    # -----------------------------------------------------

    content = response.content

    # Newer LangChain versions may return content blocks
    if isinstance(content, list):

        text_parts = []

        for block in content:

            if isinstance(block, dict):
                text = block.get("text")

                if text:
                    text_parts.append(text)

            elif isinstance(block, str):
                text_parts.append(block)

        content = "".join(text_parts)

    # Make sure content is a string
    content = str(content)

    # -----------------------------------------------------
    # Parse JSON
    # -----------------------------------------------------

    analysis_data = extract_json(content)

    # -----------------------------------------------------
    # Validate AI output
    # -----------------------------------------------------

    analysis = IssueAnalysis.model_validate(
        analysis_data
    )

    # -----------------------------------------------------
    # Return LangGraph state update
    # -----------------------------------------------------

    return {
        "analysis": analysis.model_dump()
    }


# =========================================================
# LANGGRAPH WORKFLOW
# =========================================================

graph = StateGraph(IssueState)

graph.add_node(
    "analyze_issue",
    analyze_issue
)

graph.set_entry_point(
    "analyze_issue"
)

graph.add_edge(
    "analyze_issue",
    END
)

issue_analyzer = graph.compile()


# =========================================================
# PUBLIC FUNCTION
# =========================================================

def analyze_student_issue(
    title: str,
    description: str
):
    """
    Analyze a student issue using
    LangGraph + Gemini.
    """

    result = issue_analyzer.invoke(
        {
            "title": title,
            "description": description,
            "analysis": {}
        }
    )

    return result["analysis"]