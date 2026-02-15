import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, User, FolderOpen, Mail, Settings, Moon, Sun, X, Minimize2, Maximize2,
  Shield, Eye, Code, Volume2, Volume1, VolumeX, Battery, WifiIcon, WifiOff,
  LayoutGrid, MapPin, Phone, Send, CheckCircle, RefreshCw, Github, Linkedin,
  Instagram, Facebook, Target, Scan, Bug, Activity, Zap, TerminalSquare,
  Monitor, Info, Image, Music, Video, Download, FileText, GraduationCap,
  Bluetooth, Wifi, Calendar, Clock, Calculator, Edit3, Plus, Lock, Unlock,
} from "lucide-react";
import { format } from "date-fns";

// ============================================
// TYPES
// ============================================
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

type FileType = 'file' | 'directory' | 'executable' | 'link';

interface FileNode {
  name: string;
  type: FileType;
  content?: string;
  children?: Record<string, FileNode>;
  permissions: string;
  owner: string;
  size: number;
  modified: Date;
  target?: string;
}

interface Process {
  pid: number;
  name: string;
  status: 'running' | 'stopped' | 'zombie';
  cpu: number;
  memory: number;
}

interface TerminalStateType {
  currentPath: string;
  environment: Record<string, string>;
  aliases: Record<string, string>;
  processes: Process[];
  history: string[];
}

interface EditorState {
  isOpen: boolean;
  filename: string;
  content: string[];
  cursorLine: number;
  cursorCol: number;
  modified: boolean;
  mode: 'insert' | 'command';
  commandBuffer: string;
  statusMessage: string;
}

// ============================================
// CONSTANTS
// ============================================
const PROFILE_IMAGE = "https://scontent.fktm19-1.fna.fbcdn.net/v/t39.30808-6/480347813_569555419398127_972680757615671058_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=dziFfm82pYkQ7kNvwFJNyrU&_nc_oc=AdnGHiO7a2zVBYjBJNqNjwdAmxJa8Syn2St16y5usHBzsh6hhgvTd1Yg4qxx6kf9fDM&_nc_zt=23&_nc_ht=scontent.fktm19-1.fna&_nc_gid=FIRXfGn4xwDZQGPIbVzwwg&oh=00_AfsukNJBBKGMIFTH-ZlQhrHQLb0LIO1onoB49G1RljLQBA&oe=69960C19";
const ABOUT_IMAGE = "https://scontent.fktm19-1.fna.fbcdn.net/v/t39.30808-6/565717911_757399067280427_4804829451481773559_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=wEZv58m8FD4Q7kNvwEBMUTM&_nc_oc=AdkvSmFOG6aDRZETa-P6EXC0c45-KP1UsQjPZ_R2eXPjZ1fzPcX1QNNiZmwHBFTzhZ0&_nc_zt=23&_nc_ht=scontent.fktm19-1.fna&_nc_gid=NvsFZTZD3mElNoPgjO-DFA&oh=00_AfvOGPieAs-JcBHNTg-khTk1ISyQaRklAW-Rv7Kr4e35vA&oe=6995FF4B";
const DEFAULT_WALLPAPER = "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80";

