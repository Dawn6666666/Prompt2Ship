// Adapted from Magic UI Terminal / AnimatedSpan (MIT).
import { motion, useReducedMotion } from "motion/react";
import { TerminalSquare } from "lucide-react";
export function Terminal({
  command,
  output,
}: {
  command: string;
  output: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="terminal">
      <div className="terminal-heading">
        <TerminalSquare size={14} /> 终端记录 <span>教学模拟 · 非实时执行</span>
      </div>
      <div className="terminal-body">
        {command.split("\n").map((line, i) => (
          <motion.div
            key={`${i}-${line}`}
            initial={reduce ? false : { opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduce ? 0 : i * 0.12 }}
          >
            <b>$</b> {line}
          </motion.div>
        ))}
        <pre>{output}</pre>
      </div>
    </div>
  );
}
