"use client";

import { useCallback, useEffect, useState } from "react";
import cropRules from "@/lib/seed-data/crop_rules.json";
import { DemoStepNav } from "@/components/DemoStepNav";
import { Button, Card, PageShell } from "@/components/ui";
import type { CropName, RecommendationResult } from "@/types";

export default function RecommendPage() {
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [plotId, setPlotId] = useState<string | null>(null);

  const getRecommendation = useCallback(async (id: string) => {
    setLoading(true);
    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plotId: id }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    const id = sessionStorage.getItem("plotId");
    setPlotId(id);
    if (id) getRecommendation(id);
  }, [getRecommendation]);

  return (
    <PageShell
      title="Crop recommendation"
      subtitle="Rules engine using soil, rainfall & groundwater data"
    >
      {!plotId ? (
        <Card>
          <p className="text-emerald-800">
            No plot found.{" "}
            <a href="/farmer/register" className="underline">
              Register first
            </a>
          </p>
        </Card>
      ) : (
        <>
          <Button
            onClick={() => plotId && getRecommendation(plotId)}
            disabled={loading}
          >
            {loading ? "Analyzing…" : "Refresh recommendation"}
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <Card>
                <h2 className="font-semibold text-emerald-900">Top crops</h2>
                <ol className="mt-2 list-decimal pl-5">
                  {result.recommended.map((crop) => {
                    const rule = cropRules[crop as CropName];
                    return (
                      <li key={crop} className="text-emerald-800">
                        {rule.label} ({rule.labelTe}) — risk{" "}
                        {result.riskScores[crop as CropName]}%
                      </li>
                    );
                  })}
                </ol>
              </Card>
              <Card>
                <h2 className="font-semibold text-emerald-900">Reasoning</h2>
                <p className="mt-2 text-sm text-emerald-800">{result.reasoning}</p>
                <p className="mt-2 text-sm text-emerald-700">{result.reasoningTe}</p>
              </Card>
            </div>
          )}
        </>
      )}
      <DemoStepNav current={2} />
    </PageShell>
  );
}
