"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { analyzeResume, deleteResume, getResumes, type ResumeRecord } from "@/lib/api";

export default function HistoryPage() {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadResumes() {
    setLoading(true);
    getResumes()
      .then((result) => setResumes(result.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load resumes"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    void Promise.resolve().then(loadResumes);
  }, []);

  async function removeResume(resumeId: string) {
    await deleteResume(resumeId);
    setResumes((current) => current.filter((resume) => resume._id !== resumeId));
  }

  async function analyzeAgain(resumeId: string) {
    await analyzeResume(resumeId);
    await loadResumes();
  }

  return (
    <>
      <PageHeader
        title="Resume History"
        description="View all uploaded resume versions and open their previous analysis reports."
      />

      {loading ? (
        <EmptyState title="Loading resumes" description="Fetching uploaded resumes from the backend." />
      ) : error ? (
        <EmptyState title="Could not load resumes" description={error} />
      ) : resumes.length === 0 ? (
        <EmptyState
          title="No resume history"
          description="Upload a PDF resume first. It will appear here after MongoDB saves it."
          actionHref="/dashboard/upload"
          actionLabel="Upload Resume"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resumes.map((resume) => (
            <div key={resume._id} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                {resume.title}
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                {new Date(resume.createdAt).toLocaleString()}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950">
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">Resume</p>
                  <p className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                    {resume.analysis?.overallScore ?? "-"}
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950">
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">ATS</p>
                  <p className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                    {resume.analysis ? `${resume.analysis.atsScore}%` : "-"}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href={`/dashboard/analysis/${resume._id}`} className="rounded-lg bg-zinc-950 px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-950">
                  View
                </Link>
                <button onClick={() => analyzeAgain(resume._id)} className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 dark:border-zinc-800 dark:text-zinc-100">
                  <RotateCcw size={15} />
                </button>
                <button onClick={() => removeResume(resume._id)} className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-red-600 dark:border-zinc-800">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
