"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DemoStepNav } from "@/components/DemoStepNav";
import { Button, Card, PageShell } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/farmers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        phone: form.get("phone"),
        village: form.get("village"),
        acres: form.get("acres"),
      }),
    });

    if (!res.ok) {
      setError("Registration failed");
      setLoading(false);
      return;
    }

    const farmer = await res.json();
    sessionStorage.setItem("farmerId", farmer.id);
    sessionStorage.setItem("plotId", farmer.plots[0].id);
    router.push("/farmer/recommend");
  }

  return (
    <PageShell
      title="Farmer registration"
      subtitle="Register a plot to get crop recommendations"
    >
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Name" name="name" defaultValue="Lakshmi Devi" />
          <Field label="Phone" name="phone" defaultValue="9876543210" />
          <Field label="Village" name="village" defaultValue="Hanamkonda" />
          <Field label="Acres" name="acres" type="number" defaultValue="2" step="0.5" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Register & continue"}
          </Button>
        </form>
      </Card>
      <DemoStepNav current={1} />
    </PageShell>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  step,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  step?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-emerald-900">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        step={step}
        required
        className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2"
      />
    </label>
  );
}
