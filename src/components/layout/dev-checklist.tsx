import { getSetupChecklist } from "@/lib/profile";

/** Development-only reminder of personal details that still need filling in. */
export function DevChecklist() {
  if (process.env.NODE_ENV === "production") return null;
  const items = getSetupChecklist();
  if (!items.length) return null;

  return (
    <details className="glass fixed bottom-4 left-4 z-[80] max-w-[19rem] rounded-xl text-xs shadow-card">
      <summary className="cursor-pointer list-none px-3 py-2 font-mono text-accent-3 marker:hidden">
        ● Setup checklist ({items.length}) — dev only
      </summary>
      <ul className="space-y-1.5 border-t border-line px-3 py-3">
        {items.map((item) => (
          <li key={item.label}>
            <span className="text-fg">{item.label}</span>
            <span className="block font-mono text-[11px] text-fg-subtle">{item.where}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
