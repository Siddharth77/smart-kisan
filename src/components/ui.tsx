import Link from "next/link";

const links = [
  { href: "/farmer/register", label: "Register", desc: "Create farmer profile" },
  { href: "/farmer/recommend", label: "Crop advice", desc: "Rules-based recommendation" },
  { href: "/dashboard", label: "Dashboard", desc: "Soil, rainfall & map" },
  { href: "/farmer/inbox", label: "Farmer inbox", desc: "SMS-style alerts" },
  { href: "/farmer/diagnose", label: "Diagnose", desc: "Photo crop health check" },
  { href: "/rsk", label: "RSK queue", desc: "Expert follow-up tickets" },
];

export function Nav() {
  return (
    <header className="border-b border-emerald-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-emerald-800">
          Kisan Alert
        </Link>
        <nav className="hidden gap-4 text-sm md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-emerald-700 hover:text-emerald-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-emerald-50/50">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold text-emerald-900">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-emerald-700/80">{subtitle}</p>
        )}
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-emerald-100 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  const styles = {
    primary: "bg-emerald-700 text-white hover:bg-emerald-800",
    secondary: "border border-emerald-200 text-emerald-800 hover:bg-emerald-50",
    danger: "bg-amber-600 text-white hover:bg-amber-700",
  };
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
