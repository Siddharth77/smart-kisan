import Link from "next/link";
import { Button } from "@/components/ui";

export const DEMO_STEPS = [
  { step: 1, label: "Register", href: "/farmer/register" },
  { step: 2, label: "Crop advice", href: "/farmer/recommend" },
  { step: 3, label: "Alerts", href: "/farmer/inbox" },
  { step: 4, label: "Diagnose", href: "/farmer/diagnose" },
  { step: 5, label: "RSK queue", href: "/rsk" },
] as const;

export function DemoStepNav({ current }: { current: number }) {
  const prev = DEMO_STEPS.find((s) => s.step === current - 1);
  const next = DEMO_STEPS.find((s) => s.step === current + 1);

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-100 pt-6">
      <div className="flex gap-1">
        {DEMO_STEPS.map((s) => (
          <span
            key={s.step}
            className={`h-2 w-6 rounded-full ${
              s.step === current
                ? "bg-emerald-600"
                : s.step < current
                  ? "bg-emerald-300"
                  : "bg-emerald-100"
            }`}
            title={s.label}
          />
        ))}
      </div>
      <div className="flex gap-2">
        {prev && (
          <Link href={prev.href}>
            <Button variant="secondary">← {prev.label}</Button>
          </Link>
        )}
        {next && (
          <Link href={next.href}>
            <Button>Next: {next.label} →</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
