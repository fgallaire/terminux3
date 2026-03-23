import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

interface V86TerminalProps {
  onReady: (term: Terminal) => void;
  onData: (data: string) => void;
  onExit: () => void;
}

const V86Terminal = ({ onReady, onData, onExit }: V86TerminalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!containerRef.current || termRef.current) return;

    const term = new Terminal({
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 14,
      lineHeight: 1.4,
      cursorBlink: true,
      cursorStyle: "block",
      theme: {
        background: "hsl(240, 10%, 2%)",
        foreground: "hsl(150, 100%, 50%)",
        cursor: "hsl(150, 100%, 50%)",
        selectionBackground: "hsla(150, 100%, 50%, 0.2)",
        black: "#1a1a2e",
        red: "#ff0000",
        green: "#00ff80",
        yellow: "#ffff00",
        blue: "#00bfff",
        magenta: "#ff00ff",
        cyan: "#00ffff",
        white: "#e0e0e0",
        brightBlack: "#555555",
        brightRed: "#ff5555",
        brightGreen: "#50fa7b",
        brightYellow: "#f1fa8c",
        brightBlue: "#6272a4",
        brightMagenta: "#ff79c6",
        brightCyan: "#8be9fd",
        brightWhite: "#ffffff",
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(containerRef.current);
    fitAddon.fit();

    term.onData((data) => {
      // Ctrl+D to exit
      if (data === "\x04") {
        onExit();
        return;
      }
      onData(data);
    });

    termRef.current = term;
    onReady(term);

    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      term.dispose();
      termRef.current = null;
    };
  }, [onReady, onData, onExit]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ padding: "8px" }}
    />
  );
};

export default V86Terminal;
