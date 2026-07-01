"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Role = { label: string; colour: string };
type Session = { roles: Role[] };

const MEDIA_ROLES = ["Owner", "Media Team", "Head of Media"];
const ADMIN_ROLES = ["Owner", "Builder"];

const BASE_TABS = [
  { label: "Overview", href: "/portal" },
  { label: "Company Funds", href: "/portal/funds" },
  { label: "Shifts", href: "/portal/shifts" },
  { label: "Route Log", href: "/portal/route-log" },
];

export default function PortalTabs() {
  const pathname = usePathname();
  const [isBuilder, setIsBuilder] = useState(false);
  const [isMedia, setIsMedia] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("tt_session");
    if (!stored) return;
    try {
      const session: Session = JSON.parse(stored);
      setIsBuilder(session.roles.some((r) => r.label === "Builder"));
      setIsMedia(session.roles.some((r) => MEDIA_ROLES.includes(r.label)));
      setIsAdmin(session.roles.some((r) => ADMIN_ROLES.includes(r.label)));
    } catch { /* ignore */ }
  }, [pathname]);

  const tabs = [
    ...BASE_TABS,
    ...(isAdmin ? [{ label: "Driver of the Week", href: "/portal/dotw" }] : []),
    ...(isMedia ? [{ label: "Gallery Upload", href: "/portal/gallery-upload" }] : []),
    ...(isAdmin ? [{ label: "Members", href: "/portal/members" }] : []),
    ...(isBuilder ? [{ label: "Maintenance", href: "/maintenance" }] : []),
  ];

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
