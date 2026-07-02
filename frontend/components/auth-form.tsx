"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authenticate } from "@/lib/api";

type AuthMode = "login" | "register";

const copy = {
  login: {
    title: "Welcome back",
    description: "Log in to upload resumes and view stored analysis results.",
    button: "Login",
  },
  register: {
    title: "Create your account",
    description: "Start uploading resumes and tracking your improvements.",
    button: "Register",
  },
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const data = await authenticate(mode, { name, email, password });
      const nestedUser =
        data.user && "user" in data.user ? data.user.user : data.user;
      const token =
        data.token ?? (data.user && "token" in data.user ? data.user.token : null);

      if (token) localStorage.setItem("resume_ai_token", token);
      if (nestedUser) {
        localStorage.setItem("resume_ai_user", JSON.stringify(nestedUser));
      }

      router.push("/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm md:grid-cols-[1fr_0.9fr] dark:border-zinc-800 dark:bg-zinc-900">
          <div className="hidden bg-zinc-950 p-10 text-white md:flex md:flex-col md:justify-between">
            <Link href="/" className="text-lg font-semibold">
              ResumeAI
            </Link>
            <div>
              <p className="max-w-sm text-3xl font-semibold tracking-tight">
                Your resume reviews and progress in one focused dashboard.
              </p>
              <p className="mt-4 text-zinc-300">
                Upload, review, compare, and improve your resume before you
                apply.
              </p>
            </div>
            <p className="text-sm text-zinc-300">
              Sign in to continue your resume improvement workflow.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <Link href="/" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Back to home
            </Link>
            <div className="mt-10">
              <h1 className="text-3xl font-semibold tracking-tight">
                {copy[mode].title}
              </h1>
              <p className="mt-3 text-zinc-700 dark:text-zinc-300">
                {copy[mode].description}
              </p>
            </div>

            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              {mode === "register" ? (
                <label className="block">
                  <span className="text-sm font-medium">Name</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    minLength={3}
                    className="mt-2 h-12 w-full rounded-lg border border-zinc-200 bg-white px-4 outline-none focus:border-zinc-950 dark:border-zinc-800 dark:bg-zinc-950"
                    placeholder="You"
                  />
                </label>
              ) : null}

              <label className="block">
                <span className="text-sm font-medium">Email</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  type="email"
                  className="mt-2 h-12 w-full rounded-lg border border-zinc-200 bg-white px-4 outline-none focus:border-zinc-950 dark:border-zinc-800 dark:bg-zinc-950"
                  placeholder="you@example.com"
                />
              </label>

                <label className="block">
                  <span className="text-sm font-medium">Password</span>
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={6}
                    type="password"
                    className="mt-2 h-12 w-full rounded-lg border border-zinc-200 bg-white px-4 outline-none focus:border-zinc-950 dark:border-zinc-800 dark:bg-zinc-950"
                    placeholder="Minimum 6 characters"
                  />
                </label>

              <button
                disabled={loading}
                className="h-12 w-full rounded-lg bg-zinc-950 px-5 font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                {loading ? "Please wait..." : copy[mode].button}
              </button>
            </form>

            {message ? (
              <p className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                {message}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-700 dark:text-zinc-300">
              {mode !== "login" ? <Link href="/login">Login</Link> : null}
              {mode !== "register" ? <Link href="/register">Register</Link> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
