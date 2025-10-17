import { Hammer } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 select-none">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--orange-base)] text-white shadow-sm">
        <Hammer className="h-5 w-5" />
      </span>
      <span className="font-extrabold tracking-tight text-xl" style={{ color: "var(--text-primary)" }}>
        LOGOVIT <span className="text-[var(--orange-base)]">YAPI</span> MARKET
      </span>
    </div>
  );
}
