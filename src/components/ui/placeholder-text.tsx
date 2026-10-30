const PLACEHOLDER = /^\[.*\]$/;

export function isPlaceholder(value: string) {
  return value.trim() === "" || PLACEHOLDER.test(value.trim());
}

/** Renders "[Like this]" values from the data files with a visible dashed style. */
export function PlaceholderText({ value }: { value: string }) {
  if (!PLACEHOLDER.test(value.trim())) return <>{value}</>;
  return (
    <span className="placeholder-text" title="Placeholder — edit the data files in src/data">
      {value}
    </span>
  );
}
