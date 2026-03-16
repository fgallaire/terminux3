import { Terminal, Cpu, Network, HardDrive, Settings, Info } from "lucide-react";

const navItems = [
  { icon: Terminal, label: "Terminal", active: true },
  { icon: Cpu, label: "System" },
  { icon: Network, label: "Network" },
  { icon: HardDrive, label: "Storage" },
  { icon: Settings, label: "Config" },
  { icon: Info, label: "About" },
];

const Sidebar = () => {
  return (
    <aside className="w-[60px] lg:w-[200px] h-screen flex flex-col border-r border-border/10 bg-sidebar shrink-0">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2 border-b border-border/10">
        <Terminal className="w-5 h-5 text-foreground text-glow shrink-0" />
        <span className="hidden lg:block terminal-heading text-foreground text-glow">
          NEXTERM
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
              item.active
                ? "text-foreground text-glow bg-secondary"
                : "text-muted-foreground hover:text-foreground/70 hover:bg-secondary/50"
            }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="hidden lg:block">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Status */}
      <div className="p-4 border-t border-border/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="hidden lg:block text-xs text-muted-foreground">online</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
