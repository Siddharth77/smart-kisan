"use client";

import Image from "next/image";
import { useState } from "react";
import { DEMO_IMAGES } from "@/lib/diagnosis-engine";
import { DemoStepNav } from "@/components/DemoStepNav";
import { Button, Card, PageShell } from "@/components/ui";

const DEMO_FILES = ["leaf_spot.svg", "healthy.svg", "nutrient_def.svg"];

export default function DiagnosePage() {
  const [selected, setSelected] = useState(DEMO_FILES[0]);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  async function diagnose() {
    const farmerId = sessionStorage.getItem("farmerId");
    if (!farmerId) {
      alert("Register a farmer first");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ farmerId, imageFilename: selected }),
    });
    setResult(await res.json());
    setLoading(false);
  }

  return (
    <PageShell
      title="Crop health check"
      subtitle="Demo photo diagnosis (rules-based mock)"
    >
      <Card>
        <p className="mb-4 text-sm text-emerald-700">
          Select a demo crop image. Low confidence (&lt;80%) creates an RSK ticket.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {DEMO_FILES.map((file) => (
            <button
              key={file}
              type="button"
              onClick={() => setSelected(file)}
              className={`rounded-lg border p-2 transition ${
                selected === file
                  ? "border-emerald-600 ring-2 ring-emerald-200"
                  : "border-emerald-100"
              }`}
            >
              <Image
                src={`/demo-crops/${file}`}
                alt={file}
                width={120}
                height={90}
                className="mx-auto h-20 w-full object-contain"
              />
              <p className="mt-1 truncate text-xs">{file.replace(".svg", "")}</p>
            </button>
          ))}
        </div>
        <Button className="mt-4" onClick={diagnose} disabled={loading}>
          {loading ? "Diagnosing…" : "Run diagnosis"}
        </Button>
      </Card>

      {result && (
        <Card className="mt-4">
          <h2 className="font-semibold text-emerald-900">{String(result.disease)}</h2>
          <p className="mt-1 text-sm">
            Confidence: {(Number(result.confidence) * 100).toFixed(0)}%
          </p>
          <p className="mt-2 text-sm">{String(result.action)}</p>
          <p className="mt-1 text-sm text-emerald-700">{String(result.actionTe)}</p>
          {result.ticket != null && (
            <p className="mt-3 rounded bg-amber-50 p-2 text-sm text-amber-800">
              RSK ticket created — check the expert queue.
            </p>
          )}
        </Card>
      )}

      <p className="mt-4 text-xs text-emerald-600">
        Available demo images: {DEMO_IMAGES.join(", ")}
      </p>
      <DemoStepNav current={4} />
    </PageShell>
  );
}
