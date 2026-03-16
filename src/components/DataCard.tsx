import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DataCardProps {
  title: string;
  children: ReactNode;
  accent?: boolean;
}

const DataCard = ({ title, children, accent }: DataCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
      className="glass-surface rounded p-4 group hover:scale-[1.005] transition-transform"
    >
      <div className={`terminal-heading mb-3 ${accent ? "text-accent text-glow-accent" : "text-muted-foreground"}`}>
        {title}
      </div>
      <div className="text-foreground text-glow text-sm leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
};

export default DataCard;
