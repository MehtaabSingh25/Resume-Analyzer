"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getResumes, type ResumeRecord } from "@/lib/api";

export default function RoadmapPage() {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getResumes()
      .then((result) => setResumes(result.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load roadmap"))
      .finally(() => setLoading(false));
  }, []);

  const latest = resumes.find((resume) => resume.analysis);
  const missingSkills = latest?.analysis?.missingSkills ?? [];

  return (
    <>
      <PageHeader
        title="Career Roadmap"
        description="Turn missing skills into focused next steps for improving your resume and career readiness."
      />

      {loading ? (
        <EmptyState title="Loading roadmap" description="Fetching your roadmap." />
      ) : error ? (
        <EmptyState title="Could not load roadmap" description={error} />
      ) : !latest ? (
        <EmptyState
          title="No roadmap yet"
          description="Analyze a resume first so your roadmap can be created from missing skills."
          actionHref="/dashboard/upload"
          actionLabel="Upload Resume"
        />
      ) : missingSkills.length === 0 ? (
        <EmptyState title="No missing skills found" description="Your latest resume analysis did not return any missing skills." />
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {missingSkills.map((skill, index) => (
              <div key={skill} className="rounded-lg bg-zinc-50 p-5 dark:bg-zinc-950">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-zinc-950 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">
                    {index + 1}
                  </span>
                  <p className="font-semibold text-zinc-950 dark:text-zinc-50">Next Step</p>
                </div>
                <p className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{skill}</p>
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                  Add evidence for this skill in projects, experience, or certifications.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
