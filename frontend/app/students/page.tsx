"use client";

import {
  LayoutDashboard,
  Users,
  AlertCircle,
  CheckSquare,
  Bot,
  Bell,
  RefreshCw,
  Plus,
  Search,
  GraduationCap,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL =
  "https://ai-education-operations-platform.onrender.com";

type Student = {
  id: string;
  name: string;
  email?: string;
  class_name?: string;
  school_id?: string;
  teacher_id?: string | null;
  status?: string;
  created_at?: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  // Add student modal
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    class_name: "",
    school_id: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/students/`);

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const result = await response.json();

      setStudents(result.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load students");
    } finally {
      setLoading(false);
    }
  }

  function openAddStudentModal() {
    setCreateError("");

    // If students already exist, automatically use their school_id
    const existingSchoolId =
      students.find((student) => student.school_id)?.school_id || "";

    setForm({
      name: "",
      email: "",
      class_name: "",
      school_id: existingSchoolId,
    });

    setShowModal(true);
  }

  function closeAddStudentModal() {
    if (creating) return;

    setShowModal(false);
    setCreateError("");
  }

  async function createStudent(e: React.FormEvent) {
    e.preventDefault();

    setCreateError("");

    if (!form.name.trim()) {
      setCreateError("Student name is required.");
      return;
    }

    if (!form.email.trim()) {
      setCreateError("Email is required.");
      return;
    }

    if (!form.class_name.trim()) {
      setCreateError("Class is required.");
      return;
    }

    if (!form.school_id.trim()) {
      setCreateError("School ID is required.");
      return;
    }

    try {
      setCreating(true);

      const response = await fetch(`${API_URL}/students/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          class_name: form.class_name.trim(),
          school_id: form.school_id.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.detail || "Failed to create student"
        );
      }

      // Close modal
      setShowModal(false);

      // Reset form
      setForm({
        name: "",
        email: "",
        class_name: "",
        school_id: "",
      });

      // Refresh student list
      await fetchStudents();
    } catch (err) {
      console.error(err);

      setCreateError(
        err instanceof Error
          ? err.message
          : "Failed to create student"
      );
    } finally {
      setCreating(false);
    }
  }

  const activeStudents = students.filter(
    (student) => student.status?.toLowerCase() === "active"
  ).length;

  const classes = new Set(
    students
      .map((student) => student.class_name)
      .filter(Boolean)
  ).size;

  const filteredStudents = students.filter((student) => {
    const query = search.toLowerCase();

    return (
      student.name?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query) ||
      student.class_name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-20 flex h-screen w-[250px] flex-col bg-[#18213f] text-white">

        {/* Logo */}
        <div className="flex h-[82px] items-center gap-3 border-b border-white/10 px-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15">
            <Bot className="h-6 w-6 text-cyan-400" />
          </div>

          <div>
            <h1 className="text-lg font-bold">
              EduOps AI
            </h1>

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
          />

          <NavItem
            href="/students"
            icon={<Users size={19} />}
            label="Students"
            active
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

        {/* System */}
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

      {/* MAIN */}
      <main className="ml-[250px] min-h-screen">

        {/* HEADER */}
        <header className="sticky top-0 z-10 flex h-[82px] items-center justify-between border-b border-slate-200 bg-white/95 px-8 backdrop-blur">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[2px] text-cyan-600">
              Operations
            </p>

            <h2 className="text-xl font-bold">
              Student Management
            </h2>
          </div>

          <div className="flex items-center gap-4">

            {/* Search */}
            <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 md:flex">

              <Search
                size={18}
                className="text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-[250px] bg-transparent text-sm outline-none placeholder:text-slate-400"
              />

            </div>

            {/* Notification */}
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50">

              <Bell
                size={18}
                className="text-slate-600"
              />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />

            </button>

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

        {/* CONTENT */}
        <div className="p-8">

          {/* Page heading */}
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>

              <p className="mb-2 text-sm text-slate-500">
                Education Operations
              </p>

              <h1 className="text-3xl font-bold tracking-tight">
                Students
              </h1>

              <p className="mt-2 text-slate-500">
                Manage and monitor students across your education operations.
              </p>

            </div>

            {/* ADD STUDENT BUTTON */}
            <button
              onClick={openAddStudentModal}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#18213f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#202b50]"
            >
              <Plus size={18} />
              Add Student
            </button>

          </div>

          {/* STATS */}
          <div className="mb-7 grid gap-5 md:grid-cols-3">

            <StatCard
              title="Total Students"
              value={loading ? "..." : students.length.toString()}
              icon={<Users className="h-5 w-5 text-cyan-600" />}
            />

            <StatCard
              title="Active Students"
              value={loading ? "..." : activeStudents.toString()}
              icon={<GraduationCap className="h-5 w-5 text-cyan-600" />}
            />

            <StatCard
              title="Classes"
              value={loading ? "..." : classes.toString()}
              icon={<CheckSquare className="h-5 w-5 text-cyan-600" />}
            />

          </div>

          {/* DIRECTORY */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Section header */}
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center">

              <div>

                <h2 className="text-lg font-bold">
                  Student Directory
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Live student data from the FastAPI backend.
                </p>

              </div>

              <button
                onClick={fetchStudents}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-50"
              >

                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />

                Refresh

              </button>

            </div>

            {/* Loading */}
            {loading && (
              <div className="px-6 py-20 text-center">

                <RefreshCw
                  size={28}
                  className="mx-auto animate-spin text-cyan-500"
                />

                <p className="mt-4 text-sm text-slate-500">
                  Loading students...
                </p>

              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="px-6 py-20 text-center">

                <AlertCircle
                  size={32}
                  className="mx-auto text-red-400"
                />

                <p className="mt-3 font-medium text-red-500">
                  {error}
                </p>

                <button
                  onClick={fetchStudents}
                  className="mt-4 rounded-lg bg-[#18213f] px-4 py-2 text-sm text-white"
                >
                  Try Again
                </button>

              </div>
            )}

            {/* Empty */}
            {!loading &&
              !error &&
              filteredStudents.length === 0 && (
                <div className="px-6 py-20 text-center">

                  <Users
                    size={34}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 font-medium text-slate-600">
                    No students found
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Try another search.
                  </p>

                </div>
              )}

            {/* Table */}
            {!loading &&
              !error &&
              filteredStudents.length > 0 && (
                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead className="bg-slate-50">

                      <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">

                        <th className="px-6 py-4">
                          Student
                        </th>

                        <th className="px-6 py-4">
                          Email
                        </th>

                        <th className="px-6 py-4">
                          Class
                        </th>

                        <th className="px-6 py-4">
                          Status
                        </th>

                        <th className="px-6 py-4">
                          Student ID
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {filteredStudents.map((student) => (

                        <tr
                          key={student.id}
                          className="border-b border-slate-100 transition hover:bg-slate-50"
                        >

                          {/* Student */}
                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 font-semibold text-cyan-600">

                                {student.name
                                  ?.charAt(0)
                                  .toUpperCase()}

                              </div>

                              <div>

                                <p className="font-semibold">
                                  {student.name}
                                </p>

                                <p className="text-xs text-slate-400">
                                  Student
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Email */}
                          <td className="px-6 py-5 text-sm text-slate-600">
                            {student.email || "—"}
                          </td>

                          {/* Class */}
                          <td className="px-6 py-5">

                            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
                              {student.class_name || "—"}
                            </span>

                          </td>

                          {/* Status */}
                          <td className="px-6 py-5">

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                student.status?.toLowerCase() === "active"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {student.status || "unknown"}
                            </span>

                          </td>

                          {/* ID */}
                          <td className="max-w-[180px] truncate px-6 py-5 font-mono text-xs text-slate-400">
                            {student.id}
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>
              )}

          </section>

          {/* Backend status */}
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">

            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            Connected to FastAPI backend

          </div>

        </div>

      </main>

      {/* ========================= */}
      {/* ADD STUDENT MODAL */}
      {/* ========================= */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>
                <h2 className="text-xl font-bold">
                  Add Student
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new student in the education platform.
                </p>
              </div>

              <button
                onClick={closeAddStudentModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={createStudent}
              className="space-y-5 p-6"
            >

              {/* Error */}
              {createError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {createError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Student Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter student name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  placeholder="student@example.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              {/* Class */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Class
                </label>

                <input
                  type="text"
                  value={form.class_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      class_name: e.target.value,
                    })
                  }
                  placeholder="e.g. 10th"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              {/* School ID */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  School ID
                </label>

                <input
                  type="text"
                  value={form.school_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      school_id: e.target.value,
                    })
                  }
                  placeholder="School UUID"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-xs outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />

                {form.school_id && (
                  <p className="mt-1 text-xs text-emerald-600">
                    Existing school ID detected automatically.
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={closeAddStudentModal}
                  disabled={creating}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-2 rounded-xl bg-[#18213f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#202b50] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {creating && (
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {creating
                    ? "Creating..."
                    : "Create Student"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

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
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50">
        {icon}
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