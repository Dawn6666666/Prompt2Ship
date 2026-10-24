import { MessageSquare, Terminal } from "lucide-react";
import { WindowFrame } from "../../ui/window/WindowFrame";
import { Copy } from "../../ui/window/CopyButton";

export function Prompt({
  text,
  destination = "发给 Agent",
  command = false,
}: {
  text: string;
  destination?: string;
  command?: boolean;
}) {
  return (
    <WindowFrame
      className={command ? "prompt-block command-block" : "prompt-block"}
      variant={command ? "terminal" : "prompt"}
      icon={
        command ? <Terminal size={13} /> : <MessageSquare size={13} />
      }
      title={destination}
      actions={<Copy text={text} />}
    >
      <pre>{text}</pre>
    </WindowFrame>
  );
}

export function CommandBlock({
  text,
  destination = "输入终端",
}: {
  text: string;
  destination?: string;
}) {
  return <Prompt text={text} destination={destination} command />;
}
