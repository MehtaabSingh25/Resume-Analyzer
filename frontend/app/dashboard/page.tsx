"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, FileText, Gauge, Sparkles, Upload } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { buildScoreTrend, ProgressTrendChart } from "@/components/charts";
import { getResumes, type ResumeRecord } from "@/lib/api";

export default function DashboardPage() {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getResumes()
      .then((result) => setResumes(result.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const analyzed = resumes.filter((resume) => resume.analysis);
  const latest = resumes[0];
  const averageResumeScore = analyzed.length
    ? Math.round(
        analyzed.reduce(
          (total, resume) => total + (resume.analysis?.overallScore ?? 0),
          0,
        ) / analyzed.length,
      )
    : 0;
  const averageAtsScore = analyzed.length
    ? Math.round(
        analyzed.reduce(
          (total, resume) => total + (resume.analysis?.atsScore ?? 0),
          0,
        ) / analyzed.length,
      )
    : 0;
  const trend = useMemo(() => buildScoreTrend(resumes), [resumes]);

  const stats = [
    {
      title: "Average Resume Score",
      value: String(averageResumeScore),
      suffix: "/100",
      note: analyzed.length ? "" : "No analysis yet",
      icon: Sparkles,
    },
    {
      title: "Average ATS Score",
      value: String(averageAtsScore),
      suffix: "%",
      note: analyzed.length ? "" : "No analysis yet",
      icon: Gauge,
    },
    {
      title: "Total Resumes",
      value: String(resumes.length),
      suffix: "",
      note: "",
      icon: FileText,
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Track your resume scores, uploaded versions, and recent progress in one place."
      />

      {loading ? (
        <EmptyState title="Loading dashboard" description="Fetching your real resume records from the backend." />
      ) : error ? (
        <EmptyState title="Could not load dashboard" description={error} />
      ) : resumes.length === 0 ? (
        <EmptyState
          title="No resumes uploaded yet"
          description="Upload your first PDF resume. It will be stored through your backend and analyzed by Gemini."
          actionHref="/dashboard/upload"
          actionLabel="Upload Resume"
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.75fr]">
            {trend.length ? (
              <ProgressTrendChart data={trend} />
            ) : (
              <EmptyState
                title="No analysis chart yet"
                description="Upload and analyze a resume to build a real progress chart."
              />
            )}

            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="font-semibold text-zinc-950 dark:text-zinc-50">
                Quick Actions
              </h2>
              <div className="mt-4 grid gap-3">
                <Link
                  href="/dashboard/upload"
                  className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-950"
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <Upload size={18} />
                    Upload Resume
                  </span>
                  <ArrowRight size={16} />
                </Link>
                {latest ? (
                  <Link
                    href={`/dashboard/analysis/${latest._id}`}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-950"
                  >
                    <span className="flex items-center gap-3 text-sm font-medium">
                      <FileText size={18} />
                      Open Latest Analysis
                    </span>
                    <ArrowRight size={16} />
                  </Link>
                ) : null}
              </div>

              {latest ? (
                <div className="mt-8 rounded-lg bg-zinc-50 p-4 text-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
                  <p className="font-medium">{latest.title}</p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                    {latest.analysis
                      ? `Resume ${latest.analysis.overallScore}/100 · ATS ${latest.analysis.atsScore}%`
                      : "Uploaded, not analyzed yet"}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </>
  );
}
