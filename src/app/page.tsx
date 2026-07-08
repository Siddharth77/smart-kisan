"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Card, PageShell } from "@/components/ui";

const flow = [
  { step: "1", label: "Register plot", href: "/farmer/register" },
  { step: "2", label: "Get crop advice", href: "/farmer/recommend" },
  { step: "3", label: "Dry-spell alert", href: "/farmer/inbox" },
  { step: "4", label: "Photo diagnosis", href: "/farmer/diagnose" },
  { step: "5", label: "RSK expert queue", href: "/rsk" },
];

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function startQuickDemo() {
    setLoading(true);
    const res = await fetch("/api/demo/reset", { method: "POST" });
    const data = await res.json();
    sessionStorage.setItem("farmerId", data.farmer.id);
    sessionStorage.setItem("plotId", data.farmer.plots[0].id);
    router.push("/farmer/recommend");
  }

  return (
    <PageShell
      title="Kisan Alert"
      subtitle="Voice & SMS agricultural intelligence for small farmers — local MVP"
    >
      <Card>
        <p className="text-emerald-800">
          Data-driven crop recommendations, dry-spell alerts, and crop health
          logging with Rythu Seva Kendra follow-up. Built for Warangal district
          demo farmers in Telugu.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={startQuickDemo} disabled={loading}>
            {loading ? "Loading…" : "Quick demo (Lakshmi Devi)"}
          </Button>
          <Link href="/farmer/register">
            <Button variant="secondary">Register new farmer</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary">View dashboard</Button>
          </Link>
        </div>
      </Card>

      <h2 className="mt-8 text-lg font-semibold text-emerald-900">Demo flow</h2>
      <ol className="mt-3 space-y-2">
        {flow.map((item) => (
          <li key={item.step}>
            <Link
              href={item.href}
              className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-white px-4 py-3 text-emerald-800 hover:bg-emerald-50"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                {item.step}
              </span>
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
