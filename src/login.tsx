import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Unlock, Eye, EyeOff, Terminal, Fingerprint, Zap } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
  isDark: boolean;
}

// Glitch text effect component
const GlitchText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 text-red-500 opacity-70 animate-pulse" style={{ clipPath: "inset(0 0 50% 0)", transform: "translateX(2px)" }}>
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 text-cyan-500 opacity-70 animate-pulse" style={{ clipPath: "inset(50% 0 0 0)", transform: "translateX(-2px)" }}>
        {text}
      </span>
    </div>
  );
};

// Matrix rain effect background
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 15, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#8b5cf6";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-30" />;
};

// Scanning line effect
const ScanLine = () => (
  <motion.div
    className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent"
    animate={{ top: ["0%", "100%"] }}
    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
  />
);

export default function Login({ onLogin, isDark }: LoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [bootSequence, setBootSequence] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Boot sequence effect
  useEffect(() => {
    const timer = setTimeout(() => setBootSequence(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "TYPE-C") {
      setUnlocking(true);
      setTimeout(() => onLogin(), 1500);
    } else {
      setError(true);
      setAttempts(a => a + 1);
      setTimeout(() => setError(false), 800);
      // Shake effect
      if (inputRef.current) {
        inputRef.current.style.transform = "translateX(10px)";
        setTimeout(() => {
          if (inputRef.current) inputRef.current.style.transform = "translateX(-10px)";
        }, 100);
        setTimeout(() => {
          if (inputRef.current) inputRef.current.style.transform = "translateX(0)";
        }, 200);
      }
    }
  };

  if (bootSequence) {
    return (
      <motion.div 
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] bg-[#0a0a0f] flex items-center justify-center font-mono text-sm"
      >
        <div className="w-full max-w-md p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {[
              "BIOS DATE 01/15/2025 14:22:51 VER 3.0",
              "CPU: AMD Ryzen 9 5900X @ 3.7GHz",
              "Detecting primary master ... SUCCESS",
              "Detecting primary slave  ... NONE",
              "Loading kernel modules ...",
              "Mounting file system ...",
              "Initializing security protocols ...",
              "Starting CyberOS v3.0 ...",
              "",
              "> ACCESS RESTRICTED",
              "> AUTHORIZED PERSONNEL ONLY",
              ""
            ].map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  "mb-1",
                  line.includes("SUCCESS") ? "text-green-500" :
                  line.includes("RESTRICTED") ? "text-red-500 font-bold" :
                  line.includes("ONLY") ? "text-yellow-500" :
                  "text-violet-400"
                )}
              >
                {line.includes(">") ? (
                  <span>
                    <span className="text-cyan-500 animate-pulse">{">"}</span>
                    <span className="text-gray-300">{line.slice(1)}</span>
                  </span>
                ) : (
                  line
                )}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-4 flex items-center gap-2 text-violet-400"
            >
              <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading authentication module...</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#0a0a0f] overflow-hidden"
    >
      {/* Background effects */}
      <MatrixRain />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      
      {/* Scan line */}
      <ScanLine />

      {/* Main content */}
      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="w-full max-w-sm"
        >
          {/* Logo area */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, delay: 0.2 }}
              className="relative w-24 h-24 mx-auto mb-4"
            >
              {/* Glowing ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 animate-pulse blur-xl opacity-50" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 p-[2px]">
                <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center">
                  <Shield className="w-10 h-10 text-violet-500" />
                </div>
              </div>
              {/* Orbiting dot */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="w-2 h-2 bg-cyan-400 rounded-full absolute -top-1 left-1/2 -translate-x-1/2 shadow-lg shadow-cyan-400/50" />
              </motion.div>
            </motion.div>

            <GlitchText 
              text="CYBEROS" 
              className="text-3xl font-bold tracking-wider text-white mb-1"
            />
            <p className="text-xs text-gray-500 uppercase tracking-[0.3em]">Secure Workstation v3.0</p>
          </div>

          {/* Login card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "relative p-6 rounded-3xl backdrop-blur-xl border",
              isDark 
                ? "bg-white/5 border-white/10" 
                : "bg-white/80 border-white/20"
            )}
          >
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-violet-500/50 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-violet-500/50 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-violet-500/50 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-violet-500/50 rounded-br-3xl" />

            {/* User info */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-violet-500/50">
                <img 
                  src={PROFILE_IMAGE} 
                  alt="Aayush" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "";
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <h2 className={cn("text-lg font-medium", isDark ? "text-white" : "text-gray-900")}>
                Aayush Timalsina
              </h2>
              <p className="text-xs text-gray-500">Security Researcher</p>
            </div>

            {/* Password form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <div className={cn(
                  "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
                  error ? "text-red-500" : "text-gray-500"
                )}>
                  {error ? <Zap className="w-4 h-4 animate-pulse" /> : <Lock className="w-4 h-4" />}
                </div>
                <input
                  ref={inputRef}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ENTER PASSWORD"
                  className={cn(
                    "w-full pl-10 pr-10 py-3 rounded-xl text-sm font-mono uppercase tracking-wider outline-none transition-all bg-transparent border",
                    error
                      ? "border-red-500/50 text-red-400 placeholder-red-400/50 animate-pulse"
                      : "border-white/10 text-white placeholder-gray-600 focus:border-violet-500/50"
                  )}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Hint */}
              <p className="text-xs text-center text-gray-600 font-mono">
                Hint: <span className="text-violet-400">TYPE-C</span>
              </p>

              {/* Submit button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all",
                  unlocking
                    ? "bg-green-600 text-white"
                    : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white"
                )}
              >
                {unlocking ? (
                  <>
                    <Unlock className="w-4 h-4" />
                    ACCESS GRANTED
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-4 h-4" />
                    AUTHENTICATE
                  </>
                )}
              </motion.button>
            </form>

            {/* Security footer */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-600 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                SYSTEM SECURE
              </span>
              <span>ATTEMPTS: {attempts}</span>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6 text-xs text-gray-600 font-mono"
          >
            <Terminal className="w-3 h-3 inline mr-1" />
            Built by Aayush Timalsina, Nepal 🇳🇵
          </motion.p>
        </motion.div>
      </div>

      {/* Unlock animation overlay */}
      <AnimatePresence>
        {unlocking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1, 2], opacity: [1, 1, 0] }}
              transition={{ duration: 1.5 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 blur-xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Unlock className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute mt-40 text-center"
            >
              <p className="text-green-400 font-mono text-lg">ACCESS GRANTED</p>
              <p className="text-gray-500 font-mono text-sm">Welcome back, Aayush</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}