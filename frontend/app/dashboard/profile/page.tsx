"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getCurrentUser, type User } from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCurrentUser()
      .then((result) => setUser(result.user))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const initials =
    user?.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  return (
    <>
      <PageHeader
        title="Profile"
        description="View your account details and basic profile information."
      />

      {loading ? (
        <EmptyState title="Loading profile" description="Fetching current user from the backend." />
      ) : error ? (
        <EmptyState title="Could not load profile" description={error} />
      ) : !user ? (
        <EmptyState title="No user found" description="Please login again." actionHref="/login" actionLabel="Login" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="rounded-lg border border-zinc-200 bg-white p-5 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-zinc-950 text-3xl font-semibold text-white dark:bg-white dark:text-zinc-950">
              {initials}
            </div>
            <p className="mt-5 font-semibold text-zinc-950 dark:text-zinc-50">
              {user.name}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="grid gap-4 md:grid-cols-2">
              <ReadOnlyField label="Name" value={user.name} />
              <ReadOnlyField label="Email" value={user.email} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label>
      <span className="text-sm font-medium text-zinc-950 dark:text-zinc-50">{label}</span>
      <input
        value={value}
        readOnly
        className="mt-2 h-12 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
      />
    </label>
  );
}
