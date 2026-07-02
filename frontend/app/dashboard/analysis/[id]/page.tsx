"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnalysisBarChart, KeywordCountChart } from "@/components/charts";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { ScoreRing } from "@/components/score-ring";
import {
  analyzeResume,
  getResume,
  type ResumeAnalysis,
  type ResumeRecord,
} from "@/lib/api";

export default function AnalysisPage() {
  const params = useParams<{ id: string }>();
  const resumeId = params.id;
  const [resume, setResume] = useState<ResumeRecord | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void Promise.resolve().then(() => {
      setLoading(true);
      getResume(resumeId)
        .then((result) => {
          setResume(result.data);
          setAnalysis(result.data.analysis);
        })
        .catch((err) =>
          setError(err instanceof Error ? err.message : "Failed to load analysis"),
        )
        .finally(() => setLoading(false));
    });
  }, [resumeId]);

  async function runAnalysis() {
    setAnalyzing(true);
    setError("");

    try {
      const result = await analyzeResume(resumeId);
      setAnalysis(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow={resume?.title ?? "Resume Analysis"}
        title="Resume Analysis"
        description="Review your resume score, ATS score, strengths, weaknesses, missing skills, and improvement suggestions."
      />

      {loading ? (
        <EmptyState title="Loading analysis" description="Fetching this resume and its latest stored analysis." />
      ) : error ? (
        <EmptyState title="Could not load analysis" description={error} />
      ) : !resume ? (
        <EmptyState title="Resume not found" description="This resume does not exist for the current logged-in user." />
      ) : !analysis ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            This resume has not been analyzed yet
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 dark:text-zinc-300">
            Click below to send this resume text to Gemini. The result will be
            saved in MongoDB and shown here.
          </p>
          <button
            onClick={runAnalysis}
            disabled={analyzing}
            className="mt-6 rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
          >
            {analyzing ? "Analyzing..." : "Run Gemini Analysis"}
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-wrap justify-center gap-8">
                <ScoreRing score={analysis.overallScore} label="Overall" />
                <ScoreRing score={analysis.atsScore} label="ATS" />
              </div>
              <p className="mt-6 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {analysis.summary}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Strengths", analysis.strengths],
                ["Weaknesses", analysis.weaknesses],
                ["Missing Skills", analysis.missingSkills],
                ["Suggestions", analysis.suggestions],
              ].map(([title, items]) => (
                <div key={title as string} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <h2 className="font-semibold text-zinc-950 dark:text-zinc-50">
                    {title as string}
                  </h2>
                  <ul className="mt-4 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                    {(items as string[]).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <AnalysisBarChart analysis={analysis} />
            <KeywordCountChart analysis={analysis} />
          </div>
        </>
      )}
    </>
  );
}
