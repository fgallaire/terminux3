import { motion } from "framer-motion";

interface TerminalLineProps {
  content: string;
  type?: "command" | "output" | "error" | "info" | "success";
  index?: number;
}

const typeStyles: Record<string, string> = {
  command: "text-foreground text-glow",
  output: "text-foreground/80",
  error: "text-destructive",
  info: "text-accent text-glow-accent",
  success: "text-foreground text-glow",
};

const TerminalLine = ({ content, type = "output", index = 0 }: TerminalLineProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: index * 0.02,
        ease: [0.19, 1, 0.22, 1],
      }}
      className={`font-mono text-sm leading-relaxed ${typeStyles[type]}`}
    >
      {type === "command" && <span className="text-muted-foreground mr-2 select-none">❯</span>}
      {type === "error" && <span className="mr-2 select-none">✗</span>}
      {type === "success" && <span className="mr-2 select-none">✓</span>}
      {type === "info" && <span className="mr-2 select-none">ℹ</span>}
      {content}
    </motion.div>
  );
};

export default TerminalLine;
