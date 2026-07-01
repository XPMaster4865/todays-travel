"use client";
import { useEffect, useState } from "react";

type Entry = { balance: number; timestamp: number };

function formatCurrency(n: number) {
  return `${new Intl.NumberFormat("en-GB").format(n)} points`;
}

export default function FundsBar() {
  const [entry, setEntry] = useState<Entry | null>(null);

  useEffect(() => {
    fetch("/api/funds/list")
      .then((res) => res.json())
      .then((data: { entries: Entry[] }) => setEntry(data.entries?.[0] ?? null))
      .catch(() => {});
  }, []);

  if (!entry) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 rounded-full px-4 py-1.5 text-sm text-[#2dd4bf] mb-6">
      <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-pulse" />
      Company Points: <span className="font-bold">{formatCurrency(entry.balance)}</span>
    </div>
  );
}
