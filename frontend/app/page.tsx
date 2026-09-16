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
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
};

type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
};

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [studentsRes, issuesRes, tasksRes] = await Promise.all([
          fetch(`${API_URL}/students/`),
          fetch(`${API_URL}/issues/`),
          fetch(`${API_URL}/tasks/`),
        ]);

        const studentsData = await studentsRes.json();
        const issuesData = await issuesRes.json();
        const tasksData = await tasksRes.json();

        setStudents(studentsData.data || []);
        setIssues(issuesData.data || []);
        setTasks(tasksData.data || []);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const openIssues = issues.filter(
    (issue) =>
      issue.status?.toLowerCase() === "open" ||
      issue.status?.toLowerCase() === "in progress"
  ).length;

  const pendingTasks = tasks.filter(
    (task) =>
      task.status?.toLowerCase() === "pending" ||
      task.status?.toLowerCase() === "in progress"
  ).length;

  const activeStudents = students.filter(
    (student) => student.status?.toLowerCase() === "active"
  ).length;

  const recentIssues = issues.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-20 flex h-screen w-[250px] flex-col bg-[#18213f] text-white">
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
          />
        </nav>

        {/* System status */}
        <div className="border-t border-white/10 p-5">
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-xs text-slate-400">AI System</p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-sm text-slate-200">Operational</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-[250px] min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-[82px] items-center justify-between border-b border-slate-200 bg-white/95 px-8 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[2px] text-cyan-600">
              Overview
            </p>

            <h2 className="text-xl font-bold text-slate-900">
              Operations Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 md:flex">
              <Search size={18} className="text-slate-400" />

              <input
                placeholder="Search students, issues, tasks..."
                className="w-[260px] bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Notification */}
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50">
              <Bell size={18} className="text-slate-600" />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#18213f] text-sm font-bold text-white">
                VG
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold">Admin</p>
                <p className="text-xs text-slate-400">Operations</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Welcome */}
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-sm text-slate-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              <h3 className="text-3xl font-bold tracking-tight">
                Welcome back, Admin 👋
              </h3>

              <p className="mt-2 text-slate-500">
                Here's what's happening across your education operations.
              </p>
            </div>

            <Link
              href="/issues"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#18213f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#202b50]"
            >
              <Plus size={18} />
              New Issue
            </Link>
          </div>

          {/* Stats */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Students"
              value={loading ? "..." : students.length.toString()}
              change={loading ? "" : `${activeStudents} active`}
              icon={<Users className="h-5 w-5 text-cyan-600" />}
            />

            <StatCard
              title="Open Issues"
              value={loading ? "..." : openIssues.toString()}
              change="Live"
              icon={<AlertCircle className="h-5 w-5 text-cyan-600" />}
            />

            <StatCard
              title="Pending Tasks"
              value={loading ? "..." : pendingTasks.toString()}
              change="Live"
              icon={<CheckSquare className="h-5 w-5 text-cyan-600" />}
            />

            <StatCard
              title="AI Operations"
              value={loading ? "..." : issues.length.toString()}
              change="Issues analyzed"
              icon={<Bot className="h-5 w-5 text-cyan-600" />}
            />
          </div>

          {/* Bottom section */}
          <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_350px]">
            {/* Recent Issues */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <h4 className="font-bold">Recent Issues</h4>

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
                  <div className="px-6 py-10 text-center text-sm text-slate-400">
                    No issues found.
                  </div>
                ) : (
                  recentIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                          <AlertCircle
                            size={18}
                            className="text-slate-500"
                          />
                        </div>

                        <div>
                          <p className="text-sm font-semibold">
                            {issue.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {issue.category || "Other"} •{" "}
                            {issue.description?.slice(0, 55)}
                            {issue.description?.length > 55 ? "..." : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <PriorityBadge priority={issue.priority} />

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {issue.status}
                        </span>
                      </div>
                    </div>
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
                  <h4 className="font-bold">AI Operations</h4>

                  <p className="text-xs text-slate-400">
                    Automated intelligence
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-5">
                <AIActivity
                  icon={<Activity size={17} />}
                  title="Issues analyzed"
                  value={loading ? "..." : issues.length.toString()}
                />

                <AIActivity
                  icon={<CheckSquare size={17} />}
                  title="Tasks generated"
                  value={loading ? "..." : tasks.length.toString()}
                />

                <AIActivity
                  icon={<Bell size={17} />}
                  title="Active students"
                  value={loading ? "..." : activeStudents.toString()}
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
            </section>
          </div>

          {/* System status */}
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
            <Clock size={14} />
            Connected to FastAPI backend
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------- Components ---------------- */

function NavItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-cyan-500/10 text-cyan-400"
          : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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

      <p className="mt-5 text-sm text-slate-500">{title}</p>

      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
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
      className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {priority || "Unknown"}
    </span>
  );
}

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

        <span className="text-sm text-slate-600">{title}</span>
      </div>

      <span className="font-bold">{value}</span>
    </div>
  );
}