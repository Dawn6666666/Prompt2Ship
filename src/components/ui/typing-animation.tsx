// Adapted from Magic UI TypingAnimation (MIT): single-pass, cancellable
// streaming with a completion callback, batching for larger code files.
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

export function TypingAnimation({
  text,
  onComplete,
  code = false,
}: {
  text: string;
  onComplete?: () => void;
  code?: boolean;
}) {
  const [count, setCount] = useState(0);
  const callback = useRef(onComplete);
  callback.current = onComplete;
  const reduce = useReducedMotion();
  const element = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const letters = Array.from(text);
    let position = 0;
    setCount(0);
    const timer = setInterval(
      () => {
        position = Math.min(
          letters.length,
          position +
            (reduce
              ? letters.length
              : code
                ? Math.max(3, Math.ceil(letters.length / 140))
                : 2),
        );
        setCount(position);
        if (position >= letters.length) {
          clearInterval(timer);
          callback.current?.();
        }
      },
      reduce ? 0 : code ? 24 : 32,
    );
    return () => clearInterval(timer);
  }, [text, code, reduce]);
  useEffect(() => {
    if (code && element.current?.parentElement) {
      element.current.parentElement.scrollTop =
        element.current.parentElement.scrollHeight;
    }
  }, [count, code]);
  return (
    <span ref={element}>
      {Array.from(text).slice(0, count).join("")}
      {count < Array.from(text).length && (
        <span className="typing-cursor" aria-hidden="true">
          ▍
        </span>
      )}
    </span>
  );
}
