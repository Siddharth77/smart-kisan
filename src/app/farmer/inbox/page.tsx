"use client";

import { useEffect, useState } from "react";
import { DemoStepNav } from "@/components/DemoStepNav";
import { VoiceAlert } from "@/components/VoiceAlert";
import { Button, Card, PageShell } from "@/components/ui";

interface Alert {
  id: string;
  type: string;
  message: string;
  messageTe: string;
  read: boolean;
  createdAt: string;
}

export default function InboxPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [farmerId, setFarmerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = sessionStorage.getItem("farmerId");
    setFarmerId(id);
    if (id) loadAlerts(id);
  }, []);

  async function loadAlerts(id: string) {
    const res = await fetch(`/api/alerts?farmerId=${id}`);
    setAlerts(await res.json());
  }

  async function triggerDrySpell() {
    setLoading(true);
    const id = farmerId ?? sessionStorage.getItem("farmerId");
    await fetch("/api/alerts/trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ farmerId: id }),
    });
    if (id) await loadAlerts(id);
    setLoading(false);
  }

  return (
    <PageShell
      title="Farmer inbox"
      subtitle="SMS-style alerts in Telugu & English"
    >
      <div className="mb-4 flex gap-3">
        <Button variant="danger" onClick={triggerDrySpell} disabled={loading}>
          {loading ? "Triggering…" : "Simulate dry spell"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => farmerId && loadAlerts(farmerId)}
        >
          Refresh
        </Button>
      </div>

      {alerts.length === 0 ? (
        <Card>
          <p className="text-emerald-700">No alerts yet. Trigger a dry spell to demo.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className={alert.read ? "opacity-60" : ""}>
              <div className="flex items-start justify-between gap-2">
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                  {alert.type}
                </span>
                <time className="text-xs text-emerald-600">
                  {new Date(alert.createdAt).toLocaleString()}
                </time>
              </div>
              <p className="mt-2 text-sm">{alert.message}</p>
              <p className="mt-1 text-sm text-emerald-700">{alert.messageTe}</p>
              <div className="mt-3">
                <VoiceAlert text={alert.messageTe} />
              </div>
            </Card>
          ))}
        </div>
      )}
      <DemoStepNav current={3} />
    </PageShell>
  );
}
