import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import TerminalInput from "@/components/TerminalInput";
import TerminalLine from "@/components/TerminalLine";
import DataCard from "@/components/DataCard";
import ProgressBar from "@/components/ProgressBar";
import { usePyodide } from "@/hooks/usePyodide";

type LineEntry = {
  id: number;
  content: string;
  type: "command" | "output" | "error" | "info" | "success";
};

type BlockEntry = {
  id: number;
  kind: "lines" | "card" | "progress";
  lines?: LineEntry[];
  card?: { title: string; content: string; accent?: boolean };
  progress?: number;
};

const COMMANDS: Record<string, () => BlockEntry[]> = {
  help: () => [
    {
      id: Date.now(),
      kind: "lines",
      lines: [
        { id: 1, content: "help", type: "command" },
        { id: 2, content: "Available commands:", type: "info" },
        { id: 3, content: "  help       — show this message", type: "output" },
        { id: 4, content: "  status     — system diagnostics", type: "output" },
        { id: 5, content: "  scan       — run network scan", type: "output" },
        { id: 6, content: "  about      — about this terminal", type: "output" },
        { id: 7, content: "  clear      — clear terminal", type: "output" },
        { id: 8, content: "  neofetch   — system info", type: "output" },
      ],
    },
  ],
  status: () => [
    {
      id: Date.now(),
      kind: "lines",
      lines: [
        { id: 1, content: "status", type: "command" },
        { id: 2, content: "Running system diagnostics...", type: "info" },
      ],
    },
    {
      id: Date.now() + 1,
      kind: "progress",
      progress: 100,
    },
    {
      id: Date.now() + 2,
      kind: "card",
      card: {
        title: "System Status",
        content: `CPU ··········· 23% [████░░░░░░░░░░░░░░░░]\nMEM ··········· 4.2 / 16.0 GB\nDISK ·········· 128 / 512 GB\nUPTIME ········ 14d 7h 32m\nPROCESSES ····· 247 running`,
      },
    },
  ],
  scan: () => [
    {
      id: Date.now(),
      kind: "lines",
      lines: [
        { id: 1, content: "scan", type: "command" },
        { id: 2, content: "Scanning network 192.168.1.0/24...", type: "info" },
      ],
    },
    {
      id: Date.now() + 1,
      kind: "progress",
      progress: 100,
    },
    {
      id: Date.now() + 2,
      kind: "card",
      card: {
        title: "Network Scan Results",
        accent: true,
        content: `Found 6 active hosts:\n\n  192.168.1.1 ···· gateway    ✓ online\n  192.168.1.12 ··· workstation ✓ online\n  192.168.1.15 ··· nas-server  ✓ online\n  192.168.1.22 ··· iot-hub     ✓ online\n  192.168.1.34 ··· printer     ✗ timeout\n  192.168.1.50 ··· media-srv   ✓ online`,
      },
    },
  ],
  about: () => [
    {
      id: Date.now(),
      kind: "lines",
      lines: [
        { id: 1, content: "about", type: "command" },
      ],
    },
    {
      id: Date.now() + 1,
      kind: "card",
      card: {
        title: "About NEXTERM",
        accent: true,
        content: `NEXTERM v1.0.0\nRetro-Modern Terminal Interface\n\nBuilt with precision.\nInspired by phosphor monitors & modern craft.\n\n© 2026 — All systems nominal.`,
      },
    },
  ],
  neofetch: () => [
    {
      id: Date.now(),
      kind: "lines",
      lines: [
        { id: 1, content: "neofetch", type: "command" },
      ],
    },
    {
      id: Date.now() + 1,
      kind: "card",
      card: {
        title: "System Info",
        content: `    ╔══════════════╗
    ║   NEXTERM    ║     OS ········· NexOS 4.2.1
    ║   ░░░░░░░░   ║     Kernel ····· 6.8.0-rc3
    ║   ░░░░░░░░   ║     Shell ······ nxsh 2.1
    ║   ░░░░░░░░   ║     Terminal ··· nexterm v1.0
    ╚══════════════╝     Resolution · 1920x1080`,
      },
    },
  ],
};

const WELCOME_BLOCKS: BlockEntry[] = [
  {
    id: 0,
    kind: "lines",
    lines: [
      { id: 1, content: "NEXTERM v1.0.0 — Retro-Modern Terminal Interface", type: "success" },
      { id: 2, content: "Type 'help' to see available commands.", type: "info" },
      { id: 3, content: "", type: "output" },
    ],
  },
];

const Index = () => {
  const [blocks, setBlocks] = useState<BlockEntry[]>(WELCOME_BLOCKS);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [blocks, scrollToBottom]);

  const handleCommand = async (cmd: string) => {
    const lowerCmd = cmd.toLowerCase().trim();

    if (lowerCmd === "clear") {
      setBlocks([]);
      return;
    }

    setIsProcessing(true);

    const handler = COMMANDS[lowerCmd];
    if (handler) {
      const newBlocks = handler();
      // Simulate streaming with stagger
      for (let i = 0; i < newBlocks.length; i++) {
        await new Promise((r) => setTimeout(r, i === 0 ? 0 : 400));
        setBlocks((prev) => [...prev, newBlocks[i]]);
      }
    } else {
      setBlocks((prev) => [
        ...prev,
        {
          id: Date.now(),
          kind: "lines",
          lines: [
            { id: 1, content: cmd, type: "command" },
            { id: 2, content: `command not found: ${cmd}`, type: "error" },
          ],
        },
      ]);
    }

    setIsProcessing(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background dot-grid">
      <Sidebar />

      {/* Main terminal area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="px-4 py-3 border-b border-border/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="terminal-heading text-muted-foreground">session://local</span>
            <span className="text-xs text-muted-foreground/50">•</span>
            <span className="text-xs text-muted-foreground/50 tabular-nums">pid:4827</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive/60" />
            <div className="w-2 h-2 rounded-full bg-accent/40" />
            <div className="w-2 h-2 rounded-full bg-primary/60" />
          </div>
        </header>

        {/* Terminal output */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ scrollBehavior: "auto" }}
        >
          <AnimatePresence mode="popLayout">
            {blocks.map((block) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              >
                {block.kind === "lines" &&
                  block.lines?.map((line, i) => (
                    <TerminalLine
                      key={`${block.id}-${line.id}`}
                      content={line.content}
                      type={line.type}
                      index={i}
                    />
                  ))}
                {block.kind === "card" && block.card && (
                  <DataCard title={block.card.title} accent={block.card.accent}>
                    <pre className="whitespace-pre font-mono text-sm">{block.card.content}</pre>
                  </DataCard>
                )}
                {block.kind === "progress" && (
                  <ProgressBar progress={block.progress ?? 0} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="border-t border-border/10 shrink-0">
          <TerminalInput onSubmit={handleCommand} disabled={isProcessing} />
        </div>
      </main>
    </div>
  );
};

export default Index;
