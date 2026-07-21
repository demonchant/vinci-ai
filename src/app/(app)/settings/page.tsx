"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { signOut } from "@/services/authClient";
import { useRouter } from "next/navigation";

interface SettingsState {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketAlerts: boolean;
  memoryEnabled: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsState | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data.settings));
  }, []);

  async function toggle(key: keyof SettingsState) {
    if (!settings) return;
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {settings && (
        <div className="mt-8 max-w-lg space-y-2">
          <ToggleRow label="Email notifications" checked={settings.emailNotifications} onChange={() => toggle("emailNotifications")} />
          <ToggleRow label="Push notifications" checked={settings.pushNotifications} onChange={() => toggle("pushNotifications")} />
          <ToggleRow label="Market alerts" checked={settings.marketAlerts} onChange={() => toggle("marketAlerts")} />
          <ToggleRow label="Collector Memory enabled" checked={settings.memoryEnabled} onChange={() => toggle("memoryEnabled")} />
        </div>
      )}

      <button
        onClick={handleSignOut}
        className="mt-10 rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
      >
        Sign out
      </button>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between glass rounded-xl p-4">
      <span className="text-sm">{label}</span>
      <button
        onClick={onChange}
        className={`h-6 w-11 rounded-full transition ${checked ? "bg-primary" : "bg-white/10"}`}
      >
        <span
          className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}
