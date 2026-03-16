import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number; // 0-100
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  const totalBlocks = 20;
  const filledBlocks = Math.round((progress / 100) * totalBlocks);
  const bar = "█".repeat(filledBlocks) + "░".repeat(totalBlocks - filledBlocks);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3 font-mono text-sm px-4 py-1"
    >
      <span className="text-foreground/60 text-glow">{bar}</span>
      <span className="text-muted-foreground tabular-nums min-w-[3ch] text-right">
        {progress}%
      </span>
    </motion.div>
  );
};

export default ProgressBar;
