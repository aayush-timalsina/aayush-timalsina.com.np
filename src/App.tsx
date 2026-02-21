import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  User,
  FolderOpen,
  Mail,
  Settings,
  Moon,
  Sun,
  X,
  Minimize2,
  Maximize2,
  Shield,
  Eye,
  Code,
  Volume2,
  Volume1,
  VolumeX,
  Battery,
  WifiIcon,
  WifiOff,
  LayoutGrid,
  MapPin,
  Phone,
  Send,
  CheckCircle,
  RefreshCw,
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Target,
  Scan,
  Bug,
  Activity,
  Zap,
  TerminalSquare,
  Monitor,
  Info,
  Image,
  Music,
  Video,
  Download,
  FileText,
  GraduationCap,
  Bluetooth,
  Wifi,
  Calendar,
  Clock,
  Calculator,
  Edit3,
  Plus,
  Lock,
  Unlock,
  HardDrive,
  GitBranch,
  Cpu,
  Layers,
  Search,
  Undo,
  RotateCcw,
  Save,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "./utils/cn";

// File System Types
interface FileSystemNode {
  type: "file" | "directory";
  name: string;
  content?: string;
  children?: { [key: string]: FileSystemNode };
  size: number;
  modified: Date;
}

// Types
interface WindowState {
  id: string;
  title: string;
  type: "terminal" | "about" | "projects" | "skills" | "contact" | "settings" | "finder" | "calculator" | "calendar" | "notes" | "help" | "shortcuts" | "about-os";
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  skills: string[];
  category: string;
}

interface Skill {
  name: string;
  icon: React.ReactNode;
  level: number;
  category: string;
}

interface Wallpaper {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
}

// Constants
const PROFILE_IMAGE = "https://scontent.fktm19-1.fna.fbcdn.net/v/t39.30808-6/480347813_569555419398127_972680757615671058_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=dziFfm82pYkQ7kNvwFJNyrU&_nc_oc=AdnGHiO7a2zVBYjBJNqNjwdAmxJa8Syn2St16y5usHBzsh6hhgvTd1Yg4qxx6kf9fDM&_nc_zt=23&_nc_ht=scontent.fktm19-1.fna&_nc_gid=FIRXfGn4xwDZQGPIbVzwwg&oh=00_AfsukNJBBKGMIFTH-ZlQhrHQLb0LIO1onoB49G1RljLQBA&oe=69960C19";
const ABOUT_IMAGE = "https://scontent.fktm19-1.fna.fbcdn.net/v/t39.30808-6/565717911_757399067280427_4804829451481773559_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=wEZv58m8FD4Q7kNvwEBMUTM&_nc_oc=AdkvSmFOG6aDRZETa-P6EXC0c45-KP1UsQjPZ_R2eXPjZ1fzPcX1QNNiZmwHBFTzhZ0&_nc_zt=23&_nc_ht=scontent.fktm19-1.fna&_nc_gid=NvsFZTZD3mElNoPgjO-DFA&oh=00_AfvOGPieAs-JcBHNTg-khTk1ISyQaRklAW-Rv7Kr4e35vA&oe=6995FF4B";
const DEFAULT_WALLPAPER = "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80";

