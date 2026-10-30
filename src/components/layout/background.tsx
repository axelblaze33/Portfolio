/** Fixed ambient layer: drifting grid, soft glows and film grain. CSS-only. */
export function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-grid absolute inset-0" />
      <div
        className="bg-glow absolute -top-[20%] -left-[10%] size-[60vmax] rounded-full"
        style={{ background: "radial-gradient(circle, var(--glow-2), transparent 65%)" }}
      />
      <div
        className="bg-glow absolute top-[30%] -right-[20%] size-[55vmax] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--glow-1), transparent 65%)",
          animationDelay: "-11s",
        }}
      />
      <div className="bg-noise absolute inset-0" />
    </div>
  );
}