const WALLPAPERS: Wallpaper[] = [
  { id: "aurora", name: "Aurora", url: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80", thumbnail: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=200&q=60" },
  { id: "neon-city", name: "Neon City", url: "https://images.unsplash.com/photo-1563089145-599997674d42?w=1920&q=80", thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?w=200&q=60" },
  { id: "deep-space", name: "Deep Space", url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80", thumbnail: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&q=60" },
];

const PROJECTS: Project[] = [
  { id: "1", title: "My First Security Lab", description: "Built this firewall setup myself. Learned IDS/IPS from scratch.", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80", skills: ["Firewall Config", "IDS/IPS", "Wireshark"], category: "Security" },
  { id: "2", title: "Web App Pentest I Did", description: "Found SQLi and XSS bugs in test apps. Reported them ethically.", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80", skills: ["Burp Suite", "OWASP", "Report Writing"], category: "Web Security" },
  { id: "3", title: "Network Traffic Analysis", description: "Spent nights analyzing packets. Found some weird stuff.", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80", skills: ["Wireshark", "TCPDump", "Analysis"], category: "Analysis" },
  { id: "4", title: "Price Tampering Bug Hunt", description: "Found this bug in a local site. They fixed it and thanked me.", image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80", skills: ["Bug Bounty", "Ethical Disclosure", "Testing"], category: "Vulnerability" },
];

const SKILLS: Skill[] = [
  { name: "Breaking Stuff (Ethically)", icon: <Target className="w-5 h-5" />, level: 85, category: "What I Do" },
  { name: "Finding Threats", icon: <Eye className="w-5 h-5" />, level: 80, category: "What I Do" },
  { name: "NMAP (my go-to)", icon: <Scan className="w-5 h-5" />, level: 90, category: "Tools I Use" },
  { name: "Wireshark (packet nerd)", icon: <Activity className="w-5 h-5" />, level: 75, category: "Tools I Use" },
  { name: "Burp Suite (web stuff)", icon: <Bug className="w-5 h-5" />, level: 70, category: "Tools I Use" },
  { name: "Python (scripting)", icon: <Code className="w-5 h-5" />, level: 65, category: "Languages" },
  { name: "Bash (terminal life)", icon: <Terminal className="w-5 h-5" />, level: 70, category: "Languages" },
  { name: "Linux (daily driver)", icon: <TerminalSquare className="w-5 h-5" />, level: 85, category: "Systems" },
  { name: "Kali Linux (hacking)", icon: <Shield className="w-5 h-5" />, level: 80, category: "Systems" },
  { name: "Metasploit (learning)", icon: <Zap className="w-5 h-5" />, level: 60, category: "Tools I Use" },
];

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

// ============================================
// FILE SYSTEM
// ============================================
const createInitialFS = (): FileNode => ({
  name: '/', type: 'directory', permissions: 'drwxr-xr-x', owner: 'root', size: 4096, modified: new Date(),
  children: {
    home: {
      name: 'home', type: 'directory', permissions: 'drwxr-xr-x', owner: 'root', size: 4096, modified: new Date(),
      children: {
        aayush: {
          name: 'aayush', type: 'directory', permissions: 'drwxr-xr-x', owner: 'aayush', size: 4096, modified: new Date(),
          children: {
            documents: {
              name: 'documents', type: 'directory', permissions: 'drwxr-xr-x', owner: 'aayush', size: 4096, modified: new Date(),
              children: {
                'resume.txt': { name: 'resume.txt', type: 'file', permissions: '-rw-r--r--', owner: 'aayush', size: 1024, modified: new Date(), content: 'Aayush Timalsina - Cybersecurity Student\n\nEducation: Class 12, Skyrider College\nSkills: Penetration Testing, Threat Detection, NMAP, Wireshark' },
                'projects.md': { name: 'projects.md', type: 'file', permissions: '-rw-r--r--', owner: 'aayush', size: 512, modified: new Date(), content: '# My Projects\n\n## Network Security Lab\nConfigured firewalls and IDS systems\n\n## Web App Penetration Testing\nOWASP testing with Burp Suite' }
              }
            },
            projects: {
              name: 'projects', type: 'directory', permissions: 'drwxr-xr-x', owner: 'aayush', size: 4096, modified: new Date(),
              children: {
                'scan.sh': { name: 'scan.sh', type: 'executable', permissions: '-rwxr-xr-x', owner: 'aayush', size: 256, modified: new Date(), content: '#!/bin/bash\necho "Starting network scan..."\nnmap -sV 192.168.1.0/24' },
                'exploit.py': { name: 'exploit.py', type: 'file', permissions: '-rw-r--r--', owner: 'aayush', size: 128, modified: new Date(), content: '#!/usr/bin/env python3\nimport requests\n\n# Ethical testing only!\nprint("Security testing framework")' }
              }
            },
            '.bashrc': { name: '.bashrc', type: 'file', permissions: '-rw-r--r--', owner: 'aayush', size: 256, modified: new Date(), content: '# User specific aliases\nalias ll="ls -la"\nalias la="ls -A"\nalias l="ls -CF"\nalias ..="cd .."' },
            '.bash_history': { name: '.bash_history', type: 'file', permissions: '-rw-------', owner: 'aayush', size: 0, modified: new Date(), content: '' },
            'welcome.txt': { name: 'welcome.txt', type: 'file', permissions: '-rw-r--r--', owner: 'aayush', size: 256, modified: new Date(), content: 'Welcome to CyberOS Terminal!\n\nTry: ls, cd, pwd, cat, nano, grep, ps, alias, export\nType "help" for all commands' }
          }
        }
      }
    },
    bin: {
      name: 'bin', type: 'directory', permissions: 'drwxr-xr-x', owner: 'root', size: 4096, modified: new Date(),
      children: {
        'bash': { name: 'bash', type: 'executable', permissions: '-rwxr-xr-x', owner: 'root', size: 1234567, modified: new Date() },
        'ls': { name: 'ls', type: 'executable', permissions: '-rwxr-xr-x', owner: 'root', size: 142536, modified: new Date() },
        'cat': { name: 'cat', type: 'executable', permissions: '-rwxr-xr-x', owner: 'root', size: 35421, modified: new Date() },
        'grep': { name: 'grep', type: 'executable', permissions: '-rwxr-xr-x', owner: 'root', size: 215364, modified: new Date() },
        'python3': { name: 'python3', type: 'executable', permissions: '-rwxr-xr-x', owner: 'root', size: 4563400, modified: new Date() },
        'nmap': { name: 'nmap', type: 'executable', permissions: '-rwxr-xr-x', owner: 'root', size: 2345678, modified: new Date() },
        'ssh': { name: 'ssh', type: 'executable', permissions: '-rwxr-xr-x', owner: 'root', size: 876543, modified: new Date() }
      }
    },
    etc: {
      name: 'etc', type: 'directory', permissions: 'drwxr-xr-x', owner: 'root', size: 4096, modified: new Date(),
      children: {
        'hostname': { name: 'hostname', type: 'file', permissions: '-rw-r--r--', owner: 'root', size: 16, modified: new Date(), content: 'cyberos-portfolio\n' },
        'hosts': { name: 'hosts', type: 'file', permissions: '-rw-r--r--', owner: 'root', size: 256, modified: new Date(), content: '127.0.0.1 localhost\n127.0.1.1 cyberos-portfolio\n' },
        'os-release': { name: 'os-release', type: 'file', permissions: '-rw-r--r--', owner: 'root', size: 256, modified: new Date(), content: 'NAME="CyberOS"\nVERSION="3.0 (Portfolio Edition)"\nID=cyberos\nPRETTY_NAME="CyberOS 3.0"' }
      }
    },
    tmp: { name: 'tmp', type: 'directory', permissions: 'drwxrwxrwt', owner: 'root', size: 4096, modified: new Date(), children: {} },
    var: {
      name: 'var', type: 'directory', permissions: 'drwxr-xr-x', owner: 'root', size: 4096, modified: new Date(),
      children: {
        log: {
          name: 'log', type: 'directory', permissions: 'drwxr-xr-x', owner: 'root', size: 4096, modified: new Date(),
          children: {
            'syslog': { name: 'syslog', type: 'file', permissions: '-rw-r-----', owner: 'root', size: 1048576, modified: new Date(), content: 'System log initialized...\n' + Array(50).fill('Jan 15 10:30:01 cyberos systemd[1]: Started regular background program processing cron.').join('\n') }
          }
        }
      }
    }
  }
});

const formatDate = (date: Date): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const isCurrentYear = date.getFullYear() === now.getFullYear();
  if (isCurrentYear) return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}  ${date.getFullYear()}`;
};

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return bytes.toString();
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}M`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}G`;
};

// ============================================
// COMPONENTS
// ============================================

const ProfileImage = ({ src, size, rounded, fallbackSize }: { src: string; size: string; rounded: string; fallbackSize: string }) => {
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn(size, rounded, "overflow-hidden bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center")}>
      {!failed ? <img src={src} alt="Aayush Timalsina" className="w-full h-full object-cover" onError={() => setFailed(true)} /> : <User className={cn(fallbackSize, "text-white")} />}
    </div>
  );
};

const DockItem = ({ icon, label, isActive, onClick, isDark }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; isDark: boolean }) => (
  <motion.button whileHover={{ scale: 1.2, y: -8 }} whileTap={{ scale: 0.95 }} onClick={onClick} className="group relative">
    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg", isActive ? "bg-gradient-to-br from-violet-600 to-fuchsia-600" : "bg-white/10 hover:bg-white/20 backdrop-blur-xl")}>
      <div className={isActive ? "text-white" : "text-white/80"}>{icon}</div>
    </div>
    {isActive && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />}
    <span className={cn("absolute -top-10 px-3 py-1.5 rounded-xl text-xs font-medium opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap backdrop-blur-xl", isDark ? "bg-black/60 text-white" : "bg-white/80 text-gray-900")}>{label}</span>
  </motion.button>
);

const Window = ({ window: win, isActive, onClose, onMinimize, onMaximize, onClick, children, isDark, brightness }: any) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!win.isMaximized && (e.target as HTMLElement).closest(".window-header")) {
      setIsDragging(true);
      const rect = windowRef.current?.getBoundingClientRect();
      if (rect) setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    onClick();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && windowRef.current) {
        windowRef.current.style.left = `${Math.max(0, e.clientX - dragOffset.x)}px`;
        windowRef.current.style.top = `${Math.max(32, e.clientY - dragOffset.y)}px`;
      }
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) { document.addEventListener("mousemove", handleMouseMove); document.addEventListener("mouseup", handleMouseUp); }
    return () => { document.removeEventListener("mousemove", handleMouseMove); document.removeEventListener("mouseup", handleMouseUp); };
  }, [isDragging, dragOffset]);

  return (
    <motion.div ref={windowRef} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: win.isMinimized ? 0 : 1, scale: win.isMinimized ? 0.9 : 1, y: win.isMinimized ? 20 : 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className={cn("absolute rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl border border-white/10", isActive ? "z-50" : "z-10", isDark ? "bg-black/40" : "bg-white/70")} style={{ zIndex: win.zIndex, width: win.isMaximized ? "100vw" : win.size.width, height: win.isMaximized ? "calc(100vh - 32px)" : win.size.height, left: win.isMaximized ? 0 : win.position.x, top: win.isMaximized ? 32 : win.position.y, filter: `brightness(${brightness}%)` }} onMouseDown={handleMouseDown}>
      <div className={cn("window-header flex items-center justify-between px-4 py-3 cursor-default select-none border-b border-white/5", isDark ? "bg-white/5" : "bg-white/30")}>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
          <button onClick={onMinimize} className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
          <button onClick={onMaximize} className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
        </div>
        <span className={cn("text-sm font-medium", isDark ? "text-white/80" : "text-gray-700")}>{win.title}</span>
        <div className="w-16" />
      </div>
      <div className="overflow-auto" style={{ height: "calc(100% - 48px)" }}>{children}</div>
    </motion.div>
  );
};

// ============================================
// TERMINAL WINDOW (MODERN STYLE)
// ============================================

const TerminalWindow = ({ isDark }: { isDark: boolean }) => {
  const [fileSystem, setFileSystem] = useState<FileNode>(createInitialFS());
  const [terminalState, setTerminalState] = useState<TerminalStateType>({
    currentPath: '/home/aayush',
    environment: { HOME: '/home/aayush', USER: 'aayush', SHELL: '/bin/bash', PATH: '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin', PWD: '/home/aayush', OLDPWD: '', PS1: '\\u@\\h:\\w\\$ ', TERM: 'xterm-256color', EDITOR: 'nano' },
    aliases: { ll: 'ls -la', la: 'ls -A', l: 'ls -CF', '..': 'cd ..', '...': 'cd ../..' },
    processes: [{ pid: 1, name: 'init', status: 'running', cpu: 0.1, memory: 4.2 }, { pid: 42, name: 'sshd', status: 'running', cpu: 0.0, memory: 2.1 }, { pid: 1337, name: 'node', status: 'running', cpu: 2.5, memory: 156.3 }],
    history: []
  });
  const [editor, setEditor] = useState<EditorState>({ isOpen: false, filename: '', content: [], cursorLine: 0, cursorCol: 0, modified: false, mode: 'insert', commandBuffer: '', statusMessage: '' });
  const [commands, setCommands] = useState<string[]>(['Welcome to CyberOS Terminal v3.0', 'Type "help" for available commands', '']);
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!editor.isOpen && inputRef.current) inputRef.current.focus(); }, [editor.isOpen, commands]);
  useEffect(() => { if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight; }, [commands]);

  const resolvePath = (path: string, currentDir: string = terminalState.currentPath): string => {
    if (path.startsWith('/')) return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
    if (path.startsWith('~')) return path.replace('~', terminalState.environment.HOME);
    const parts = currentDir.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);
    for (const part of pathParts) { if (part === '..') parts.pop(); else if (part !== '.') parts.push(part); }
    return '/' + parts.join('/');
  };

  const getNodeAtPath = (path: string): { node: FileNode | null; parent: FileNode | null; name: string } => {
    const resolved = resolvePath(path);
    const parts = resolved.split('/').filter(Boolean);
    if (parts.length === 0) return { node: fileSystem, parent: null, name: '/' };
    let current: FileNode = fileSystem; let parent: FileNode | null = null;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (current.type !== 'directory' || !current.children) return { node: null, parent: null, name: part };
      if (!(part in current.children)) return { node: null, parent: current, name: part };
      parent = current; current = current.children[part];
    }
    return { node: current, parent, name: parts[parts.length - 1] || '/' };
  };

  const getPrompt = (): string => {
    let prompt = terminalState.environment.PS1;
    prompt = prompt.replace(/\\u/g, terminalState.environment.USER);
    prompt = prompt.replace(/\\h/g, 'cyberos-portfolio');
    const displayPath = terminalState.currentPath === terminalState.environment.HOME ? '~' : terminalState.currentPath;
    prompt = prompt.replace(/\\w/g, displayPath);
    prompt = prompt.replace(/\\W/g, displayPath.split('/').pop() || '');
    prompt = prompt.replace(/\\\$/g, terminalState.environment.USER === 'root' ? '#' : '$');
    return prompt;
  };

  const expandVariables = (str: string): string => str.replace(/\$(\w+)|\$\{(\w+)\}/g, (_, name1, name2) => terminalState.environment[name1 || name2] || '').replace(/~(?=\/|$)/g, terminalState.environment.HOME);
  const expandAliases = (cmd: string): string => { const parts = cmd.trim().split(/\s+/); const alias = terminalState.aliases[parts[0]]; return alias ? alias + (parts.length > 1 ? ' ' + parts.slice(1).join(' ') : '') : cmd; };

  // ... (keep executeCommand and executeSingleCommand the same as your working version)

  const executeCommand = (rawCommand: string): string[] => {
    const expanded = expandVariables(rawCommand);
    const withAliases = expandAliases(expanded);
    const trimmed = withAliases.trim();
    if (!trimmed) return [];
    if (trimmed.includes('|')) { const cmds = trimmed.split('|').map(c => c.trim()); let result: string[] = []; for (const c of cmds) result = executeSingleCommand(c, result.join('\n')); return result; }
    const redirectMatch = trimmed.match(/(.+?)\s*([>]+)\s*(.+)$/);
    if (redirectMatch) {
      const [, cmd, operator, filename] = redirectMatch;
      const result = executeSingleCommand(cmd.trim());
      const content = result.join('\n') + (operator === '>>' ? '\n' : '');
      const { parent, name } = getNodeAtPath(filename);
      if (parent && parent.type === 'directory') {
        const existing = parent.children?.[name];
        if (!existing || existing.type === 'file') {
          const newFile: FileNode = { name, type: 'file', permissions: '-rw-r--r--', owner: terminalState.environment.USER, size: content.length, modified: new Date(), content: operator === '>>' && existing ? (existing.content || '') + content : content };
          setFileSystem(prev => { const newFS = { ...prev }; const parts = resolvePath(filename).split('/').filter(Boolean); let current: FileNode = newFS; for (let i = 0; i < parts.length - 1; i++) current = current.children![parts[i]]; current.children![name] = newFile; return newFS; });
        }
      }
      return [];
    }
    return executeSingleCommand(trimmed);
  };

  const executeSingleCommand = (command: string, stdin: string = ''): string[] => {
    // Same as your working version - abbreviated for space
    const parts = command.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const args = parts.map(p => p.replace(/^"|"$/g, ''));
    const cmd = args[0]?.toLowerCase();
    const flags = args.filter(a => a.startsWith('-')).join('');
    const operands = args.slice(1).filter(a => !a.startsWith('-'));

    switch (cmd) {
      case 'cd': { const target = operands[0] || terminalState.environment.HOME; const resolved = resolvePath(target); const { node } = getNodeAtPath(resolved); if (!node) return [`bash: cd: ${target}: No such file or directory`]; if (node.type !== 'directory') return [`bash: cd: ${target}: Not a directory`]; setTerminalState(prev => ({ ...prev, currentPath: resolved, environment: { ...prev.environment, OLDPWD: prev.currentPath, PWD: resolved } })); return []; }
      case 'pwd': return [terminalState.currentPath];
      case 'ls': { const showAll = flags.includes('a') || flags.includes('A'); const longFormat = flags.includes('l'); const humanReadable = flags.includes('h'); const sortByTime = flags.includes('t'); const reverse = flags.includes('r'); const target = operands[0] || '.'; const resolved = resolvePath(target); const { node } = getNodeAtPath(resolved); if (!node) return [`ls: cannot access '${target}': No such file or directory`]; if (node.type === 'file') return longFormat ? [`${node.permissions} 1 ${node.owner} ${node.owner} ${humanReadable ? formatSize(node.size) : node.size} ${formatDate(node.modified)} ${node.name}`] : [node.name]; let entries = Object.entries(node.children || {}); if (!showAll) entries = entries.filter(([name]) => !name.startsWith('.')); if (sortByTime) entries.sort((a, b) => b[1].modified.getTime() - a[1].modified.getTime()); else entries.sort(([a], [b]) => a.localeCompare(b)); if (reverse) entries.reverse(); if (!longFormat) return entries.map(([name, child]) => child.type === 'directory' ? `${name}/` : child.type === 'executable' ? `${name}*` : name); const total = entries.reduce((sum, [, n]) => sum + Math.ceil(n.size / 4096) * 4, 0); const lines = [`total ${Math.ceil(total / 2)}`]; for (const [name, child] of entries) { const size = humanReadable ? formatSize(child.size) : child.size.toString().padStart(8); lines.push(`${child.permissions} 1 ${child.owner.padEnd(8)} ${child.owner.padEnd(8)} ${size} ${formatDate(child.modified)} ${name}${child.type === 'directory' ? '/' : child.type === 'executable' ? '*' : ''}`); } return lines; }
      case 'cat': { if (operands.length === 0) return stdin ? stdin.split('\n') : []; const lines: string[] = []; for (const file of operands) { const resolved = resolvePath(file); const { node } = getNodeAtPath(resolved); if (!node) lines.push(`cat: ${file}: No such file or directory`); else if (node.type === 'directory') lines.push(`cat: ${file}: Is a directory`); else lines.push(...(node.content || '').split('\n')); } return lines; }
      case 'help': return ['╔══════════════════════════════════════════════════════════════════╗', '║           🛡️  AAYUSH\'S CYBEROS TERMINAL v3.0  🛡️                  ║', '╠══════════════════════════════════════════════════════════════════╣', '║  NAVIGATION                                                      ║', '║    cd [dir]        Change directory      pwd    Print directory  ║', '║    ls [options]    List files            ..     Parent dir       ║', '╠══════════════════════════════════════════════════════════════════╣', '║  FILE OPS (my favorites)                                         ║', '║    cat [file]      Read files            touch  Make empty file  ║', '║    nano [file]     MY editor!            rm     Delete stuff     ║', '║    mkdir [-p]      Make folders          cp/mv  Copy/move        ║', '╠══════════════════════════════════════════════════════════════════╣', '║  HACKER TOOLS (that I use)                                       ║', '║    grep [opt]      Search text           find   Find files       ║', '║    ps/top          See processes         kill   Kill process     ║', '╠══════════════════════════════════════════════════════════════════╣', '║  MY CUSTOM COMMANDS                                              ║', '║    neofetch        Show off my system    hack   Fake hack lol    ║', '║    nmap            Scan networks         ssh    Connect remote   ║', '║    aayush / me     About ME!                                       ║', '╠══════════════════════════════════════════════════════════════════╣', '║  PRO TIPS: Use | for pipes, > for output, TAB for completion     ║', '╚══════════════════════════════════════════════════════════════════╝', '', '  "Break things to make them stronger" - Aayush Timalsina, 2024'];
      // ... (add other commands as needed)
      default: if (cmd.trim()) return [`bash: ${cmd}: command not found`, 'Type "help" for available commands']; return [];
    }
  };

  const saveEditorFile = () => {
    const content = editor.content.join('\n');
    const resolved = resolvePath(editor.filename);
    const { parent, name } = getNodeAtPath(resolved);
    if (!parent) { setEditor(prev => ({ ...prev, statusMessage: 'Error: Cannot save file' })); return; }
    setFileSystem(prev => { const newFS = { ...prev }; const parts = resolved.split('/').filter(Boolean); let current: FileNode = newFS; for (let i = 0; i < parts.length - 1; i++) current = current.children![parts[i]]; current.children![name] = { name, type: 'file', permissions: '-rw-r--r--', owner: terminalState.environment.USER, size: content.length, modified: new Date(), content }; return newFS; });
    setEditor(prev => ({ ...prev, modified: false, statusMessage: `Saved ${editor.content.length} lines` }));
  };

  // ... (keep handleEditorKeyDown, handleSubmit, handleKeyDown same)

  // MODERN TERMINAL RENDER
  return (
    <>
      <div className={cn("h-full p-4 font-mono text-[13px] relative", isDark ? "bg-[#0a0a0f]" : "bg-white")}>
        <div ref={terminalRef} className="h-full overflow-auto pb-8">
          {commands.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap leading-relaxed">
              {line.startsWith(getPrompt()) ? (
                <span>
                  <span className="text-violet-400 font-bold">aayush</span>
                  <span className="text-gray-500">@</span>
                  <span className="text-fuchsia-400">cyberos</span>
                  <span className="text-gray-400">:</span>
                  <span className="text-cyan-400">{terminalState.currentPath === terminalState.environment.HOME ? '~' : terminalState.currentPath}</span>
                  <span className="text-violet-400">$</span>
                  <span className={isDark ? "text-gray-300" : "text-gray-700"}> {line.slice(getPrompt().length + 1)}</span>
                </span>
              ) : line.startsWith('bash:') || line.includes('command not found') ? (
                <span className="text-red-400">✗ {line}</span>
              ) : line.startsWith('╔') || line.startsWith('╠') || line.startsWith('║') || line.startsWith('╚') ? (
                <span className="text-cyan-400">{line}</span>
              ) : line.startsWith('Welcome') ? (
                <span className="text-violet-400">{line}</span>
              ) : line.startsWith('  "') ? (
                <span className="text-gray-500 italic">{line}</span>
              ) : (
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>{line}</span>
              )}
            </div>
          ))}
          {!editor.isOpen && (
            <form onSubmit={(e) => { e.preventDefault(); if (!input.trim()) return; setTerminalState(prev => ({ ...prev, history: [...prev.history, input] })); setHistoryIndex(-1); const result = executeCommand(input); setCommands(prev => [...prev, `${getPrompt()} ${input}`, ...result, '']); setInput(''); }} className="flex items-center mt-1">
              <span className="text-violet-400 font-bold">aayush</span>
              <span className="text-gray-500">@</span>
              <span className="text-fuchsia-400">cyberos</span>
              <span className="text-gray-400">:</span>
              <span className="text-cyan-400">{terminalState.currentPath === terminalState.environment.HOME ? '~' : terminalState.currentPath}</span>
              <span className="text-violet-400">$</span>
              <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'ArrowUp') { e.preventDefault(); setHistoryIndex(prev => { const newIndex = Math.min(terminalState.history.length - 1, prev + 1); if (newIndex >= 0) setInput(terminalState.history[terminalState.history.length - 1 - newIndex]); return newIndex; }); } else if (e.key === 'ArrowDown') { e.preventDefault(); setHistoryIndex(prev => { const newIndex = Math.max(-1, prev - 1); if (newIndex === -1) setInput(''); else setInput(terminalState.history[terminalState.history.length - 1 - newIndex]); return newIndex; }); } else if (e.key === 'Tab') { e.preventDefault(); const words = input.split(/\s+/); const lastWord = words[words.length - 1]; const { node } = getNodeAtPath(terminalState.currentPath); if (!node || node.type !== 'directory') return; const candidates = Object.keys(node.children || {}).filter(name => name.startsWith(lastWord)); if (candidates.length === 1) setInput(words.slice(0, -1).concat(candidates[0]).join(' ') + ' '); } }} className={cn("flex-1 bg-transparent border-none outline-none ml-2", isDark ? "text-gray-300" : "text-gray-700")} spellCheck={false} autoComplete="off" />
            </form>
          )}
        </div>
      </div>
      {editor.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div ref={editorRef} className="w-full max-w-4xl h-[600px] bg-[#1a1a2e] flex flex-col rounded-2xl shadow-2xl border border-white/10 overflow-hidden" tabIndex={0} onKeyDown={(e) => { if (editor.mode === 'insert') { if (e.ctrlKey) { e.preventDefault(); switch (e.key.toLowerCase()) { case 'x': if (editor.modified) { setEditor(prev => ({ ...prev, statusMessage: 'Save? (Y/N)' })); setTimeout(() => setEditor(prev => ({ ...prev, isOpen: false })), 100); } else setEditor(prev => ({ ...prev, isOpen: false })); return; case 'o': saveEditorFile(); return; } } } }}>
            <div className="bg-[#16162a] text-white px-4 py-2 text-sm border-b border-white/5 flex items-center justify-between">
              <span>nano <span className="text-gray-400">—</span> {editor.filename || 'New Buffer'}{editor.modified && <span className="text-yellow-400 ml-2">●</span>}</span>
              <span className="text-xs text-gray-500">{editor.cursorLine + 1}:{editor.cursorCol}</span>
            </div>
            <div className="flex-1 p-3 overflow-auto font-mono text-sm text-gray-200">
              {editor.content.map((line, i) => (
                <div key={i} className={`${i === editor.cursorLine ? 'bg-white/5' : ''} whitespace-pre`}>
                  {line.split('').map((char, j) => <span key={j} className={`${i === editor.cursorLine && j === editor.cursorCol ? 'bg-violet-600 text-white' : ''}`}>{char || ' '}</span>)}
                  {i === editor.cursorLine && editor.cursorCol >= line.length && <span className="bg-violet-600 text-white">&nbsp;</span>}
                </div>
              ))}
            </div>
            <div className="bg-[#16162a] text-gray-400 px-4 py-2 text-xs border-t border-white/5 flex gap-4">
              <span><span className="text-violet-400">^G</span> Help</span>
              <span><span className="text-violet-400">^O</span> Save</span>
              <span><span className="text-violet-400">^X</span> Exit</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ============================================
// OTHER WINDOWS (MODERN - NO BOXES)
// ============================================

const AboutWindow = ({ isDark }: { isDark: boolean }) => (
  <div className={cn("h-full overflow-auto", isDark ? "bg-[#0a0a0f]" : "bg-gray-50")}>
    <div className="relative h-56 bg-gradient-to-br from-violet-600/20 via-fuchsia-600/20 to-cyan-600/20 flex items-center justify-center">
      <div className="text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-white/20">
          <ProfileImage src={ABOUT_IMAGE} size="w-full h-full" rounded="rounded-full" fallbackSize="w-10 h-10" />
        </motion.div>
        <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>Aayush Timalsina</h1>
        <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>17 • Security Researcher • Nepal 🇳🇵</p>
      </div>
    </div>
    <div className="max-w-xl mx-auto px-6 -mt-6 space-y-4">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={cn("p-5 rounded-2xl", isDark ? "bg-white/5" : "bg-white shadow-lg")}>
        <p className={cn("leading-relaxed text-sm", isDark ? "text-gray-300" : "text-gray-700")}>I break things to understand them. Started with my home router at 15, now doing CTFs and building this OS portfolio from scratch with React + TypeScript.</p>
      </motion.div>
      <div className="flex justify-center gap-8 py-2">
        {[{ n: "4+", l: "Projects" }, { n: "15+", l: "CTFs" }, { n: "7", l: "Bugs" }].map((s, i) => (
          <motion.div key={s.l} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 + i * 0.1 }} className="text-center">
            <div className="text-xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">{s.n}</div>
            <div className="text-xs text-gray-500 uppercase">{s.l}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const ProjectsWindow = ({ isDark }: { isDark: boolean }) => (
  <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-[#0a0a0f]" : "bg-gray-50")}>
    <h1 className={cn("text-xl font-light mb-5", isDark ? "text-white" : "text-gray-900")}>Selected Work</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {PROJECTS.map((p, i) => (
        <motion.div key={p.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className={cn("group relative overflow-hidden rounded-2xl cursor-pointer", isDark ? "bg-white/5" : "bg-white shadow-md")}>
          <div className="h-40 overflow-hidden"><img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" /></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <span className="text-xs text-violet-400 uppercase">{p.category}</span>
            <h3 className="text-lg font-semibold text-white">{p.title}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const SkillsWindow = ({ isDark }: { isDark: boolean }) => (
  <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-[#0a0a0f]" : "bg-gray-50")}>
    <h1 className={cn("text-xl font-light mb-6", isDark ? "text-white" : "text-gray-900")}>Capabilities</h1>
    <div className="max-w-lg space-y-4">
      {SKILLS.map((s, i) => (
        <motion.div key={s.name} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
          <div className="flex justify-between mb-1"><span className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-700")}>{s.name}</span><span className="text-xs text-gray-500">{s.level}%</span></div>
          <div className={cn("h-1 rounded-full", isDark ? "bg-white/10" : "bg-gray-200")}><motion.div initial={{ width: 0 }} animate={{ width: `${s.level}%` }} transition={{ duration: 0.8, delay: 0.2 }} className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" /></div>
        </motion.div>
      ))}
    </div>
  </div>
);

const ContactWindow = ({ isDark }: { isDark: boolean }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setIsSubmitting(true); await new Promise(r => setTimeout(r, 1500)); setIsSubmitting(false); setSubmitted(true); setTimeout(() => setSubmitted(false), 3000); };
  return (
    <div className={cn("h-full overflow-auto", isDark ? "bg-[#0a0a0f]" : "bg-gray-50")}>
      <div className="h-40 bg-gradient-to-br from-violet-600/20 via-fuchsia-600/20 to-cyan-600/20 flex items-center justify-center"><h1 className={cn("text-2xl font-light", isDark ? "text-white" : "text-gray-900")}>Let's Talk</h1></div>
      <div className="max-w-sm mx-auto px-6 -mt-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={cn("p-5 rounded-2xl shadow-xl", isDark ? "bg-white/5" : "bg-white")}>
          {submitted ? <div className="text-center py-6"><div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center"><CheckCircle className="w-6 h-6 text-white" /></div><p className={cn("text-lg", isDark ? "text-white" : "text-gray-900")}>Sent!</p></div> : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Your name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={cn("w-full px-4 py-2.5 rounded-xl text-sm outline-none", isDark ? "bg-white/10 text-white placeholder-gray-500" : "bg-gray-100 text-gray-900 placeholder-gray-400")} required />
              <input type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={cn("w-full px-4 py-2.5 rounded-xl text-sm outline-none", isDark ? "bg-white/10 text-white placeholder-gray-500" : "bg-gray-100 text-gray-900 placeholder-gray-400")} required />
              <textarea placeholder="What's up?" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} rows={3} className={cn("w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none", isDark ? "bg-white/10 text-white placeholder-gray-500" : "bg-gray-100 text-gray-900 placeholder-gray-400")} required />
              <button type="submit" disabled={isSubmitting} className="w-full py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 disabled:opacity-50">{isSubmitting ? "Sending..." : "Send Message"}</button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const SettingsWindow = ({ isDark, setIsDark, brightness, setBrightness, volume, setVolume, currentWallpaper, setCurrentWallpaper, customWallpapers, setCustomWallpapers }: any) => {
  const [activeTab, setActiveTab] = useState("appearance");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tabs = [{ id: "appearance", label: "Appearance", icon: <Monitor className="w-4 h-4" /> }, { id: "wallpaper", label: "Wallpaper", icon: <Image className="w-4 h-4" /> }, { id: "sound", label: "Sound", icon: <Volume2 className="w-4 h-4" /> }];
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (event) => { const url = event.target?.result as string; setCustomWallpapers([...customWallpapers, { id: `custom-${Date.now()}`, name: file.name.replace(/\.[^/.]+$/, ""), url, thumbnail: url }]); setCurrentWallpaper(url); }; reader.readAsDataURL(file); } };
  const allWallpapers = [...WALLPAPERS, ...customWallpapers];
  return (
    <div className={cn("h-full flex", isDark ? "bg-[#0a0a0f]" : "bg-gray-50")}>
      <div className="w-48 p-4">
        {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm mb-1", activeTab === tab.id ? (isDark ? "bg-white/10 text-white" : "bg-gray-900 text-white") : (isDark ? "text-gray-400 hover:text-white" : "text-gray-600"))}>{tab.icon}{tab.label}</button>)}
      </div>
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === "appearance" && (
          <div className="max-w-sm">
            <h2 className={cn("text-lg font-light mb-4", isDark ? "text-white" : "text-gray-900")}>Appearance</h2>
            <div className={cn("p-4 rounded-2xl mb-3", isDark ? "bg-white/5" : "bg-white")}>
              <div className="flex items-center justify-between">
                <div><p className={cn("font-medium text-sm", isDark ? "text-white" : "text-gray-900")}>Dark Mode</p><p className="text-xs text-gray-500">Easier on the eyes</p></div>
                <button onClick={() => setIsDark(!isDark)} className={cn("w-11 h-6 rounded-full p-1", isDark ? "bg-violet-600" : "bg-gray-300")}><motion.div animate={{ x: isDark ? 20 : 0 }} className="w-4 h-4 rounded-full bg-white" /></button>
              </div>
            </div>
            <div className={cn("p-4 rounded-2xl", isDark ? "bg-white/5" : "bg-white")}><p className={cn("font-medium text-sm mb-2", isDark ? "text-white" : "text-gray-900")}>Brightness</p><input type="range" min="20" max="100" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full accent-violet-500" /></div>
          </div>
        )}
        {activeTab === "wallpaper" && (
          <div>
            <div className="flex items-center justify-between mb-4"><h2 className={cn("text-lg font-light", isDark ? "text-white" : "text-gray-900")}>Wallpaper</h2><button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600">Upload</button><input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></div>
            <div className="grid grid-cols-2 gap-3">{allWallpapers.map((wp: any) => <button key={wp.id} onClick={() => setCurrentWallpaper(wp.url)} className={cn("relative aspect-video rounded-2xl overflow-hidden", currentWallpaper === wp.url ? "ring-2 ring-violet-500" : "")}><img src={wp.thumbnail} alt={wp.name} className="w-full h-full object-cover" />{currentWallpaper === wp.url && <div className="absolute inset-0 flex items-center justify-center bg-black/40"><CheckCircle className="w-8 h-8 text-white" /></div>}</button>)}</div>
          </div>
        )}
        {activeTab === "sound" && <div className="max-w-sm"><h2 className={cn("text-lg font-light mb-4", isDark ? "text-white" : "text-gray-900")}>Sound</h2><div className={cn("p-4 rounded-2xl", isDark ? "bg-white/5" : "bg-white")}><p className={cn("font-medium text-sm mb-2", isDark ? "text-white" : "text-gray-900")}>Volume</p><input type="range" min="0" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-full accent-violet-500" /></div></div>}
      </div>
    </div>
  );
};

const FinderWindow = ({ isDark }: { isDark: boolean }) => (
  <div className={cn("h-full flex", isDark ? "bg-[#0a0a0f]" : "bg-gray-50")}>
    <div className="w-44 p-4"><p className="text-xs text-gray-500 uppercase mb-2 px-3">Favorites</p>{["Desktop", "Documents", "Downloads", "Projects"].map(i => <button key={i} className={cn("w-full text-left px-3 py-2 rounded-xl text-sm", isDark ? "text-gray-400 hover:text-white" : "text-gray-600")}>{i}</button>)}</div>
    <div className="flex-1 p-6"><div className="grid grid-cols-4 gap-4">{[{ n: "Documents", c: "text-blue-500" }, { n: "Projects", c: "text-yellow-500" }, { n: "Images", c: "text-purple-500" }].map(f => <motion.button key={f.n} whileHover={{ scale: 1.05 }} className="flex flex-col items-center p-4 rounded-2xl hover:bg-white/5"><FolderOpen className={cn("w-10 h-10", f.c)} /><span className={cn("text-sm mt-2", isDark ? "text-gray-300" : "text-gray-700")}>{f.n}</span></motion.button>)}</div></div>
  </div>
);

const CalculatorWindow = ({ isDark }: { isDark: boolean }) => {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const calc = (a: number, b: number, o: string) => { switch(o){case'+':return a+b;case'-':return a-b;case'×':return a*b;case'÷':return b!==0?a/b:0;default:return b} };
  const inputNum = (n: string) => { if(waiting){setDisplay(n);setWaiting(false)}else setDisplay(display==="0"?n:display+n) };
  const inputOp = (o: string) => { const v=parseFloat(display); if(prev===null)setPrev(v);else if(op){const r=calc(prev,v,op);setPrev(r);setDisplay(String(r))} setWaiting(true);setOp(o) };
  const doCalc = () => { const v=parseFloat(display); if(prev!==null&&op){const r=calc(prev,v,op);setDisplay(String(r));setPrev(null);setOp(null);setWaiting(true)} };
  const clear = () => { setDisplay("0");setPrev(null);setOp(null);setWaiting(false) };
  const btns = [{l:"C",c:"text-red-400",a:clear},{l:"±",a:()=>setDisplay(String(parseFloat(display)*-1))},{l:"%",a:()=>setDisplay(String(parseFloat(display)/100))},{l:"÷",c:"text-violet-400",a:()=>inputOp("÷")},{l:"7",a:()=>inputNum("7")},{l:"8",a:()=>inputNum("8")},{l:"9",a:()=>inputNum("9")},{l:"×",c:"text-violet-400",a:()=>inputOp("×")},{l:"4",a:()=>inputNum("4")},{l:"5",a:()=>inputNum("5")},{l:"6",a:()=>inputNum("6")},{l:"-",c:"text-violet-400",a:()=>inputOp("-")},{l:"1",a:()=>inputNum("1")},{l:"2",a:()=>inputNum("2")},{l:"3",a:()=>inputNum("3")},{l:"+",c:"text-violet-400",a:()=>inputOp("+")},{l:"0",c:"col-span-2",a:()=>inputNum("0")},{l:".",a:()=>inputNum(".")},{l:"=",c:"bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white",a:doCalc}];
  return (
    <div className={cn("h-full flex items-center justify-center p-6", isDark ? "bg-[#0a0a0f]" : "bg-gray-50")}>
      <div className={cn("w-64 rounded-3xl p-4 shadow-2xl", isDark ? "bg-white/5" : "bg-white")}>
        <div className={cn("text-right text-3xl font-light mb-3 px-2 py-3", isDark ? "text-white" : "text-gray-900")}>{display}</div>
        <div className="grid grid-cols-4 gap-2">{btns.map(b => <button key={b.l} onClick={b.a} className={cn("h-12 rounded-xl text-sm font-medium", b.c?.includes("col-span")?"col-span-2":"", b.c||"bg-white/10 hover:bg-white/20 text-white")}>{b.l}</button>)}</div>
      </div>
    </div>
  );
};

const CalendarWindow = ({ isDark }: { isDark: boolean }) => {
  const [currentDate] = useState(new Date());
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  return (
    <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-[#0a0a0f]" : "bg-gray-50")}>
      <div className="max-w-sm mx-auto">
        <div className={cn("rounded-2xl overflow-hidden shadow-lg", isDark ? "bg-white/5" : "bg-white")}>
          <div className="p-4 text-center bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20"><h2 className="text-white text-lg font-light">{format(currentDate, "MMMM yyyy")}</h2></div>
          <div className="p-3 grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">{["S","M","T","W","T","F","S"].map(d => <div key={d}>{d}</div>)}</div>
          <div className="p-3 pt-0 grid grid-cols-7 gap-1">{Array.from({length:firstDay}).map((_,i)=><div key={i}/>)}{Array.from({length:daysInMonth},(_,i)=>i+1).map(d => <div key={d} className={cn("aspect-square flex items-center justify-center rounded-lg text-sm", d===new Date().getDate()?"bg-violet-600 text-white":"text-gray-400 hover:bg-white/5")}>{d}</div>)}</div>
        </div>
      </div>
    </div>
  );
};

const NotesWindow = ({ isDark }: { isDark: boolean }) => {
  const [notes, setNotes] = useState([{ id: "1", title: "CTF Notes", content: "Buffer overflow technique...\nROP chain basics", date: "2024-01-15" }, { id: "2", title: "Project Ideas", content: "Build a custom scanner\nLearn Rust for tools", date: "2024-01-14" }]);
  const [selected, setSelected] = useState(notes[0]);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(selected.content);
  const save = () => { setNotes(notes.map(n => n.id === selected.id ? { ...n, content } : n)); setSelected({ ...selected, content }); setEditing(false); };
  return (
    <div className={cn("h-full flex", isDark ? "bg-[#0a0a0f]" : "bg-gray-50")}>
      <div className="w-56 p-3">
        <button onClick={() => { const n = { id: Date.now().toString(), title: "New Note", content: "", date: new Date().toISOString().split("T")[0] }; setNotes([n, ...notes]); setSelected(n); setContent(""); setEditing(true); }} className="w-full py-2 mb-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600">+ New Note</button>
        {notes.map(n => <button key={n.id} onClick={() => { setSelected(n); setContent(n.content); setEditing(false); }} className={cn("w-full text-left p-3 rounded-xl text-sm mb-1", selected.id === n.id ? (isDark ? "bg-white/10" : "bg-white") : (isDark ? "hover:bg-white/5" : "hover:bg-gray-100"))}><p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{n.title}</p><p className="text-xs text-gray-500 truncate">{n.content || "Empty"}</p></button>)}
      </div>
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-3"><h2 className={cn("text-lg", isDark ? "text-white" : "text-gray-900")}>{selected.title}</h2>{editing ? <button onClick={save} className="px-3 py-1 rounded-lg text-xs bg-violet-600 text-white">Save</button> : <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-white/10"><Edit3 className="w-4 h-4" /></button>}</div>
        {editing ? <textarea value={content} onChange={e => setContent(e.target.value)} className={cn("w-full h-[calc(100%-3rem)] p-3 rounded-xl text-sm outline-none resize-none", isDark ? "bg-white/10 text-white" : "bg-white text-gray-900")} /> : <div className={cn("whitespace-pre-wrap text-sm", isDark ? "text-gray-300" : "text-gray-700")}>{selected.content}</div>}
      </div>
    </div>
  );
};

const HelpWindow = ({ isDark }: { isDark: boolean }) => (
  <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-[#0a0a0f]" : "bg-gray-50")}>
    <div className="max-w-md mx-auto text-center py-12">
      <Shield className="w-16 h-16 mx-auto mb-4 text-violet-500" />
      <h1 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>CyberOS Help</h1>
      <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>Built from scratch by Aayush Timalsina</p>
      <div className={cn("mt-8 p-4 rounded-2xl text-left text-sm", isDark ? "bg-white/5" : "bg-white")}>
        <p className={cn("mb-2", isDark ? "text-gray-300" : "text-gray-700")}>• Click the <strong>Dock</strong> at the bottom to open apps</p>
        <p className={cn("mb-2", isDark ? "text-gray-300" : "text-gray-700")}>• Use <strong>Terminal</strong> for a real Linux experience</p>
        <p className={cn("mb-2", isDark ? "text-gray-300" : "text-gray-700")}>• Drag windows by their title bar</p>
        <p className={cn("mb-2", isDark ? "text-gray-300" : "text-gray-700")}>• Upload custom wallpapers in Settings</p>
      </div>
    </div>
  </div>
);

const ShortcutsWindow = ({ isDark }: { isDark: boolean }) => (
  <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-[#0a0a0f]" : "bg-gray-50")}>
    <div className="max-w-sm mx-auto">
      <h1 className={cn("text-xl font-light mb-6", isDark ? "text-white" : "text-gray-900")}>Keyboard Shortcuts</h1>
      {[{t:"General",s:[{k:"⌘N",a:"New Terminal"},{k:"⌘W",a:"Close Window"},{k:"⌘Q",a:"Quit"}]},{t:"View",s:[{k:"F4",a:"Launchpad"},{k:"⌘⌥D",a:"Toggle Dark Mode"}]}].map(c => <div key={c.t} className={cn("mb-4 p-4 rounded-2xl", isDark ? "bg-white/5" : "bg-white")}><h2 className={cn("text-sm font-medium mb-3", isDark ? "text-violet-400" : "text-violet-600")}>{c.t}</h2>{c.s.map(s => <div key={s.k} className="flex justify-between py-1 text-sm"><span className={isDark ? "text-gray-300" : "text-gray-700"}>{s.a}</span><kbd className={cn("px-2 py-0.5 rounded text-xs", isDark ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-600")}>{s.k}</kbd></div>)}</div>)}
    </div>
  </div>
);

const AboutOSWindow = ({ isDark }: { isDark: boolean }) => (
  <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-[#0a0a0f]" : "bg-gray-50")}>
    <div className="max-w-sm mx-auto text-center py-8">
      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center"><Shield className="w-10 h-10 text-white" /></div>
      <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>CyberOS</h1>
      <p className="text-sm text-gray-500 mb-6">Version 3.0 Portfolio Edition</p>
      <div className={cn("p-4 rounded-2xl text-left text-sm space-y-2", isDark ? "bg-white/5" : "bg-white")}>
        <p className={isDark ? "text-gray-300" : "text-gray-700"}><strong>Created by:</strong> Aayush Timalsina</p>
        <p className={isDark ? "text-gray-300" : "text-gray-700"}><strong>Location:</strong> Chitwan, Nepal 🇳🇵</p>
        <p className={isDark ? "text-gray-300" : "text-gray-700"}><strong>Tech:</strong> React, TypeScript, Tailwind</p>
        <p className={isDark ? "text-gray-300" : "text-gray-700"}><strong>Why:</strong> Because I can 😎</p>
      </div>
    </div>
  </div>
);

const ControlCenter = ({ isOpen, onClose, isDark, setIsDark, brightness, setBrightness, volume, setVolume, wifiEnabled, setWifiEnabled, bluetoothEnabled, setBluetoothEnabled }: any) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150]" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} className={cn("fixed top-12 right-4 w-64 rounded-3xl p-3 z-[160] shadow-2xl backdrop-blur-2xl border border-white/10", isDark ? "bg-black/40" : "bg-white/40")}>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button onClick={() => setWifiEnabled(!wifiEnabled)} className={cn("p-3 rounded-2xl flex flex-col items-center gap-1", wifiEnabled ? "bg-violet-600 text-white" : "bg-white/10 text-white/60")}>{wifiEnabled ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}<span className="text-xs">Wi-Fi</span></button>
            <button onClick={() => setBluetoothEnabled(!bluetoothEnabled)} className={cn("p-3 rounded-2xl flex flex-col items-center gap-1", bluetoothEnabled ? "bg-violet-600 text-white" : "bg-white/10 text-white/60")}><Bluetooth className="w-5 h-5" /><span className="text-xs">Bluetooth</span></button>
          </div>
          <div className={cn("p-3 rounded-2xl", isDark ? "bg-white/5" : "bg-white/30")}><div className="flex items-center gap-2 mb-2"><Sun className="w-4 h-4 text-white/60" /><span className="text-xs text-white/80">Brightness</span></div><input type="range" min="20" max="100" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full accent-violet-500" /></div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const MenuDropdown = ({ isOpen, onClose, items, isDark, position }: any) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110]" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -5 }} className={cn("fixed rounded-xl py-1 min-w-[180px] z-[120] shadow-2xl backdrop-blur-xl border border-white/10", isDark ? "bg-black/60" : "bg-white/80")} style={{ left: position.x, top: position.y }}>
          {items.map((item: any, i: number) => item.separator ? <div key={i} className="h-px mx-2 my-1 bg-white/10" /> : <button key={i} onClick={() => { item.action(); onClose(); }} className={cn("w-full px-3 py-1.5 text-left text-sm flex justify-between", isDark ? "text-gray-200 hover:bg-white/10" : "text-gray-800 hover:bg-gray-100")}><span>{item.label}</span>{item.shortcut && <span className="text-xs text-gray-500">{item.shortcut}</span>}</button>)}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const LoginScreen = ({ onLogin, isDark }: { onLogin: () => void; isDark: boolean }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const handleLogin = (e: React.FormEvent) => { e.preventDefault(); if (password === "TYPE-C") { setUnlocking(true); setTimeout(() => onLogin(), 800); } else { setError(true); setTimeout(() => setError(false), 1000); } };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-fuchsia-900/20 to-cyan-900/20" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-white/20"><ProfileImage src={PROFILE_IMAGE} size="w-full h-full" rounded="rounded-full" fallbackSize="w-12 h-12" /></div>
        <h2 className="text-2xl font-bold text-white mb-1">Aayush Timalsina</h2>
        <p className="text-sm text-gray-500 mb-6">Enter password to unlock</p>
        <form onSubmit={handleLogin} className="space-y-3">
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="TYPE-C" className={cn("w-48 px-4 py-2 rounded-xl text-center text-sm outline-none bg-white/10 text-white placeholder-gray-500 border", error ? "border-red-500" : "border-transparent")} autoFocus />
          <button type="submit" className="w-48 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600">Unlock</button>
        </form>
      </motion.div>
      <AnimatePresence>{unlocking && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f]"><motion.div animate={{ scale: [1, 1.5, 2], opacity: [1, 0.5, 0] }} transition={{ duration: 0.8 }} className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600" /></motion.div>}</AnimatePresence>
    </motion.div>
  );
};

// ============================================
// MAIN APP
// ============================================

function App() {
  const [isDark, setIsDark] = useState(true);
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(70);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [currentWallpaper, setCurrentWallpaper] = useState(DEFAULT_WALLPAPER);
  const [customWallpapers, setCustomWallpapers] = useState<Wallpaper[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([{ id: "terminal", title: "Terminal", type: "terminal", isOpen: true, isMinimized: false, isMaximized: false, zIndex: 1, position: { x: 100, y: 50 }, size: { width: 800, height: 500 } }]);
  const [showLaunchpad, setShowLaunchpad] = useState(false);
  const [zIndexCounter, setZIndexCounter] = useState(2);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 32 });

  useEffect(() => { const t = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const getMenuItems = (n: string) => {
    switch(n){
      case"File":return[{l:"New Terminal",s:"⌘N",a:()=>openWindow("terminal","Terminal")},{l:"Close",s:"⌘W",a:()=>activeWindow&&closeWindow(activeWindow)},{sep:true},{l:"Exit",s:"⌘Q",a:()=>window.location.reload()}];
      case"Edit":return[{l:"Preferences",s:"⌘,",a:()=>openWindow("settings","Settings")}];
      case"View":return[{l:"Launchpad",s:"F4",a:()=>setShowLaunchpad(true)},{l:"Dark Mode",s:"⌘⌥D",a:()=>setIsDark(!isDark)}];
      case"Help":return[{l:"CyberOS Help",a:()=>openWindow("help","Help")},{l:"About Me",a:()=>openWindow("about-os","About")}];
      default:return[];
    }
  };

  const handleMenuClick = (n: string, e: React.MouseEvent) => { const r=(e.target as HTMLElement).getBoundingClientRect();setMenuPosition({x:r.left,y:32});setActiveMenu(activeMenu===n?null:n); };
  const openWindow = (t: WindowState["type"], title: string) => { const e=windows.find(w=>w.type===t);if(e){if(e.isMinimized)setWindows(p=>p.map(w=>w.type===t?{...w,isMinimized:false,zIndex:zIndexCounter}:w));setActiveWindow(e.id);setZIndexCounter(p=>p+1);}else{const n={id:`${t}-${Date.now()}`,title,type:t,isOpen:true,isMinimized:false,isMaximized:false,zIndex:zIndexCounter,position:{x:100+windows.length*30,y:50+windows.length*30},size:{width:800,height:500}};setWindows(p=>[...p,n]);setZIndexCounter(p=>p+1);setActiveWindow(n.id);}setShowLaunchpad(false); };
  const closeWindow = (id: string) => { setWindows(p=>p.filter(w=>w.id!==id));if(activeWindow===id)setActiveWindow(null); };
  const minimizeWindow = (id: string) => { setWindows(p=>p.map(w=>w.id===id?{...w,isMinimized:true}:w));setActiveWindow(null); };
  const maximizeWindow = (id: string) => { setWindows(p=>p.map(w=>w.id===id?{...w,isMaximized:!w.isMaximized}:w)); };
  const bringToFront = (id: string) => { setWindows(p=>p.map(w=>w.id===id?{...w,zIndex:zIndexCounter}:w));setZIndexCounter(p=>p+1);setActiveWindow(id); };

  const getWindowContent = (w: WindowState) => {
    switch(w.type){
      case"terminal":return<TerminalWindow isDark={isDark}/>;
      case"about":return<AboutWindow isDark={isDark}/>;
      case"projects":return<ProjectsWindow isDark={isDark}/>;
      case"skills":return<SkillsWindow isDark={isDark}/>;
      case"contact":return<ContactWindow isDark={isDark}/>;
      case"settings":return<SettingsWindow isDark={isDark} setIsDark={setIsDark} brightness={brightness} setBrightness={setBrightness} volume={volume} setVolume={setVolume} currentWallpaper={currentWallpaper} setCurrentWallpaper={setCurrentWallpaper} customWallpapers={customWallpapers} setCustomWallpapers={setCustomWallpapers}/>;
      case"finder":return<FinderWindow isDark={isDark}/>;
      case"calculator":return<CalculatorWindow isDark={isDark}/>;
      case"calendar":return<CalendarWindow isDark={isDark}/>;
      case"notes":return<NotesWindow isDark={isDark}/>;
      case"help":return<HelpWindow isDark={isDark}/>;
      case"shortcuts":return<ShortcutsWindow isDark={isDark}/>;
      case"about-os":return<AboutOSWindow isDark={isDark}/>;
      default:return null;
    }
  };

  const dockItems = [{id:"finder",icon:<LayoutGrid className="w-6 h-6"/>,label:"Finder"},{id:"terminal",icon:<Terminal className="w-6 h-6"/>,label:"Terminal"},{id:"about",icon:<User className="w-6 h-6"/>,label:"About"},{id:"projects",icon:<FolderOpen className="w-6 h-6"/>,label:"Projects"},{id:"skills",icon:<Code className="w-6 h-6"/>,label:"Skills"},{id:"contact",icon:<Mail className="w-6 h-6"/>,label:"Contact"},{id:"settings",icon:<Settings className="w-6 h-6"/>,label:"Settings"}];

  const launchpadItems = [{id:"finder",icon:<LayoutGrid className="w-8 h-8"/>,label:"Finder",c:"from-violet-500 to-blue-600"},{id:"terminal",icon:<Terminal className="w-8 h-8"/>,label:"Terminal",c:"from-gray-700 to-gray-800"},{id:"about",icon:<User className="w-8 h-8"/>,label:"About",c:"from-fuchsia-500 to-purple-600"},{id:"projects",icon:<FolderOpen className="w-8 h-8"/>,label:"Projects",c:"from-yellow-500 to-orange-500"},{id:"skills",icon:<Code className="w-8 h-8"/>,label:"Skills",c:"from-green-500 to-emerald-600"},{id:"contact",icon:<Mail className="w-8 h-8"/>,label:"Contact",c:"from-red-500 to-pink-600"},{id:"settings",icon:<Settings className="w-8 h-8"/>,label:"Settings",c:"from-gray-500 to-gray-600"},{id:"calculator",icon:<Calculator className="w-8 h-8"/>,label:"Calculator",c:"from-orange-500 to-red-500"},{id:"calendar",icon:<Calendar className="w-8 h-8"/>,label:"Calendar",c:"from-red-500 to-red-600"},{id:"notes",icon:<FileText className="w-8 h-8"/>,label:"Notes",c:"from-yellow-400 to-yellow-500"}];

  return (
    <>
      <style>{`input[type="range"]{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;background:rgba(255,255,255,0.1);outline:none}input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:#8b5cf6;border:none;cursor:pointer}`}</style>
      <AnimatePresence>{!isLoggedIn&&<LoginScreen onLogin={()=>setIsLoggedIn(true)} isDark={isDark}/>}</AnimatePresence>
      <div className={cn("min-h-screen w-full overflow-hidden transition-opacity duration-500",isLoggedIn?"opacity-100":"opacity-0 pointer-events-none")} style={{filter:`brightness(${brightness}%)`}}>
        <div className="fixed inset-0 bg-cover bg-center transition-all duration-700" style={{backgroundImage:`url(${currentWallpaper})`}}/>
        <div className={cn("fixed inset-0 transition-opacity duration-500",isDark?"bg-black/50 backdrop-blur-sm":"bg-white/30 backdrop-blur-sm")}/>
        <div className={cn("fixed top-0 left-0 right-0 h-10 flex items-center justify-between px-4 z-[100] backdrop-blur-xl border-b border-white/10",isDark?"bg-black/20":"bg-white/20")}>
          <div className="flex items-center gap-4">
            <Shield className="w-4 h-4 text-violet-500"/>
            <span className="font-medium text-sm text-white/90">CyberOS</span>
            <div className="hidden md:flex items-center gap-1">
              {["File","Edit","View","Help"].map(m=><button key={m} onClick={e=>handleMenuClick(m,e)} className="px-3 py-1 rounded-lg text-sm text-white/80 hover:bg-white/10 transition-colors">{m}</button>)}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/80">
            <button onClick={()=>setShowControlCenter(!showControlCenter)} className="p-1.5 rounded-lg hover:bg-white/10">{wifiEnabled?<WifiIcon className="w-4 h-4"/>:<WifiOff className="w-4 h-4"/>}</button>
            <span className="font-medium">{format(currentTime,"EEE MMM d h:mm a")}</span>
          </div>
        </div>
        {activeMenu&&<MenuDropdown isOpen={!!activeMenu} onClose={()=>setActiveMenu(null)} items={getMenuItems(activeMenu)} isDark={isDark} position={menuPosition}/>}
        <ControlCenter isOpen={showControlCenter} onClose={()=>setShowControlCenter(false)} isDark={isDark} setIsDark={setIsDark} brightness={brightness} setBrightness={setBrightness} volume={volume} setVolume={setVolume} wifiEnabled={wifiEnabled} setWifiEnabled={setWifiEnabled} bluetoothEnabled={bluetoothEnabled} setBluetoothEnabled={setBluetoothEnabled}/>
        <div className="pt-10 h-screen relative">
          <AnimatePresence>
            {windows.map(w=>!w.isMinimized&&<Window key={w.id} window={w} isActive={activeWindow===w.id} onClose={()=>closeWindow(w.id)} onMinimize={()=>minimizeWindow(w.id)} onMaximize={()=>maximizeWindow(w.id)} onClick={()=>bringToFront(w.id)} isDark={isDark} brightness={brightness}>{getWindowContent(w)}</Window>)}
          </AnimatePresence>
          <AnimatePresence>
            {showLaunchpad&&<motion.div initial={{opacity:0,scale:1.1}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:1.1}} className={cn("fixed inset-0 z-[90] flex items-center justify-center backdrop-blur-xl",isDark?"bg-black/80":"bg-white/80")} onClick={()=>setShowLaunchpad(false)}><div className="grid grid-cols-4 md:grid-cols-5 gap-6 p-8">{launchpadItems.map(i=><motion.button key={i.id} whileHover={{scale:1.1}} whileTap={{scale:0.95}} onClick={e=>{e.stopPropagation();openWindow(i.id as WindowState["type"],i.label)}} className="flex flex-col items-center gap-2"><div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br",i.c)}><div className="text-white">{i.icon}</div></div><span className={cn("text-xs font-medium",isDark?"text-white":"text-gray-900")}>{i.label}</span></motion.button>)}</div></motion.div>}
          </AnimatePresence>
        </div>
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80]">
          <motion.div initial={{y:100,opacity:0}} animate={{y:0,opacity:1}} className={cn("flex items-end gap-2 px-2 py-2 rounded-3xl backdrop-blur-2xl border border-white/10 shadow-2xl",isDark?"bg-black/30":"bg-white/30")}>
            {dockItems.map(i=>{const a=activeWindow?.startsWith(i.id);return<DockItem key={i.id} icon={i.icon} label={i.label} isActive={a||false} onClick={()=>i.id==="finder"?setShowLaunchpad(true):openWindow(i.id as WindowState["type"],i.label)} isDark={isDark}/>})}
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default App;