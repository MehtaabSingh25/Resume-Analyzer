"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ResumeAnalysis, ResumeRecord } from "@/lib/api";

type ScorePoint = {
  label: string;
  resume: number;
  ats: number;
};

const axisColor = "#a1a1aa";
const gridColor = "#3f3f46";

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
        {title}
      </h3>
      <div className="mt-4 h-72">{children}</div>
    </div>
  );
}

function tooltipStyle() {
  return {
    background: "#18181b",
    border: "1px solid #3f3f46",
    borderRadius: "8px",
    color: "#fafafa",
  };
}

export function buildScoreTrend(resumes: ResumeRecord[]): ScorePoint[] {
  return resumes
    .filter((resume) => resume.analysis)
    .slice()
    .reverse()
    .map((resume) => ({
      label: new Date(resume.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      resume: resume.analysis?.overallScore ?? 0,
      ats: resume.analysis?.atsScore ?? 0,
    }));
}

export function ProgressTrendChart({ data }: { data: ScorePoint[] }) {
  return (
    <ChartCard title="Resume and ATS Progress">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} stroke={axisColor} />
          <YAxis tickLine={false} axisLine={false} stroke={axisColor} domain={[0, 100]} />
          <Tooltip contentStyle={tooltipStyle()} />
          <Area
            type="monotone"
            dataKey="resume"
            stroke="#fafafa"
            fill="#52525b"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="ats"
            stroke="#a1a1aa"
            fill="#71717a"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function AnalysisBarChart({ analysis }: { analysis: ResumeAnalysis }) {
  const data = [
    { label: "Overall", score: analysis.overallScore },
    { label: "ATS", score: analysis.atsScore },
  ];

  return (
    <ChartCard title="Analysis Scores">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} stroke={axisColor} />
          <YAxis tickLine={false} axisLine={false} stroke={axisColor} domain={[0, 100]} />
          <Tooltip contentStyle={tooltipStyle()} />
          <Bar dataKey="score" fill="#fafafa" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function KeywordCountChart({ analysis }: { analysis: ResumeAnalysis }) {
  const data = [
    { label: "Strengths", count: analysis.strengths.length },
    { label: "Weaknesses", count: analysis.weaknesses.length },
    { label: "Missing", count: analysis.missingSkills.length },
    { label: "Suggestions", count: analysis.suggestions.length },
  ];

  return (
    <ChartCard title="Feedback Breakdown">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} stroke={axisColor} />
          <YAxis tickLine={false} axisLine={false} stroke={axisColor} />
          <Tooltip contentStyle={tooltipStyle()} />
          <Bar dataKey="count" fill="#a1a1aa" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
