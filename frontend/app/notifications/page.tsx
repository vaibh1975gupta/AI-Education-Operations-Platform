"use client";

import { useEffect, useMemo, useState } from "react";

type Notification = {
  id: string;
  user_id?: string;
  issue_id?: string;
  message: string;
  type?: string;
  is_read?: boolean;
  created_at?: string;
};

const API_URL =
  "https://ai-education-operations-platform.onrender.com";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/notifications/`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const result = await response.json();

      setNotifications(result.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load notifications");
    } finally {
      setLoading(false);
    }
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const readCount = notifications.filter(
    (notification) => notification.is_read
  ).length;

  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    if (typeFilter !== "all") {
      result = result.filter(
        (notification) =>
          notification.type?.toLowerCase() ===
          typeFilter.toLowerCase()
      );
    }

    if (statusFilter === "unread") {
      result = result.filter(
        (notification) => !notification.is_read
      );
    }

    if (statusFilter === "read") {
      result = result.filter(
        (notification) => notification.is_read
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(
        a.created_at || 0
      ).getTime();

      const dateB = new Date(
        b.created_at || 0
      ).getTime();

      return sortOrder === "latest"
        ? dateB - dateA
        : dateA - dateB;
    });

    return result;
  }, [
    notifications,
    typeFilter,
    statusFilter,
    sortOrder,
  ]);

  const notificationTypes = useMemo(() => {
    return Array.from(
      new Set(
        notifications
          .map((notification) =>
            notification.type?.toLowerCase()
          )
          .filter(Boolean)
      )
    );
  }, [notifications]);

  function getTypeStyle(type?: string) {
    switch (type?.toLowerCase()) {
      case "warning":
        return "bg-amber-50 text-amber-700 border-amber-100";

      case "success":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";

      case "error":
        return "bg-red-50 text-red-700 border-red-100";

      case "ai":
        return "bg-purple-50 text-purple-700 border-purple-100";

      default:
        return "bg-cyan-50 text-cyan-700 border-cyan-100";
    }
  }

  function getTypeIcon(type?: string) {
    switch (type?.toLowerCase()) {
      case "warning":
        return "!";
      case "success":
        return "✓";
      case "error":
        return "×";
      case "ai":
        return "✦";
      default:
        return "🔔";
    }
  }

  function formatDate(date?: string) {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function clearFilters() {
    setTypeFilter("all");
    setStatusFilter("all");
    setSortOrder("latest");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= HEADER ================= */}

      <header className="border-b border-slate-200 bg-white px-8 py-5">
        <div className="flex items-center justify-between">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-500">
              Operations
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Notifications
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor alerts, updates, and automated operations activity.
            </p>
          </div>

          <div className="hidden items-center gap-3 md:flex">

            <div className="flex h-11 w-72 items-center rounded-xl bg-slate-100 px-4">
              <span className="mr-3 text-slate-400">
                🔍
              </span>

              <span className="text-sm text-slate-400">
                Search notifications...
              </span>
            </div>

            <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white">
              🔔

              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 font-bold text-white">
                VG
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Admin
                </p>

                <p className="text-xs text-slate-400">
                  Operations
                </p>
              </div>

            </div>
          </div>
        </div>
      </header>


      {/* ================= MAIN ================= */}

      <main className="p-8">

        {/* Page intro */}

        <div className="mb-7 flex items-end justify-between">

          <div>
            <p className="text-sm text-slate-500">
              Education Operations
            </p>

            <h2 className="mt-1 text-4xl font-bold tracking-tight">
              Notification Center
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Stay informed about student issues, tasks, and AI-powered activities.
            </p>
          </div>

          <button
            onClick={fetchNotifications}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            ↻ Refresh
          </button>

        </div>


        {/* ================= STATS ================= */}

        <div className="mb-6 grid gap-5 md:grid-cols-3">

          {/* Total */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Total Notifications
                </p>

                <p className="mt-2 text-4xl font-bold">
                  {notifications.length}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  All system notifications
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-xl text-cyan-600">
                🔔
              </div>

            </div>

            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live
            </div>

          </div>


          {/* Unread */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Unread
                </p>

                <p className="mt-2 text-4xl font-bold">
                  {unreadCount}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Require your attention
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-xl font-bold text-amber-600">
                !
              </div>

            </div>

            <div className="mt-5 text-xs font-semibold text-amber-600">
              {unreadCount > 0
                ? "Action required"
                : "All caught up"}
            </div>

          </div>


          {/* Read */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Read
                </p>

                <p className="mt-2 text-4xl font-bold">
                  {readCount}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Already viewed
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl font-bold text-emerald-600">
                ✓
              </div>

            </div>

            <div className="mt-5 text-xs font-semibold text-emerald-600">
              Up to date
            </div>

          </div>

        </div>


        {/* ================= FILTERS ================= */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h3 className="text-lg font-semibold">
                Notification Filters
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Filter notifications by type or status.
              </p>
            </div>

            <button
              onClick={clearFilters}
              className="text-sm font-semibold text-cyan-600 hover:text-cyan-700"
            >
              Clear Filters
            </button>

          </div>


          <div className="grid gap-4 md:grid-cols-3">

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value)
              }
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-cyan-400"
            >
              <option value="all">
                All Types
              </option>

              {notificationTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() +
                    type.slice(1)}
                </option>
              ))}
            </select>


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

              <option value="unread">
                Unread
              </option>

              <option value="read">
                Read
              </option>
            </select>


            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value)
              }
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-cyan-400"
            >
              <option value="latest">
                Latest First
              </option>

              <option value="oldest">
                Oldest First
              </option>
            </select>

          </div>

        </div>


        {/* ================= NOTIFICATION CENTER ================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

            <div>
              <h3 className="text-lg font-semibold">
                Notification Activity
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Live notification data from FastAPI + Supabase.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {filteredNotifications.length} notifications
            </span>

          </div>


          {/* Loading */}

          {loading && (
            <div className="px-6 py-24 text-center">

              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-500" />

              <p className="mt-4 text-sm text-slate-500">
                Loading notifications...
              </p>

            </div>
          )}


          {/* Error */}

          {!loading && error && (
            <div className="px-6 py-24 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-500">
                !
              </div>

              <h3 className="mt-4 font-semibold">
                Unable to load notifications
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                The notification service could not be reached.
              </p>

              <button
                onClick={fetchNotifications}
                className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Try Again
              </button>

            </div>
          )}


          {/* Empty */}

          {!loading &&
            !error &&
            filteredNotifications.length === 0 && (
              <div className="px-6 py-24 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-2xl">
                  🔔
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  No notifications found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  {notifications.length === 0
                    ? "Notifications will appear here when new updates, alerts, or AI-generated activities are created."
                    : "No notifications match the selected filters."}
                </p>

                <button
                  onClick={
                    notifications.length === 0
                      ? fetchNotifications
                      : clearFilters
                  }
                  className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  {notifications.length === 0
                    ? "↻ Refresh"
                    : "Clear Filters"}
                </button>

              </div>
            )}


          {/* Notifications */}

          {!loading &&
            !error &&
            filteredNotifications.length > 0 && (

              <div className="divide-y divide-slate-100">

                {filteredNotifications.map(
                  (notification) => (

                    <div
                      key={notification.id}
                      className={`px-6 py-5 transition hover:bg-slate-50 ${
                        !notification.is_read
                          ? "bg-cyan-50/20"
                          : ""
                      }`}
                    >

                      <div className="flex gap-4">

                        {/* Icon */}

                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-lg font-bold ${getTypeStyle(
                            notification.type
                          )}`}
                        >
                          {getTypeIcon(
                            notification.type
                          )}
                        </div>


                        {/* Content */}

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getTypeStyle(
                                notification.type
                              )}`}
                            >
                              {notification.type ||
                                "info"}
                            </span>

                            {!notification.is_read && (
                              <span className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600">
                                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                                Unread
                              </span>
                            )}

                          </div>


                          <p className="mt-3 text-sm font-medium leading-6 text-slate-800">
                            {notification.message}
                          </p>


                          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">

                            <span>
                              {formatDate(
                                notification.created_at
                              )}
                            </span>

                            {notification.issue_id && (
                              <span className="font-mono">
                                Issue:{" "}
                                {notification.issue_id.slice(
                                  0,
                                  8
                                )}
                                ...
                              </span>
                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>
            )}

        </div>


        {/* ================= BACKEND STATUS ================= */}

        <div className="mt-5 flex items-center justify-between">

          <div className="flex items-center gap-2 text-sm text-slate-400">

            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            Connected to FastAPI backend

          </div>

          <div className="hidden text-xs text-slate-400 md:block">
            EduOps AI • Education Operations Platform
          </div>

        </div>

      </main>
    </div>
  );
}