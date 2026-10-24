/** Three window controls shared by terminal, prompt and editor frames. */
export function TrafficLights() {
  return (
    <span className="win-dots" aria-hidden="true">
      <i className="win-dot win-dot-red" />
      <i className="win-dot win-dot-yellow" />
      <i className="win-dot win-dot-green" />
    </span>
  );
}
