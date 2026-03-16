import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface TerminalInputProps {
  onSubmit: (command: string) => void;
  disabled?: boolean;
}

const TerminalInput = ({ onSubmit, disabled }: TerminalInputProps) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
      setValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3">
      <span className="text-muted-foreground select-none">❯</span>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        className="flex-1 bg-transparent outline-none caret-transparent text-foreground text-glow placeholder:text-muted-foreground/50 font-mono"
        placeholder={disabled ? "processing..." : "enter command..."}
        autoComplete="off"
        spellCheck={false}
      />
      <motion.div
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        className="w-2 h-5 bg-primary rounded-none"
        style={{ animationTimingFunction: "steps(1)" }}
      />
    </form>
  );
};

export default TerminalInput;
