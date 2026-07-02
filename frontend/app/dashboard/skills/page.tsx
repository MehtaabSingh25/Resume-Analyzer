"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getResumes, type ResumeRecord } from "@/lib/api";

export default function SkillsPage() {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getResumes()
      .then((result) => setResumes(result.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load skills"))
      .finally(() => setLoading(false));
  }, []);

  const latestAnalysis = resumes.find((resume) => resume.analysis)?.analysis;
  const missingSkills = latestAnalysis?.missingSkills ?? [];
  const strengths = latestAnalysis?.strengths ?? [];

  return (
    <>
      <PageHeader
        title="Skill Gap Analysis"
        description="Review strengths and missing skills found in your latest resume analysis."
      />

      {loading ? (
        <EmptyState title="Loading skills" description="Fetching your skill analysis." />
      ) : error ? (
        <EmptyState title="Could not load skills" description={error} />
      ) : !latestAnalysis ? (
        <EmptyState
          title="No skill analysis yet"
          description="Upload and analyze a resume first. Missing skills and strengths will appear here."
          actionHref="/dashboard/upload"
          actionLabel="Upload Resume"
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <SkillPanel title="Strength Signals From Resume" items={strengths} />
          <SkillPanel title="Missing Skills" items={missingSkills} />
        </div>
      )}
    </>
  );
}

function SkillPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="font-semibold text-zinc-950 dark:text-zinc-50">{title}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <span key={item} className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
              {item}
            </span>
          ))
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">No items found.</p>
        )}
      </div>
    </div>
  );
}
