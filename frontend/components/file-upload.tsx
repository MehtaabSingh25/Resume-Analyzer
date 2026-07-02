"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FileUp, Loader2, UploadCloud } from "lucide-react";
import { analyzeResume, uploadResume } from "@/lib/api";

export function FileUpload() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  function validate(nextFile: File | undefined) {
    setMessage("");
    if (!nextFile) return;

    if (nextFile.type !== "application/pdf") {
      setMessage("Only PDF files are allowed.");
      return;
    }

    if (nextFile.size > 5 * 1024 * 1024) {
      setMessage("PDF must be 5 MB or smaller.");
      return;
    }

    setFile(nextFile);
  }

  async function startUpload() {
    if (!file) {
      setMessage("Please choose a PDF first.");
      return;
    }

    setUploading(true);
    setProgress(25);

    try {
      const token = localStorage.getItem("resume_ai_token");
      if (!token) throw new Error("Please login before uploading.");

      setProgress(55);
      const result = await uploadResume(file, token, file.name);
      setProgress(75);
      const id = result.data?._id;
      if (!id) throw new Error("Backend did not return a resume id.");
      await analyzeResume(id, token);
      setProgress(95);
      router.push(`/dashboard/analysis/${id}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress((current) => (current >= 90 ? 100 : current));
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <div
        onDrop={(event) => {
          event.preventDefault();
          validate(event.dataTransfer.files[0]);
        }}
        onDragOver={(event) => event.preventDefault()}
        className="grid min-h-80 place-items-center rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
      >
        <div>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            <UploadCloud size={28} />
          </div>
          <h2 className="mt-5 text-xl font-semibold">Drag and drop your PDF</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Maximum file size is 5 MB. PDF files only.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(event) => validate(event.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-6 rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
          >
            Select PDF
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="font-semibold">Upload workflow</h3>
        <div className="mt-5 space-y-4">
          {["Choose PDF", "Upload", "AI Analysis", "Redirect"].map(
            (step, index) => (
              <div key={step} className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-zinc-950 text-xs font-semibold text-white dark:bg-white dark:text-zinc-950">
                  {index + 1}
                </div>
                <span className="text-sm font-medium">{step}</span>
              </div>
            ),
          )}
        </div>

        <div className="mt-8 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-950">
          {file ? (
            <div className="flex items-center gap-3">
              <FileUp size={20} />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-300">No file selected yet.</p>
          )}

          <div className="mt-4 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-2 rounded-full bg-zinc-950 dark:bg-white"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            type="button"
            onClick={startUpload}
            disabled={uploading}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
          >
            {uploading ? <Loader2 className="animate-spin" size={18} /> : null}
            Upload and analyze
          </button>
        </div>

        {message ? (
          <p className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
