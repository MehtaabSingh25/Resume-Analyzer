"use client";

import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getResumes, type ResumeRecord } from "@/lib/api";

export default function ComparePage() {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getResumes()
      .then((result) => {
        const analyzed = result.data.filter((resume) => resume.analysis);
        setResumes(analyzed);
        setFirst(analyzed[0]?._id ?? "");
        setSecond(analyzed[1]?._id ?? analyzed[0]?._id ?? "");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load resumes"))
      .finally(() => setLoading(false));
  }, []);

  const a = resumes.find((resume) => resume._id === first) ?? null;
  const b = resumes.find((resume) => resume._id === second) ?? null;

  const added = useMemo(() => {
    const firstSkills = a?.analysis?.missingSkills ?? [];
    const secondSkills = b?.analysis?.missingSkills ?? [];
    return firstSkills.filter((skill) => !secondSkills.includes(skill));
  }, [a, b]);

  const removed = useMemo(() => {
    const firstSkills = a?.analysis?.missingSkills ?? [];
    const secondSkills = b?.analysis?.missingSkills ?? [];
    return secondSkills.filter((skill) => !firstSkills.includes(skill));
  }, [a, b]);

  return (
    <>
      <PageHeader
        title="Resume Comparison"
        description="Compare two analyzed resumes to see score differences and skill-gap changes."
      />

      {loading ? (
        <EmptyState title="Loading analyzed resumes" description="Fetching MongoDB resume analysis records." />
      ) : error ? (
        <EmptyState title="Could not compare resumes" description={error} />
      ) : resumes.length < 2 ? (
        <EmptyState
          title="Need two analyzed resumes"
          description="Upload and analyze at least two resumes before comparison can use real stored data."
          actionHref="/dashboard/upload"
          actionLabel="Upload Resume"
        />
      ) : a && b ? (
        <>
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
            {[{ label: "Resume A", value: first, set: setFirst }, { label: "Resume B", value: second, set: setSecond }].map(
              (picker, index) => (
                <div key={picker.label} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">{picker.label}</label>
                  <select
                    value={picker.value}
                    onChange={(event) => picker.set(event.target.value)}
                    className="mt-3 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                  >
                    {resumes.map((resume) => (
                      <option key={resume._id} value={resume._id}>{resume.title}</option>
                    ))}
                  </select>
                  <p className="mt-5 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
                    {index === 0 ? a.analysis?.atsScore : b.analysis?.atsScore}% ATS
                  </p>
                </div>
              ),
            )}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-600 dark:text-zinc-300">ATS Difference</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
                {(b.analysis?.atsScore ?? 0) - (a.analysis?.atsScore ?? 0) > 0 ? "+" : ""}
                {(b.analysis?.atsScore ?? 0) - (a.analysis?.atsScore ?? 0)}%
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="font-semibold text-zinc-950 dark:text-zinc-50">Missing Skills Improved</p>
              <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">{added.join(", ") || "No improvement detected"}</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="font-semibold text-zinc-950 dark:text-zinc-50">New Missing Skills</p>
              <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">{removed.join(", ") || "No new missing skills"}</p>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
