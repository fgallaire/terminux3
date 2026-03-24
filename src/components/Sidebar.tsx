import { Terminal, Cpu, Network, HardDrive, Settings, Info } from "lucide-react";

const navItems = [
  { icon: Terminal, label: "Terminal", id: "terminal" },
  { icon: Cpu, label: "System", id: "system" },
  { icon: Network, label: "Network", id: "network" },
  { icon: HardDrive, label: "Storage", id: "storage" },
  { icon: Settings, label: "Config", id: "config" },
  { icon: Info, label: "About", id: "about" },
];

// Commands to run in the VM for each tab
export const VM_COMMANDS: Record<string, string> = {
  system: "echo '=== SYSTEM INFO ===' && uname -a && echo '' && echo '=== CPU ===' && cat /proc/cpuinfo | head -20 && echo '' && echo '=== MEMORY ===' && free -h\n",
  network: "echo '=== NETWORK ===' && ip addr 2>/dev/null || ifconfig 2>/dev/null && echo '' && echo '=== ROUTES ===' && ip route 2>/dev/null || route 2>/dev/null\n",
  storage: "echo '=== DISK USAGE ===' && df -h && echo '' && echo '=== BLOCK DEVICES ===' && cat /proc/partitions\n",
  config: "echo '=== KERNEL CONFIG ===' && uname -a && echo '' && echo '=== ENVIRONMENT ===' && env && echo '' && echo '=== MOUNTS ===' && mount\n",
};

interface SidebarProps {
  activeTab: string;
  onTabClick: (id: string) => void;
  vmRunning?: boolean;
}

const Sidebar = ({ activeTab, onTabClick, vmRunning }: SidebarProps) => {
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
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isVmOnly = item.id !== "terminal" && item.id !== "about";
          const isDisabled = isVmOnly && !vmRunning;

          return (
            <button
              key={item.id}
              onClick={() => onTabClick(item.id)}
              disabled={isDisabled}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                isActive
                  ? "text-foreground text-glow bg-secondary"
                  : isDisabled
                  ? "text-muted-foreground/30 cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground/70 hover:bg-secondary/50"
              }`}
              title={isDisabled ? "Lance la VM Linux d'abord (commande 'linux')" : item.label}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="hidden lg:block">{item.label}</span>
              {isVmOnly && !vmRunning && (
                <span className="hidden lg:block text-[10px] text-muted-foreground/30 ml-auto">VM</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Status */}
      <div className="p-4 border-t border-border/10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${vmRunning ? "bg-primary animate-pulse" : "bg-muted-foreground/30"}`} />
          <span className="hidden lg:block text-xs text-muted-foreground">
            {vmRunning ? "VM running" : "offline"}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
