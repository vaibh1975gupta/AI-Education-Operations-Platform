"use client";

import { useEffect, useMemo, useState } from "react";

type Student = {
  id: string;
  name: string;
};

type Issue = {
  id: string;
  student_id?: string;
  title: string;
  description: string;
  category?: string;
  priority?: string;
  status?: string;
  ai_analysis?: string;
  created_at?: string;
};

const API_URL =
  "https://ai-education-operations-platform.onrender.com";

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    student_id: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchIssues();
    fetchStudents();
  }, []);

  async function fetchIssues() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/issues/`);

      if (!response.ok) {
        throw new Error("Failed to fetch issues");
      }

      const result = await response.json();
      setIssues(result.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load issues");
    } finally {
      setLoading(false);
    }
  }

  async function fetchStudents() {
    try {
      const response = await fetch(`${API_URL}/students/`);

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const result = await response.json();
      setStudents(result.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function createIssue(e: React.FormEvent) {
    e.preventDefault();

    if (!form.student_id || !form.title || !form.description) {
      alert("Please fill all fields");
      return;
    }

    try {
      setCreating(true);

      const response = await fetch(`${API_URL}/issues/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: form.student_id,
          title: form.title,
          description: form.description,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || "Failed to create issue"
        );
      }

      setShowModal(false);

      setForm({
        student_id: "",
        title: "",
        description: "",
      });

      await fetchIssues();

      alert("Issue created successfully with AI analysis.");
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to create issue"
      );
    } finally {
      setCreating(false);
    }
  }

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const searchText = search.toLowerCase();

      const searchMatch =
        !search ||
        issue.title.toLowerCase().includes(searchText) ||
        issue.description.toLowerCase().includes(searchText) ||
        getStudentName(issue.student_id)
          .toLowerCase()
          .includes(searchText);

      const priorityMatch =
        priorityFilter === "all" ||
        issue.priority?.toLowerCase() === priorityFilter;

      const statusMatch =
        statusFilter === "all" ||
        issue.status?.toLowerCase() === statusFilter;

      const categoryMatch =
        categoryFilter === "all" ||
        issue.category?.toLowerCase() === categoryFilter;

      return (
        searchMatch &&
        priorityMatch &&
        statusMatch &&
        categoryMatch
      );
    });
  }, [
    issues,
    search,
    priorityFilter,
    statusFilter,
    categoryFilter,
  ]);

  function getStudentName(studentId?: string) {
    return (
      students.find((student) => student.id === studentId)?.name ||
      "Unknown Student"
    );
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
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

  function statusStyle(status?: string) {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-blue-50 text-blue-600";

      case "in progress":
        return "bg-purple-50 text-purple-600";

      case "resolved":
        return "bg-emerald-50 text-emerald-600";

      default:
        return "bg-slate-100 text-slate-500";
    }
  }

  function categoryStyle(category?: string) {
    switch (category?.toLowerCase()) {
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

  const highPriorityCount = issues.filter(
    (issue) =>
      issue.priority?.toLowerCase() === "high" ||
      issue.priority?.toLowerCase() === "critical"
  ).length;

  const openCount = issues.filter(
    (issue) => issue.status?.toLowerCase() === "open"
  ).length;

  const analyzedCount = issues.filter(
    (issue) => issue.ai_analysis
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[290px] bg-[#18213f] text-white lg:block">

        {/* Logo */}
        <div className="flex h-[120px] items-center gap-4 border-b border-white/10 px-9">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="16" rx="3" />
              <path d="M8 9h8M8 13h5" />
              <path d="M9 4V2M15 4V2" />
            </svg>
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

        {/* Navigation */}
        <nav className="px-4 py-8">

          <a
            href="/"
            className="mb-2 flex items-center gap-4 rounded-xl px-5 py-4 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <span>▦</span>
            Dashboard
          </a>

          <a
            href="/students"
            className="mb-2 flex items-center gap-4 rounded-xl px-5 py-4 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <span>♙</span>
            Students
          </a>

          <a
            href="/issues"
            className="mb-2 flex items-center gap-4 rounded-xl bg-[#17395d] px-5 py-4 text-sm font-semibold text-cyan-400"
          >
            <span>ⓘ</span>
            Issues
          </a>

          <a
            href="/tasks"
            className="mb-2 flex items-center gap-4 rounded-xl px-5 py-4 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <span>☑</span>
            Tasks
          </a>

          <a
            href="/ai-operations"
            className="mb-2 flex items-center gap-4 rounded-xl px-5 py-4 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <span>♙</span>
            AI Operations
          </a>

          <a
            href="/notifications"
            className="flex items-center gap-4 rounded-xl px-5 py-4 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <span>♧</span>
            Notifications
          </a>
        </nav>

        {/* Bottom status */}
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

        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-[96px] items-center justify-between border-b border-slate-200 bg-white px-8">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">
              Operations
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Issue Management
            </h2>
          </div>

          <div className="flex items-center gap-5">

            {/* Search */}
            <div className="relative hidden md:block">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search issues..."
                className="w-[300px] rounded-xl bg-slate-100 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            {/* Notification */}
            <button className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600">
              ♧
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Profile */}
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

          {/* Page intro */}
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Education Operations
              </p>

              <h1 className="mt-1 text-4xl font-bold tracking-tight">
                Issues
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Track, prioritize, and resolve student issues.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#18213f] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#11182f]"
            >
              <span className="text-lg">+</span>
              New Issue
            </button>
          </div>

          {/* ================= STATS ================= */}
          <div className="mb-6 grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
                  ⓘ
                </div>

                <span className="text-xs font-semibold text-emerald-500">
                  Live ↗
                </span>
              </div>

              <p className="text-sm text-slate-500">
                Total Issues
              </p>

              <p className="mt-2 text-4xl font-bold">
                {issues.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                  ◉
                </div>

                <span className="text-xs font-semibold text-blue-500">
                  Active
                </span>
              </div>

              <p className="text-sm text-slate-500">
                Open Issues
              </p>

              <p className="mt-2 text-4xl font-bold">
                {openCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
                  ✦
                </div>

                <span className="text-xs font-semibold text-emerald-500">
                  AI Active
                </span>
              </div>

              <p className="text-sm text-slate-500">
                AI Analyzed
              </p>

              <p className="mt-2 text-4xl font-bold">
                {analyzedCount}
              </p>
            </div>
          </div>

          {/* ================= FILTERS ================= */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h2 className="font-semibold">
                  Issue Filters
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Filter issues by priority, status, or category.
                </p>
              </div>

              <button
                onClick={() => {
                  setPriorityFilter("all");
                  setStatusFilter("all");
                  setCategoryFilter("all");
                  setSearch("");
                }}
                className="text-sm font-medium text-cyan-600 transition hover:text-cyan-700"
              >
                Clear Filters
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
              >
                <option value="all">
                  All Priorities
                </option>
                <option value="critical">
                  Critical
                </option>
                <option value="high">
                  High
                </option>
                <option value="medium">
                  Medium
                </option>
                <option value="low">
                  Low
                </option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
              >
                <option value="all">
                  All Statuses
                </option>
                <option value="open">
                  Open
                </option>
                <option value="in progress">
                  In Progress
                </option>
                <option value="resolved">
                  Resolved
                </option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
              >
                <option value="all">
                  All Categories
                </option>
                <option value="attendance">
                  Attendance
                </option>
                <option value="academic">
                  Academic
                </option>
                <option value="behavioral">
                  Behavioral
                </option>
                <option value="technical">
                  Technical
                </option>
                <option value="administrative">
                  Administrative
                </option>
                <option value="other">
                  Other
                </option>
              </select>
            </div>
          </div>

          {/* ================= ISSUE DIRECTORY ================= */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>
                <h2 className="text-lg font-semibold">
                  Issue Directory
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Live issue data from FastAPI + Supabase.
                </p>
              </div>

              <button
                onClick={fetchIssues}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-50"
              >
                ↻
                Refresh
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center px-6 py-20">

                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-500" />

                <p className="text-sm text-slate-500">
                  Loading issues...
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="px-6 py-20 text-center">

                <p className="font-medium text-red-500">
                  {error}
                </p>

                <button
                  onClick={fetchIssues}
                  className="mt-4 rounded-xl bg-[#18213f] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading &&
              !error &&
              filteredIssues.length === 0 && (
                <div className="px-6 py-20 text-center">

                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
                    ⓘ
                  </div>

                  <p className="font-medium text-slate-700">
                    No issues found
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Try changing your filters or create a new issue.
                  </p>
                </div>
              )}

            {/* Table */}
            {!loading &&
              !error &&
              filteredIssues.length > 0 && (
                <div className="overflow-x-auto">

                  <table className="w-full min-w-[900px]">

                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">

                        <th className="px-6 py-4">
                          Issue
                        </th>

                        <th className="px-6 py-4">
                          Student
                        </th>

                        <th className="px-6 py-4">
                          Category
                        </th>

                        <th className="px-6 py-4">
                          Priority
                        </th>

                        <th className="px-6 py-4">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredIssues.map((issue) => {

                        const studentName =
                          getStudentName(issue.student_id);

                        return (
                          <tr
                            key={issue.id}
                            className="border-b border-slate-100 transition hover:bg-slate-50"
                          >

                            {/* Issue */}
                            <td className="px-6 py-5">

                              <div className="max-w-[430px]">

                                <p className="truncate font-semibold text-slate-900">
                                  {issue.title}
                                </p>

                                <p className="mt-1 truncate text-xs text-slate-400">
                                  {issue.description}
                                </p>

                              </div>
                            </td>

                            {/* Student */}
                            <td className="px-6 py-5">

                              <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50 text-xs font-bold text-cyan-600">
                                  {getInitials(studentName)}
                                </div>

                                <div>
                                  <p className="text-sm font-semibold text-slate-700">
                                    {studentName}
                                  </p>

                                  <p className="text-xs text-slate-400">
                                    Student
                                  </p>
                                </div>

                              </div>
                            </td>

                            {/* Category */}
                            <td className="px-6 py-5">

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${categoryStyle(
                                  issue.category
                                )}`}
                              >
                                {issue.category || "other"}
                              </span>

                            </td>

                            {/* Priority */}
                            <td className="px-6 py-5">

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${priorityStyle(
                                  issue.priority
                                )}`}
                              >
                                {issue.priority || "medium"}
                              </span>

                            </td>

                            {/* Status */}
                            <td className="px-6 py-5">

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(
                                  issue.status
                                )}`}
                              >
                                {issue.status || "open"}
                              </span>

                            </td>

                          </tr>
                        );
                      })}
                    </tbody>

                  </table>
                </div>
              )}
          </div>

          {/* Backend status */}
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Connected to FastAPI backend
          </div>

        </main>
      </div>

      {/* ================= CREATE ISSUE MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>
                <h2 className="text-xl font-bold">
                  Create New Issue
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Gemini AI will automatically analyze this issue.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={createIssue}
              className="space-y-5 p-6"
            >

              {/* Student */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Student
                </label>

                <select
                  value={form.student_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      student_id: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-50"
                >
                  <option value="">
                    Select student
                  </option>

                  {students.map((student) => (
                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Issue Title
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Student attendance issue"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Description
                </label>

                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the issue in detail..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-50"
                />
              </div>

              {/* AI info */}
              <div className="rounded-xl bg-cyan-50 p-4">

                <div className="flex gap-3">

                  <div className="mt-0.5 text-cyan-600">
                    ✦
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-cyan-800">
                      AI-powered analysis
                    </p>

                    <p className="mt-1 text-xs leading-5 text-cyan-700">
                      Gemini will classify the issue, determine
                      priority, and generate a recommended action.
                    </p>
                  </div>

                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-[#18213f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#11182f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating
                    ? "Analyzing..."
                    : "Create Issue"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}