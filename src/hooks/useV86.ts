import { useState, useRef, useCallback } from "react";

declare global {
  interface Window {
    V86: any;
  }
}

export function useV86() {
  const [booting, setBooting] = useState(false);
  const [running, setRunning] = useState(false);
  const emulatorRef = useRef<any>(null);

  const boot = useCallback(async (onChar: (char: string) => void) => {
    if (emulatorRef.current) {
      setRunning(true);
      return;
    }

    setBooting(true);

    // Load v86 script if not loaded
    if (!window.V86) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "/v86/libv86.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load v86"));
        document.head.appendChild(script);
      });
    }

    const emulator = new window.V86({
      wasm_path: "/v86/v86.wasm",
      memory_size: 64 * 1024 * 1024,
      vga_memory_size: 2 * 1024 * 1024,
      bios: { url: "/v86/seabios.bin" },
      vga_bios: { url: "/v86/vgabios.bin" },
      bzimage: { url: "/v86/buildroot-bzimage.bin", size: 5166352 },
      cmdline: "tsc=reliable mitigations=off random.trust_cpu=on console=ttyS0",
      autostart: true,
      disable_keyboard: true,
      disable_mouse: true,
      disable_speaker: true,
    });

    emulator.add_listener("serial0-output-byte", (byte: number) => {
      const char = String.fromCharCode(byte);
      onChar(char);
    });

    emulatorRef.current = emulator;

    // Wait for emulator to start
    emulator.add_listener("emulator-ready", () => {
      setBooting(false);
      setRunning(true);
    });
  }, []);

  const sendChar = useCallback((char: string) => {
    if (emulatorRef.current) {
      emulatorRef.current.serial0_send(char);
    }
  }, []);

  const sendString = useCallback((str: string) => {
    if (emulatorRef.current) {
      emulatorRef.current.serial0_send(str);
    }
  }, []);

  const stop = useCallback(() => {
    if (emulatorRef.current) {
      emulatorRef.current.stop();
      emulatorRef.current.destroy();
      emulatorRef.current = null;
    }
    setRunning(false);
    setBooting(false);
  }, []);

  return { boot, booting, running, sendChar, sendString, stop };
}
