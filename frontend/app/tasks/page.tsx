"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Task = {
  id: string;
  issue_id?: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
  created_at?: string;
};

const API_URL =
  "https://ai-education-operations-platform.onrender.com";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/tasks/`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const result = await response.json();

      setTasks(result.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load tasks");
    } finally {
      setLoading(false);
    }
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        !searchText ||
        task.title?.toLowerCase().includes(searchText) ||
        task.description?.toLowerCase().includes(searchText);

      const matchesPriority =
        priorityFilter === "all" ||
        task.priority?.toLowerCase() === priorityFilter;

      const matchesStatus =
        statusFilter === "all" ||
        task.status?.toLowerCase() === statusFilter;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus
      );
    });
  }, [tasks, search, priorityFilter, statusFilter]);

  const pendingTasks = tasks.filter(
    (task) => task.status?.toLowerCase() === "pending"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status?.toLowerCase() === "completed"
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) =>
      task.priority?.toLowerCase() === "high" ||
      task.priority?.toLowerCase() === "critical"
  ).length;

  function priorityStyle(priority?: string) {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";

      case "high":
        return "bg-red-50 text-red-600 border-red-100";

      case "medium":
        return "bg-amber-50 text-amber-600 border-amber-100";

      case "low":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";

      default:
        return "bg-slate-100 text-slate-500 border-slate-200";
    }
  }

  function statusStyle(status?: string) {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";

      case "in progress":
        return "bg-purple-50 text-purple-600 border-purple-100";

      case "pending":
        return "bg-amber-50 text-amber-600 border-amber-100";

      default:
        return "bg-slate-100 text-slate-500 border-slate-200";
    }
  }

  function formatDate(date?: string) {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function clearFilters() {
    setSearch("");
    setPriorityFilter("all");
    setStatusFilter("all");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[275px] border-r border-slate-800 bg-[#17213f] lg:block">

        {/* Logo */}
        <div className="flex h-[118px] items-center border-b border-white/10 px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="4" y="5" width="16" height="14" rx="3" />
                <path d="M8 2v3M16 2v3M8 12h.01M12 12h.01M16 12h.01M8 16h8" />
              </svg>
            </div>

            <div>
              <h1 className="text-xl font-bold text-white">
                EduOps AI
              </h1>

              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                Operations
              </p>

              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                Platform
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-7">

          <Link
            href="/"
            className="mb-2 flex h-12 items-center gap-4 rounded-xl px-5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <span className="text-lg">▦</span>
            Dashboard
          </Link>

          <Link
            href="/students"
            className="mb-2 flex h-12 items-center gap-4 rounded-xl px-5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <span className="text-lg">♙</span>
            Students
          </Link>

          <Link
            href="/issues"
            className="mb-2 flex h-12 items-center gap-4 rounded-xl px-5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <span className="text-lg">ⓘ</span>
            Issues
          </Link>

          {/* Active */}
          <Link
            href="/tasks"
            className="mb-2 flex h-12 items-center gap-4 rounded-xl bg-cyan-500/10 px-5 text-sm font-semibold text-cyan-400"
          >
            <span className="text-lg">☑</span>
            Tasks
          </Link>

          <Link
            href="/ai-operations"
            className="mb-2 flex h-12 items-center gap-4 rounded-xl px-5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <span className="text-lg">♙</span>
            AI Operations
          </Link>

          <Link
            href="/notifications"
            className="flex h-12 items-center gap-4 rounded-xl px-5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <span className="text-lg">♧</span>
            Notifications
          </Link>

        </nav>

        {/* Bottom system card */}
        <div className="absolute bottom-6 left-5 right-5">
          <div className="rounded-2xl bg-[#222d50] px-5 py-5">
            <p className="text-xs text-slate-400">
              AI System
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-sm font-medium text-white">
                Operational
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="lg:ml-[275px]">

        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-[92px] items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-10">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">
              Operations
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Task Management
            </h2>
          </div>

          <div className="flex items-center gap-4">

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
                placeholder="Search tasks..."
                className="h-12 w-[280px] rounded-xl border border-transparent bg-slate-100 pl-11 pr-4 text-sm outline-none transition focus:border-cyan-300 focus:bg-white"
              />
            </div>

            {/* Notification */}
            <button className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
              <span className="text-xl">♧</span>

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Profile */}
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#17213f] text-sm font-bold text-white">
                VG
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Admin
                </p>

                <p className="text-xs text-slate-400">
                  Operations
                </p>
              </div>
            </div>

          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <main className="p-6 lg:p-10">

          {/* Page heading */}
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>
              <p className="text-sm text-slate-500">
                Education Operations
              </p>

              <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
                Tasks
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage and monitor tasks generated from student issues.
              </p>
            </div>

          </div>

          {/* ================= STATS ================= */}
          <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
                  ☑
                </div>

                <span className="text-xs font-medium text-emerald-500">
                  Live ↗
                </span>
              </div>

              <p className="mt-6 text-sm text-slate-500">
                Total Tasks
              </p>

              <p className="mt-1 text-3xl font-bold">
                {tasks.length}
              </p>
            </div>

            {/* Pending */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                  ◷
                </div>

                <span className="text-xs font-medium text-amber-500">
                  Pending
                </span>
              </div>

              <p className="mt-6 text-sm text-slate-500">
                Pending Tasks
              </p>

              <p className="mt-1 text-3xl font-bold">
                {pendingTasks}
              </p>
            </div>

            {/* Completed */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                  ✓
                </div>

                <span className="text-xs font-medium text-emerald-500">
                  Completed
                </span>
              </div>

              <p className="mt-6 text-sm text-slate-500">
                Completed
              </p>

              <p className="mt-1 text-3xl font-bold">
                {completedTasks}
              </p>
            </div>

            {/* High priority */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  !
                </div>

                <span className="text-xs font-medium text-red-500">
                  Attention
                </span>
              </div>

              <p className="mt-6 text-sm text-slate-500">
                High Priority
              </p>

              <p className="mt-1 text-3xl font-bold">
                {highPriorityTasks}
              </p>
            </div>

          </div>

          {/* ================= FILTERS ================= */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold">
                  Task Filters
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Filter tasks by priority or status.
                </p>
              </div>

              {(search ||
                priorityFilter !== "all" ||
                statusFilter !== "all") && (
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-cyan-600 hover:text-cyan-700"
                >
                  Clear Filters
                </button>
              )}

            </div>

            <div className="grid gap-4 md:grid-cols-3">

              {/* Mobile Search */}
              <div className="relative md:hidden">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  width="18"
                  height="18"
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
                  placeholder="Search tasks..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              {/* Priority */}
              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value)
                }
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-cyan-400"
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

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-cyan-400"
              >
                <option value="all">
                  All Statuses
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="in progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>

            </div>
          </div>

          {/* ================= DIRECTORY ================= */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Directory header */}
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center">

              <div>
                <h2 className="text-lg font-semibold">
                  Task Directory
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Live task data from FastAPI + Supabase.
                </p>
              </div>

              <button
                onClick={fetchTasks}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className={loading ? "animate-spin" : ""}>
                  ↻
                </span>

                Refresh
              </button>

            </div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center px-6 py-20">

                <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-500" />

                <p className="text-sm text-slate-500">
                  Loading tasks...
                </p>

              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="px-6 py-20 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-xl text-red-500">
                  !
                </div>

                <p className="mt-4 font-medium text-red-500">
                  {error}
                </p>

                <button
                  onClick={fetchTasks}
                  className="mt-5 rounded-xl bg-[#17213f] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#202d52]"
                >
                  Try Again
                </button>

              </div>
            )}

            {/* Empty */}
            {!loading &&
              !error &&
              filteredTasks.length === 0 && (
                <div className="px-6 py-20 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
                    ☑
                  </div>

                  <p className="mt-4 font-medium text-slate-700">
                    No tasks found
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Try changing your filters or search term.
                  </p>

                </div>
              )}

            {/* Table */}
            {!loading &&
              !error &&
              filteredTasks.length > 0 && (
                <div className="overflow-x-auto">

                  <table className="w-full min-w-[1050px]">

                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                        <th className="px-6 py-4">
                          Task
                        </th>

                        <th className="px-6 py-4">
                          Description
                        </th>

                        <th className="px-6 py-4">
                          Priority
                        </th>

                        <th className="px-6 py-4">
                          Status
                        </th>

                        <th className="px-6 py-4">
                          Due Date
                        </th>

                        <th className="px-6 py-4">
                          Issue ID
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {filteredTasks.map((task) => (

                        <tr
                          key={task.id}
                          className="border-b border-slate-100 transition hover:bg-slate-50"
                        >

                          {/* Task */}
                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 font-semibold text-cyan-600">
                                ✓
                              </div>

                              <div className="min-w-0">

                                <p className="max-w-[250px] truncate font-semibold text-slate-900">
                                  {task.title}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  Task
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Description */}
                          <td className="max-w-[350px] px-6 py-5">

                            <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                              {task.description || "No description available"}
                            </p>

                          </td>

                          {/* Priority */}
                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${priorityStyle(
                                task.priority
                              )}`}
                            >
                              {task.priority || "medium"}
                            </span>

                          </td>

                          {/* Status */}
                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyle(
                                task.status
                              )}`}
                            >
                              {task.status || "pending"}
                            </span>

                          </td>

                          {/* Due date */}
                          <td className="px-6 py-5 text-sm text-slate-600">
                            {formatDate(task.due_date)}
                          </td>

                          {/* Issue ID */}
                          <td className="max-w-[180px] px-6 py-5">

                            <span
                              title={task.issue_id || ""}
                              className="block max-w-[180px] truncate font-mono text-xs text-slate-400"
                            >
                              {task.issue_id || "—"}
                            </span>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>
              )}

          </div>

          {/* Backend status */}
          <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">

            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            Connected to FastAPI backend

            <span className="text-slate-300">
              •
            </span>

            <span>
              {filteredTasks.length} of {tasks.length} tasks
            </span>

          </div>

        </main>
      </div>
    </div>
  );
}