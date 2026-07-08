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
    const formEl = e.currentTarget;
    setLoading(true);
    setError("");

    try {
      const form = new FormData(formEl);
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

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }

      sessionStorage.setItem("farmerId", data.id);
      sessionStorage.setItem("plotId", data.plots[0].id);
      router.push("/farmer/recommend");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell title="Farmer registration" subtitle="Register your plot">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Name" name="name" defaultValue="Lakshmi Devi" />
          <Field label="Phone" name="phone" defaultValue="9876543210" />
          <Field label="Village" name="village" defaultValue="Hanamkonda" />
          <Field label="Acres" name="acres" type="number" defaultValue="2" step="0.5" min="0.5" />
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
  min,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  step?: string;
  min?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-emerald-900">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        step={step}
        min={min}
        required
        className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2"
      />
    </label>
  );
}
