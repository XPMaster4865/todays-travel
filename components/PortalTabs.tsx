"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Role = { label: string; colour: string };
type Session = { roles: Role[] };

const BASE_TABS = [
  { label: "Overview", href: "/portal" },
  { label: "Company Funds", href: "/portal/funds" },
  { label: "Shifts", href: "/portal/shifts" },
];

export default function PortalTabs() {
  const pathname = usePathname();
  const [isBuilder, setIsBuilder] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("tt_session");
    if (!stored) return;
    try {
      const session: Session = JSON.parse(stored);
      setIsBuilder(session.roles.some((r) => r.label === "Builder"));
    } catch { /* ignore */ }
  }, [pathname]);

  const tabs = isBuilder ? [...BASE_TABS, { label: "Maintenance", href: "/maintenance" }] : BASE_TABS;

  return (
    <div className="flex gap-2 mb-10 border-b border-purple-900/40 overflow-x-auto">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <a
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              active
                ? "border-[#8b3cf7] text-[#c084fc]"
                : "border-transparent text-[#f0eaff]/40 hover:text-[#f0eaff]/70"
            }`}
          >
            {tab.label}
          </a>
        );
      })}
    </div>
  );
}
