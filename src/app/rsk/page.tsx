"use client";

import { useCallback, useEffect, useState } from "react";
import { DemoStepNav } from "@/components/DemoStepNav";
import { Button, Card, PageShell } from "@/components/ui";

interface Ticket {
  id: string;
  status: string;
  expertNote: string | null;
  createdAt: string;
  diagnosis: {
    disease: string;
    confidence: number;
    imagePath: string;
    action: string;
  };
}

export default function RSKPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/tickets");
    setTickets(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function resolve(id: string) {
    await fetch("/api/tickets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status: "resolved",
        expertNote: "Advised neem spray + follow-up call completed.",
      }),
    });
    load();
  }

  return (
    <PageShell
      title="Rythu Seva Kendra queue"
      subtitle="Expert follow-up for low-confidence diagnoses"
    >
      <div className="mb-4 flex gap-3">
        <Button variant="secondary" onClick={load}>
          Refresh
        </Button>
        <Button
          variant="secondary"
          onClick={async () => {
            await fetch("/api/demo/reset", { method: "POST" });
            load();
          }}
        >
          Reset demo
        </Button>
      </div>

      {loading ? (
        <p className="text-emerald-700">Loading…</p>
      ) : tickets.length === 0 ? (
        <Card>
          <p className="text-emerald-700">
            No tickets. Run a diagnosis on leaf_spot or nutrient_def to create one.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-emerald-900">
                    {ticket.diagnosis.disease}
                  </h2>
                  <p className="text-sm text-emerald-700">
                    Confidence: {(ticket.diagnosis.confidence * 100).toFixed(0)}%
                  </p>
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${
                    ticket.status === "resolved"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
              <p className="mt-2 text-sm">{ticket.diagnosis.action}</p>
              {ticket.expertNote && (
                <p className="mt-2 text-sm italic text-emerald-600">
                  Expert: {ticket.expertNote}
                </p>
              )}
              {ticket.status !== "resolved" && (
                <Button className="mt-3" onClick={() => resolve(ticket.id)}>
                  Mark resolved
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
      <DemoStepNav current={5} />
    </PageShell>
  );
}
