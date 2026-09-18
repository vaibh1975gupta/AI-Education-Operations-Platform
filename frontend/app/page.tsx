"use client";

import {
  LayoutDashboard,
  Users,
  AlertCircle,
  CheckSquare,
  Bot,
  Bell,
  Search,
  Plus,
  ArrowUpRight,
  Clock,
  Activity,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_URL = "https://ai-education-operations-platform.onrender.com";

type Student = {
  id: string;
  name: string;
  email: string | null;
  class_name: string | null;
  status: string;
};

type Issue = {
  id: string;
  student_id: string | null;
  title: string;
  description: string;
  category: string | null;
  priority: string;
  status: string;
  ai_analysis?: string | null;
};

type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
};

type Notification = {
  id: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
};

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadDashboard(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [
        studentsRes,
        issuesRes,
        tasksRes,
        notificationsRes,
      ] = await Promise.all([
        fetch(`${API_URL}/students/`, { cache: "no-store" }),
        fetch(`${API_URL}/issues/`, { cache: "no-store" }),
        fetch(`${API_URL}/tasks/`, { cache: "no-store" }),
        fetch(`${API_URL}/notifications/`, { cache: "no-store" }),
      ]);

      if (
        !studentsRes.ok ||
        !issuesRes.ok ||
        !tasksRes.ok ||
        !notificationsRes.ok
      ) {
        throw new Error("One or more backend services are unavailable");
      }

      const studentsData = await studentsRes.json();
      const issuesData = await issuesRes.json();
      const tasksData = await tasksRes.json();
      const notificationsData = await notificationsRes.json();

      setStudents(studentsData.data || []);
      setIssues(issuesData.data || []);
      setTasks(tasksData.data || []);
      setNotifications(notificationsData.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(
        "Unable to connect to the FastAPI backend. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const openIssues = issues.filter((issue) => {
    const status = issue.status?.toLowerCase();

    return status === "open" || status === "in progress";
  }).length;

  const pendingTasks = tasks.filter((task) => {
    const status = task.status?.toLowerCase();

    return status === "pending" || status === "in progress";
  }).length;

  const activeStudents = students.filter(
    (student) => student.status?.toLowerCase() === "active"
  ).length;

  const unreadNotifications = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const aiAnalyzedIssues = issues.filter(
    (issue) =>
      Boolean(issue.ai_analysis) ||
      Boolean(issue.category)
  ).length;

  const recentIssues = useMemo(() => {
    return [...issues]
      .sort((a, b) => {
        return Number(b.id > a.id) - Number(b.id < a.id);
      })
      .slice(0, 4);
  }, [issues]);

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">

      {/* ================= SIDEBAR ================= */}

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[250px] flex-col bg-[#18213f] text-white lg:flex">

        {/* Logo */}
        <div className="flex h-[82px] items-center gap-3 border-b border-white/10 px-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15">
            <Bot className="h-6 w-6 text-cyan-400" />
          </div>

          <div>
            <h1 className="text-lg font-bold">EduOps AI</h1>

            <p className="text-[10px] uppercase tracking-[2px] text-slate-400">
              Operations Platform
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-7">

          <NavItem
            href="/"
            icon={<LayoutDashboard size={19} />}
            label="Dashboard"
            active
          />

          <NavItem
            href="/students"
            icon={<Users size={19} />}
            label="Students"
          />

          <NavItem
            href="/issues"
            icon={<AlertCircle size={19} />}
            label="Issues"
          />

          <NavItem
            href="/tasks"
            icon={<CheckSquare size={19} />}
            label="Tasks"
          />

          <NavItem
            href="/ai-operations"
            icon={<Bot size={19} />}
            label="AI Operations"
          />

          <NavItem
            href="/notifications"
            icon={<Bell size={19} />}
            label="Notifications"
            badge={unreadNotifications}
          />

        </nav>

        {/* System status */}
        <div className="border-t border-white/10 p-5">
          <div className="rounded-xl bg-white/5 p-4">

            <p className="text-xs text-slate-400">
              AI System
            </p>

            <div className="mt-2 flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-sm text-slate-200">
                Operational
              </span>

            </div>

          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}

      <main className="min-h-screen lg:ml-[250px]">

        {/* Header */}
        <header className="sticky top-0 z-20 flex min-h-[82px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[2px] text-cyan-600">
              Overview
            </p>

            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Operations Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3">

            {/* Search */}
            <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 xl:flex">
              <Search size={18} className="text-slate-400" />

              <input
                placeholder="Search students, issues, tasks..."
                className="w-[260px] bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Notification */}
            <Link
              href="/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50"
            >
              <Bell size={18} className="text-slate-600" />

              {unreadNotifications > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {unreadNotifications > 9
                    ? "9+"
                    : unreadNotifications}
                </span>
              )}
            </Link>

            {/* Profile */}
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#18213f] text-sm font-bold text-white">
                VG
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold">
                  Admin
                </p>

                <p className="text-xs text-slate-400">
                  Operations
                </p>
              </div>

            </div>

          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">

          {/* Welcome */}
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="mb-2 text-sm text-slate-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back, Admin 👋
              </h3>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Here's what's happening across your education operations.
              </p>

            </div>

            <div className="flex gap-3">

              <button
                onClick={() => loadDashboard(true)}
                disabled={refreshing}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCw
                  size={17}
                  className={refreshing ? "animate-spin" : ""}
                />

                Refresh
              </button>

              <Link
                href="/issues"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#18213f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#202b50]"
              >
                <Plus size={18} />
                New Issue
              </Link>

            </div>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <AlertCircle className="text-red-500" size={20} />

                <p className="text-sm font-medium text-red-700">
                  {error}
                </p>

              </div>

              <button
                onClick={() => loadDashboard(true)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Retry
              </button>

            </div>
          )}

          {/* ================= STATS ================= */}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Total Students"
              value={
                loading
                  ? "..."
                  : students.length.toString()
              }
              change={
                loading
                  ? ""
                  : `${activeStudents} active`
              }
              icon={
                <Users className="h-5 w-5 text-cyan-600" />
              }
            />

            <StatCard
              title="Open Issues"
              value={
                loading
                  ? "..."
                  : openIssues.toString()
              }
              change="Live"
              icon={
                <AlertCircle className="h-5 w-5 text-cyan-600" />
              }
            />

            <StatCard
              title="Pending Tasks"
              value={
                loading
                  ? "..."
                  : pendingTasks.toString()
              }
              change="Live"
              icon={
                <CheckSquare className="h-5 w-5 text-cyan-600" />
              }
            />

            <StatCard
              title="AI Operations"
              value={
                loading
                  ? "..."
                  : aiAnalyzedIssues.toString()
              }
              change="Issues analyzed"
              icon={
                <Bot className="h-5 w-5 text-cyan-600" />
              }
            />

          </div>

          {/* ================= QUICK INSIGHTS ================= */}

          <div className="mt-6 grid gap-5 md:grid-cols-3">

            <InsightCard
              title="Unread Notifications"
              value={
                loading
                  ? "..."
                  : unreadNotifications.toString()
              }
              subtitle={
                unreadNotifications > 0
                  ? "Action required"
                  : "All caught up"
              }
              icon={<Bell size={18} />}
              highlight={unreadNotifications > 0}
            />

            <InsightCard
              title="Total Tasks"
              value={
                loading
                  ? "..."
                  : tasks.length.toString()
              }
              subtitle="Tasks generated by operations"
              icon={<CheckSquare size={18} />}
            />

            <InsightCard
              title="Active Students"
              value={
                loading
                  ? "..."
                  : activeStudents.toString()
              }
              subtitle="Currently active"
              icon={<TrendingUp size={18} />}
            />

          </div>

          {/* ================= BOTTOM SECTION ================= */}

          <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_350px]">

            {/* Recent Issues */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">

                <div>
                  <h4 className="font-bold">
                    Recent Issues
                  </h4>

                  <p className="mt-1 text-xs text-slate-400">
                    Latest student and operational issues
                  </p>
                </div>

                <Link
                  href="/issues"
                  className="text-sm font-semibold text-cyan-600 hover:text-cyan-700"
                >
                  View all
                </Link>

              </div>

              <div className="divide-y divide-slate-100">

                {loading ? (

                  <div className="px-6 py-10 text-center text-sm text-slate-400">
                    Loading issues...
                  </div>

                ) : recentIssues.length === 0 ? (

                  <div className="px-6 py-10 text-center">

                    <AlertCircle className="mx-auto mb-3 text-slate-300" size={30} />

                    <p className="text-sm font-medium text-slate-500">
                      No issues found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      New student issues will appear here.
                    </p>

                  </div>

                ) : (

                  recentIssues.map((issue) => (

                    <Link
                      href="/issues"
                      key={issue.id}
                      className="flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50 sm:px-6 md:flex-row md:items-center md:justify-between"
                    >

                      <div className="flex items-center gap-4">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                          <AlertCircle
                            size={18}
                            className="text-slate-500"
                          />
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold">
                            {issue.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {issue.category || "Other"} •{" "}
                            {issue.description?.slice(0, 55)}
                            {issue.description?.length > 55
                              ? "..."
                              : ""}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-3 pl-14 md:pl-0">

                        <PriorityBadge
                          priority={issue.priority}
                        />

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
                          {issue.status}
                        </span>

                      </div>

                    </Link>

                  ))

                )}

              </div>

            </section>

            {/* AI Operations */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50">
                  <Bot className="h-5 w-5 text-cyan-600" />
                </div>

                <div>
                  <h4 className="font-bold">
                    AI Operations
                  </h4>

                  <p className="text-xs text-slate-400">
                    Automated intelligence
                  </p>
                </div>

              </div>

              <div className="mt-7 space-y-5">

                <AIActivity
                  icon={<Activity size={17} />}
                  title="Issues analyzed"
                  value={
                    loading
                      ? "..."
                      : aiAnalyzedIssues.toString()
                  }
                />

                <AIActivity
                  icon={<CheckSquare size={17} />}
                  title="Tasks generated"
                  value={
                    loading
                      ? "..."
                      : tasks.length.toString()
                  }
                />

                <AIActivity
                  icon={<Bell size={17} />}
                  title="Unread alerts"
                  value={
                    loading
                      ? "..."
                      : unreadNotifications.toString()
                  }
                />

              </div>

              <div className="mt-7 rounded-xl bg-[#18213f] p-4 text-white">

                <div className="flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  <span className="text-xs font-semibold">
                    Gemini AI Agent
                  </span>

                </div>

                <p className="mt-2 text-xs leading-5 text-slate-300">
                  AI classification and task automation are running normally.
                </p>

              </div>

              <Link
                href="/ai-operations"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Open AI Operations
                <ArrowUpRight size={16} />
              </Link>

            </section>

          </div>

          {/* System status */}

          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-400">

            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <Clock size={14} />

            Connected to FastAPI + Supabase

            <span className="text-slate-300">
              •
            </span>

            <span>
              Live data
            </span>

          </div>

        </div>

      </main>
    </div>
  );
}

/* ================= NAV ITEM ================= */

function NavItem({
  href,
  icon,
  label,
  active = false,
  badge = 0,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-cyan-500/10 text-cyan-400"
          : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>

      {badge > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </Link>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50">
          {icon}
        </div>

        {change && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
            {change}
            <ArrowUpRight size={13} />
          </span>
        )}

      </div>

      <p className="mt-5 text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-3xl font-bold">
        {value}
      </p>

    </div>
  );
}

/* ================= INSIGHT CARD ================= */

function InsightCard({
  title,
  value,
  subtitle,
  icon,
  highlight = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            highlight
              ? "bg-amber-50 text-amber-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {icon}
        </div>

      </div>

      <p
        className={`mt-3 text-xs font-medium ${
          highlight
            ? "text-amber-600"
            : "text-slate-400"
        }`}
      >
        {subtitle}
      </p>

    </div>
  );
}

/* ================= PRIORITY BADGE ================= */

function PriorityBadge({
  priority,
}: {
  priority: string;
}) {
  const normalized = priority?.toLowerCase();

  let classes = "bg-emerald-50 text-emerald-600";

  if (normalized === "critical") {
    classes = "bg-red-100 text-red-700";
  } else if (normalized === "high") {
    classes = "bg-red-50 text-red-600";
  } else if (normalized === "medium") {
    classes = "bg-amber-50 text-amber-600";
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${classes}`}
    >
      {priority || "Unknown"}
    </span>
  );
}

/* ================= AI ACTIVITY ================= */

function AIActivity({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          {icon}
        </div>

        <span className="text-sm text-slate-600">
          {title}
        </span>

      </div>

      <span className="font-bold">
        {value}
      </span>

    </div>
  );
}