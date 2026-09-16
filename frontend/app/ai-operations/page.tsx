"use client";

import { useEffect, useMemo, useState } from "react";

type Issue = {
  id: string;
  title: string;
  description: string;
  category?: string;
  priority?: string;
  status?: string;
  ai_analysis?: string;
  created_at?: string;
};

type Task = {
  id: string;
  issue_id?: string;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  created_at?: string;
};

const API_URL =
  "https://ai-education-operations-platform.onrender.com";

export default function AIOperationsPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAIData();
  }, []);

  async function fetchAIData() {
    try {
      setLoading(true);
      setError("");

      const [issuesResponse, tasksResponse] =
        await Promise.all([
          fetch(`${API_URL}/issues/`),
          fetch(`${API_URL}/tasks/`),
        ]);

      if (!issuesResponse.ok || !tasksResponse.ok) {
        throw new Error("Failed to fetch AI operations data");
      }

      const issuesResult = await issuesResponse.json();
      const tasksResult = await tasksResponse.json();

      setIssues(issuesResult.data || []);
      setTasks(tasksResult.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load AI operations data");
    } finally {
      setLoading(false);
    }
  }

  const analyzedIssues = useMemo(() => {
    return issues.filter(
      (issue) =>
        issue.ai_analysis &&
        issue.ai_analysis.trim() !== ""
    );
  }, [issues]);

  const highPriorityIssues = useMemo(() => {
    return issues.filter(
      (issue) =>
        issue.priority?.toLowerCase() === "high" ||
        issue.priority?.toLowerCase() === "critical"
    );
  }, [issues]);

  const pendingTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.status?.toLowerCase() === "pending"
    );
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.status?.toLowerCase() === "completed"
    );
  }, [tasks]);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};

    analyzedIssues.forEach((issue) => {
      const category =
        issue.category?.toLowerCase() || "other";

      counts[category] =
        (counts[category] || 0) + 1;
    });

    return Object.entries(counts).sort(
      (a, b) => b[1] - a[1]
    );
  }, [analyzedIssues]);

  function categoryStyle(category: string) {
    switch (category) {
      case "attendance":
        return "bg-cyan-50 text-cyan-700";

      case "academic":
        return "bg-indigo-50 text-indigo-700";

      case "behavioral":
        return "bg-purple-50 text-purple-700";

      case "technical":
        return "bg-sky-50 text-sky-700";

      case "administrative":
        return "bg-orange-50 text-orange-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  }

  function priorityStyle(priority?: string) {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-700";

      case "high":
        return "bg-red-50 text-red-600";

      case "medium":
        return "bg-amber-50 text-amber-600";

      case "low":
        return "bg-emerald-50 text-emerald-600";

      default:
        return "bg-slate-100 text-slate-500";
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= SIDEBAR ================= */}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[290px] bg-[#18213f] text-white lg:block">

        <div className="flex h-[120px] items-center gap-4 border-b border-white/10 px-9">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">
            ✦
          </div>

          <div>
            <h1 className="text-xl font-bold">
              EduOps AI
            </h1>

            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
              Operations
              <br />
              Platform
            </p>
          </div>
        </div>

        <nav className="px-4 py-8">

          <a
            href="/"
            className="mb-2 flex items-center gap-4 rounded-xl px-5 py-4 text-sm text-slate-300 transition hover:bg-white/5"
          >
            ▦
            Dashboard
          </a>

          <a
            href="/students"
            className="mb-2 flex items-center gap-4 rounded-xl px-5 py-4 text-sm text-slate-300 transition hover:bg-white/5"
          >
            ♙
            Students
          </a>

          <a
            href="/issues"
            className="mb-2 flex items-center gap-4 rounded-xl px-5 py-4 text-sm text-slate-300 transition hover:bg-white/5"
          >
            ⓘ
            Issues
          </a>

          <a
            href="/tasks"
            className="mb-2 flex items-center gap-4 rounded-xl px-5 py-4 text-sm text-slate-300 transition hover:bg-white/5"
          >
            ☑
            Tasks
          </a>

          <a
            href="/ai-operations"
            className="mb-2 flex items-center gap-4 rounded-xl bg-[#17395d] px-5 py-4 text-sm font-semibold text-cyan-400"
          >
            ✦
            AI Operations
          </a>

          <a
            href="/notifications"
            className="flex items-center gap-4 rounded-xl px-5 py-4 text-sm text-slate-300 transition hover:bg-white/5"
          >
            ♧
            Notifications
          </a>
        </nav>

        <div className="absolute bottom-5 left-5 right-5">
          <div className="rounded-2xl bg-[#222d50] px-5 py-5">

            <p className="text-xs text-slate-400">
              AI System
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-sm font-medium">
                Operational
              </span>
            </div>

          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}

      <div className="lg:pl-[290px]">

        {/* Header */}

        <header className="sticky top-0 z-30 flex h-[96px] items-center justify-between border-b border-slate-200 bg-white px-8">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">
              Intelligence
            </p>

            <h2 className="mt-1 text-xl font-bold">
              AI Operations
            </h2>
          </div>

          <div className="flex items-center gap-5">

            <div className="hidden rounded-xl bg-slate-100 px-5 py-3 text-sm text-slate-400 md:block">
              AI-powered operations
            </div>

            <button className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white">
              ♧
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#18213f] text-sm font-bold text-white">
                VG
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-bold">
                  Admin
                </p>

                <p className="text-xs text-slate-400">
                  Operations
                </p>
              </div>

            </div>
          </div>
        </header>

        <main className="p-6 md:p-8">

          {/* ================= INTRO ================= */}

          <div className="mb-8">

            <p className="text-sm font-medium text-slate-500">
              Education Operations
            </p>

            <div className="mt-1 flex flex-col justify-between gap-4 md:flex-row md:items-end">

              <div>

                <h1 className="text-4xl font-bold tracking-tight">
                  AI Operations
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Monitor AI-powered issue classification,
                  analysis, and task automation.
                </p>

              </div>

              <button
                onClick={fetchAIData}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold transition hover:bg-slate-50"
              >
                ↻ Refresh AI Data
              </button>

            </div>
          </div>

          {/* ================= AI STATUS ================= */}

          <div className="mb-6 rounded-2xl bg-[#18213f] p-6 text-white shadow-sm">

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-2xl text-cyan-400">
                  ✦
                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <h2 className="text-lg font-semibold">
                      Gemini AI Agent
                    </h2>

                    <span className="h-2 w-2 rounded-full bg-emerald-400" />

                    <span className="text-xs font-medium text-emerald-400">
                      Operational
                    </span>

                  </div>

                  <p className="mt-1 text-sm text-slate-400">
                    AI classification and task automation
                    are running normally.
                  </p>

                </div>
              </div>

              <div className="text-left md:text-right">

                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Powered by
                </p>

                <p className="mt-1 font-semibold">
                  LangGraph + Gemini
                </p>

              </div>

            </div>
          </div>

          {/* ================= STATS ================= */}

          <div className="mb-6 grid gap-5 md:grid-cols-4">

            {/* Analyzed */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
                  ✦
                </div>

                <span className="text-xs font-semibold text-emerald-500">
                  AI
                </span>

              </div>

              <p className="text-sm text-slate-500">
                Issues Analyzed
              </p>

              <p className="mt-2 text-4xl font-bold">
                {loading ? "..." : analyzedIssues.length}
              </p>

            </div>

            {/* Tasks */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                  ☑
                </div>

                <span className="text-xs font-semibold text-blue-500">
                  AUTO
                </span>

              </div>

              <p className="text-sm text-slate-500">
                Tasks Generated
              </p>

              <p className="mt-2 text-4xl font-bold">
                {loading ? "..." : tasks.length}
              </p>

            </div>

            {/* High Priority */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  !
                </div>

                <span className="text-xs font-semibold text-red-500">
                  Attention
                </span>

              </div>

              <p className="text-sm text-slate-500">
                High Priority Issues
              </p>

              <p className="mt-2 text-4xl font-bold">
                {loading ? "..." : highPriorityIssues.length}
              </p>

            </div>

            {/* Pending */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                  ◷
                </div>

                <span className="text-xs font-semibold text-amber-500">
                  Pending
                </span>

              </div>

              <p className="text-sm text-slate-500">
                Pending Tasks
              </p>

              <p className="mt-2 text-4xl font-bold">
                {loading ? "..." : pendingTasks.length}
              </p>

            </div>
          </div>

          {/* ================= TWO COLUMN ================= */}

          <div className="grid gap-6 lg:grid-cols-2">

            {/* AI Activity */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 px-6 py-5">

                <h2 className="text-lg font-semibold">
                  Recent AI Activity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest issues processed by the AI agent.
                </p>

              </div>

              <div className="divide-y divide-slate-100">

                {loading && (
                  <div className="px-6 py-12 text-center text-sm text-slate-400">
                    Loading AI activity...
                  </div>
                )}

                {!loading &&
                  analyzedIssues.length === 0 && (
                    <div className="px-6 py-12 text-center text-sm text-slate-400">
                      No AI activity available.
                    </div>
                  )}

                {!loading &&
                  analyzedIssues.slice(0, 5).map((issue) => (
                    <div
                      key={issue.id}
                      className="flex gap-4 px-6 py-5"
                    >

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-500">
                        ✦
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-3">

                          <p className="truncate text-sm font-semibold">
                            {issue.title}
                          </p>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${priorityStyle(
                              issue.priority
                            )}`}
                          >
                            {issue.priority || "medium"}
                          </span>

                        </div>

                        <div className="mt-2 flex items-center gap-2">

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${categoryStyle(
                              issue.category || "other"
                            )}`}
                          >
                            {issue.category || "other"}
                          </span>

                          <span className="text-xs text-emerald-500">
                            AI analyzed
                          </span>

                        </div>

                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Category Analysis */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6">

                <h2 className="text-lg font-semibold">
                  Issue Classification
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Categories identified by Gemini AI.
                </p>

              </div>

              {loading ? (
                <div className="py-12 text-center text-sm text-slate-400">
                  Loading classification...
                </div>
              ) : categories.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-400">
                  No classification data available.
                </div>
              ) : (
                <div className="space-y-5">

                  {categories.map(
                    ([category, count]) => {

                      const percentage =
                        analyzedIssues.length > 0
                          ? Math.round(
                              (count /
                                analyzedIssues.length) *
                                100
                            )
                          : 0;

                      return (
                        <div key={category}>

                          <div className="mb-2 flex items-center justify-between">

                            <div className="flex items-center gap-3">

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${categoryStyle(
                                  category
                                )}`}
                              >
                                {category}
                              </span>

                            </div>

                            <span className="text-sm font-semibold">
                              {count}
                            </span>

                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                            <div
                              className="h-full rounded-full bg-cyan-500 transition-all"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />

                          </div>

                          <p className="mt-1 text-right text-[11px] text-slate-400">
                            {percentage}% of analyzed issues
                          </p>

                        </div>
                      );
                    }
                  )}

                </div>
              )}
            </div>
          </div>

          {/* ================= AUTOMATION PIPELINE ================= */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

              <h2 className="text-lg font-semibold">
                AI Automation Pipeline
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                How an issue moves through the intelligent
                operations workflow.
              </p>

            </div>

            <div className="grid gap-4 md:grid-cols-4">

              <PipelineStep
                number="01"
                title="Issue Created"
                description="Student issue enters the platform."
              />

              <PipelineStep
                number="02"
                title="AI Analysis"
                description="Gemini classifies category and priority."
              />

              <PipelineStep
                number="03"
                title="Task Generated"
                description="Recommended follow-up task is created."
              />

              <PipelineStep
                number="04"
                title="Staff Action"
                description="Staff member follows the generated task."
              />

            </div>
          </div>

          {/* ================= SYSTEM INFO ================= */}

          <div className="mt-6 grid gap-6 md:grid-cols-3">

            <SystemCard
              title="AI Model"
              value="Gemini 2.5 Flash"
              status="Connected"
            />

            <SystemCard
              title="Agent Framework"
              value="LangGraph"
              status="Active"
            />

            <SystemCard
              title="Database"
              value="Supabase PostgreSQL"
              status="Connected"
            />

          </div>

          {/* Error */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Backend */}

          <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">

            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            Connected to FastAPI AI backend

          </div>

        </main>
      </div>
    </div>
  );
}


/* ================= PIPELINE COMPONENT ================= */

function PipelineStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-5">

      <span className="text-xs font-bold text-cyan-500">
        {number}
      </span>

      <h3 className="mt-3 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
}


/* ================= SYSTEM CARD ================= */

function SystemCard({
  title,
  value,
  status,
}: {
  title: string;
  value: string;
  status: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <div className="mt-3 flex items-center justify-between gap-3">

        <p className="font-semibold">
          {value}
        </p>

        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {status}
        </span>

      </div>
    </div>
  );
}