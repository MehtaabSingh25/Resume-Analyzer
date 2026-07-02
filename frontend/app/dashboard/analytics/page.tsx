"use client";

import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { buildScoreTrend, ProgressTrendChart } from "@/components/charts";
import { PageHeader } from "@/components/page-header";
import { getResumes, type ResumeRecord } from "@/lib/api";

export default function AnalyticsPage() {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getResumes()
      .then((result) => setResumes(result.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  const trend = useMemo(() => buildScoreTrend(resumes), [resumes]);
  const analyzed = resumes.filter((resume) => resume.analysis);

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Track score trends and resume improvement across your analyzed versions."
      />

      {loading ? (
        <EmptyState title="Loading analytics" description="Fetching stored resume records from MongoDB." />
      ) : error ? (
        <EmptyState title="Could not load analytics" description={error} />
      ) : trend.length === 0 ? (
        <EmptyState
          title="No analytics yet"
          description="Upload and analyze resumes first. Charts will be created from real stored analysis scores."
          actionHref="/dashboard/upload"
          actionLabel="Upload Resume"
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <ProgressTrendChart data={trend} />
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="font-semibold text-zinc-950 dark:text-zinc-50">Stored Resume Summary</h2>
            <div className="mt-5 space-y-4">
              {[
                ["Uploaded resumes", resumes.length],
                ["Analyzed resumes", analyzed.length],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <div className="flex justify-between text-sm text-zinc-700 dark:text-zinc-300">
                    <span>{label as string}</span>
                    <span>{value as number}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className="h-2 rounded-full bg-zinc-950 dark:bg-white"
                      style={{
                        width: `${Math.min(
                          ((value as number) / Math.max(resumes.length, 1)) * 100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