const WALLPAPERS: Wallpaper[] = [
  { id: "1", name: "Cyberpunk", url: DEFAULT_WALLPAPER, thumbnail: DEFAULT_WALLPAPER },
  { id: "3", name: "Tech", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=80", thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80" },
  { id: "dark-abstract", name: "Dark Abstract", url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1920&q=80", thumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=200&q=60" },
  { id: "dark-gradient", name: "Dark Gradient", url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80", thumbnail: "https://images.unsplash.com/photo-1557683316-973673baf926?w=200&q=60" },
  { id: "dark-mountain", name: "Dark Mountain", url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80", thumbnail: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200&q=60" },
];

// File System Initialization
const initializeFileSystem = (): FileSystemNode => ({
  type: "directory",
  name: "root",
  size: 0,
  modified: new Date(),
  children: {
    home: {
      type: "directory",
      name: "home",
      size: 0,
      modified: new Date(),
      children: {
        aayush: {
          type: "directory",
          name: "aayush",
          size: 0,
          modified: new Date(),
          children: {
            "about.md": {
              type: "file",
              name: "about.md",
              content: `# Aayush Timalsina - Cybersecurity Student

## About
Hi! I'm Aayush Timalsina, currently studying in class 12 at Skyrider College, Nepal.
Passionate about cybersecurity, penetration testing, and ethical hacking.

## Skills
- Python, JavaScript, TypeScript, React
- Linux/Bash, Network Security
- Penetration Testing, Web Security
- Threat Detection & Analysis

## Contact
📧 Email: aayush@cyberos.local
📍 Location: Chitwan, Nepal
🔗 GitHub: github.com/aayush`,
              size: 512,
              modified: new Date(),
            },
            "projects.json": {
              type: "file",
              name: "projects.json",
              content: `[
  {
    "title": "CyberOS Portfolio",
    "description": "Interactive OS-based portfolio with terminal",
    "tech": ["React", "TypeScript", "Tailwind", "Framer Motion"]
  },
  {
    "title": "Security Scanner",
    "description": "Network vulnerability scanner",
    "tech": ["Python", "Scapy", "Flask"]
  }
]`,
              size: 256,
              modified: new Date(),
            },
            resume: {
              type: "directory",
              name: "resume",
              size: 0,
              modified: new Date(),
              children: {
                "resume.pdf": {
                  type: "file",
                  name: "resume.pdf",
                  content: "PDF resume document - Download from portfolio",
                  size: 1024,
                  modified: new Date(),
                },
              },
            },
            projects: {
              type: "directory",
              name: "projects",
              size: 0,
              modified: new Date(),
              children: {
                "cybersecurity": {
                  type: "directory",
                  name: "cybersecurity",
                  size: 0,
                  modified: new Date(),
                  children: {
                    "notes.txt": {
                      type: "file",
                      name: "notes.txt",
                      content: "Security research and findings\n\nNotes on network security, cryptography, and best practices.",
                      size: 256,
                      modified: new Date(),
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    etc: {
      type: "directory",
      name: "etc",
      size: 0,
      modified: new Date(),
      children: {
        "config.conf": {
          type: "file",
          name: "config.conf",
          content: "CyberOS Configuration File\nVersion: 3.0\nTheme: Dark\nLocale: en_US",
          size: 128,
          modified: new Date(),
        },
      },
    },
    usr: {
      type: "directory",
      name: "usr",
      size: 0,
      modified: new Date(),
      children: {
        bin: {
          type: "directory",
          name: "bin",
          size: 0,
          modified: new Date(),
          children: {},
        },
      },
    },
  },
});

const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Network Security Lab",
    description: "Configured firewalls and intrusion detection systems in a simulated environment to learn about network protection and threat detection.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    skills: ["Firewall Configuration", "IDS/IPS Setup", "Vulnerability Scanning"],
    category: "Security",
  },
  {
    id: "2",
    title: "Web Application Penetration Testing",
    description: "Conducted security assessments on web applications to identify vulnerabilities such as SQL injection, XSS, and CSRF.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    skills: ["OWASP Testing", "Burp Suite", "Vulnerability Reporting"],
    category: "Web Security",
  },
  {
    id: "3",
    title: "Network Traffic Analysis",
    description: "Analyzed network traffic to detect suspicious activities and potential security threats using Wireshark.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    skills: ["Wireshark Analysis", "Intrusion Detection", "Threat Hunting"],
    category: "Analysis",
  },
  {
    id: "4",
    title: "Price Tampering Vulnerability",
    description: "Identified and exploited price tampering vulnerabilities in e-commerce platforms and implemented security measures.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
    skills: ["Vulnerability Assessment", "Penetration Testing", "Security Implementation"],
    category: "Vulnerability",
  },
];

const SKILLS: Skill[] = [
  { name: "Penetration Testing", icon: <Target className="w-5 h-5" />, level: 85, category: "Core" },
  { name: "Threat Detection", icon: <Eye className="w-5 h-5" />, level: 80, category: "Core" },
  { name: "NMAP", icon: <Scan className="w-5 h-5" />, level: 90, category: "Tools" },
  { name: "Wireshark", icon: <Activity className="w-5 h-5" />, level: 75, category: "Tools" },
  { name: "Burp Suite", icon: <Bug className="w-5 h-5" />, level: 70, category: "Tools" },
  { name: "Python", icon: <Code className="w-5 h-5" />, level: 65, category: "Languages" },
  { name: "Bash", icon: <Terminal className="w-5 h-5" />, level: 70, category: "Languages" },
  { name: "Linux", icon: <TerminalSquare className="w-5 h-5" />, level: 85, category: "Systems" },
  { name: "Kali Linux", icon: <Shield className="w-5 h-5" />, level: 80, category: "Systems" },
  { name: "Metasploit", icon: <Zap className="w-5 h-5" />, level: 60, category: "Tools" },
];

// Utility functions
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

// Components
const DockItem = ({
  icon,
  label,
  isActive,
  onClick,
  isDark,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isDark: boolean;
  badge?: number;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.2, y: -8 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="group relative flex flex-col items-center"
    >
      <div
        className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg relative",
          isActive
            ? isDark
              ? "bg-gradient-to-br from-blue-600 to-purple-600"
              : "bg-gradient-to-br from-blue-500 to-purple-500"
            : isDark
            ? "bg-white/10 backdrop-blur-xl"
            : "bg-white/80 backdrop-blur-xl"
        )}
      >
        <div className={isActive ? "text-white" : isDark ? "text-gray-300" : "text-gray-700"}>
          {icon}
        </div>
        {badge && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
            {badge}
          </div>
        )}
      </div>
      <span
        className={cn(
          "absolute -top-10 px-3 py-1 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none",
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800 shadow-lg"
        )}
      >
        {label}
      </span>
      {isActive && (
        <motion.div
          layoutId="dock-indicator"
          className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-blue-500"
        />
      )}
    </motion.button>
  );
};

const Window = ({
  window: win,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onClick,
  children,
  isDark,
  brightness,
}: {
  window: WindowState;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClick: () => void;
  children: React.ReactNode;
  isDark: boolean;
  brightness: number;
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!win.isMaximized && (e.target as HTMLElement).closest(".window-header")) {
      setIsDragging(true);
      const rect = windowRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
    onClick();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && windowRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        windowRef.current.style.left = `${Math.max(0, newX)}px`;
        windowRef.current.style.top = `${Math.max(32, newY)}px`;
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      globalThis.window.addEventListener("mousemove", handleMouseMove);
      globalThis.window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      globalThis.window.removeEventListener("mousemove", handleMouseMove);
      globalThis.window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{
        opacity: win.isMinimized ? 0 : 1,
        scale: win.isMinimized ? 0.9 : 1,
        y: win.isMinimized ? 20 : 0,
      }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={cn(
        "absolute rounded-xl overflow-hidden shadow-2xl",
        isActive ? "z-50" : "z-10",
        isDark ? "bg-gray-900/95 border border-gray-700" : "bg-white/95 border border-gray-200"
      )}
      style={{
        zIndex: win.zIndex,
        width: win.isMaximized ? "100vw" : win.size.width,
        height: win.isMaximized ? "calc(100vh - 32px)" : win.size.height,
        left: win.isMaximized ? 0 : win.position.x,
        top: win.isMaximized ? 32 : win.position.y,
        filter: `brightness(${brightness}%)`,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Window Header */}
      <div
        className={cn(
          "window-header flex items-center justify-between px-4 py-3 cursor-default select-none",
          isDark ? "bg-gray-800/50 border-b border-gray-700" : "bg-gray-50/80 border-b border-gray-200"
        )}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center group"
          >
            <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={onMinimize}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors flex items-center justify-center group"
          >
            <Minimize2 className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={onMaximize}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center group"
          >
            <Maximize2 className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100" />
          </button>
        </div>
        <span className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-700")}>
          {win.title}
        </span>
        <div className="w-16" />
      </div>

      {/* Window Content */}
      <div className="overflow-auto" style={{ height: "calc(100% - 48px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

// Enhanced Terminal Component with File System
const TerminalWindow = ({ isDark, fileSystem, setFileSystem }: { isDark: boolean; fileSystem: FileSystemNode; setFileSystem: (fs: FileSystemNode) => void }) => {
  const [commands, setCommands] = useState<string[]>([
    "Welcome to CyberOS Terminal v3.0",
    "Type 'help' for available commands",
    "",
  ]);
  const [input, setInput] = useState("");
  const [currentPath, setCurrentPath] = useState<string[]>(["home", "aayush"]);
  const [editingFile, setEditingFile] = useState<{ path: string[]; name: string } | null>(null);
  const [editContent, setEditContent] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);

  const getNodeAtPath = (path: string[]): FileSystemNode | null => {
    let node = fileSystem;
    for (const part of path) {
      if (node.children && node.children[part]) {
        node = node.children[part];
      } else {
        return null;
      }
    }
    return node;
  };

  const handleCommand = (cmd: string) => {
    const newCommands = [...commands];
    const parts = cmd.trim().split(" ");
    const command = parts[0];
    const args = parts.slice(1);

    const displayPrompt = () => `aayush@cyberos:~/${currentPath.join("/")}$`;

    newCommands.push(`${displayPrompt()} ${cmd}`);

    switch (command) {
      case "help":
        newCommands.push(
          "\nAvailable Commands:",
          "  pwd              - Print working directory",
          "  ls [dir]         - List files and directories",
          "  cd [directory]   - Change directory",
          "  mkdir [name]     - Create directory",
          "  touch [file]     - Create file",
          "  cat [file]       - View file contents",
          "  nano [file]      - Edit file",
          "  rm [file/dir]    - Remove file or directory",
          "  clear            - Clear screen",
          "  whoami           - Display user info",
          "  date             - Show current date",
          "  neofetch         - System information",
          "  tree             - Show directory tree",
          ""
        );
        break;

      case "pwd":
        newCommands.push(currentPath.join("/") === "" ? "/" : "/" + currentPath.join("/") + "/");
        break;

      case "ls":
        const targetPath = args[0] ? [...currentPath, args[0]] : currentPath;
        const target = getNodeAtPath(targetPath);
        if (target && target.type === "directory" && target.children) {
          const items = Object.values(target.children);
          newCommands.push(
            items.map((item) => `${item.type === "directory" ? "📁" : "📄"} ${item.name}`).join("  ")
          );
        } else {
          newCommands.push("Directory not found");
        }
        break;

      case "cd":
        if (!args[0]) {
          setCurrentPath(["home", "aayush"]);
          newCommands.push("Changed to home directory");
        } else if (args[0] === "..") {
          if (currentPath.length > 0) {
            setCurrentPath(currentPath.slice(0, -1));
          }
        } else {
          const newPath = [...currentPath, args[0]];
          const node = getNodeAtPath(newPath);
          if (node && node.type === "directory") {
            setCurrentPath(newPath);
          } else {
            newCommands.push(`bash: cd: ${args[0]}: No such file or directory`);
          }
        }
        break;

      case "cat":
        if (args[0]) {
          const filePath = [...currentPath, args[0]];
          const file = getNodeAtPath(filePath);
          if (file && file.type === "file" && file.content) {
            newCommands.push(file.content);
          } else {
            newCommands.push(`cat: ${args[0]}: No such file or directory`);
          }
        } else {
          newCommands.push("Usage: cat [filename]");
        }
        break;

      case "nano":
        if (args[0]) {
          setEditingFile({ path: currentPath, name: args[0] });
          const filePath = [...currentPath, args[0]];
          const file = getNodeAtPath(filePath);
          setEditContent(file && file.type === "file" ? file.content || "" : "");
        } else {
          newCommands.push("Usage: nano [filename]");
        }
        break;

      case "mkdir":
        if (args[0]) {
          const currentNode = getNodeAtPath(currentPath);
          if (currentNode && currentNode.children) {
            currentNode.children[args[0]] = {
              type: "directory",
              name: args[0],
              size: 0,
              modified: new Date(),
              children: {},
            };
            setFileSystem({ ...fileSystem });
            newCommands.push(`Directory '${args[0]}' created`);
          }
        } else {
          newCommands.push("Usage: mkdir [directory name]");
        }
        break;

      case "touch":
        if (args[0]) {
          const currentNode = getNodeAtPath(currentPath);
          if (currentNode && currentNode.children) {
            currentNode.children[args[0]] = {
              type: "file",
              name: args[0],
              content: "",
              size: 0,
              modified: new Date(),
            };
            setFileSystem({ ...fileSystem });
            newCommands.push(`File '${args[0]}' created`);
          }
        } else {
          newCommands.push("Usage: touch [filename]");
        }
        break;

      case "clear":
        setCommands([]);
        return;

      case "whoami":
        newCommands.push("aayush");
        break;

      case "date":
        newCommands.push(new Date().toString());
        break;

      case "neofetch":
        newCommands.push(
          "       .---.        aayush@cyberos",
          "      /     \\       ----------------",
          "      \\.@-@./       OS: CyberOS 3.0",
          "      /`\\_/`\\       Kernel: Security-First Arch",
          "     //  _  \\\\      Shell: zsh 5.8",
          "    | \\     )|_     DE: ReactOS Wind",
          "   /`\\_`>  <_/ \\    WM: Framer Motion",
          "   \\__/'---'\\__/    Theme: Cyberpunk Dark",
          "                    Icons: Lucide React",
          "                    RAM: 69 GiB (Nice)",
          "                    CPU: Brain v2.0 Quantum"
        );
        break;

      case "tree":
        const printTree = (node: FileSystemNode, indent = "") => {
          const lines: string[] = [];
          if (node.children) {
            const entries = Object.entries(node.children);
            entries.forEach(([, child], idx) => {
              const isLast = idx === entries.length - 1;
              lines.push(`${indent}${isLast ? "└── " : "├── "}${child.type === "directory" ? "📁 " : "📄 "}${child.name}`);
              if (child.type === "directory" && child.children) {
                const childLines = printTree(child, indent + (isLast ? "    " : "│   "));
                lines.push(...childLines);
              }
            });
          }
          return lines;
        };
        const currentNode = getNodeAtPath(currentPath);
        if (currentNode) {
          newCommands.push(currentNode.name);
          newCommands.push(...printTree(currentNode));
        }
        break;

      case "hack":
        newCommands.push(
          "[+] Initializing penetration testing sequence...",
          "[~] Scanning target...",
          "[+] Found 3 open ports",
          "[!] Vulnerability detected in SSH service",
          "[+] Attempting credential stuffing...",
          "[✓] Access granted!",
          "[!] Just kidding! This is a simulation.",
          "[i] Remember: Only ethical hacking!",
          "[i] Type 'help' for more commands"
        );
        break;

      default:
        if (cmd.trim()) {
          newCommands.push(`bash: ${command}: command not found`);
        }
    }

    newCommands.push("");
    setCommands(newCommands);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput("");
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  if (editingFile) {
    return (
      <NanoEditor
        isDark={isDark}
        content={editContent}
        onSave={(content) => {
          const parentPath = editingFile.path;
          const parentNode = getNodeAtPath(parentPath);
          if (parentNode && parentNode.children) {
            parentNode.children[editingFile.name] = {
              type: "file",
              name: editingFile.name,
              content,
              size: content.length,
              modified: new Date(),
            };
            setFileSystem({ ...fileSystem });
            setCommands([...commands, `\nFile '${editingFile.name}' saved successfully\n`]);
          }
          setEditingFile(null);
        }}
        onExit={() => setEditingFile(null)}
        onEdit={setEditContent}
        filename={editingFile.name}
      />
    );
  }

  return (
    <div className={cn("h-full p-4 font-mono text-sm flex flex-col", isDark ? "bg-gray-950 text-green-400" : "bg-gray-900 text-green-400")}>
      <div ref={terminalRef} className="flex-1 overflow-auto whitespace-pre-wrap text-xs md:text-sm">
        {commands.map((line, i) => (
          <div key={i} className="leading-relaxed">
            {line.startsWith("aayush@") ? (
              <span>
                <span className="text-cyan-400">{line.split("$")[0]}$</span>
                <span className="text-gray-300"> {line.split("$ ")[1]}</span>
              </span>
            ) : line.startsWith("[") ? (
              <span className="text-yellow-400">{line}</span>
            ) : (
              line
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center mt-2 border-t border-gray-700 pt-2">
        <span className="text-cyan-400 flex-shrink-0 text-xs md:text-sm">aayush@cyberos</span>
        <span className="text-white text-xs md:text-sm">:</span>
        <span className="text-cyan-400 text-xs md:text-sm">{currentPath.length === 0 ? "/" : "/" + currentPath.join("/")}</span>
        <span className="text-white text-xs md:text-sm">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-gray-300 ml-2 text-xs md:text-sm"
          autoFocus
          spellCheck={false}
        />
      </form>
    </div>
  );
};

// Nano Editor Component
const NanoEditor = ({
  isDark,
  content,
  onSave,
  onExit,
  onEdit,
  filename,
}: {
  isDark: boolean;
  content: string;
  onSave: (content: string) => void;
  onExit: () => void;
  onEdit: (content: string) => void;
  filename: string;
}) => {
  return (
    <div className={cn("h-full flex flex-col", isDark ? "bg-gray-950 text-gray-100" : "bg-gray-900 text-gray-100")}>
      <div className={cn("p-2 border-b text-xs", isDark ? "border-gray-700 bg-gray-800" : "border-gray-600 bg-gray-800")}>
        <div className="font-semibold">GNU nano 6.4 - {filename}</div>
      </div>

      <textarea
        value={content}
        onChange={(e) => onEdit(e.target.value)}
        className={cn(
          "flex-1 p-4 font-mono text-sm border-none outline-none resize-none",
          isDark ? "bg-gray-950 text-green-400" : "bg-gray-900 text-green-400"
        )}
        spellCheck={false}
      />

      <div className={cn("p-2 border-t text-xs", isDark ? "border-gray-700 bg-gray-800" : "border-gray-600 bg-gray-800")}>
        <div className="flex flex-wrap gap-4 mb-2">
          <span className="text-cyan-400 cursor-pointer hover:text-cyan-300 text-xs" onClick={() => onSave(content)}>
            ^O WriteOut
          </span>
          <span className="text-cyan-400 cursor-pointer hover:text-cyan-300 text-xs" onClick={onExit}>
            ^X Exit
          </span>
        </div>
        <div className="text-gray-500 text-xs">
          Lines: {content.split("\n").length} | Chars: {content.length}
        </div>
      </div>
    </div>
  );
};


const AboutWindow = ({ isDark }: { isDark: boolean }) => {
  return (
    <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-gray-900" : "bg-gray-50")}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <img 
              src={ABOUT_IMAGE} 
              alt="Aayush Timalsina" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
            <User className="w-16 h-16 text-white hidden" />
          </div>
          <div>
            <h1 className={cn("text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>
              Aayush Timalsina
            </h1>
            <p className={cn("text-lg mb-2", isDark ? "text-blue-400" : "text-blue-600")}>
              Cybersecurity Student
            </p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" />
              <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                Chitwan, Nepal
              </span>
            </div>
          </div>
        </div>

        <div className={cn("rounded-xl p-6 mb-6", isDark ? "bg-gray-800" : "bg-white")}>
          <h2 className={cn("text-xl font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>
            About Me
          </h2>
          <p className={cn("leading-relaxed mb-4", isDark ? "text-gray-300" : "text-gray-600")}>
            Hi! I'm Aayush Timalsina, currently studying in class 12 at Skyrider College, Nepal. 
            I'm passionate about cybersecurity, especially penetration testing, threat detection and monitoring, 
            and scripting and automation.
          </p>
          <p className={cn("leading-relaxed", isDark ? "text-gray-300" : "text-gray-600")}>
            I enjoy learning new ways to protect digital assets and help organizations stay secure 
            in an ever-evolving cyber landscape. My goal is to become a skilled cybersecurity professional 
            who can make the digital world a safer place.
          </p>
        </div>

        <div className={cn("rounded-xl p-6 mb-6", isDark ? "bg-gray-800" : "bg-white")}>
          <h2 className={cn("text-xl font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>
            Education
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className={cn("p-3 rounded-lg", isDark ? "bg-gray-700" : "bg-gray-100")}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                  Class 12 (Science)
                </h3>
                <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                  Skyrider College, Chitwan, Nepal
                </p>
                <p className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-500")}>
                  2023 - Present
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={cn("rounded-xl p-6", isDark ? "bg-gray-800" : "bg-white")}>
          <h2 className={cn("text-xl font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>
            Quick Stats
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Projects", value: "4+", icon: <FolderOpen className="w-5 h-5" /> },
              { label: "Skills", value: "10+", icon: <Code className="w-5 h-5" /> },
              { label: "Experience", value: "2+ yrs", icon: <Clock className="w-5 h-5" /> },
            ].map((stat) => (
              <div key={stat.label} className={cn("text-center p-4 rounded-lg", isDark ? "bg-gray-700" : "bg-gray-100")}>
                <div className={cn("flex justify-center mb-2", isDark ? "text-blue-400" : "text-blue-600")}>
                  {stat.icon}
                </div>
                <div className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                  {stat.value}
                </div>
                <div className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsWindow = ({ isDark }: { isDark: boolean }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(PROJECTS.map((p) => p.category)))];
  const filteredProjects = selectedCategory === "All" 
    ? PROJECTS 
    : PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-gray-900" : "bg-gray-50")}>
      <div className="max-w-4xl mx-auto">
        <h1 className={cn("text-2xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>
          My Projects
        </h1>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                selectedCategory === cat
                  ? "bg-blue-500 text-white"
                  : isDark
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-xl overflow-hidden group cursor-pointer",
                isDark ? "bg-gray-800" : "bg-white shadow-lg"
              )}
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <span className={cn("text-xs font-medium px-2 py-1 rounded-full", isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600")}>
                  {project.category}
                </span>
                <h3 className={cn("font-semibold mt-2 mb-2", isDark ? "text-white" : "text-gray-900")}>
                  {project.title}
                </h3>
                <p className={cn("text-sm mb-3 line-clamp-2", isDark ? "text-gray-400" : "text-gray-600")}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className={cn(
                        "text-xs px-2 py-1 rounded",
                        isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SkillsWindow = ({ isDark }: { isDark: boolean }) => {
  const categories = Array.from(new Set(SKILLS.map((s) => s.category)));

  return (
    <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-gray-900" : "bg-gray-50")}>
      <div className="max-w-4xl mx-auto">
        <h1 className={cn("text-2xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>
          Technical Skills
        </h1>

        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h2 className={cn("text-lg font-semibold mb-4", isDark ? "text-gray-300" : "text-gray-700")}>
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SKILLS.filter((s) => s.category === category).map((skill) => (
                  <div
                    key={skill.name}
                    className={cn(
                      "p-4 rounded-xl flex items-center gap-4",
                      isDark ? "bg-gray-800" : "bg-white shadow-sm"
                    )}
                  >
                    <div className={cn("p-3 rounded-lg", isDark ? "bg-gray-700" : "bg-gray-100")}>
                      {skill.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                          {skill.name}
                        </span>
                        <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className={cn("h-2 rounded-full overflow-hidden", isDark ? "bg-gray-700" : "bg-gray-200")}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ContactWindow = ({ isDark }: { isDark: boolean }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-gray-900" : "bg-gray-50")}>
      <div className="max-w-2xl mx-auto">
        <h1 className={cn("text-2xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>
          Get In Touch
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <a
            href="mailto:aayushtimalsina789@gmail.com"
            className={cn(
              "p-4 rounded-xl flex items-center gap-4 transition-all hover:scale-105",
              isDark ? "bg-gray-800" : "bg-white shadow-sm"
            )}
          >
            <div className={cn("p-3 rounded-lg", isDark ? "bg-blue-500/20" : "bg-blue-100")}>
              <Mail className={isDark ? "text-blue-400" : "text-blue-600"} />
            </div>
            <div>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Email</p>
              <p className={cn("font-medium text-sm", isDark ? "text-white" : "text-gray-900")}>
                aayushtimalsina789@gmail.com
              </p>
            </div>
          </a>

          <a
            href="tel:+9779845242492"
            className={cn(
              "p-4 rounded-xl flex items-center gap-4 transition-all hover:scale-105",
              isDark ? "bg-gray-800" : "bg-white shadow-sm"
            )}
          >
            <div className={cn("p-3 rounded-lg", isDark ? "bg-green-500/20" : "bg-green-100")}>
              <Phone className={isDark ? "text-green-400" : "text-green-600"} />
            </div>
            <div>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Phone</p>
              <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                +977 9845242492
              </p>
            </div>
          </a>
        </div>

        <div className={cn("rounded-xl p-6", isDark ? "bg-gray-800" : "bg-white shadow-lg")}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={cn("block text-sm font-medium mb-2", isDark ? "text-gray-300" : "text-gray-700")}>
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={cn(
                  "w-full px-4 py-3 rounded-lg outline-none transition-all",
                  isDark
                    ? "bg-gray-700 text-white border border-gray-600 focus:border-blue-500"
                    : "bg-gray-50 text-gray-900 border border-gray-200 focus:border-blue-500"
                )}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className={cn("block text-sm font-medium mb-2", isDark ? "text-gray-300" : "text-gray-700")}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={cn(
                  "w-full px-4 py-3 rounded-lg outline-none transition-all",
                  isDark
                    ? "bg-gray-700 text-white border border-gray-600 focus:border-blue-500"
                    : "bg-gray-50 text-gray-900 border border-gray-200 focus:border-blue-500"
                )}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className={cn("block text-sm font-medium mb-2", isDark ? "text-gray-300" : "text-gray-700")}>
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className={cn(
                  "w-full px-4 py-3 rounded-lg outline-none transition-all resize-none",
                  isDark
                    ? "bg-gray-700 text-white border border-gray-600 focus:border-blue-500"
                    : "bg-gray-50 text-gray-900 border border-gray-200 focus:border-blue-500"
                )}
                placeholder="Your message..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all",
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:opacity-90",
                isDark ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
              )}
            >
              {isSubmitting ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : submitted ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Sent!
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mt-8">
          {[
            { icon: <Github className="w-5 h-5" />, href: "https://github.com/", label: "GitHub" },
            { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
            { icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/t_y_p_e_c", label: "Instagram" },
            { icon: <Facebook className="w-5 h-5" />, href: "https://www.facebook.com/aayush.timalsina.891052", label: "Facebook" },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "p-3 rounded-xl transition-all hover:scale-110",
                isDark ? "bg-gray-800 text-gray-400 hover:text-white" : "bg-white text-gray-600 hover:text-gray-900 shadow-sm"
              )}
              title={social.label}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const SettingsWindow = ({ 
  isDark, 
  setIsDark, 
  brightness, 
  setBrightness, 
  volume, 
  setVolume,
  currentWallpaper,
  setCurrentWallpaper,
}: { 
  isDark: boolean; 
  setIsDark: (v: boolean) => void;
  brightness: number;
  setBrightness: (v: number) => void;
  volume: number;
  setVolume: (v: number) => void;
  currentWallpaper: string;
  setCurrentWallpaper: (v: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [customWallpapers, setCustomWallpapers] = useState<{id: string, name: string, url: string, thumbnail: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const newWallpaper = {
          id: `custom-${Date.now()}`,
          name: file.name.split('.')[0],
          url,
          thumbnail: url,
        };
        setCustomWallpapers([...customWallpapers, newWallpaper]);
        setCurrentWallpaper(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const allWallpapers = [...WALLPAPERS, ...customWallpapers];

  const tabs = [
    { id: "general", label: "General", icon: <Settings className="w-4 h-4" /> },
    { id: "display", label: "Display", icon: <Monitor className="w-4 h-4" /> },
    { id: "wallpaper", label: "Wallpaper", icon: <Image className="w-4 h-4" /> },
    { id: "sound", label: "Sound", icon: <Volume2 className="w-4 h-4" /> },
  ];

  return (
    <div className={cn("h-full flex", isDark ? "bg-gray-900" : "bg-gray-50")}>
      {/* Sidebar */}
      <div className={cn("w-48 p-4 border-r", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200")}>
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                activeTab === tab.id
                  ? isDark ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                  : isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-200"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === "general" && (
          <div className="max-w-xl">
            <h2 className={cn("text-xl font-semibold mb-6", isDark ? "text-white" : "text-gray-900")}>
              General Settings
            </h2>

            <div className="space-y-4">
              {/* Appearance */}
              <div className={cn("p-4 rounded-xl", isDark ? "bg-gray-800" : "bg-white")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-lg", isDark ? "bg-purple-500/20" : "bg-purple-100")}>
                      {isDark ? <Moon className="text-purple-400" /> : <Sun className="text-purple-600" />}
                    </div>
                    <div>
                      <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                        Appearance
                      </p>
                      <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                        {isDark ? "Dark mode" : "Light mode"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDark(!isDark)}
                    className={cn(
                      "w-14 h-8 rounded-full p-1 transition-colors",
                      isDark ? "bg-blue-600" : "bg-gray-300"
                    )}
                  >
                    <motion.div
                      animate={{ x: isDark ? 24 : 0 }}
                      className="w-6 h-6 rounded-full bg-white shadow-md"
                    />
                  </button>
                </div>
              </div>

              {/* About */}
              <div className={cn("p-4 rounded-xl", isDark ? "bg-gray-800" : "bg-white")}>
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-lg", isDark ? "bg-green-500/20" : "bg-green-100")}>
                    <Info className={isDark ? "text-green-400" : "text-green-600"} />
                  </div>
                  <div>
                    <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                      About System
                    </p>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                      CyberOS v3.0 - Portfolio Edition
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "display" && (
          <div className="max-w-xl">
            <h2 className={cn("text-xl font-semibold mb-6", isDark ? "text-white" : "text-gray-900")}>
              Display Settings
            </h2>

            <div className={cn("p-4 rounded-xl", isDark ? "bg-gray-800" : "bg-white")}>
              <div className="flex items-center gap-4 mb-4">
                <div className={cn("p-3 rounded-lg", isDark ? "bg-yellow-500/20" : "bg-yellow-100")}>
                  <Sun className={isDark ? "text-yellow-400" : "text-yellow-600"} />
                </div>
                <div>
                  <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                    Brightness
                  </p>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                    {brightness}%
                  </p>
                </div>
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="cyber-slider w-full"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "wallpaper" && (
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-gray-900")}>
                Wallpaper
              </h2>
              <button
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
                  isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
                )}
              >
                <Plus className="w-4 h-4" />
                Upload Custom
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCustomWallpaperUpload}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allWallpapers.map((wallpaper) => (
                <button
                  key={wallpaper.id}
                  onClick={() => setCurrentWallpaper(wallpaper.url)}
                  className={cn(
                    "relative rounded-xl overflow-hidden aspect-video group",
                    currentWallpaper === wallpaper.url ? "ring-2 ring-blue-500" : ""
                  )}
                >
                  <img
                    src={wallpaper.thumbnail}
                    alt={wallpaper.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium">{wallpaper.name}</span>
                  </div>
                  {currentWallpaper === wallpaper.url && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "sound" && (
          <div className="max-w-xl">
            <h2 className={cn("text-xl font-semibold mb-6", isDark ? "text-white" : "text-gray-900")}>
              Sound Settings
            </h2>

            <div className={cn("p-4 rounded-xl", isDark ? "bg-gray-800" : "bg-white")}>
              <div className="flex items-center gap-4 mb-4">
                <div className={cn("p-3 rounded-lg", isDark ? "bg-pink-500/20" : "bg-pink-100")}>
                  {volume === 0 ? <VolumeX className={isDark ? "text-pink-400" : "text-pink-600"} /> : volume < 50 ? <Volume1 className={isDark ? "text-pink-400" : "text-pink-600"} /> : <Volume2 className={isDark ? "text-pink-400" : "text-pink-600"} />}
                </div>
                <div>
                  <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                    System Volume
                  </p>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                    {volume}%
                  </p>
                </div>
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="cyber-slider volume-slider w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FinderWindow = ({ isDark, fileSystem }: { isDark: boolean; fileSystem?: FileSystemNode }) => {
  const [selectedFolder, setSelectedFolder] = useState<string[]>(["home", "aayush"]);
  const [currentPath, setCurrentPath] = useState(["home", "aayush"]);
  
  const getNodeAtPath = (path: string[]): FileSystemNode | null => {
    if (!fileSystem) return null;
    let node = fileSystem;
    for (const part of path) {
      if (node.children && node.children[part]) {
        node = node.children[part];
      } else {
        return null;
      }
    }
    return node;
  };

  const currentNode = getNodeAtPath(currentPath);

  return (
    <div className={cn("h-full flex flex-col", isDark ? "bg-gray-900" : "bg-gray-50")}>
      {/* Toolbar */}
      <div className={cn("px-4 py-3 border-b", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200")}>
        <div className="text-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {currentPath.length === 0 ? "/" : "/" + currentPath.join("/")}
        </div>
      </div>

      <div className={cn("h-full flex", isDark ? "bg-gray-900" : "bg-gray-50")}>
        {/* Sidebar */}
        <div className={cn("w-48 p-4 border-r", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200")}>
          <div className="space-y-1">
            <p className={cn("text-xs font-semibold uppercase tracking-wider mb-3 px-3", isDark ? "text-gray-500" : "text-gray-400")}>
              Quick Access
            </p>
            {[
              { name: "Home", path: ["home", "aayush"] },
              { name: "Projects", path: ["home", "aayush", "projects"] },
              { name: "Resume", path: ["home", "aayush", "resume"] },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setCurrentPath(item.path)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
                  JSON.stringify(currentPath) === JSON.stringify(item.path)
                    ? isDark ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                    : isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-200"
                )}
              >
                <FolderOpen className="w-4 h-4" />
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {currentNode && currentNode.type === "directory" && currentNode.children ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Object.values(currentNode.children).map((item) => (
                <motion.button
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (item.type === "directory") {
                      setCurrentPath([...currentPath, item.name]);
                    }
                  }}
                  className="flex flex-col items-center p-4 rounded-xl transition-colors hover:bg-white/5"
                >
                  <div className="mb-2">
                    {item.type === "directory" ? (
                      <FolderOpen className="w-8 h-8 text-blue-500" />
                    ) : (
                      <FileText className="w-8 h-8 text-gray-500" />
                    )}
                  </div>
                  <span className={cn("text-sm font-medium text-center truncate w-full", isDark ? "text-gray-300" : "text-gray-700")}>
                    {item.name}
                  </span>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className={cn("text-center py-12", isDark ? "text-gray-400" : "text-gray-600")}>
              Empty folder
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CalculatorWindow = ({ isDark }: { isDark: boolean }) => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputOperation = (op: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      setPreviousValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(op);
  };

  const calculate = (firstValue: number, secondValue: number, op: string) => {
    switch (op) {
      case "+": return firstValue + secondValue;
      case "-": return firstValue - secondValue;
      case "×": return firstValue * secondValue;
      case "÷": return firstValue / secondValue;
      default: return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const buttons = [
    { label: "C", onClick: clear, className: "bg-red-500 text-white" },
    { label: "±", onClick: () => setDisplay(String(parseFloat(display) * -1)), className: isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900" },
    { label: "%", onClick: () => setDisplay(String(parseFloat(display) / 100)), className: isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900" },
    { label: "÷", onClick: () => inputOperation("÷"), className: "bg-orange-500 text-white" },
    { label: "7", onClick: () => inputNumber("7"), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" },
    { label: "8", onClick: () => inputNumber("8"), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" },
    { label: "9", onClick: () => inputNumber("9"), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" },
    { label: "×", onClick: () => inputOperation("×"), className: "bg-orange-500 text-white" },
    { label: "4", onClick: () => inputNumber("4"), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" },
    { label: "5", onClick: () => inputNumber("5"), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" },
    { label: "6", onClick: () => inputNumber("6"), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" },
    { label: "-", onClick: () => inputOperation("-"), className: "bg-orange-500 text-white" },
    { label: "1", onClick: () => inputNumber("1"), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" },
    { label: "2", onClick: () => inputNumber("2"), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" },
    { label: "3", onClick: () => inputNumber("3"), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" },
    { label: "+", onClick: () => inputOperation("+"), className: "bg-orange-500 text-white" },
    { label: "0", onClick: () => inputNumber("0"), className: isDark ? "bg-gray-800 text-white col-span-2" : "bg-white text-gray-900 col-span-2" },
    { label: ".", onClick: () => inputNumber("."), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" },
    { label: "=", onClick: performCalculation, className: "bg-orange-500 text-white" },
  ];

  return (
    <div className={cn("h-full flex items-center justify-center p-6", isDark ? "bg-gray-900" : "bg-gray-100")}>
      <div className={cn("w-72 rounded-2xl overflow-hidden shadow-2xl", isDark ? "bg-gray-800" : "bg-gray-200")}>
        <div className={cn("p-4 text-right text-4xl font-light", isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900")}>
          {display}
        </div>
        <div className="grid grid-cols-4 gap-px">
          {buttons.map((btn) => (
            <button
              key={btn.label}
              onClick={btn.onClick}
              className={cn(
                "h-16 text-xl font-medium transition-all hover:opacity-80 active:scale-95",
                btn.className,
                btn.label === "0" ? "col-span-2" : ""
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const CalendarWindow = ({ isDark }: { isDark: boolean }) => {
  const [currentDate] = useState(new Date());
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-gray-900" : "bg-gray-50")}>
      <div className="max-w-md mx-auto">
        <div className={cn("rounded-2xl overflow-hidden shadow-lg", isDark ? "bg-gray-800" : "bg-white")}>
          <div className={cn("p-6 text-center", isDark ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gradient-to-r from-blue-500 to-purple-500")}>
            <h2 className="text-white text-2xl font-bold">
              {format(currentDate, "MMMM yyyy")}
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className={cn("text-center text-sm font-medium py-2", isDark ? "text-gray-400" : "text-gray-600")}>
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map((day) => {
                const isToday = day === new Date().getDate() && 
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear();
                return (
                  <div
                    key={day}
                    className={cn(
                      "aspect-square flex items-center justify-center rounded-lg text-sm cursor-pointer transition-all",
                      isToday
                        ? "bg-blue-500 text-white font-bold"
                        : isDark
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotesWindow = ({ isDark }: { isDark: boolean }) => {
  const [notes, setNotes] = useState([
    { id: "1", title: "Project Ideas", content: "1. Network Security Scanner\n2. Password Manager\n3. Vulnerability Assessment Tool", date: "2024-01-15" },
    { id: "2", title: "Learning Goals", content: "- Complete CEH certification\n- Learn Rust programming\n- Master cloud security", date: "2024-01-14" },
    { id: "3", title: "Meeting Notes", content: "Discussed penetration testing methodologies and tools. Key takeaways: Always document findings, use proper channels for disclosure.", date: "2024-01-13" },
  ]);
  const [selectedNote, setSelectedNote] = useState(notes[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(selectedNote.content);

  const handleSave = () => {
    setNotes(notes.map(n => n.id === selectedNote.id ? { ...n, content: editContent } : n));
    setSelectedNote({ ...selectedNote, content: editContent });
    setIsEditing(false);
  };

  return (
    <div className={cn("h-full flex", isDark ? "bg-gray-900" : "bg-gray-50")}>
      {/* Sidebar */}
      <div className={cn("w-64 border-r", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200")}>
        <div className="p-4">
          <button
            onClick={() => {
              const newNote = { id: Date.now().toString(), title: "New Note", content: "", date: new Date().toISOString().split("T")[0] };
              setNotes([newNote, ...notes]);
              setSelectedNote(newNote);
              setEditContent("");
              setIsEditing(true);
            }}
            className={cn(
              "w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors",
              isDark ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900" : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
            )}
          >
            <Plus className="w-4 h-4" />
            New Note
          </button>
        </div>
        <div className="overflow-auto" style={{ maxHeight: "calc(100% - 80px)" }}>
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => {
                setSelectedNote(note);
                setEditContent(note.content);
                setIsEditing(false);
              }}
              className={cn(
                "w-full text-left p-4 border-b transition-colors",
                selectedNote.id === note.id
                  ? isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
                  : isDark ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-200 hover:bg-gray-50"
              )}
            >
              <h3 className={cn("font-medium truncate", isDark ? "text-white" : "text-gray-900")}>
                {note.title}
              </h3>
              <p className={cn("text-sm truncate mt-1", isDark ? "text-gray-400" : "text-gray-500")}>
                {note.content || "No additional text"}
              </p>
              <p className={cn("text-xs mt-2", isDark ? "text-gray-500" : "text-gray-400")}>
                {note.date}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-gray-900")}>
            {selectedNote.title}
          </h2>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditContent(selectedNote.content);
                    setIsEditing(false);
                  }}
                  className={cn("px-4 py-2 rounded-lg transition-colors", isDark ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300")}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className={cn("p-2 rounded-lg transition-colors", isDark ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300")}
              >
                <Edit3 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className={cn(
              "w-full h-full p-4 rounded-lg resize-none outline-none",
              isDark ? "bg-gray-800 text-white border border-gray-700" : "bg-white text-gray-900 border border-gray-200"
            )}
            style={{ minHeight: "400px" }}
          />
        ) : (
          <div className={cn("whitespace-pre-wrap", isDark ? "text-gray-300" : "text-gray-700")}>
            {selectedNote.content || "No content"}
          </div>
        )}
      </div>
    </div>
  );
};

// Help Window Component
const HelpWindow = ({ isDark }: { isDark: boolean }) => {
  return (
    <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-gray-900" : "bg-gray-50")}>
      <div className="max-w-2xl mx-auto">
        <div className={cn("rounded-2xl overflow-hidden shadow-xl", isDark ? "bg-gray-800" : "bg-white")}>
          <div className={cn("p-6 text-center", isDark ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gradient-to-r from-blue-500 to-purple-500")}>
            <h1 className="text-2xl font-bold text-white">CyberOS Help</h1>
            <p className="text-white/80 mt-2">Your guide to using CyberOS</p>
          </div>
          <div className="p-6 space-y-6">
            <section>
              <h2 className={cn("text-lg font-semibold mb-3", isDark ? "text-white" : "text-gray-900")}>Quick Start</h2>
              <p className={cn("text-sm leading-relaxed", isDark ? "text-gray-300" : "text-gray-600")}>
                Welcome to CyberOS, a fully functional OS-style portfolio. Use the Dock at the bottom to open applications, 
                or click the Finder icon to access the Launchpad. The menu bar at the top provides quick access to system functions.
              </p>
            </section>
            
            <section>
              <h2 className={cn("text-lg font-semibold mb-3", isDark ? "text-white" : "text-gray-900")}>Applications</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Terminal", desc: "Command line interface" },
                  { name: "Finder", desc: "File management" },
                  { name: "Settings", desc: "System preferences" },
                  { name: "Calculator", desc: "Basic calculations" },
                  { name: "Calendar", desc: "View dates" },
                  { name: "Notes", desc: "Take notes" },
                ].map((app) => (
                  <div key={app.name} className={cn("p-3 rounded-lg", isDark ? "bg-gray-700" : "bg-gray-100")}>
                    <p className={cn("font-medium text-sm", isDark ? "text-white" : "text-gray-900")}>{app.name}</p>
                    <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>{app.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className={cn("text-lg font-semibold mb-3", isDark ? "text-white" : "text-gray-900")}>System Features</h2>
              <ul className={cn("space-y-2 text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full" /> Control Center - Access Wi-Fi, Bluetooth, Brightness, Volume</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full" /> Dark/Light Mode - Toggle appearance in Settings</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-purple-500 rounded-full" /> Custom Wallpapers - Upload your own background</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-yellow-500 rounded-full" /> Window Management - Drag, minimize, maximize windows</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// Keyboard Shortcuts Window Component
const ShortcutsWindow = ({ isDark }: { isDark: boolean }) => {
  const shortcuts = [
    { category: "File", items: [
      { key: "⌘N", action: "New Terminal" },
      { key: "⌘O", action: "Open Launchpad" },
      { key: "⌘W", action: "Close Window" },
      { key: "⌘Q", action: "Exit" },
    ]},
    { category: "Edit", items: [
      { key: "⌘Z", action: "Undo" },
      { key: "⌘⇧Z", action: "Redo" },
      { key: "⌘X", action: "Cut" },
      { key: "⌘C", action: "Copy" },
      { key: "⌘V", action: "Paste" },
      { key: "⌘A", action: "Select All" },
      { key: "⌘,", action: "Preferences" },
    ]},
    { category: "View", items: [
      { key: "F4", action: "Show Launchpad" },
      { key: "⌃⌘F", action: "Enter Full Screen" },
      { key: "F3", action: "Show All Windows" },
      { key: "⌘⌥D", action: "Toggle Dark Mode" },
    ]},
    { category: "Window", items: [
      { key: "⌘M", action: "Minimize Window" },
      { key: "⌘⇧M", action: "Maximize Window" },
      { key: "⌘⇧]", action: "Next Window" },
    ]},
  ];

  return (
    <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-gray-900" : "bg-gray-50")}>
      <div className="max-w-2xl mx-auto">
        <h1 className={cn("text-2xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>Keyboard Shortcuts</h1>
        <div className="space-y-6">
          {shortcuts.map((category) => (
            <div key={category.category} className={cn("rounded-xl overflow-hidden", isDark ? "bg-gray-800" : "bg-white shadow-sm")}>
              <div className={cn("px-4 py-3 font-semibold", isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900")}>
                {category.category}
              </div>
              <div className="divide-y divide-gray-700/10">
                {category.items.map((item, idx) => (
                  <div key={idx} className={cn("flex items-center justify-between px-4 py-3", isDark ? "text-gray-300" : "text-gray-700")}>
                    <span className="text-sm">{item.action}</span>
                    <kbd className={cn("px-2 py-1 rounded text-xs font-mono", isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700")}>
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// About CyberOS Window Component
const AboutOSWindow = ({ isDark }: { isDark: boolean }) => {
  return (
    <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-gray-900" : "bg-gray-50")}>
      <div className="max-w-xl mx-auto">
        <div className={cn("rounded-2xl overflow-hidden shadow-xl", isDark ? "bg-gray-800" : "bg-white")}>
          <div className={cn("p-8 text-center", isDark ? "bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" : "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500")}>
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">CyberOS</h1>
            <p className="text-white/80 text-sm">Version 3.0 Portfolio Edition</p>
          </div>
          <div className="p-6 space-y-4">
            <p className={cn("text-sm text-center", isDark ? "text-gray-400" : "text-gray-600")}>
              A fully functional OS-style portfolio for Aayush Timalsina, a cybersecurity student.
            </p>
            
            <div className={cn("p-4 rounded-xl", isDark ? "bg-gray-700/50" : "bg-gray-100")}>
              <h3 className={cn("font-semibold mb-2", isDark ? "text-white" : "text-gray-900")}>Developer</h3>
              <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>Aayush Timalsina</p>
              <p className={cn("text-xs mt-1", isDark ? "text-gray-400" : "text-gray-500")}>Cybersecurity Student, Nepal</p>
            </div>

            <div className={cn("p-4 rounded-xl", isDark ? "bg-gray-700/50" : "bg-gray-100")}>
              <h3 className={cn("font-semibold mb-2", isDark ? "text-white" : "text-gray-900")}>Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Tailwind CSS", "Framer Motion"].map((tech) => (
                  <span key={tech} className={cn("px-2 py-1 rounded text-xs", isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600")}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className={cn("text-center text-xs pt-4 border-t", isDark ? "text-gray-500 border-gray-700" : "text-gray-400 border-gray-200")}>
              © 2024 CyberOS. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Control Center Component
const ControlCenter = ({
  isOpen,
  onClose,
  isDark,
  setIsDark,
  brightness,
  setBrightness,
  volume,
  setVolume,
  wifiEnabled,
  setWifiEnabled,
  bluetoothEnabled,
  setBluetoothEnabled,
  useVideoWallpaper,
  setUseVideoWallpaper,
}: {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  brightness: number;
  setBrightness: (v: number) => void;
  volume: number;
  setVolume: (v: number) => void;
  wifiEnabled: boolean;
  setWifiEnabled: (v: boolean) => void;
  bluetoothEnabled: boolean;
  setBluetoothEnabled: (v: boolean) => void;
  useVideoWallpaper: boolean;
  setUseVideoWallpaper: (v: boolean) => void;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className={cn(
              "fixed top-10 right-4 w-80 rounded-2xl p-4 z-[160] shadow-2xl",
              isDark ? "bg-gray-800/95 backdrop-blur-xl" : "bg-white/95 backdrop-blur-xl"
            )}
          >
            {/* Connectivity */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setWifiEnabled(!wifiEnabled)}
                className={cn(
                  "p-4 rounded-xl flex flex-col items-center gap-2 transition-all",
                  wifiEnabled ? "bg-blue-500 text-white" : isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600"
                )}
              >
                {wifiEnabled ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
                <span className="text-sm font-medium">{wifiEnabled ? "Wi-Fi On" : "Wi-Fi Off"}</span>
              </button>
              <button
                onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
                className={cn(
                  "p-4 rounded-xl flex flex-col items-center gap-2 transition-all",
                  bluetoothEnabled ? "bg-blue-500 text-white" : isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600"
                )}
              >
                <Bluetooth className="w-6 h-6" />
                <span className="text-sm font-medium">{bluetoothEnabled ? "Bluetooth On" : "Bluetooth Off"}</span>
              </button>
            </div>

            {/* Brightness */}
            <div className={cn("p-4 rounded-xl mb-4", isDark ? "bg-gray-700" : "bg-gray-100")}>
              <div className="flex items-center gap-3 mb-3">
                <Sun className="w-5 h-5" />
                <span className={cn("text-sm font-medium flex-1", isDark ? "text-white" : "text-gray-900")}>
                  Brightness
                </span>
                <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>{brightness}%</span>
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="cyber-slider w-full"
                />
              </div>
            </div>

            {/* Volume */}
            <div className={cn("p-4 rounded-xl mb-4", isDark ? "bg-gray-700" : "bg-gray-100")}>
              <div className="flex items-center gap-3 mb-3">
                {volume === 0 ? <VolumeX className="w-5 h-5" /> : volume < 50 ? <Volume1 className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                <span className={cn("text-sm font-medium flex-1", isDark ? "text-white" : "text-gray-900")}>
                  Volume
                </span>
                <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>{volume}%</span>
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="cyber-slider volume-slider w-full"
                />
              </div>
            </div>

            {/* Dark Mode */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={cn(
                "w-full p-4 rounded-xl flex items-center justify-between transition-all mb-3",
                isDark ? "bg-gray-700" : "bg-gray-100"
              )}
            >
              <div className="flex items-center gap-3">
                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>
                  {isDark ? "Dark Mode" : "Light Mode"}
                </span>
              </div>
              <div className={cn("w-12 h-6 rounded-full p-1", isDark ? "bg-blue-500" : "bg-gray-300")}>
                <motion.div
                  animate={{ x: isDark ? 24 : 0 }}
                  className="w-4 h-4 rounded-full bg-white"
                />
              </div>
            </button>

            {/* Wallpaper Mode */}
            <button
              onClick={() => setUseVideoWallpaper(!useVideoWallpaper)}
              className={cn(
                "w-full p-4 rounded-xl flex items-center justify-between transition-all",
                isDark ? "bg-gray-700" : "bg-gray-100"
              )}
            >
              <div className="flex items-center gap-3">
                <Image className="w-5 h-5" />
                <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>
                  {useVideoWallpaper ? "Live Video" : "Static Image"}
                </span>
              </div>
              <div className={cn("w-12 h-6 rounded-full p-1", useVideoWallpaper ? "bg-purple-500" : "bg-gray-300")}>
                <motion.div
                  animate={{ x: useVideoWallpaper ? 24 : 0 }}
                  className="w-4 h-4 rounded-full bg-white"
                />
              </div>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Menu Dropdown Component
const MenuDropdown = ({
  isOpen,
  onClose,
  items,
  isDark,
  position,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: { label: string; shortcut?: string; action: () => void; separator?: boolean }[];
  isDark: boolean;
  position: { x: number; y: number };
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.1 }}
            className={cn(
              "fixed rounded-lg py-1 min-w-[200px] z-[120] shadow-2xl",
              isDark ? "bg-gray-800/95 backdrop-blur-xl border border-gray-700" : "bg-white/95 backdrop-blur-xl border border-gray-200"
            )}
            style={{ left: position.x, top: position.y }}
          >
            {items.map((item, index) => (
              item.separator ? (
                <div key={index} className={cn("h-px mx-2 my-1", isDark ? "bg-gray-700" : "bg-gray-200")} />
              ) : (
                <button
                  key={index}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className={cn(
                    "w-full px-4 py-1.5 text-left text-sm flex items-center justify-between transition-colors",
                    isDark ? "text-gray-200 hover:bg-blue-600 hover:text-white" : "text-gray-800 hover:bg-blue-500 hover:text-white"
                  )}
                >
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <span className={cn("text-xs ml-4", isDark ? "text-gray-500" : "text-gray-400")}>
                      {item.shortcut}
                    </span>
                  )}
                </button>
              )
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Premium Music Player Component
const MusicPlayer = ({
  isPlaying,
  setIsPlaying,
  currentSong,
  setCurrentSong,
  customUrl,
  setCustomUrl,
  showUrlInput,
  setShowUrlInput,
  musicCurrentTime,
  setMusicCurrentTime,
  duration,
  setDuration,
  playerVolume,
  setPlayerVolume,
  audioRef,
  isDark
}: {
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  currentSong: { title: string; artist: string; url: string };
  setCurrentSong: (song: { title: string; artist: string; url: string }) => void;
  customUrl: string;
  setCustomUrl: (url: string) => void;
  showUrlInput: boolean;
  setShowUrlInput: (val: boolean) => void;
  musicCurrentTime: number;
  setMusicCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (dur: number) => void;
  playerVolume: number;
  setPlayerVolume: (vol: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  isDark: boolean;
}) => {
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setMusicCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setMusicCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setPlayerVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleAddCustomUrl = () => {
    if (customUrl.trim()) {
      setCurrentSong({
        title: "Custom Track",
        artist: "Unknown Artist",
        url: customUrl
      });
      setCustomUrl("");
      setShowUrlInput(false);
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="fixed top-20 right-6 z-[70] w-80"
    >
      <div className={cn(
        "rounded-2xl backdrop-blur-2xl p-6 shadow-2xl",
        isDark 
          ? "bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80 border border-cyan-500/20"
          : "bg-gradient-to-br from-white/80 via-gray-50/70 to-white/80 border border-cyan-500/30"
      )}>
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-xl -z-10" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500">
              <Music className="w-4 h-4 text-white" />
            </div>
            <span className={cn(
              "font-semibold text-sm",
              isDark ? "text-white" : "text-gray-900"
            )}>
              Now Playing
            </span>
          </div>
          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              isDark 
                ? "hover:bg-gray-700/50 text-gray-400 hover:text-cyan-400"
                : "hover:bg-gray-200/50 text-gray-600 hover:text-cyan-600"
            )}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Custom URL Input */}
        <AnimatePresence>
          {showUrlInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="Enter music URL..."
                  className={cn(
                    "flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all",
                    isDark
                      ? "bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500"
                      : "bg-white/50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-cyan-500"
                  )}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomUrl()}
                />
                <button
                  onClick={handleAddCustomUrl}
                  className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                  Add
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Album Art / Visualizer */}
        <div className="relative mb-4 aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: isPlaying ? [1, 1.2, 1] : 1,
                rotate: isPlaying ? 360 : 0
              }}
              transition={{
                scale: { repeat: Infinity, duration: 2 },
                rotate: { repeat: Infinity, duration: 10, ease: "linear" }
              }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center"
            >
              <Music className="w-16 h-16 text-white" />
            </motion.div>
          </div>
          
          {/* Animated bars when playing */}
          {isPlaying && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: ["8px", `${Math.random() * 24 + 8}px`, "8px"]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    delay: i * 0.1
                  }}
                  className="w-1 bg-white/80 rounded-full"
                />
              ))}
            </div>
          )}
        </div>

        {/* Song Info */}
        <div className="text-center mb-4">
          <h3 className={cn(
            "font-bold text-lg mb-1 truncate",
            isDark ? "text-white" : "text-gray-900"
          )}>
            {currentSong.title}
          </h3>
          <p className={cn(
            "text-sm truncate",
            isDark ? "text-gray-400" : "text-gray-600"
          )}>
            {currentSong.artist}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={musicCurrentTime}
            onChange={handleSeek}
            className="w-full h-1 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-track]:bg-gray-600/30
              [&::-webkit-slider-track]:rounded-full
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-3
              [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-gradient-to-r
              [&::-webkit-slider-thumb]:from-cyan-500
              [&::-webkit-slider-thumb]:to-purple-500
              [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs mt-1">
            <span className={isDark ? "text-gray-500" : "text-gray-600"}>
              {formatTime(musicCurrentTime)}
            </span>
            <span className={isDark ? "text-gray-500" : "text-gray-600"}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
              }
            }}
            className={cn(
              "p-2 rounded-full transition-all",
              isDark 
                ? "hover:bg-gray-700/50 text-gray-400 hover:text-white"
                : "hover:bg-gray-200/50 text-gray-600 hover:text-gray-900"
            )}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handlePlayPause}
            className="p-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
              }
            }}
            className={cn(
              "p-2 rounded-full transition-all",
              isDark 
                ? "hover:bg-gray-700/50 text-gray-400 hover:text-white"
                : "hover:bg-gray-200/50 text-gray-600 hover:text-gray-900"
            )}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Volume2 className={cn(
            "w-4 h-4",
            isDark ? "text-gray-400" : "text-gray-600"
          )} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={playerVolume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-track]:bg-gray-600/30
              [&::-webkit-slider-track]:rounded-full
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-3
              [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-gradient-to-r
              [&::-webkit-slider-thumb]:from-cyan-500
              [&::-webkit-slider-thumb]:to-purple-500
              [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <span className={cn(
            "text-xs w-8 text-right",
            isDark ? "text-gray-500" : "text-gray-600"
          )}>
            {Math.round(playerVolume * 100)}%
          </span>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={currentSong.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </motion.div>
  );
};

// Login Screen Component - Animated Portfolio Launch
const LoginScreen = ({ onLogin, isDark }: { onLogin: () => void; isDark: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] overflow-hidden"
      style={{ background: '#000', fontFamily: 'Inter, sans-serif' }}
    >
      <div className="w-full h-full relative overflow-hidden" style={{ background: '#030308' }}>
        
        {/* Background Base */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, #06060f 0%, #0a0a1a 20%, #0d0f2b 40%, #0a0c20 60%, #08081a 80%, #050510 100%)',
          }}
        />

        {/* Grid Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute inset-0 z-[1]"
          style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Scanlines */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
          }}
        />

        {/* Glowing Orbs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="absolute w-[50vw] h-[50vw] rounded-full z-[1] blur-[80px] top-[5%] left-[-10%]"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)' }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [0, 10, 0], y: [0, -15, 0] }}
            transition={{ duration: 6, delay: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="absolute w-[60vw] h-[60vw] rounded-full z-[1] blur-[80px] top-[35%] right-[-15%]"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)' }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], x: [0, -10, 0], y: [0, 10, 0] }}
            transition={{ duration: 8, delay: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 2 }}
          className="absolute w-[40vw] h-[40vw] rounded-full z-[1] blur-[80px] bottom-[10%] left-[5%]"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [0, 10, 0], y: [0, -15, 0] }}
            transition={{ duration: 7, delay: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full"
          />
        </motion.div>

        {/* Corner Brackets */}
        {[
          { pos: 'top-6 left-6', border: 'border-t-2 border-l-2 border-blue-500/40', delay: 1.5 },
          { pos: 'top-6 right-6', border: 'border-t-2 border-r-2 border-blue-500/40', delay: 1.7 },
          { pos: 'bottom-6 left-6', border: 'border-b-2 border-l-2 border-purple-500/40', delay: 1.9 },
          { pos: 'bottom-6 right-6', border: 'border-b-2 border-r-2 border-purple-500/40', delay: 2.1 },
        ].map((corner, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: corner.delay }}
            className={`absolute w-[30px] h-[30px] z-[15] ${corner.pos} ${corner.border}`}
          />
        ))}

        {/* Side Text */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
          className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-blue-500/20 tracking-[4px] uppercase z-10"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          CyberOS v3.0
        </motion.span>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
          className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[10px] text-blue-500/20 tracking-[4px] uppercase z-10"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          Portfolio 2026
        </motion.span>

        {/* Floating Particles */}
        {[
          { size: 3, top: '12%', left: '10%', delay: 2, color: '#3b82f6' },
          { size: 2, top: '22%', right: '15%', delay: 2.3, color: '#8b5cf6' },
          { size: 3, top: '48%', left: '6%', delay: 2.6, color: '#3b82f6' },
          { size: 4, top: '65%', right: '8%', delay: 2.9, color: '#3b82f6' },
          { size: 2, top: '80%', left: '20%', delay: 3.2, color: '#8b5cf6' },
          { size: 3, top: '35%', left: '88%', delay: 3.5, color: '#3b82f6' },
        ].map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: p.delay }}
            className="absolute rounded-full z-[3]"
            style={{
              width: p.size, height: p.size,
              top: p.top, left: p.left || undefined, right: p.right || undefined,
              background: p.color,
            }}
          >
            <motion.div
              animate={{
                y: [0, -15, -5, -20, 0],
                x: [0, 8, -5, 12, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full"
            />
          </motion.div>
        ))}

        {/* Glitch Flash */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0, 0, 1, 0, 0, 1, 0],
          }}
          transition={{
            times: [0, 0.05, 0.1, 0.4, 0.45, 0.5, 0.7, 0.75, 0.8],
            duration: 10,
            delay: 2.4,
          }}
          className="absolute inset-0 z-[200] pointer-events-none"
          style={{ background: 'rgba(59,130,246,0.08)' }}
        />

        {/* Horizontal Scan Lines */}
        <motion.div
          initial={{ top: '0%', opacity: 0.8 }}
          animate={{ top: '100%', opacity: 0 }}
          transition={{ duration: 3, delay: 2.5, ease: "easeInOut" }}
          className="absolute left-0 right-0 h-[2px] z-[150]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.4), rgba(139,92,246,0.3), transparent)',
            boxShadow: '0 0 20px rgba(59,130,246,0.3)',
          }}
        />

        <motion.div
          initial={{ top: '0%', opacity: 0.8 }}
          animate={{ top: '100%', opacity: 0 }}
          transition={{ duration: 3, delay: 6, ease: "easeInOut" }}
          className="absolute left-0 right-0 h-[2px] z-[150]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.4), rgba(139,92,246,0.3), transparent)',
            boxShadow: '0 0 20px rgba(59,130,246,0.3)',
          }}
        />

        {/* Typing Lines Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ times: [0, 0.1, 0.8, 1], duration: 1.5, delay: 2.6 }}
          className="absolute top-0 left-0 right-0 z-[90] px-8 py-16"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {[
            { text: '> initializing portfolio...', delay: 2.7 },
            { text: '> loading modules: [react, framer-motion, tailwind]', delay: 2.9 },
            { text: '> connecting to aayush-timalsina.com.np', delay: 3.1 },
            { text: '> status: DEPLOYED ✓', delay: 3.3, color: '#22c55e' },
          ].map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: line.delay }}
              className="text-xs mb-1"
              style={{ color: line.color || 'rgba(59,130,246,0.5)' }}
            >
              {line.text}
            </motion.div>
          ))}
        </motion.div>

        {/* Boot Screen */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 2.5 }}
          className="absolute inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: '#030308', pointerEvents: 'none' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-20 h-20 border-[3px] border-blue-500 rounded-2xl flex items-center justify-center mb-6"
            style={{ boxShadow: '0 0 30px rgba(59,130,246,0.3), inset 0 0 20px rgba(59,130,246,0.1)' }}
          >
            <Shield className="w-10 h-10 text-blue-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-sm text-blue-500 tracking-[6px] uppercase mb-6"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            CyberOS
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.2 }}
            className="w-[200px] h-[3px] rounded-sm overflow-hidden"
            style={{ background: 'rgba(59,130,246,0.15)' }}
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.2, delay: 1.3 }}
              className="h-full rounded-sm"
              style={{
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                boxShadow: '0 0 10px rgba(59,130,246,0.5)',
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.5 }}
            className="text-[11px] text-blue-500/40 mt-4"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            Initializing secure environment...
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-between px-8 py-16">
          
          {/* Top Section */}
          <div className="flex flex-col items-center w-full">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 3 }}
              className="text-xs text-blue-400/60 tracking-[2px]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              &gt; deploy --production
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block w-[9px] h-4 bg-blue-400/70 ml-1 align-middle"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 3.5 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full mt-4"
              style={{
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.2)',
              }}
            >
              <motion.div
                animate={{ boxShadow: ['0 0 10px rgba(34,197,94,0.6)', '0 0 18px rgba(34,197,94,0.9)', '0 0 10px rgba(34,197,94,0.6)'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-500"
              />
              <span className="text-xs text-gray-400 tracking-[3px] uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Now Live
              </span>
            </motion.div>
          </div>

          {/* Middle Section */}
          <div className="flex flex-col items-center w-full flex-1 justify-center">
            
            {/* Profile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 4 }}
              className="relative mb-9"
            >
              <motion.div
                animate={{
                  background: [
                    'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
                    'conic-gradient(from 360deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
                  ],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="w-40 h-40 rounded-full p-[3px]"
                style={{ boxShadow: '0 0 40px rgba(59,130,246,0.25), 0 0 80px rgba(139,92,246,0.15)' }}
              >
                <img
                  src={PROFILE_IMAGE}
                  alt="Aayush Timalsina"
                  className="w-full h-full rounded-full object-cover border-[3px] border-[#0a0a1a]"
                />
              </motion.div>

              {/* Decoration Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-[200px] h-[200px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-blue-500/15"
              >
                <div className="absolute w-1.5 h-1.5 rounded-full bg-blue-500 top-[-3px] left-1/2 -translate-x-1/2" style={{ boxShadow: '0 0 10px rgba(59,130,246,0.8)' }} />
                <div className="absolute w-1.5 h-1.5 rounded-full bg-blue-500 bottom-[-3px] left-1/2 -translate-x-1/2" style={{ boxShadow: '0 0 10px rgba(59,130,246,0.8)' }} />
              </motion.div>

              {/* Hex Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                className="absolute w-[220px] h-[220px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/8"
              />
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 5 }}
              className="text-[15px] font-normal text-slate-400/80 tracking-[8px] uppercase mb-3"
            >
              Finally
            </motion.div>

            <div className="text-center mb-5">
              <motion.div
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, delay: 5.3 }}
                className="text-5xl font-black leading-tight tracking-tight mb-1"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 30%, #3b82f6 60%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                My Portfolio
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, delay: 5.6 }}
                className="text-[44px] font-black leading-tight"
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '1.5px rgba(59,130,246,0.5)',
                }}
              >
                Is Out!
              </motion.div>
            </div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 6.2 }}
              className="text-center mb-7"
            >
              <div className="text-2xl font-bold text-white mb-1.5">Aayush Timalsina</div>
              <div className="text-xs text-blue-500 tracking-[2px]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                // Cybersecurity Student
              </div>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100px' }}
              transition={{ duration: 0.8, delay: 6.8 }}
              className="h-[2px] my-6 relative"
              style={{ background: 'linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, transparent)' }}
            >
              <div
                className="absolute w-2 h-2 border-2 border-blue-500 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ background: '#0a0a1a' }}
              />
            </motion.div>

            {/* URL Card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 7.2 }}
              className="w-full max-w-md px-7 py-6 rounded-2xl text-center relative overflow-hidden mb-6"
              style={{
                background: 'rgba(15,15,30,0.7)',
                border: '1px solid rgba(59,130,246,0.15)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <motion.div
                initial={{ left: '-100%' }}
                animate={{ left: '100%' }}
                transition={{ duration: 2, delay: 7.5 }}
                className="absolute top-0 right-0 h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.6), rgba(139,92,246,0.6), transparent)' }}
              />

              <div
                className="absolute inset-0 z-[-1]"
                style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.03) 0%, transparent 50%, rgba(139,92,246,0.03) 100%)' }}
              />

              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-[-20px] z-[-1]"
                style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%)' }}
              />

              <div className="text-[10px] text-slate-400/50 tracking-[5px] uppercase mb-3" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Visit Now
              </div>

              <div className="text-lg font-semibold text-white tracking-wide" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                <span className="text-blue-500">www.</span>aayush-timalsina<span className="text-blue-500">.com.np</span>
              </div>
            </motion.div>

            {/* Tech Tags */}
            <div className="flex gap-2 flex-wrap justify-center mb-6">
              {[
                { text: '🛡️ Cybersecurity', delay: 8 },
                { text: '🔍 Pen Testing', delay: 8.15 },
                { text: '💻 Ethical Hacking', delay: 8.3 },
                { text: '🐧 Linux', delay: 8.45 },
              ].map((tag, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: tag.delay }}
                  className="px-3.5 py-1.5 rounded-md text-[11px] text-slate-400/70"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    background: 'rgba(59,130,246,0.06)',
                    border: '1px solid rgba(59,130,246,0.1)',
                  }}
                >
                  {tag.text}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col items-center w-full">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 9 }}
              onClick={onLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-9 py-3.5 rounded-full relative overflow-hidden cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))',
                border: '1px solid rgba(59,130,246,0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <motion.div
                initial={{ left: '-100%' }}
                animate={{ left: '200%' }}
                transition={{ duration: 3, delay: 9.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 w-full h-full"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
              />

              <motion.div
                animate={{
                  boxShadow: ['0 0 20px rgba(59,130,246,0.15)', '0 0 40px rgba(59,130,246,0.3)', '0 0 20px rgba(59,130,246,0.15)'],
                }}
                transition={{ duration: 2, delay: 10, repeat: Infinity }}
                className="absolute inset-0 rounded-full pointer-events-none"
              />

              <span className="text-[15px] font-semibold text-white/85 tracking-[3px] uppercase">Click Here</span>
              
              <motion.svg
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-5 h-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </motion.svg>
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 8, 0] }}
              transition={{ opacity: { duration: 0.5, delay: 9.5 }, y: { duration: 2, delay: 10, repeat: Infinity, ease: "easeInOut" } }}
              className="mt-5 flex flex-col items-center gap-0.5"
            >
              <svg className="w-6 h-6 text-blue-500/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              <svg className="w-6 h-6 text-blue-500/50 opacity-40 -mt-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              <svg className="w-6 h-6 text-blue-500/50 opacity-20 -mt-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              <span className="text-[10px] text-slate-400/40 tracking-[3px] uppercase mt-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Swipe Up
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 10 }}
              className="text-[10px] text-blue-500/20 tracking-[2px] mt-5"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              © 2026 CyberOS
            </motion.div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

// Main App Component
function App() {
  const [isDark, setIsDark] = useState(true);
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(70);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [useVideoWallpaper, setUseVideoWallpaper] = useState(true);
  const [currentWallpaper, setCurrentWallpaper] = useState(DEFAULT_WALLPAPER);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [fileSystem, setFileSystem] = useState<FileSystemNode>(initializeFileSystem());
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: "terminal",
      title: "Terminal",
      type: "terminal",
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      position: { x: 100, y: 50 },
      size: { width: 800, height: 500 },
    },
  ]);
  const [showLaunchpad, setShowLaunchpad] = useState(false);
  const [zIndexCounter, setZIndexCounter] = useState(2);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Music Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState({
    title: "Warning",
    artist: "Masoom Sharma, Swara Verma",
    url: "/audio/Warning.mp3"
  });
  const [customUrl, setCustomUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [musicCurrentTime, setMusicCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playerVolume, setPlayerVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Menu bar state
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 32 });

  // Menu configurations
  const getMenuItems = (menuName: string) => {
    switch (menuName) {
      case "File":
        return [
          { label: "New Terminal", shortcut: "⌘N", action: () => openWindow("terminal", "Terminal") },
          { label: "New Finder Window", shortcut: "⌘⇧N", action: () => openWindow("finder", "Finder") },
          { label: "New Note", shortcut: "⌘⌥N", action: () => openWindow("notes", "Notes") },
          { separator: true, label: "", action: () => {} },
          { label: "Open...", shortcut: "⌘O", action: () => setShowLaunchpad(true) },
          { separator: true, label: "", action: () => {} },
          { label: "Close Window", shortcut: "⌘W", action: () => activeWindow && closeWindow(activeWindow) },
          { separator: true, label: "", action: () => {} },
          { label: "Exit", shortcut: "⌘Q", action: () => window.location.reload() },
        ];
      case "Edit":
        return [
          { label: "Undo", shortcut: "⌘Z", action: () => {} },
          { label: "Redo", shortcut: "⌘⇧Z", action: () => {} },
          { separator: true, label: "", action: () => {} },
          { label: "Cut", shortcut: "⌘X", action: () => {} },
          { label: "Copy", shortcut: "⌘C", action: () => {} },
          { label: "Paste", shortcut: "⌘V", action: () => {} },
          { separator: true, label: "", action: () => {} },
          { label: "Select All", shortcut: "⌘A", action: () => {} },
          { separator: true, label: "", action: () => {} },
          { label: "Preferences...", shortcut: "⌘,", action: () => openWindow("settings", "Settings") },
        ];
      case "View":
        return [
          { label: "Show Launchpad", shortcut: "F4", action: () => setShowLaunchpad(true) },
          { separator: true, label: "", action: () => {} },
          { label: "Enter Full Screen", shortcut: "⌃⌘F", action: () => activeWindow && maximizeWindow(activeWindow) },
          { separator: true, label: "", action: () => {} },
          { label: "Show All Windows", shortcut: "F3", action: () => {} },
          { separator: true, label: "", action: () => {} },
          { label: "Dark Mode", shortcut: "⌘⌥D", action: () => setIsDark(!isDark) },
        ];
      case "Window":
        return [
          { label: "Minimize", shortcut: "⌘M", action: () => activeWindow && minimizeWindow(activeWindow) },
          { label: "Zoom", shortcut: "⌘⌥M", action: () => activeWindow && maximizeWindow(activeWindow) },
          { separator: true, label: "", action: () => {} },
          { label: "Show Previous Tab", shortcut: "⌃⇧⇥", action: () => {} },
          { label: "Show Next Tab", shortcut: "⌃⇥", action: () => {} },
          { separator: true, label: "", action: () => {} },
          { label: "Bring All to Front", shortcut: "", action: () => {
            windows.forEach(w => bringToFront(w.id));
          }},
          { separator: true, label: "", action: () => {} },
          ...windows.filter(w => !w.isMinimized).map(w => ({
            label: w.title,
            shortcut: "",
            action: () => bringToFront(w.id),
          })),
        ];
      case "Help":
        return [
          { label: "CyberOS Help", shortcut: "", action: () => openWindow("help", "CyberOS Help") },
          { separator: true, label: "", action: () => {} },
          { label: "Keyboard Shortcuts", shortcut: "", action: () => openWindow("shortcuts", "Keyboard Shortcuts") },
          { separator: true, label: "", action: () => {} },
          { label: "About CyberOS", shortcut: "", action: () => openWindow("about-os", "About CyberOS") },
        ];
      default:
        return [];
    }
  };

  const handleMenuClick = (menuName: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setMenuPosition({ x: rect.left, y: 32 });
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Window management functions
  const openWindow = (type: WindowState["type"], title: string) => {
    const existingWindow = windows.find((w) => w.type === type);
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        setWindows((prev) =>
          prev.map((w) =>
            w.type === type ? { ...w, isMinimized: false, zIndex: zIndexCounter } : w
          )
        );
        setZIndexCounter((prev) => prev + 1);
      }
      setActiveWindow(existingWindow.id);
    } else {
      const newWindow: WindowState = {
        id: `${type}-${Date.now()}`,
        title,
        type,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: zIndexCounter,
        position: { x: 100 + windows.length * 30, y: 50 + windows.length * 30 },
        size: { width: 800, height: 500 },
      };
      setWindows((prev) => [...prev, newWindow]);
      setZIndexCounter((prev) => prev + 1);
      setActiveWindow(newWindow.id);
    }
    setShowLaunchpad(false);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    setActiveWindow(null);
  };

  const maximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  const bringToFront = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: zIndexCounter } : w))
    );
    setZIndexCounter((prev) => prev + 1);
    setActiveWindow(id);
  };

  const getWindowContent = (win: WindowState) => {
    switch (win.type) {
      case "terminal":
        return <TerminalWindow isDark={isDark} fileSystem={fileSystem} setFileSystem={setFileSystem} />;
      case "about":
        return <AboutWindow isDark={isDark} />;
      case "projects":
        return <ProjectsWindow isDark={isDark} />;
      case "skills":
        return <SkillsWindow isDark={isDark} />;
      case "contact":
        return <ContactWindow isDark={isDark} />;
      case "settings":
        return (
          <SettingsWindow
            isDark={isDark}
            setIsDark={setIsDark}
            brightness={brightness}
            setBrightness={setBrightness}
            volume={volume}
            setVolume={setVolume}
            currentWallpaper={currentWallpaper}
            setCurrentWallpaper={setCurrentWallpaper}
          />
        );
      case "finder":
        return <FinderWindow isDark={isDark} fileSystem={fileSystem} />;
      case "calculator":
        return <CalculatorWindow isDark={isDark} />;
      case "calendar":
        return <CalendarWindow isDark={isDark} />;
      case "notes":
        return <NotesWindow isDark={isDark} />;
      case "help":
        return <HelpWindow isDark={isDark} />;
      case "shortcuts":
        return <ShortcutsWindow isDark={isDark} />;
      case "about-os":
        return <AboutOSWindow isDark={isDark} />;
      default:
        return null;
    }
  };

  const dockItems = [
    { id: "finder", icon: <LayoutGrid className="w-6 h-6" />, label: "Finder" },
    { id: "terminal", icon: <Terminal className="w-6 h-6" />, label: "Terminal" },
    { id: "about", icon: <User className="w-6 h-6" />, label: "About" },
    { id: "projects", icon: <FolderOpen className="w-6 h-6" />, label: "Projects" },
    { id: "skills", icon: <Code className="w-6 h-6" />, label: "Skills" },
    { id: "contact", icon: <Mail className="w-6 h-6" />, label: "Contact" },
    { id: "settings", icon: <Settings className="w-6 h-6" />, label: "Settings" },
  ];

  const launchpadItems = [
    { id: "finder", icon: <LayoutGrid className="w-8 h-8" />, label: "Finder", color: "from-blue-500 to-blue-600" },
    { id: "terminal", icon: <Terminal className="w-8 h-8" />, label: "Terminal", color: "from-gray-700 to-gray-800" },
    { id: "about", icon: <User className="w-8 h-8" />, label: "About", color: "from-purple-500 to-purple-600" },
    { id: "projects", icon: <FolderOpen className="w-8 h-8" />, label: "Projects", color: "from-yellow-500 to-orange-500" },
    { id: "skills", icon: <Code className="w-8 h-8" />, label: "Skills", color: "from-green-500 to-emerald-600" },
    { id: "contact", icon: <Mail className="w-8 h-8" />, label: "Contact", color: "from-red-500 to-pink-600" },
    { id: "settings", icon: <Settings className="w-8 h-8" />, label: "Settings", color: "from-gray-500 to-gray-600" },
    { id: "calculator", icon: <Calculator className="w-8 h-8" />, label: "Calculator", color: "from-orange-500 to-red-500" },
    { id: "calendar", icon: <Calendar className="w-8 h-8" />, label: "Calendar", color: "from-red-500 to-red-600" },
    { id: "notes", icon: <FileText className="w-8 h-8" />, label: "Notes", color: "from-yellow-400 to-yellow-500" },
  ];

  return (
    <>
      <style>{`
        .slider-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .cyber-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          outline: none;
          background: #374151;
          position: relative;
        }
        
        .cyber-slider::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 3px;
        }
        
        .cyber-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: none;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
          cursor: pointer;
          margin-top: -6px;
          position: relative;
          z-index: 2;
        }
        
        .cyber-slider::-moz-range-track {
          height: 6px;
          border-radius: 3px;
          background: #374151;
        }
        
        .cyber-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: none;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
          cursor: pointer;
        }
        
        .cyber-slider::-moz-range-progress {
          height: 6px;
          border-radius: 3px;
          background: #3b82f6;
        }
        
        .volume-slider::-moz-range-progress {
          background: #ec4899;
        }
        .cyber-grid {
          background-image:
            linear-gradient(rgba(56,189,248,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,0.08) 1px, transparent 1px);
          background-size: 80px 80px;
          opacity: 0.2;
        }
        .cyber-noise {
          background-image:
            repeating-linear-gradient(0deg, rgba(56,189,248,0.08) 0 1px, transparent 1px 3px),
            repeating-linear-gradient(90deg, rgba(14,165,233,0.05) 0 1px, transparent 1px 4px);
          mix-blend-mode: screen;
          opacity: 0.15;
        }
        .cyber-sweep {
          background: linear-gradient(90deg, transparent 0%, rgba(56,189,248,0.25) 50%, transparent 100%);
          animation: cyberSweep 10s ease-in-out infinite;
          opacity: 0.25;
        }
        @keyframes cyberSweep {
          0% { transform: translateX(-60%); }
          50% { transform: translateX(60%); }
          100% { transform: translateX(120%); }
        }
      `}</style>
      
      {/* Login Screen */}
      <AnimatePresence>
        {!isLoggedIn && (
          <LoginScreen onLogin={() => setIsLoggedIn(true)} isDark={isDark} />
        )}
      </AnimatePresence>

      {/* Main Desktop */}
      <div
        className={cn(
          "min-h-screen w-full overflow-hidden transition-opacity duration-500",
          isLoggedIn ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{
          filter: `brightness(${brightness}%)`,
        }}
      >
        {/* Wallpaper - Video or Static */}
        {useVideoWallpaper ? (
          <div className="fixed inset-0 overflow-hidden" style={{ 
            zIndex: 0,
            backgroundColor: isDark ? "#0a0118" : "#dbeafe"
          }}>
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ 
                filter: isDark ? "brightness(0.75) saturate(1.1)" : "brightness(0.92) saturate(1.05)",
                backgroundColor: isDark ? "#0a0118" : "#dbeafe"
              }}
              onError={(e) => console.error('Video failed to load:', e)}
              onLoadedData={() => console.log('Video loaded successfully')}
            >
              <source src="/video/videoplayback.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
            {/* Vignette overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: isDark
                ? "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)"
                : "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,20,0.25) 100%)",
            }} />
            {/* Subtle scanlines */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
            }} />
          </div>
        ) : (
          <div
            className="fixed inset-0 bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: `url(${currentWallpaper})`,
              zIndex: 0,
            }}
          />
        )}

        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <div className="absolute inset-0 cyber-grid" style={{ opacity: isDark ? 0.06 : 0.03 }} />
          <div className="absolute inset-0 cyber-sweep" style={{ opacity: isDark ? 0.1 : 0.05 }} />
        </div>


        <div className="fixed top-12 right-6 z-[85]">
          <div
            className={cn(
              "rounded-2xl p-4 w-64 border shadow-2xl backdrop-blur-xl",
              isDark ? "bg-slate-950/70 border-cyan-400/20" : "bg-white/70 border-cyan-500/30"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl overflow-hidden border"
                style={{ borderColor: "rgba(56,189,248,0.45)" }}
              >
                <img
                  src={PROFILE_IMAGE}
                  alt="Aayush Timalsina"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                  }}
                />
                <User className="w-6 h-6 text-cyan-300 hidden" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Aayush Timalsina</div>
                <div className="text-xs text-cyan-200/70">Cybersecurity Student</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              {[
                { label: "Clearance", value: "L3" },
                { label: "Ops", value: "Live" },
                { label: "Signal", value: "Secure" },
                { label: "Status", value: "Ready" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg px-2 py-2 border"
                  style={{ borderColor: "rgba(56,189,248,0.2)", background: "rgba(6,182,212,0.08)" }}
                >
                  <div className="text-cyan-200/70">{item.label}</div>
                  <div className="text-white font-semibold mt-0.5">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Bar */}
        <div
          className={cn(
            "fixed top-0 left-0 right-0 h-8 flex items-center justify-between px-4 z-[100] backdrop-blur-md",
            isDark ? "bg-gray-900/80 text-white" : "bg-white/80 text-gray-900"
          )}
        >
          <div className="flex items-center gap-4">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-sm">CyberOS v3.0</span>
            <div className="hidden md:flex items-center gap-3 text-sm">
              {["File", "Edit", "View", "Window", "Help"].map((menuName) => (
                <button
                  key={menuName}
                  onClick={(e) => handleMenuClick(menuName, e)}
                  className={cn(
                    "hover:opacity-70 transition-opacity px-2 py-1 rounded",
                    activeMenu === menuName && (isDark ? "bg-white/20" : "bg-black/10"),
                    menuName === "File" && "font-medium"
                  )}
                >
                  {menuName}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowControlCenter(!showControlCenter)}
                className="flex items-center gap-2 hover:opacity-70 transition-opacity"
              >
                {wifiEnabled ? <WifiIcon className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <Battery className="w-4 h-4" />
            </div>
            <span className="font-medium">
              {format(currentTime, "EEE MMM d")}
            </span>
            <span className="font-medium">
              {format(currentTime, "h:mm a")}
            </span>
          </div>
        </div>

        {/* Menu Dropdown */}
        {activeMenu && (
          <MenuDropdown
            isOpen={!!activeMenu}
            onClose={() => setActiveMenu(null)}
            items={getMenuItems(activeMenu)}
            isDark={isDark}
            position={menuPosition}
          />
        )}

        {/* Control Center */}
        <ControlCenter
          isOpen={showControlCenter}
          onClose={() => setShowControlCenter(false)}
          isDark={isDark}
          setIsDark={setIsDark}
          brightness={brightness}
          setBrightness={setBrightness}
          volume={volume}
          setVolume={setVolume}
          wifiEnabled={wifiEnabled}
          setWifiEnabled={setWifiEnabled}
          bluetoothEnabled={bluetoothEnabled}
          setBluetoothEnabled={setBluetoothEnabled}
          useVideoWallpaper={useVideoWallpaper}
          setUseVideoWallpaper={setUseVideoWallpaper}
        />

        {/* Desktop Area */}
        <div className="pt-8 h-screen relative">
          {/* Windows */}
          <AnimatePresence>
            {windows.map((win) => (
              !win.isMinimized && (
                <Window
                  key={win.id}
                  window={win}
                  isActive={activeWindow === win.id}
                  onClose={() => closeWindow(win.id)}
                  onMinimize={() => minimizeWindow(win.id)}
                  onMaximize={() => maximizeWindow(win.id)}
                  onClick={() => bringToFront(win.id)}
                  isDark={isDark}
                  brightness={brightness}
                >
                  {getWindowContent(win)}
                </Window>
              )
            ))}
          </AnimatePresence>

          {/* Launchpad */}
          <AnimatePresence>
            {showLaunchpad && (
              <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className={cn(
                  "fixed inset-0 z-[90] flex items-center justify-center backdrop-blur-xl",
                  isDark ? "bg-gray-950/90" : "bg-white/90"
                )}
                onClick={() => setShowLaunchpad(false)}
              >
                <div className="grid grid-cols-4 md:grid-cols-5 gap-8 p-8">
                  {launchpadItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        openWindow(item.id as WindowState["type"], item.label);
                      }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div
                        className={cn(
                          "w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br",
                          item.color
                        )}
                      >
                        <div className="text-white">{item.icon}</div>
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isDark ? "text-white" : "text-gray-900"
                        )}
                      >
                        {item.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Music Widget - Above Dock */}
        <div className="fixed bottom-44 left-1/2 -translate-x-1/2 z-[75]">
          {/* Collapsed Bar - Minimal & Clean */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setShowUrlInput((v) => !v)}
            className="cursor-pointer flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-3xl border select-none"
            style={{
              background: isDark
                ? "linear-gradient(135deg, rgba(15,10,30,0.25) 0%, rgba(88,28,135,0.15) 100%)"
                : "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(233,213,255,0.2) 100%)",
              borderColor: isDark ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.12)",
              boxShadow: isDark
                ? "0 8px 32px rgba(139,92,246,0.15), 0 0 1px rgba(255,255,255,0.1)"
                : "0 8px 32px rgba(139,92,246,0.08), 0 0 1px rgba(255,255,255,0.3)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Animated Vinyl */}
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{
                background: "conic-gradient(from 0deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)",
                boxShadow: isPlaying 
                  ? "0 0 20px rgba(139,92,246,0.7), inset -2px -2px 8px rgba(0,0,0,0.3), inset 2px 2px 8px rgba(255,255,255,0.2)"
                  : "0 0 10px rgba(139,92,246,0.3), inset -2px -2px 4px rgba(0,0,0,0.2)",
              }}
            >
              <div className="w-3 h-3 rounded-full" style={{ background: isDark ? "#0a0519" : "#f5f0ff", boxShadow: "0 0 8px rgba(139,92,246,0.5)" }} />
            </motion.div>

            {/* Song info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: isDark ? "rgba(255,255,255,0.95)" : "rgba(30,20,60,0.95)" }}>
                {currentSong.title}
              </p>
              <p className="text-[11px] truncate" style={{ color: isDark ? "rgba(196,181,253,0.7)" : "rgba(88,28,135,0.6)" }}>
                {currentSong.artist}
              </p>
            </div>

            {/* Compact Controls */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                if (audioRef.current) {
                  if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
                  setIsPlaying(!isPlaying);
                }
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                boxShadow: "0 4px 12px rgba(139,92,246,0.4)",
              }}
            >
              {isPlaying ? (
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-white rounded-full" />
                  <div className="w-1 h-3 bg-white rounded-full" />
                </div>
              ) : (
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-0.5" />
              )}
            </motion.button>

            {/* Status Indicator */}
            <motion.div
              animate={{ opacity: isPlaying ? [0.5, 1, 0.5] : 0.3 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: isPlaying ? "#10b981" : "#6b7280",
                boxShadow: isPlaying ? "0 0 8px rgba(16,185,129,0.6)" : "none",
              }}
            />
          </motion.div>

          {/* Expanded Player Popup - Premium Real Player */}
          <AnimatePresence>
            {showUrlInput && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.92 }}
                transition={{ type: "spring", damping: 22, stiffness: 280 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 w-80 rounded-2xl overflow-hidden backdrop-blur-xl"
                style={{
                  background: isDark
                    ? "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)"
                    : "linear-gradient(180deg, #f8f8f8 0%, #efefef 100%)",
                  border: isDark 
                    ? "1px solid rgba(255,255,255,0.1)" 
                    : "1px solid rgba(0,0,0,0.08)",
                  boxShadow: isDark
                    ? "0 20px 60px rgba(0,0,0,0.6)"
                    : "0 20px 60px rgba(0,0,0,0.15)",
                }}
              >
                <audio
                  ref={audioRef}
                  src={currentSong.url}
                  onTimeUpdate={() => { if (audioRef.current) setMusicCurrentTime(audioRef.current.currentTime); }}
                  onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
                  onEnded={() => setIsPlaying(false)}
                />

                {/* Large Album Art */}
                <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden"
                  style={{
                    background: isDark
                      ? "linear-gradient(135deg, #111827 0%, #1a1a2e 100%)"
                      : "linear-gradient(135deg, #e5e5e5 0%, #d5d5d5 100%)",
                  }}>
                  <motion.div
                    animate={{ scale: isPlaying ? 1.05 : 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-48 h-48 rounded-lg flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                      boxShadow: isPlaying ? "0 0 40px rgba(139,92,246,0.5)" : "0 8px 32px rgba(0,0,0,0.3)",
                    }}>
                    <Music className="w-20 h-20 text-white opacity-80" />
                  </motion.div>
                </div>

                {/* Song Info */}
                <div className="px-6 pt-6 pb-3">
                  <h2 className="text-xl font-bold truncate" style={{ color: isDark ? "#fff" : "#000" }}>
                    {currentSong.title}
                  </h2>
                  <p className="text-sm mt-1 truncate" style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}>
                    {currentSong.artist}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-4">
                  <input
                    type="range" min="0" max={duration || 0} value={musicCurrentTime}
                    onChange={(e) => {
                      const t = parseFloat(e.target.value);
                      setMusicCurrentTime(t);
                      if (audioRef.current) audioRef.current.currentTime = t;
                    }}
                    className="w-full h-1 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #8b5cf6 ${duration ? (musicCurrentTime / duration) * 100 : 0}%, ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"} 0%)`,
                      accentColor: "#8b5cf6",
                    }}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs font-mono" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
                      {isNaN(musicCurrentTime) ? "0:00" : `${Math.floor(musicCurrentTime/60)}:${String(Math.floor(musicCurrentTime%60)).padStart(2,"0")}`}
                    </span>
                    <span className="text-xs font-mono" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
                      {isNaN(duration) ? "0:00" : `${Math.floor(duration/60)}:${String(Math.floor(duration%60)).padStart(2,"0")}`}
                    </span>
                  </div>
                </div>

                {/* Main Controls */}
                <div className="flex items-center justify-center gap-6 px-6 pb-4">
                  {/* Previous/Rewind */}
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10); }}
                    className="p-3 rounded-full transition-colors"
                    style={{
                      color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                      background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                    }}>
                    <RotateCcw className="w-5 h-5" />
                  </motion.button>

                  {/* Play/Pause - Main */}
                  <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (audioRef.current) {
                        if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
                        setIsPlaying(!isPlaying);
                      }
                    }}
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      background: "#8b5cf6",
                      boxShadow: "0 8px 24px rgba(139,92,246,0.4)",
                    }}>
                    {isPlaying ? (
                      <div className="flex gap-1.5 ml-0.5">
                        <div className="w-1.5 h-6 bg-white rounded-full" />
                        <div className="w-1.5 h-6 bg-white rounded-full" />
                      </div>
                    ) : (
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                    )}
                  </motion.button>

                  {/* Next/Forward */}
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10); }}
                    className="p-3 rounded-full transition-colors"
                    style={{
                      color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                      background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                    }}>
                    <RefreshCw className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-3 px-6 pb-4"
                  style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)" }}>
                  <Volume2 className="w-4 h-4 flex-shrink-0" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }} />
                  <input type="range" min="0" max="1" step="0.01" value={playerVolume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setPlayerVolume(v);
                      if (audioRef.current) audioRef.current.volume = v;
                    }}
                    className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #8b5cf6 ${playerVolume * 100}%, ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"} 0%)`,
                      accentColor: "#8b5cf6",
                    }}
                  />
                </div>

                {/* Custom URL Input */}
                <div className="px-6 py-4">
                  <label className="text-xs font-semibold block mb-2" style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}>
                    Load Custom Track
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text" value={customUrl} onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="Paste URL..."
                      className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                      style={{
                        background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                        border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.1)",
                        color: isDark ? "#fff" : "#000",
                      }}
                    />
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (customUrl.trim()) {
                          setCurrentSong({ title: "Custom Track", artist: "Custom Audio", url: customUrl });
                          setCustomUrl("");
                        }
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white flex-shrink-0 transition-all"
                      style={{ background: "#8b5cf6" }}>
                      Add
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dock */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[80]">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              "flex items-end gap-2 px-4 py-3 rounded-2xl backdrop-blur-xl",
              isDark
                ? "bg-gray-900/60 border border-gray-700/50"
                : "bg-white/60 border border-white/50 shadow-xl"
            )}
          >
            {dockItems.map((item) => {
              const isActive = activeWindow?.startsWith(item.id);
              
              return (
                <DockItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  isActive={isActive || false}
                  onClick={() =>
                    item.id === "finder"
                      ? setShowLaunchpad(true)
                      : openWindow(item.id as WindowState["type"], item.label)
                  }
                  isDark={isDark}
                />
              );
            })}
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default App;
