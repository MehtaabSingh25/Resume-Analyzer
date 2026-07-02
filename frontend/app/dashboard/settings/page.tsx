"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";

export default function SettingsPage() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("resume_ai_token");
    localStorage.removeItem("resume_ai_user");
    router.push("/login");
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage notifications, password options, account deletion, and logout."
      />

      <div className="grid gap-4">
        <SettingRow
          title="Notifications"
          description="Get alerts for resume uploads and analysis updates."
          action={<input type="checkbox" defaultChecked className="h-5 w-5" />}
        />
        <SettingRow
          title="Password"
          description="Open the reset password flow."
          action={<button className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium dark:border-zinc-800">Change</button>}
        />
        <SettingRow
          title="Logout"
          description="Sign out and return to login."
          action={<button onClick={logout} className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-950">Logout</button>}
        />
        <SettingRow
          title="Delete Account"
          description="Permanent account deletion option."
          action={<button className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 dark:border-red-900">Delete</button>}
        />
      </div>
    </>
  );
}

function SettingRow({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{description}</p>
      </div>
      {action}
    </div>
  );
}
