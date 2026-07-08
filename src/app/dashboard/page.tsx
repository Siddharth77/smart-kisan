import Image from "next/image";
import rainfall from "@/lib/seed-data/rainfall_warangal.json";
import { Card, PageShell } from "@/components/ui";

export default function DashboardPage() {
  return (
    <PageShell
      title="Farm dashboard"
      subtitle="Soil, rainfall & satellite layers for Warangal"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="font-semibold text-emerald-900">Rainfall (Warangal)</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Annual average" value={`${rainfall.annualRainfallMm} mm`} />
            <Row label="Kharif normal" value={`${rainfall.kharifNormalMm} mm`} />
            <Row label="Current season" value={`${rainfall.currentSeasonMm} mm`} />
            <Row label="10-year avg" value={`${rainfall.tenYearAverageMm} mm`} />
          </dl>
        </Card>
        <Card>
          <h2 className="font-semibold text-emerald-900">Soil & water</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Hanamkonda soil" value="Red loam" />
            <Row label="Groundwater" value="Medium depth" />
            <Row label="Season" value="Kharif" />
          </dl>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="font-semibold text-emerald-900">Satellite view (demo)</h2>
        <Image
          src="/maps/warangal-ndvi.svg"
          alt="Warangal NDVI map"
          width={800}
          height={400}
          className="mt-3 w-full rounded-lg border border-emerald-100"
        />
      </Card>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-emerald-700">{label}</dt>
      <dd className="font-medium text-emerald-900">{value}</dd>
    </div>
  );
}
