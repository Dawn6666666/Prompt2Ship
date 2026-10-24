import { AgentSetup } from "./AgentSetup";
import { ToolsSetup } from "./ToolsSetup";

export function ToolSetup({ agent = false }: { agent?: boolean }) {
  return agent ? <AgentSetup /> : <ToolsSetup />;
}
