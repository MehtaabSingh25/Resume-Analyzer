"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getResumes, type ResumeRecord } from "@/lib/api";

export default function NotificationsPage() {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getResumes()
      .then((result) => setResumes(result.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load notifications"))
      .finally(() => setLoading(false));
  }, []);

  const notifications = resumes.flatMap((resume) => [
    {
      title: "Resume uploaded",
      detail: resume.title,
      date: resume.createdAt,
    },
    ...(resume.analysis
      ? [
          {
            title: "Resume analyzed",
            detail: `Overall ${resume.analysis.overallScore}/100 · ATS ${resume.analysis.atsScore}%`,
            date: resume.analysis.createdAt ?? resume.updatedAt,
          },
        ]
      : []),
  ]);

  return (
    <>
      <PageHeader
        title="Notifications"
        description="See recent resume upload and analysis activity."
      />

      {loading ? (
        <EmptyState title="Loading notifications" description="Fetching resume activity from MongoDB." />
      ) : error ? (
        <EmptyState title="Could not load notifications" description={error} />
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="Upload and analyze resumes to create real activity notifications."
          actionHref="/dashboard/upload"
          actionLabel="Upload Resume"
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={`${notification.title}-${notification.date}`} className="flex gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                <Bell size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-zinc-950 dark:text-zinc-50">{notification.title}</h2>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{notification.detail}</p>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                  {new Date(notification.date).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
