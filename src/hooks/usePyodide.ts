import { useState, useRef, useCallback } from "react";

declare global {
  interface Window {
    loadPyodide: (config?: { indexURL?: string }) => Promise<any>;
  }
}

export function usePyodide() {
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const pyodideRef = useRef<any>(null);

  const load = useCallback(async () => {
    if (pyodideRef.current) {
      setReady(true);
      return;
    }
    setLoading(true);

    // Load pyodide script if not already loaded
    if (!window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Pyodide"));
        document.head.appendChild(script);
      });
    }

    pyodideRef.current = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
    });

    // Redirect stdout/stderr
    pyodideRef.current.runPython(`
import sys
from io import StringIO
`);

    setLoading(false);
    setReady(true);
  }, []);

  const runPython = useCallback(async (code: string): Promise<{ output: string; error?: string }> => {
    if (!pyodideRef.current) {
      return { output: "", error: "Pyodide not loaded" };
    }

    try {
      // Capture stdout
      pyodideRef.current.runPython(`
_stdout = sys.stdout
_stderr = sys.stderr
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

      let result: any;
      try {
        result = pyodideRef.current.runPython(code);
      } catch (e: any) {
        const stderr = pyodideRef.current.runPython("sys.stderr.getvalue()");
        pyodideRef.current.runPython("sys.stdout = _stdout; sys.stderr = _stderr");
        // Extract just the last line of the traceback for cleaner output
        const lines = (stderr || e.message || String(e)).trim().split("\n");
        return { output: "", error: lines[lines.length - 1] };
      }

      const stdout = pyodideRef.current.runPython("sys.stdout.getvalue()");
      pyodideRef.current.runPython("sys.stdout = _stdout; sys.stderr = _stderr");

      const output = stdout || "";
      // If there's a non-None result and no stdout, show the result (like Python REPL)
      if (result !== undefined && result !== null && String(result) !== "None" && !output) {
        return { output: String(result) };
      }
      return { output };
    } catch (e: any) {
      return { output: "", error: e.message || String(e) };
    }
  }, []);

  return { load, loading, ready, runPython };
}
