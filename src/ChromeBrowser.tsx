// ChromeBrowser.tsx
// Drop-in browser window for CyberOS Portfolio
// Usage: add "browser" to WindowState["type"] union, then add this to getWindowContent()

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Globe,
  Lock,
  Plus,
  X,
  Shield,
  Search,
  AlertTriangle,
  Home,
} from "lucide-react";
import { cn } from "./utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tab {
  id: number;
  title: string;
  url: string;
}

interface QuickLink {
  label: string;
  url: string;
  gradient: string;
  initial: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PROXY = "https://corsproxy.io/?";

const QUICK_LINKS: QuickLink[] = [
  { label: "Google",    url: "https://www.google.com",         gradient: "from-blue-600 to-cyan-500",    initial: "G"  },
  { label: "GitHub",    url: "https://github.com",             gradient: "from-purple-600 to-pink-600",  initial: "GH" },
  { label: "Wikipedia", url: "https://en.wikipedia.org",       gradient: "from-gray-600 to-gray-500",    initial: "W"  },
  { label: "MDN",       url: "https://developer.mozilla.org",  gradient: "from-orange-500 to-red-500",   initial: "M"  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const normalizeUrl = (input: string): string => {
  const url = input.trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.includes(".") && !url.includes(" ")) return "https://" + url;
  return `https://www.google.com/search?q=${encodeURIComponent(url)}`;
};

const getDomain = (url: string): string => {
  try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
};

// ─── Component ────────────────────────────────────────────────────────────────

const ChromeBrowser = ({ isDark }: { isDark: boolean }) => {
  const [tabs, setTabs]               = useState<Tab[]>([{ id: 1, title: "New Tab", url: "" }]);
  const [activeTabId, setActiveTabId] = useState<number>(1);
  const [addressInput, setAddressInput] = useState("");
  const [iframeSrc, setIframeSrc]     = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [hasError, setHasError]       = useState(false);
  const [history, setHistory]         = useState<string[]>([]);
  const [historyIdx, setHistoryIdx]   = useState(-1);
  const iframeRef                     = useRef<HTMLIFrameElement>(null);

  // ── Navigation ──────────────────────────────────────────────────────────────

  const navigate = (raw: string) => {
    const url = normalizeUrl(raw);
    if (!url) return;
    const proxied = PROXY + encodeURIComponent(url);
    setIsLoading(true);
    setHasError(false);
    setIframeSrc(proxied);
    setAddressInput(url);
    const next = history.slice(0, historyIdx + 1);
    next.push(url);
    setHistory(next);
    setHistoryIdx(next.length - 1);
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, title: getDomain(url), url } : t))
    );
  };

  const goBack = () => {
    if (historyIdx <= 0) return;
    const url = history[historyIdx - 1];
    setHistoryIdx((i) => i - 1);
    setIframeSrc(PROXY + encodeURIComponent(url));
    setAddressInput(url);
    setIsLoading(true);
  };

  const goForward = () => {
    if (historyIdx >= history.length - 1) return;
    const url = history[historyIdx + 1];
    setHistoryIdx((i) => i + 1);
    setIframeSrc(PROXY + encodeURIComponent(url));
    setAddressInput(url);
    setIsLoading(true);
  };

  const refresh = () => {
    if (!iframeSrc) return;
    setIsLoading(true);
    const src = iframeSrc;
    setIframeSrc("");
    setTimeout(() => setIframeSrc(src), 50);
  };

  // ── Tab Management ──────────────────────────────────────────────────────────

  const addTab = () => {
    const id = Date.now();
    setTabs((prev) => [...prev, { id, title: "New Tab", url: "" }]);
    setActiveTabId(id);
    setAddressInput("");
    setIframeSrc("");
    setHasError(false);
    setHistory([]);
    setHistoryIdx(-1);
  };

  const closeTab = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const idx  = tabs.findIndex((t) => t.id === id);
    const next = tabs.filter((t) => t.id !== id);
    setTabs(next);
    if (activeTabId === id) {
      const fallback = next[Math.max(0, idx - 1)];
      setActiveTabId(fallback.id);
      setAddressInput(fallback.url || "");
      setIframeSrc(fallback.url ? PROXY + encodeURIComponent(fallback.url) : "");
    }
  };

  const switchTab = (tab: Tab) => {
    setActiveTabId(tab.id);
    setAddressInput(tab.url || "");
    setIframeSrc(tab.url ? PROXY + encodeURIComponent(tab.url) : "");
    setHasError(false);
  };

  const canGoBack    = historyIdx > 0;
  const canGoForward = historyIdx < history.length - 1;
  const isSecure     = iframeSrc.length > 0;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      className={cn(
        "flex flex-col h-full overflow-hidden",
        isDark ? "bg-gray-900" : "bg-gray-50"
      )}
    >
      {/* ── Tab Bar ── */}
      <div
        className={cn(
          "flex items-end gap-1 px-3 pt-2 overflow-x-auto overflow-y-visible shrink-0 scrollbar-none",
          isDark ? "bg-gray-950/60 border-b border-gray-800" : "bg-gray-100 border-b border-gray-200"
        )}
        style={{ minHeight: 42 }}
      >
        {tabs.map((tab) => {
          const active = tab.id === activeTabId;
          return (
            <motion.button
              key={tab.id}
              onClick={() => switchTab(tab)}
              whileHover={{ y: -1 }}
              className={cn(
                "group relative flex items-center gap-2 px-3 py-2 rounded-t-lg text-sm font-medium transition-all duration-200 shrink-0 max-w-[160px] min-w-[90px]",
                active
                  ? isDark
                    ? "bg-gray-900 text-white border border-b-0 border-gray-700"
                    : "bg-white text-gray-900 border border-b-0 border-gray-200"
                  : isDark
                  ? "bg-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                  : "bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              )}
            >
              {/* Active tab accent line */}
              {active && (
                <div className="absolute top-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
              )}

              {tab.url ? (
                <Globe className="w-3 h-3 shrink-0 text-blue-500" />
              ) : (
                <Shield className="w-3 h-3 shrink-0 text-gray-500" />
              )}

              <span className="truncate flex-1">{tab.title}</span>

              <button
                onClick={(e) => closeTab(tab.id, e)}
                className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all opacity-0 group-hover:opacity-100",
                  isDark
                    ? "hover:bg-red-500/20 text-gray-500 hover:text-red-400"
                    : "hover:bg-red-100 text-gray-400 hover:text-red-500"
                )}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </motion.button>
          );
        })}

        {/* New Tab */}
        <motion.button
          onClick={addTab}
          whileHover={{ scale: 1.1, y: -1 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "w-7 h-7 mb-1 rounded-lg flex items-center justify-center transition-colors shrink-0",
            isDark
              ? "text-gray-500 hover:text-gray-300 hover:bg-gray-800"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
          )}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* ── Toolbar ── */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 shrink-0",
          isDark
            ? "bg-gray-900/80 backdrop-blur-xl border-b border-gray-800"
            : "bg-white/80 backdrop-blur-xl border-b border-gray-200"
        )}
      >
        {/* Nav Buttons */}
        {[
          { icon: <ArrowLeft className="w-4 h-4" />,  action: goBack,    enabled: canGoBack,    label: "Back"    },
          { icon: <ArrowRight className="w-4 h-4" />, action: goForward, enabled: canGoForward, label: "Forward" },
          { icon: <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />, action: refresh, enabled: !!iframeSrc, label: "Refresh" },
          { icon: <Home className="w-4 h-4" />,       action: () => { setIframeSrc(""); setAddressInput(""); setHasError(false); }, enabled: true, label: "Home" },
        ].map(({ icon, action, enabled, label }) => (
          <motion.button
            key={label}
            onClick={action}
            disabled={!enabled}
            whileHover={enabled ? { scale: 1.08 } : undefined}
            whileTap={enabled ? { scale: 0.92 } : undefined}
            title={label}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
              enabled
                ? isDark
                  ? "text-gray-300 hover:bg-white/10 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                : "opacity-30 cursor-not-allowed",
              isDark ? "text-gray-400" : "text-gray-500"
            )}
          >
            {icon}
          </motion.button>
        ))}

        {/* Address Bar */}
        <div className="flex-1 relative flex items-center">
          {/* Security Icon */}
          <div className="absolute left-3 z-10">
            {isSecure ? (
              <Lock className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Globe className={cn("w-3.5 h-3.5", isDark ? "text-gray-500" : "text-gray-400")} />
            )}
          </div>

          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") navigate(addressInput); }}
            onFocus={(e) => e.target.select()}
            placeholder="Search or enter URL..."
            className={cn(
              "w-full py-2 pl-9 pr-10 rounded-lg text-sm font-mono outline-none transition-all duration-200",
              isDark
                ? "bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                : "bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
            )}
          />

          {/* Go Button */}
          <motion.button
            onClick={() => navigate(addressInput)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-2 w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center"
          >
            <Search className="w-3 h-3 text-white" />
          </motion.button>
        </div>
      </div>

      {/* ── Loading Bar ── */}
      <div className="h-0.5 relative shrink-0 overflow-hidden">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="progress"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Content Area ── */}
      <div className="flex-1 relative overflow-hidden">
        {/* New Tab Page */}
        {!iframeSrc && !hasError && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-8 p-8",
              isDark ? "bg-gray-900" : "bg-gray-50"
            )}
          >
            {/* Logo */}
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ boxShadow: ["0 0 30px rgba(59,130,246,0.3)", "0 0 50px rgba(139,92,246,0.4)", "0 0 30px rgba(59,130,246,0.3)"] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg"
              >
                <Globe className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className={cn("text-2xl font-bold tracking-tight", isDark ? "text-white" : "text-gray-900")}>
                New Tab
              </h1>
              <p className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-400")}>
                Search the web or type a URL
              </p>
            </div>

            {/* Search Bar */}
            <div
              className={cn(
                "w-full max-w-md flex items-center rounded-xl overflow-hidden border transition-all",
                isDark
                  ? "bg-gray-800 border-gray-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
                  : "bg-white border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/20"
              )}
            >
              <Search className={cn("w-4 h-4 ml-4 shrink-0", isDark ? "text-gray-500" : "text-gray-400")} />
              <input
                type="text"
                placeholder="Search or type a URL..."
                className={cn(
                  "flex-1 px-3 py-3 text-sm bg-transparent outline-none font-mono",
                  isDark ? "text-gray-200 placeholder-gray-600" : "text-gray-900 placeholder-gray-400"
                )}
                onKeyDown={(e) => { if (e.key === "Enter") navigate((e.target as HTMLInputElement).value); }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  const input = (e.currentTarget.parentNode as HTMLElement).querySelector("input");
                  if (input) navigate(input.value);
                }}
                className="m-2 px-4 py-1.5 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm font-semibold"
              >
                Go
              </motion.button>
            </div>

            {/* Quick Links */}
            <div className="flex gap-4 flex-wrap justify-center">
              {QUICK_LINKS.map((link) => (
                <motion.button
                  key={link.label}
                  onClick={() => navigate(link.url)}
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xs font-bold shadow-lg bg-gradient-to-br",
                      link.gradient
                    )}
                  >
                    {link.initial}
                  </div>
                  <span className={cn("text-xs font-medium", isDark ? "text-gray-400" : "text-gray-600")}>
                    {link.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Error Page */}
        {hasError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center",
              isDark ? "bg-gray-900" : "bg-gray-50"
            )}
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h2 className={cn("text-lg font-bold mb-1", isDark ? "text-white" : "text-gray-900")}>
                Connection Failed
              </h2>
              <p className={cn("text-sm max-w-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                This site couldn't be loaded. It may block embedding (X-Frame-Options). Try a different URL.
              </p>
            </div>
            <motion.button
              onClick={() => { setHasError(false); setIframeSrc(""); setAddressInput(""); }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm font-semibold"
            >
              ← Go Home
            </motion.button>
          </motion.div>
        )}

        {/* IFrame */}
        {iframeSrc && !hasError && (
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            title="browser"
            className="w-full h-full border-none block bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={() => setIsLoading(false)}
            onError={() => { setIsLoading(false); setHasError(true); }}
          />
        )}
      </div>
    </div>
  );
};

export default ChromeBrowser;
