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
  { id: "dark-abstract", name: "Dark Abstract", url: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80", thumbnail: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=200&q=60" },
  { id: "hack1", name: "Hacker Terminal", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=80", thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&q=60" },
  { id: "hack3", name: "Server Room", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80", thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&q=60" },
];

const PROJECTS: Project[] = [
  { id: "1", title: "Network Security Lab", description: "Configured firewalls and intrusion detection systems.", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80", skills: ["Firewall Configuration", "IDS/IPS Setup", "Vulnerability Scanning"], category: "Security" },
  { id: "2", title: "Web Application Penetration Testing", description: "Conducted security assessments on web applications.", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80", skills: ["OWASP Testing", "Burp Suite", "Vulnerability Reporting"], category: "Web Security" },
  { id: "3", title: "Network Traffic Analysis", description: "Analyzed network traffic using Wireshark.", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80", skills: ["Wireshark Analysis", "Intrusion Detection", "Threat Hunting"], category: "Analysis" },
  { id: "4", title: "Price Tampering Vulnerability", description: "Identified price tampering vulnerabilities in e-commerce.", image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80", skills: ["Vulnerability Assessment", "Penetration Testing", "Security Implementation"], category: "Vulnerability" },
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
    <div className={cn(size, rounded, "overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center")}>
      {!failed ? <img src={src} alt="Aayush Timalsina" className="w-full h-full object-cover" onError={() => setFailed(true)} /> : <User className={cn(fallbackSize, "text-white")} />}
    </div>
  );
};

const DockItem = ({ icon, label, isActive, onClick, isDark, badge }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; isDark: boolean; badge?: number }) => (
  <motion.button whileHover={{ scale: 1.2, y: -8 }} whileTap={{ scale: 0.95 }} onClick={onClick} className="group relative flex flex-col items-center">
    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg relative", isActive ? (isDark ? "bg-gradient-to-br from-blue-600 to-purple-600" : "bg-gradient-to-br from-blue-500 to-purple-500") : (isDark ? "bg-white/10 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl"))}>
      <div className={isActive ? "text-white" : isDark ? "text-gray-300" : "text-gray-700"}>{icon}</div>
      {badge && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">{badge}</div>}
    </div>
    <span className={cn("absolute -top-10 px-3 py-1 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none", isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800 shadow-lg")}>{label}</span>
    {isActive && <motion.div layoutId="dock-indicator" className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-blue-500" />}
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
    <motion.div ref={windowRef} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: win.isMinimized ? 0 : 1, scale: win.isMinimized ? 0.9 : 1, y: win.isMinimized ? 20 : 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className={cn("absolute rounded-xl overflow-hidden shadow-2xl", isActive ? "z-50" : "z-10", isDark ? "bg-gray-900/95 border border-gray-700" : "bg-white/95 border border-gray-200")} style={{ zIndex: win.zIndex, width: win.isMaximized ? "100vw" : win.size.width, height: win.isMaximized ? "calc(100vh - 32px)" : win.size.height, left: win.isMaximized ? 0 : win.position.x, top: win.isMaximized ? 32 : win.position.y, filter: `brightness(${brightness}%)` }} onMouseDown={handleMouseDown}>
      <div className={cn("window-header flex items-center justify-between px-4 py-3 cursor-default select-none", isDark ? "bg-gray-800/50 border-b border-gray-700" : "bg-gray-50/80 border-b border-gray-200")}>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center group"><X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" /></button>
          <button onClick={onMinimize} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors flex items-center justify-center group"><Minimize2 className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100" /></button>
          <button onClick={onMaximize} className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center group"><Maximize2 className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100" /></button>
        </div>
        <span className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-700")}>{win.title}</span>
        <div className="w-16" />
      </div>
      <div className="overflow-auto" style={{ height: "calc(100% - 48px)" }}>{children}</div>
    </motion.div>
  );
};

// ============================================
// TERMINAL WINDOW (ADVANCED) - PART 1
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
  const [commands, setCommands] = useState<string[]>(['Welcome to CyberOS Terminal v3.0 - Advanced Edition', 'Type "help" for available commands', '']);
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
    const parts = command.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const args = parts.map(p => p.replace(/^"|"$/g, ''));
    const cmd = args[0]?.toLowerCase();
    const flags = args.filter(a => a.startsWith('-')).join('');
    const operands = args.slice(1).filter(a => !a.startsWith('-'));

    switch (cmd) {
      case 'cd': { 
        const target = operands[0] || terminalState.environment.HOME; 
        const resolved = resolvePath(target); 
        const { node } = getNodeAtPath(resolved); 
        if (!node) return [`bash: cd: ${target}: No such file or directory`]; 
        if (node.type !== 'directory') return [`bash: cd: ${target}: Not a directory`]; 
        setTerminalState(prev => ({ ...prev, currentPath: resolved, environment: { ...prev.environment, OLDPWD: prev.currentPath, PWD: resolved } })); 
        return []; 
      }
      case 'pwd': return [terminalState.currentPath];
      case 'ls': { 
        const showAll = flags.includes('a') || flags.includes('A'); 
        const longFormat = flags.includes('l'); 
        const humanReadable = flags.includes('h'); 
        const sortByTime = flags.includes('t'); 
        const reverse = flags.includes('r'); 
        const target = operands[0] || '.'; 
        const resolved = resolvePath(target); 
        const { node } = getNodeAtPath(resolved); 
        if (!node) return [`ls: cannot access '${target}': No such file or directory`]; 
        if (node.type === 'file') return longFormat ? [`${node.permissions} 1 ${node.owner} ${node.owner} ${humanReadable ? formatSize(node.size) : node.size} ${formatDate(node.modified)} ${node.name}`] : [node.name]; 
        let entries = Object.entries(node.children || {}); 
        if (!showAll) entries = entries.filter(([name]) => !name.startsWith('.')); 
        if (sortByTime) entries.sort((a, b) => b[1].modified.getTime() - a[1].modified.getTime()); 
        else entries.sort(([a], [b]) => a.localeCompare(b)); 
        if (reverse) entries.reverse(); 
        if (!longFormat) return entries.map(([name, child]) => child.type === 'directory' ? `${name}/` : child.type === 'executable' ? `${name}*` : name); 
        const total = entries.reduce((sum, [, n]) => sum + Math.ceil(n.size / 4096) * 4, 0); 
        const lines = [`total ${Math.ceil(total / 2)}`]; 
        for (const [name, child] of entries) { 
          const size = humanReadable ? formatSize(child.size) : child.size.toString().padStart(8); 
          lines.push(`${child.permissions} 1 ${child.owner.padEnd(8)} ${child.owner.padEnd(8)} ${size} ${formatDate(child.modified)} ${name}${child.type === 'directory' ? '/' : child.type === 'executable' ? '*' : ''}`); 
        } 
        return lines; 
      }
      case 'cat': { 
        if (operands.length === 0) return stdin ? stdin.split('\n') : []; 
        const lines: string[] = []; 
        for (const file of operands) { 
          const resolved = resolvePath(file); 
          const { node } = getNodeAtPath(resolved); 
          if (!node) lines.push(`cat: ${file}: No such file or directory`); 
          else if (node.type === 'directory') lines.push(`cat: ${file}: Is a directory`); 
          else lines.push(...(node.content || '').split('\n')); 
        } 
        return lines; 
      }
      case 'head': { 
        const numLines = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10; 
        const file = operands[0]; 
        if (!file) return ['head: missing file argument']; 
        const { node } = getNodeAtPath(resolvePath(file)); 
        if (!node || node.type !== 'file') return [`head: cannot open '${file}'`]; 
        return (node.content || '').split('\n').slice(0, numLines); 
      }
      case 'tail': { 
        const numLines = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10; 
        const file = operands[0]; 
        if (!file) return ['tail: missing file argument']; 
        const { node } = getNodeAtPath(resolvePath(file)); 
        if (!node || node.type !== 'file') return [`tail: cannot open '${file}'`]; 
        return (node.content || '').split('\n').slice(-numLines); 
      }
      case 'less': 
      case 'more': { 
        const file = operands[0]; 
        if (!file) return [`${cmd}: missing file argument`]; 
        const { node } = getNodeAtPath(resolvePath(file)); 
        if (!node || node.type !== 'file') return [`${cmd}: ${file}: No such file or directory`]; 
        return (node.content || '').split('\n'); 
      }
      case 'touch': { 
        if (operands.length === 0) return ['touch: missing file operand']; 
        for (const file of operands) { 
          const resolved = resolvePath(file); 
          const { node, parent, name } = getNodeAtPath(resolved); 
          if (!parent) continue; 
          if (!node) { 
            const newFile: FileNode = { name, type: 'file', permissions: '-rw-r--r--', owner: terminalState.environment.USER, size: 0, modified: new Date(), content: '' }; 
            setFileSystem(prev => { const newFS = { ...prev }; const parts = resolved.split('/').filter(Boolean); let current: FileNode = newFS; for (let i = 0; i < parts.length - 1; i++) current = current.children![parts[i]]; current.children![name] = newFile; return newFS; }); 
          } else { 
            setFileSystem(prev => { const newFS = { ...prev }; const parts = resolved.split('/').filter(Boolean); let current: FileNode = newFS; for (let i = 0; i < parts.length; i++) current = current.children![parts[i]]; current.modified = new Date(); return newFS; }); 
          } 
        } 
        return []; 
      }
      case 'mkdir': { 
        const createParents = flags.includes('p'); 
        if (operands.length === 0) return ['mkdir: missing operand']; 
        for (const dir of operands) { 
          const resolved = resolvePath(dir); 
          const { node, parent, name } = getNodeAtPath(resolved); 
          if (node) return [`mkdir: cannot create directory '${dir}': File exists`]; 
          if (!parent) return [`mkdir: cannot create directory '${dir}': No such file or directory`]; 
          const newDir: FileNode = { name, type: 'directory', permissions: 'drwxr-xr-x', owner: terminalState.environment.USER, size: 4096, modified: new Date(), children: {} }; 
          setFileSystem(prev => { const newFS = { ...prev }; const parts = resolved.split('/').filter(Boolean); let current: FileNode = newFS; for (let i = 0; i < parts.length - 1; i++) { if (!current.children![parts[i]]) { current.children![parts[i]] = { name: parts[i], type: 'directory', permissions: 'drwxr-xr-x', owner: terminalState.environment.USER, size: 4096, modified: new Date(), children: {} }; } current = current.children![parts[i]]; } current.children![name] = newDir; return newFS; }); 
        } 
        return []; 
      }
      case 'rm': { 
        const recursive = flags.includes('r') || flags.includes('R'); 
        const force = flags.includes('f'); 
        if (operands.length === 0) return ['rm: missing operand']; 
        for (const target of operands) { 
          const resolved = resolvePath(target); 
          const { node, parent, name } = getNodeAtPath(resolved); 
          if (!node) { if (!force) return [`rm: cannot remove '${target}': No such file or directory`]; continue; } 
          if (node.type === 'directory' && !recursive) return [`rm: cannot remove '${target}': Is a directory`]; 
          setFileSystem(prev => { const newFS = { ...prev }; const parts = resolved.split('/').filter(Boolean); let current: FileNode = newFS; for (let i = 0; i < parts.length - 1; i++) current = current.children![parts[i]]; delete current.children![name]; return newFS; }); 
        } 
        return []; 
      }
      case 'cp': { 
        if (operands.length < 2) return ['cp: missing file operand']; 
        const sources = operands.slice(0, -1); 
        const dest = operands[operands.length - 1]; 
        const recursive = flags.includes('r') || flags.includes('R'); 
        const { node: destNode } = getNodeAtPath(resolvePath(dest)); 
        const isDestDir = destNode?.type === 'directory'; 
        if (sources.length > 1 && !isDestDir) return [`cp: target '${dest}' is not a directory`]; 
        for (const src of sources) { 
          const srcResolved = resolvePath(src); 
          const { node: srcNode } = getNodeAtPath(srcResolved); 
          if (!srcNode) return [`cp: cannot stat '${src}': No such file or directory`]; 
          if (srcNode.type === 'directory' && !recursive) return [`cp: -r not specified; omitting directory '${src}'`]; 
          const destName = isDestDir ? `${dest}/${srcNode.name}` : dest; 
          const destResolved = resolvePath(destName); 
          const copyNode = (n: FileNode): FileNode => ({ ...n, modified: new Date(), children: n.children ? Object.fromEntries(Object.entries(n.children).map(([k, v]) => [k, copyNode(v)])) : undefined }); 
          setFileSystem(prev => { const newFS = { ...prev }; const parts = destResolved.split('/').filter(Boolean); let current: FileNode = newFS; for (let i = 0; i < parts.length - 1; i++) current = current.children![parts[i]]; current.children![parts[parts.length - 1]] = copyNode(srcNode); return newFS; }); 
        } 
        return []; 
      }
      case 'mv': { 
        if (operands.length < 2) return ['mv: missing file operand']; 
        const sources = operands.slice(0, -1); 
        const dest = operands[operands.length - 1]; 
        const { node: destNode } = getNodeAtPath(resolvePath(dest)); 
        const isDestDir = destNode?.type === 'directory'; 
        if (sources.length > 1 && !isDestDir) return [`mv: target '${dest}' is not a directory`]; 
        for (const src of sources) { 
          const srcResolved = resolvePath(src); 
          const { node: srcNode, name: srcName } = getNodeAtPath(srcResolved); 
          if (!srcNode) return [`mv: cannot stat '${src}': No such file or directory`]; 
          const destName = isDestDir ? `${dest}/${srcName}` : dest; 
          const destResolved = resolvePath(destName); 
          const { parent: destParent, name: destFileName } = getNodeAtPath(destResolved); 
          if (!destParent) return [`mv: cannot move '${src}' to '${dest}': No such file or directory`]; 
          setFileSystem(prev => { const newFS = { ...prev }; const srcParts = srcResolved.split('/').filter(Boolean); let srcCurrent: FileNode = newFS; for (let i = 0; i < srcParts.length - 1; i++) srcCurrent = srcCurrent.children![srcParts[i]]; const movedNode = { ...srcCurrent.children![srcName], name: destFileName, modified: new Date() }; delete srcCurrent.children![srcName]; const destParts = destResolved.split('/').filter(Boolean); let destCurrent: FileNode = newFS; for (let i = 0; i < destParts.length - 1; i++) destCurrent = destCurrent.children![destParts[i]]; destCurrent.children![destFileName] = movedNode; return newFS; }); 
        } 
        return []; 
      }
      case 'nano': 
      case 'vim': 
      case 'vi': { 
        const file = operands[0]; 
        if (!file) { 
          setEditor({ isOpen: true, filename: 'New Buffer', content: [''], cursorLine: 0, cursorCol: 0, modified: false, mode: 'insert', commandBuffer: '', statusMessage: '^G Help  ^O Write Out  ^W Where Is  ^K Cut  ^J Justify  ^C Cur Pos  ^X Exit' }); 
          return []; 
        } 
        const resolved = resolvePath(file); 
        const { node } = getNodeAtPath(resolved); 
        let content: string[]; 
        if (!node) content = ['']; 
        else if (node.type !== 'file') return [`${cmd}: ${file}: Is a directory`]; 
        else { 
          content = (node.content || '').split('\n'); 
          if (content[content.length - 1] === '') content.pop(); 
          if (content.length === 0) content = ['']; 
        } 
        setEditor({ isOpen: true, filename: file, content, cursorLine: 0, cursorCol: 0, modified: false, mode: cmd === 'nano' ? 'insert' : 'normal', commandBuffer: '', statusMessage: cmd === 'nano' ? '^G Help  ^O Write Out  ^W Where Is  ^K Cut  ^J Justify  ^C Cur Pos  ^X Exit' : '' }); 
        return []; 
      }
      case 'grep': { 
        const caseInsensitive = flags.includes('i'); 
        const recursive = flags.includes('r') || flags.includes('R'); 
        const lineNumbers = flags.includes('n'); 
        const invert = flags.includes('v'); 
        let pattern = operands[0]; 
        const files = operands.slice(1); 
        if (!pattern) return ['grep: missing pattern']; 
        pattern = pattern.replace(/^['"]|['"]$/g, ''); 
        const results: string[] = []; 
        const regex = new RegExp(pattern, caseInsensitive ? 'i' : ''); 
        const searchFile = (filepath: string, content: string, filename?: string) => { 
          const lines = content.split('\n'); 
          lines.forEach((line, idx) => { 
            const matches = regex.test(line); 
            if ((matches && !invert) || (!matches && invert)) { 
              const prefix = filename ? `${filename}:` : ''; 
              const lineNum = lineNumbers ? `${idx + 1}:` : ''; 
              results.push(`${prefix}${lineNum}${line}`); 
            } 
          }); 
        }; 
        if (files.length === 0) { if (stdin) searchFile('(standard input)', stdin); } 
        else { 
          for (const file of files) { 
            const resolved = resolvePath(file); 
            const { node } = getNodeAtPath(resolved); 
            if (!node) results.push(`grep: ${file}: No such file or directory`); 
            else if (node.type === 'directory') { 
              if (!recursive) results.push(`grep: ${file}: Is a directory`); 
              else { 
                const traverse = (n: FileNode, path: string) => { 
                  if (n.type === 'file' && n.content) searchFile(path, n.content, path); 
                  else if (n.children) Object.entries(n.children).forEach(([name, child]) => traverse(child, `${path}/${name}`)); 
                }; 
                traverse(node, file); 
              } 
            } else if (node.content) searchFile(file, node.content); 
          } 
        } 
        return results; 
      }
      case 'find': { 
        const startPath = operands[0] || '.'; 
        const namePattern = args.includes('-name') ? args[args.indexOf('-name') + 1] : undefined; 
        const typeFilter = args.includes('-type') ? args[args.indexOf('-type') + 1] : undefined; 
        const resolved = resolvePath(startPath); 
        const { node } = getNodeAtPath(resolved); 
        if (!node) return [`find: '${startPath}': No such file or directory`]; 
        const results: string[] = []; 
        const traverse = (n: FileNode, path: string) => { 
          const shouldInclude = (!namePattern || new RegExp(namePattern.replace(/\*/g, '.*')).test(n.name)) && (!typeFilter || (typeFilter === 'f' && n.type === 'file') || (typeFilter === 'd' && n.type === 'directory') || (typeFilter === 'l' && n.type === 'link')); 
          if (shouldInclude && path !== resolved) results.push(path); 
          if (n.children) Object.entries(n.children).forEach(([name, child]) => traverse(child, `${path}/${name}`)); 
        }; 
        traverse(node, resolved); 
        return results.sort(); 
      }
      case 'ps': { 
        const aux = flags.includes('a') || flags.includes('x') || flags.includes('u'); 
        if (aux) { 
          const lines = ['USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND']; 
          for (const proc of terminalState.processes) lines.push(`${terminalState.environment.USER.padEnd(10)} ${proc.pid.toString().padStart(5)} ${proc.cpu.toFixed(1).padStart(4)} ${proc.memory.toFixed(1).padStart(4)}  ${(proc.memory * 1024).toFixed(0).padStart(5)} ${(proc.memory * 512).toFixed(0).padStart(5)} pts/0    ${proc.status === 'running' ? 'R' : 'S'}+ ${formatDate(new Date()).split(' ').slice(0, 2).join(' ')} 0:00 ${proc.name}`); 
          return lines; 
        } 
        return ['  PID TTY          TIME CMD', ...terminalState.processes.filter(p => p.status === 'running').map(p => `${p.pid.toString().padStart(5)} pts/0    00:00:00 ${p.name}`)]; 
      }
      case 'top': return [`top - ${new Date().toLocaleTimeString()} up 3 days, 2:15, 1 user,  load average: 0.52, 0.58, 0.59`, `Tasks: ${terminalState.processes.length} total,   1 running, ${terminalState.processes.length - 1} sleeping,   0 stopped,   0 zombie`, `%Cpu(s):  2.5 us,  1.0 sy,  0.0 ni, 96.0 id,  0.5 wa,  0.0 hi,  0.0 si,  0.0 st`, `MiB Mem :  15923.5 total,   8234.2 free,   4567.3 used,   3122.0 buff/cache`, `MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.  10356.2 avail Mem`, '', '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND', ...terminalState.processes.map(p => `${p.pid.toString().padStart(5)} ${terminalState.environment.USER.padEnd(8)} 20   0 ${(p.memory * 10).toFixed(1).padStart(7)} ${p.memory.toFixed(1).padStart(6)} ${(p.memory * 0.5).toFixed(1).padStart(6)} ${p.status === 'running' ? 'R' : 'S'}  ${p.cpu.toFixed(1).padStart(5)} ${p.memory.toFixed(1).padStart(4)}   0:00.00 ${p.name}`), '', 'Press q to quit (simulated)'];
      case 'kill': { 
        const signal = args.find(a => a.startsWith('-'))?.slice(1) || '15'; 
        if (operands.length === 0) return ['kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l [sigspec]']; 
        for (const pidStr of operands) { 
          const pid = parseInt(pidStr); 
          const proc = terminalState.processes.find(p => p.pid === pid); 
          if (!proc) return [`bash: kill: (${pid}) - No such process`]; 
          setTerminalState(prev => ({ ...prev, processes: prev.processes.filter(p => p.pid !== pid) })); 
        } 
        return []; 
      }
      case 'env': 
      case 'printenv': { 
        if (operands.length > 0) return operands.map(v => terminalState.environment[v] || ''); 
        return Object.entries(terminalState.environment).map(([k, v]) => `${k}=${v}`); 
      }
      case 'export': { 
        if (operands.length === 0) return Object.entries(terminalState.environment).map(([k, v]) => `declare -x ${k}="${v}"`); 
        for (const assignment of operands) { 
          const [key, ...valueParts] = assignment.split('='); 
          const value = valueParts.join('=').replace(/^["']|["']$/g, ''); 
          setTerminalState(prev => ({ ...prev, environment: { ...prev.environment, [key]: value } })); 
        } 
        return []; 
      }
      case 'unset': { 
        for (const key of operands) setTerminalState(prev => { const newEnv = { ...prev.environment }; delete newEnv[key]; return { ...prev, environment: newEnv }; }); 
        return []; 
      }
      case 'alias': { 
        if (operands.length === 0) return Object.entries(terminalState.aliases).map(([k, v]) => `alias ${k}='${v}'`); 
        for (const def of operands) { 
          if (!def.includes('=')) { 
            const existing = terminalState.aliases[def]; 
            return existing ? [`alias ${def}='${existing}'`] : [`bash: alias: ${def}: not found`]; 
          } 
          const [name, ...valueParts] = def.split('='); 
          const value = valueParts.join('=').replace(/^['"]|['"]$/g, ''); 
          setTerminalState(prev => ({ ...prev, aliases: { ...prev.aliases, [name]: value } })); 
        } 
        return []; 
      }
      case 'unalias': { 
        const all = flags.includes('a'); 
        if (all) { setTerminalState(prev => ({ ...prev, aliases: {} })); return []; } 
        if (operands.length === 0) return ['unalias: usage: unalias [-a] name [name ...]']; 
        for (const name of operands) setTerminalState(prev => { const newAliases = { ...prev.aliases }; delete newAliases[name]; return { ...prev, aliases: newAliases }; }); 
        return []; 
      }
      case 'source': 
      case '.': { 
        const file = operands[0]; 
        if (!file) return [`${cmd}: filename argument required`]; 
        const { node } = getNodeAtPath(resolvePath(file)); 
        if (!node || node.type !== 'file') return [`${cmd}: ${file}: No such file or directory`]; 
        const lines = (node.content || '').split('\n'); 
        const results: string[] = []; 
        for (const line of lines) { 
          const trimmed = line.trim(); 
          if (trimmed && !trimmed.startsWith('#')) { 
            const lineResults = executeCommand(trimmed); 
            results.push(...lineResults); 
          } 
        } 
        return results; 
      }
      case 'file': { 
        if (operands.length === 0) return ['file: missing operand']; 
        return operands.map(file => { 
          const { node } = getNodeAtPath(resolvePath(file)); 
          if (!node) return `${file}: cannot open \`${file}' (No such file or directory)`; 
          if (node.type === 'directory') return `${file}: directory`; 
          if (node.type === 'link') return `${file}: symbolic link to ${node.target}`; 
          if (node.type === 'executable') return `${file}: ELF 64-bit LSB executable, x86-64, version 1 (SYSV)`; 
          if (node.content?.startsWith('#!')) return `${file}: ${node.content.split('\n')[0].slice(2)} script text executable`; 
          if (node.content?.includes('\0')) return `${file}: data`; 
          return `${file}: ASCII text`; 
        }); 
      }
      case 'wc': { 
        const lines = flags.includes('l'); 
        const words = flags.includes('w'); 
        const bytes = flags.includes('c'); 
        const defaultMode = !lines && !words && !bytes; 
        const targets = operands.length > 0 ? operands : ['-']; 
        const results: string[] = []; 
        let totalLines = 0, totalWords = 0, totalBytes = 0; 
        for (const target of targets) { 
          let content: string; 
          if (target === '-') content = stdin; 
          else { 
            const { node } = getNodeAtPath(resolvePath(target)); 
            if (!node || node.type !== 'file') { 
              results.push(`wc: ${target}: No such file or directory`); 
              continue; 
            } 
            content = node.content || ''; 
          } 
          const l = content.split('\n').length - (content.endsWith('\n') ? 1 : 0); 
          const w = content.trim().split(/\s+/).filter(Boolean).length; 
          const b = new Blob([content]).size; 
          totalLines += l; totalWords += w; totalBytes += b; 
          const parts: string[] = []; 
          if (defaultMode || lines) parts.push(l.toString().padStart(8)); 
          if (defaultMode || words) parts.push(w.toString().padStart(8)); 
          if (defaultMode || bytes) parts.push(b.toString().padStart(8)); 
          parts.push(target); 
          results.push(parts.join(' ')); 
        } 
        if (targets.length > 1) { 
          const parts: string[] = []; 
          if (defaultMode || lines) parts.push(totalLines.toString().padStart(8)); 
          if (defaultMode || words) parts.push(totalWords.toString().padStart(8)); 
          if (defaultMode || bytes) parts.push(totalBytes.toString().padStart(8)); 
          parts.push('total'); 
          results.push(parts.join(' ')); 
        } 
        return results; 
      }
      case 'whoami': return [terminalState.environment.USER];
      case 'hostname': { 
        const { node } = getNodeAtPath('/etc/hostname'); 
        return [(node?.content || 'cyberos-portfolio').trim()]; 
      }
      case 'uname': { 
        const all = flags.includes('a'); 
        const kernel = flags.includes('s') || flags.includes('r') || all; 
        const machine = flags.includes('m') || all; 
        if (all) return ['Linux cyberos-portfolio 5.15.0-cyberos-generic #1 SMP x86_64 GNU/Linux']; 
        if (kernel) return ['Linux']; 
        if (machine) return ['x86_64']; 
        return ['Linux']; 
      }
      case 'date': { 
        const utc = flags.includes('u'); 
        return [utc ? new Date().toUTCString() : new Date().toString()]; 
      }
      case 'uptime': return [` ${new Date().toLocaleTimeString()} up 3 days, 2:15,  1 user,  load average: 0.52, 0.58, 0.59`];
      case 'clear': setCommands([]); return [];
      case 'history': { 
        const num = operands[0] ? parseInt(operands[0]) : terminalState.history.length; 
        return terminalState.history.slice(-num).map((cmd, i) => `${(i + 1).toString().padStart(5)}  ${cmd}`); 
      }
      case 'echo': return [operands.join(' ')];
      case 'help': return ['╔══════════════════════════════════════════════════════════════════╗', '║                    CyberOS Terminal Commands                     ║', '╠══════════════════════════════════════════════════════════════════╣', '║  NAVIGATION                                                      ║', '║    cd [dir]      Change directory        pwd      Print directory ║', '║    ls [options]  List files              ..       Parent dir (alias)║', '╠══════════════════════════════════════════════════════════════════╣', '║  FILE OPERATIONS                                                 ║', '║    cat [file]    Display contents        touch    Create empty file║', '║    head/tail     Show file start/end     less     Paged view       ║', '║    mkdir [-p]    Create directory        rm [-rf] Remove file/dir  ║', '║    cp [-r]       Copy files              mv       Move/rename      ║', '╠══════════════════════════════════════════════════════════════════╣', '║  EDITORS                                                         ║', '║    nano [file]   Full text editor with save/load capabilities      ║', '║    vim/vi [file] Vim-style editor (basic)                        ║', '╠══════════════════════════════════════════════════════════════════╣', '║  SEARCH & PROCESS                                                ║', '║    grep [opt]    Search text             find     Find files       ║', '║    ps/top        Process info            kill     Terminate process║', '╠══════════════════════════════════════════════════════════════════╣', '║  ENVIRONMENT                                                     ║', '║    env/export    Variables               alias    Command aliases  ║', '║    source/.      Execute script          uname    System info      ║', '╠══════════════════════════════════════════════════════════════════╣', '║  FEATURES: Pipes |  Redirection > >>  Variables $VAR  Tab complete ║', '╚══════════════════════════════════════════════════════════════════╝'];
      case 'neofetch': return ['       .---.        aayush@cyberos-portfolio', '      /     \\       ------------------------', '      \\.@-@./       OS: CyberOS 3.0 Portfolio Edition', '      /`\\_/`\\       Kernel: Linux 5.15.0-cyberos', '     //  _  \\\\      Uptime: 3 days, 2:15', '    | \\     )|_     Shell: bash 5.1.16', '   /`\\_`>  <_/ \\    DE: ReactOS', '   \\__/\'---\'\\__/    WM: Framer Motion', '                    Theme: Cyberpunk Dark [Made by Aayush]', '                    CPU: AMD Ryzen 9 5900X [Handpicked by Me]', '                    GPU: NVIDIA RTX 3080 [My Gaming Beast]', '                    Memory: 16GB / 32GB [Upgraded by Yours Truly]', '                    ', '                    ✨ Crafted with passion by Aayush Timalsina ✨', '                    🔒 Cybersecurity Student | Nepal 🇳🇵', '                    💻 "Code is poetry, security is art"'];
      case 'hack': return ['[+] Initializing penetration testing sequence...', '[+] Loading exploit modules... [Aayush Custom Build]', '[+] Scanning target 192.168.1.0/24...', '    [>] Found 3 active hosts', '    [>] Port 22 open on 192.168.1.105', '    [>] Port 80 open on 192.168.1.110', '    [>] Port 443 open on 192.168.1.110', '[+] Running vulnerability scan...', '    [!] CVE-2021-44228 detected on 192.168.1.110', '[+] Attempting exploitation...', '    [>] Gaining shell access...', '    [>] Privilege escalation successful', '[+] ROOT ACCESS OBTAINED', '', '[!] SIMULATION COMPLETE - No actual systems were harmed', '[!] Remember: Always practice ethical hacking!', '[!] ~ Aayush "Type-C" Timalsina'];
      case 'nmap': { 
        const target = operands[0] || '127.0.0.1'; 
        return [`Starting Nmap 7.92 ( https://nmap.org ) at ${new Date().toLocaleString()}`, `Nmap scan report for ${target}`, `Host is up (0.00032s latency).`, `Not shown: 997 closed tcp ports (reset)`, `PORT    STATE SERVICE`, `22/tcp  open  ssh`, `80/tcp  open  http`, `443/tcp open  https`, '', `Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds`, 'Scanner configured by Aayush Timalsina']; 
      }
      case 'ssh': { 
        const host = operands[0]; 
        if (!host) return ['usage: ssh user@host']; 
        return [`The authenticity of host '${host}' can't be established.`, `ED25519 key fingerprint is SHA256:aBcD1234eFgH5678iJkL9012mNoP3456qRsT7890uVwX.`, `This key is not known by any other names`, `Are you sure you want to continue connecting (yes/no/[fingerprint])?`, '', '[!] Connection simulated - no actual SSH connection made', '[!] Secure shell enthusiast: Aayush Timalsina']; 
      }
      case 'python3': 
      case 'python': { 
        if (operands.length === 0) return ['Python 3.10.4 (main, Mar 23 2022, 23:05:40) [GCC 9.4.0] :: Anaconda, Inc. on linux', 'Type "help", "copyright", "credits" or "license" for more information.', '>>> ', '[!] Interactive mode not available in this terminal', '    Use: python3 -c "print(\'hello\')" for single commands', '    Python lover: Aayush Timalsina']; 
        if (operands[0] === '-c') { 
          const code = operands.slice(1).join(' '); 
          if (code.includes('print')) { 
            const match = code.match(/print\s*\(\s*['"](.+?)['"]\s*\)/); 
            return [match ? match[1] : '']; 
          } 
          return ['']; 
        } 
        return [`python3: can't open file '${operands[0]}': No such file or directory`]; 
      }
      case 'whoami': return ['aayush', 'Cybersecurity Student | Future Ethical Hacker'];
      case 'aayush': 
      case 'me': return ['╔══════════════════════════════════════════════════════════════╗', '║                    AAYUSH TIMALSINA                          ║', '╠══════════════════════════════════════════════════════════════╣', '║  🎓 Class 12 Student @ Skyrider College, Chitwan, Nepal      ║', '║  🔐 Aspiring Cybersecurity Professional                      ║', '║  🛡️  Passionate about: Penetration Testing & Threat Detection ║', '║  🛠️  Tools: NMAP, Wireshark, Burp Suite, Metasploit           ║', '║  💻 Languages: Python, Bash, learning Rust                   ║', '║  🐧 Daily Driver: Kali Linux / Arch (btw)                    ║', '║                                                              ║', '║  📧 aayushtimalsina789@gmail.com                             ║', '║  📱 +977 9845242492                                          ║', '║  📍 Ratnanagar-10, Shanti Tole, Chitwan, Nepal               ║', '║                                                              ║', '║  🌐 "Breaking things to make them stronger"                  ║', '║  ✨ This entire OS was built by me from scratch!             ║', '╚══════════════════════════════════════════════════════════════╝'];
      default: if (cmd.trim()) return [`bash: ${cmd}: command not found`, 'Type "help" for available commands']; return [];
    }
  };

  const saveEditorFile = () => {
    const content = editor.content.join('\n');
    const resolved = resolvePath(editor.filename);
    const { parent, name } = getNodeAtPath(resolved);
    if (!parent) { setEditor(prev => ({ ...prev, statusMessage: 'Error: Cannot save file' })); return; }
    setFileSystem(prev => { const newFS = { ...prev }; const parts = resolved.split('/').filter(Boolean); let current: FileNode = newFS; for (let i = 0; i < parts.length - 1; i++) current = current.children![parts[i]]; current.children![name] = { name, type: 'file', permissions: '-rw-r--r--', owner: terminalState.environment.USER, size: content.length, modified: new Date(), content }; return newFS; });
    setEditor(prev => ({ ...prev, modified: false, statusMessage: `Wrote ${editor.content.length} lines [Saved by Aayush's Nano]` }));
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent) => {
    if (editor.mode === 'insert') {
      if (e.ctrlKey) {
        e.preventDefault();
        switch (e.key.toLowerCase()) {
          case 'x': if (editor.modified) { setEditor(prev => ({ ...prev, statusMessage: 'Save modified buffer? (Y/N/C)' })); setTimeout(() => setEditor(prev => ({ ...prev, isOpen: false })), 100); } else setEditor(prev => ({ ...prev, isOpen: false })); return;
          case 'o': saveEditorFile(); return;
          case 'w': setEditor(prev => ({ ...prev, mode: 'command', commandBuffer: '', statusMessage: 'Search: ' })); return;
          case 'k': setEditor(prev => { const newContent = [...prev.content]; newContent.splice(prev.cursorLine, 1); if (newContent.length === 0) newContent.push(''); return { ...prev, content: newContent, cursorLine: Math.min(prev.cursorLine, newContent.length - 1), modified: true }; }); return;
          case 'c': setEditor(prev => ({ ...prev, statusMessage: `Line ${prev.cursorLine + 1}/${prev.content.length} (${prev.content[prev.cursorLine]?.length || 0} chars) [Aayush's Nano]` })); return;
          case 'g': setEditor(prev => ({ ...prev, statusMessage: 'Help: Ctrl+O Save, Ctrl+X Exit, Ctrl+W Search, Ctrl+K Cut | Made by Aayush' })); return;
        }
      }
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey) { 
        e.preventDefault(); 
        setEditor(prev => { 
          const newContent = [...prev.content]; 
          const line = newContent[prev.cursorLine] || ''; 
          newContent[prev.cursorLine] = line.slice(0, prev.cursorCol) + e.key + line.slice(prev.cursorCol); 
          return { ...prev, content: newContent, cursorCol: prev.cursorCol + 1, modified: true }; 
        }); 
      }
      else if (e.key === 'Enter') { 
        e.preventDefault(); 
        setEditor(prev => { 
          const newContent = [...prev.content]; 
          const line = newContent[prev.cursorLine] || ''; 
          newContent[prev.cursorLine] = line.slice(0, prev.cursorCol); 
          newContent.splice(prev.cursorLine + 1, 0, line.slice(prev.cursorCol)); 
          return { ...prev, content: newContent, cursorLine: prev.cursorLine + 1, cursorCol: 0, modified: true }; 
        }); 
      }
      else if (e.key === 'Backspace') { 
        e.preventDefault(); 
        setEditor(prev => { 
          if (prev.cursorCol > 0) { 
            const newContent = [...prev.content]; 
            const line = newContent[prev.cursorLine]; 
            newContent[prev.cursorLine] = line.slice(0, prev.cursorCol - 1) + line.slice(prev.cursorCol); 
            return { ...prev, content: newContent, cursorCol: prev.cursorCol - 1, modified: true }; 
          } else if (prev.cursorLine > 0) { 
            const newContent = [...prev.content]; 
            const prevLine = newContent[prev.cursorLine - 1]; 
            const currLine = newContent[prev.cursorLine]; 
            newContent[prev.cursorLine - 1] = prevLine + currLine; 
            newContent.splice(prev.cursorLine, 1); 
            return { ...prev, content: newContent, cursorLine: prev.cursorLine - 1, cursorCol: prevLine.length, modified: true }; 
          } 
          return prev; 
        }); 
      }
      else if (e.key === 'Delete') { 
        e.preventDefault(); 
        setEditor(prev => { 
          const newContent = [...prev.content]; 
          const line = newContent[prev.cursorLine]; 
          if (prev.cursorCol < line.length) newContent[prev.cursorLine] = line.slice(0, prev.cursorCol) + line.slice(prev.cursorCol + 1); 
          else if (prev.cursorLine < newContent.length - 1) { 
            newContent[prev.cursorLine] = line + newContent[prev.cursorLine + 1]; 
            newContent.splice(prev.cursorLine + 1, 1); 
          } 
          return { ...prev, content: newContent, modified: true }; 
        }); 
      }
      else if (e.key === 'ArrowUp') { 
        e.preventDefault(); 
        setEditor(prev => ({ ...prev, cursorLine: Math.max(0, prev.cursorLine - 1), cursorCol: Math.min(prev.cursorCol, prev.content[Math.max(0, prev.cursorLine - 1)]?.length || 0) })); 
      }
      else if (e.key === 'ArrowDown') { 
        e.preventDefault(); 
        setEditor(prev => ({ ...prev, cursorLine: Math.min(prev.content.length - 1, prev.cursorLine + 1), cursorCol: Math.min(prev.cursorCol, prev.content[Math.min(prev.content.length - 1, prev.cursorLine + 1)]?.length || 0) })); 
      }
      else if (e.key === 'ArrowLeft') { 
        e.preventDefault(); 
        setEditor(prev => { 
          if (prev.cursorCol > 0) return { ...prev, cursorCol: prev.cursorCol - 1 }; 
          if (prev.cursorLine > 0) return { ...prev, cursorLine: prev.cursorLine - 1, cursorCol: prev.content[prev.cursorLine - 1].length }; 
          return prev; 
        }); 
      }
      else if (e.key === 'ArrowRight') { 
        e.preventDefault(); 
        setEditor(prev => { 
          const line = prev.content[prev.cursorLine]; 
          if (prev.cursorCol < line.length) return { ...prev, cursorCol: prev.cursorCol + 1 }; 
          if (prev.cursorLine < prev.content.length - 1) return { ...prev, cursorLine: prev.cursorLine + 1, cursorCol: 0 }; 
          return prev; 
        }); 
      }
    } else if (editor.mode === 'command') {
      if (e.key === 'Enter') { 
        e.preventDefault(); 
        const query = editor.commandBuffer; 
        const found = editor.content.findIndex((line, idx) => idx > editor.cursorLine && line.includes(query)); 
        if (found !== -1) setEditor(prev => ({ ...prev, cursorLine: found, cursorCol: prev.content[found].indexOf(query), mode: 'insert', statusMessage: '' })); 
        else setEditor(prev => ({ ...prev, mode: 'insert', statusMessage: 'Not found' })); 
      }
      else if (e.key === 'Escape') setEditor(prev => ({ ...prev, mode: 'insert', statusMessage: '' }));
      else if (e.key === 'Backspace') setEditor(prev => ({ ...prev, commandBuffer: prev.commandBuffer.slice(0, -1) }));
      else if (e.key.length === 1) setEditor(prev => ({ ...prev, commandBuffer: prev.commandBuffer + e.key }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTerminalState(prev => ({ ...prev, history: [...prev.history, input] }));
    setHistoryIndex(-1);
    const result = executeCommand(input);
    setCommands(prev => [...prev, `${getPrompt()} ${input}`, ...result, '']);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') { 
      e.preventDefault(); 
      setHistoryIndex(prev => { 
        const newIndex = Math.min(terminalState.history.length - 1, prev + 1); 
        if (newIndex >= 0) setInput(terminalState.history[terminalState.history.length - 1 - newIndex]); 
        return newIndex; 
      }); 
    }
    else if (e.key === 'ArrowDown') { 
      e.preventDefault(); 
      setHistoryIndex(prev => { 
        const newIndex = Math.max(-1, prev - 1); 
        if (newIndex === -1) setInput(''); 
        else setInput(terminalState.history[terminalState.history.length - 1 - newIndex]); 
        return newIndex; 
      }); 
    }
    else if (e.key === 'Tab') { 
      e.preventDefault(); 
      const words = input.split(/\s+/); 
      const lastWord = words[words.length - 1]; 
      const { node } = getNodeAtPath(terminalState.currentPath); 
      if (!node || node.type !== 'directory') return; 
      const candidates = Object.keys(node.children || {}).filter(name => name.startsWith(lastWord)); 
      if (candidates.length === 1) setInput(words.slice(0, -1).concat(candidates[0]).join(' ') + ' '); 
    }
  };

  return (
    <>
      <div className={cn("h-full p-4 font-mono text-sm relative", isDark ? "bg-gray-950 text-green-400" : "bg-gray-900 text-green-400")}>
        <div ref={terminalRef} className="h-full overflow-auto pb-8">
          {commands.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">
              {line.startsWith(getPrompt()) ? 
                <span><span className="text-blue-400">{getPrompt().split(':')[0]}</span><span className="text-white">:</span><span className="text-blue-400">{getPrompt().split(':')[1]?.replace('$', '')}</span><span className="text-white">$</span><span className="text-gray-300"> {line.slice(getPrompt().length + 1)}</span></span> : 
                line.startsWith('bash:') || line.includes('No such file') || line.includes('not found') ? 
                  <span className="text-red-400">{line}</span> : 
                  line.startsWith('╔') || line.startsWith('╠') || line.startsWith('║') || line.startsWith('╚') ? 
                    <span className="text-cyan-400">{line}</span> : 
                    line.startsWith('[') || line.startsWith('Starting') ? 
                      <span className="text-yellow-400">{line}</span> : 
                      line}
            </div>
          ))}
          {!editor.isOpen && (
            <form onSubmit={handleSubmit} className="flex items-center">
              <span className="text-blue-400">{getPrompt().split(':')[0]}</span>
              <span className="text-white">:</span>
              <span className="text-blue-400">{getPrompt().split(':')[1]?.replace('$', '')}</span>
              <span className="text-white">$</span>
              <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} className="flex-1 bg-transparent border-none outline-none text-gray-300 ml-2" spellCheck={false} autoComplete="off" />
            </form>
          )}
        </div>
      </div>
      {editor.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div ref={editorRef} className="w-full max-w-4xl h-[600px] bg-blue-900 flex flex-col rounded shadow-2xl" tabIndex={0} onKeyDown={handleEditorKeyDown}>
            <div className="bg-blue-800 text-white px-2 py-1 text-center">GNU nano 6.2 [Aayush's Custom Build]{editor.filename ? `               ${editor.filename}` : ''}{editor.modified ? ' (Modified)' : ''}</div>
            <div className="flex-1 bg-blue-900 p-2 overflow-auto font-mono text-white">
              {editor.content.map((line, i) => (
                <div key={i} className={`${i === editor.cursorLine ? 'bg-blue-700' : ''} whitespace-pre`}>
                  {line.split('').map((char, j) => <span key={j} className={`${i === editor.cursorLine && j === editor.cursorCol ? 'bg-yellow-400 text-black' : ''}`}>{char || ' '}</span>)}
                  {i === editor.cursorLine && editor.cursorCol >= line.length && <span className="bg-yellow-400 text-black">&nbsp;</span>}
                </div>
              ))}
            </div>
            <div className="bg-cyan-700 text-black px-2 py-1">{editor.mode === 'command' ? editor.commandBuffer : editor.statusMessage}</div>
            <div className="bg-gray-100 text-black flex justify-between px-2 py-1 text-xs"><span>^G Help</span><span>^O Write Out</span><span>^W Where Is</span><span>^K Cut Text</span><span>^J Justify</span><span>^C Cur Pos</span><span>^X Exit</span></div>
          </div>
        </div>
      )}
    </>
  );
};

// ============================================
// OTHER WINDOW COMPONENTS
// ============================================

const AboutWindow = ({ isDark }: { isDark: boolean }) => (
  <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-gray-900" : "bg-gray-50")}>
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-6 mb-8">
        <ProfileImage src={ABOUT_IMAGE} size="w-32 h-32" rounded="rounded-2xl" fallbackSize="w-16 h-16" />
        <div>
          <h1 className={cn("text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>Aayush Timalsina</h1>
          <p className={cn("text-lg mb-2", isDark ? "text-blue-400" : "text-blue-600")}>Cybersecurity Student | Built this OS myself 🔥</p>
          <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4" /><span className={isDark ? "text-gray-400" : "text-gray-600"}>Chitwan, Nepal 🇳🇵</span></div>
        </div>
      </div>
      <div className={cn("rounded-xl p-6 mb-6", isDark ? "bg-gray-800" : "bg-white")}>
        <h2 className={cn("text-xl font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>About Me</h2>
        <p className={cn("leading-relaxed mb-4", isDark ? "text-gray-300" : "text-gray-600")}>Hi! I'm Aayush Timalsina, currently studying in class 12 at Skyrider College, Nepal. I'm passionate about cybersecurity, especially penetration testing, threat detection and monitoring, and scripting and automation. <strong>I built this entire CyberOS from scratch!</strong></p>
        <p className={cn("leading-relaxed", isDark ? "text-gray-300" : "text-gray-600")}>This portfolio you're experiencing? It's not just a website—it's a fully functional operating system simulation with a real file system, working terminal, nano editor, and window management. All coded by me with React, TypeScript, and passion. ✨</p>
      </div>
    </div>
  </div>
);

const ProjectsWindow = ({ isDark }: { isDark: boolean }) => (
  <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-gray-900" : "bg-gray-50")}>
    <div className="max-w-4xl mx-auto">
      <h1 className={cn("text-2xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>My Projects <span className="text-sm font-normal opacity-60">- Built with my own hands</span></h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROJECTS.map((project) => (
          <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cn("rounded-xl overflow-hidden group cursor-pointer", isDark ? "bg-gray-800" : "bg-white shadow-lg")}>
            <div className="h-40 overflow-hidden"><img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
            <div className="p-4">
              <span className={cn("text-xs font-medium px-2 py-1 rounded-full", isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600")}>{project.category}</span>
              <h3 className={cn("font-semibold mt-2 mb-2", isDark ? "text-white" : "text-gray-900")}>{project.title}</h3>
              <p className={cn("text-sm mb-3 line-clamp-2", isDark ? "text-gray-400" : "text-gray-600")}>{project.description}</p>
              <div className="flex flex-wrap gap-1">{project.skills.slice(0, 3).map((skill) => <span key={skill} className={cn("text-xs px-2 py-1 rounded", isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600")}>{skill}</span>)}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const SkillsWindow = ({ isDark }: { isDark: boolean }) => (
  <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-gray-900" : "bg-gray-50")}>
    <div className="max-w-4xl mx-auto">
      <h1 className={cn("text-2xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>Technical Skills <span className="text-sm font-normal opacity-60">- Self-taught & practiced</span></h1>
      <div className="space-y-6">
        {Array.from(new Set(SKILLS.map(s => s.category))).map((category) => (
          <div key={category}>
            <h2 className={cn("text-lg font-semibold mb-4", isDark ? "text-gray-300" : "text-gray-700")}>{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SKILLS.filter(s => s.category === category).map((skill) => (
                <div key={skill.name} className={cn("p-4 rounded-xl flex items-center gap-4", isDark ? "bg-gray-800" : "bg-white shadow-sm")}>
                  <div className={cn("p-3 rounded-lg", isDark ? "bg-gray-700" : "bg-gray-100")}>{skill.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2"><span className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{skill.name}</span><span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>{skill.level}%</span></div>
                    <div className={cn("h-2 rounded-full overflow-hidden", isDark ? "bg-gray-700" : "bg-gray-200")}><motion.div initial={{ width: 0 }} animate={{ width: `${skill.level}%` }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" /></div>
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

const ContactWindow = ({ isDark }: { isDark: boolean }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
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
        <h1 className={cn("text-2xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>Get In Touch <span className="text-sm font-normal opacity-60">- I built this contact form too!</span></h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <a href="mailto:aayushtimalsina789@gmail.com" className={cn("p-4 rounded-xl flex items-center gap-4 transition-all hover:scale-105", isDark ? "bg-gray-800" : "bg-white shadow-sm")}><div className={cn("p-3 rounded-lg", isDark ? "bg-blue-500/20" : "bg-blue-100")}><Mail className={isDark ? "text-blue-400" : "text-blue-600"} /></div><div><p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Email</p><p className={cn("font-medium text-sm", isDark ? "text-white" : "text-gray-900")}>aayushtimalsina789@gmail.com</p></div></a>
          <a href="tel:+9779845242492" className={cn("p-4 rounded-xl flex items-center gap-4 transition-all hover:scale-105", isDark ? "bg-gray-800" : "bg-white shadow-sm")}><div className={cn("p-3 rounded-lg", isDark ? "bg-green-500/20" : "bg-green-100")}><Phone className={isDark ? "text-green-400" : "text-green-600"} /></div><div><p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Phone</p><p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>+977 9845242492</p></div></a>
        </div>
        <div className={cn("rounded-xl p-6", isDark ? "bg-gray-800" : "bg-white shadow-lg")}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className={cn("block text-sm font-medium mb-2", isDark ? "text-gray-300" : "text-gray-700")}>Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={cn("w-full px-4 py-3 rounded-lg outline-none", isDark ? "bg-gray-700 text-white border border-gray-600" : "bg-gray-50 text-gray-900 border border-gray-200")} placeholder="Your name" required /></div>
            <div><label className={cn("block text-sm font-medium mb-2", isDark ? "text-gray-300" : "text-gray-700")}>Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={cn("w-full px-4 py-3 rounded-lg outline-none", isDark ? "bg-gray-700 text-white border border-gray-600" : "bg-gray-50 text-gray-900 border border-gray-200")} placeholder="your@email.com" required /></div>
            <div><label className={cn("block text-sm font-medium mb-2", isDark ? "text-gray-300" : "text-gray-700")}>Message</label><textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={4} className={cn("w-full px-4 py-3 rounded-lg outline-none resize-none", isDark ? "bg-gray-700 text-white border border-gray-600" : "bg-gray-50 text-gray-900 border border-gray-200")} placeholder="Your message..." required /></div>
            <button type="submit" disabled={isSubmitting} className={cn("w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2", isDark ? "bg-blue-600 text-white" : "bg-blue-500 text-white")}>{isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : submitted ? <><CheckCircle className="w-5 h-5" /> Sent!</> : <><Send className="w-5 h-5" /> Send Message</>}</button>
          </form>
        </div>
        <div className="flex justify-center gap-4 mt-8">{[{ icon: <Github className="w-5 h-5" />, href: "https://github.com/", label: "GitHub" }, { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" }, { icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/t_y_p_e_c", label: "Instagram" }, { icon: <Facebook className="w-5 h-5" />, href: "https://www.facebook.com/aayush.timalsina.891052", label: "Facebook" }].map((social) => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className={cn("p-3 rounded-xl transition-all hover:scale-110", isDark ? "bg-gray-800 text-gray-400 hover:text-white" : "bg-white text-gray-600 hover:text-gray-900 shadow-sm")} title={social.label}>{social.icon}</a>)}</div>
      </div>
    </div>
  );
};

// ============================================
// PART 2 ENDS HERE - Continue to Part 3
// ============================================
const SettingsWindow = ({ isDark, setIsDark, brightness, setBrightness, volume, setVolume, currentWallpaper, setCurrentWallpaper }: any) => {
  const [activeTab, setActiveTab] = useState("general");
  const tabs = [{ id: "general", label: "General", icon: <Settings className="w-4 h-4" /> }, { id: "display", label: "Display", icon: <Monitor className="w-4 h-4" /> }, { id: "wallpaper", label: "Wallpaper", icon: <Image className="w-4 h-4" /> }, { id: "sound", label: "Sound", icon: <Volume2 className="w-4 h-4" /> }];
  return (
    <div className={cn("h-full flex", isDark ? "bg-gray-900" : "bg-gray-50")}>
      <div className={cn("w-48 p-4 border-r", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200")}>
        <div className="space-y-1">{tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors", activeTab === tab.id ? (isDark ? "bg-blue-600 text-white" : "bg-blue-500 text-white") : (isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-200"))}>{tab.icon}{tab.label}</button>)}</div>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === "general" && <div className="max-w-xl"><h2 className={cn("text-xl font-semibold mb-6", isDark ? "text-white" : "text-gray-900")}>General Settings</h2><div className={cn("p-4 rounded-xl", isDark ? "bg-gray-800" : "bg-white")}><div className="flex items-center justify-between"><div className="flex items-center gap-4"><div className={cn("p-3 rounded-lg", isDark ? "bg-purple-500/20" : "bg-purple-100")}>{isDark ? <Moon className="text-purple-400" /> : <Sun className="text-purple-600" />}</div><div><p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>Appearance</p><p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>{isDark ? "Dark mode" : "Light mode"}</p></div></div><button onClick={() => setIsDark(!isDark)} className={cn("w-14 h-8 rounded-full p-1 transition-colors", isDark ? "bg-blue-600" : "bg-gray-300")}><motion.div animate={{ x: isDark ? 24 : 0 }} className="w-6 h-6 rounded-full bg-white shadow-md" /></button></div></div><div className={cn("p-4 rounded-xl mt-4", isDark ? "bg-gray-800" : "bg-white")}><div className="flex items-center gap-4"><div className={cn("p-3 rounded-lg", isDark ? "bg-green-500/20" : "bg-green-100")}><Info className={isDark ? "text-green-400" : "text-green-600"} /></div><div><p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>About System</p><p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>CyberOS v3.0 - Built by Aayush Timalsina</p></div></div></div></div>}
        {activeTab === "display" && <div className="max-w-xl"><h2 className={cn("text-xl font-semibold mb-6", isDark ? "text-white" : "text-gray-900")}>Display Settings</h2><div className={cn("p-4 rounded-xl", isDark ? "bg-gray-800" : "bg-white")}><div className="flex items-center gap-4 mb-4"><div className={cn("p-3 rounded-lg", isDark ? "bg-yellow-500/20" : "bg-yellow-100")}><Sun className={isDark ? "text-yellow-400" : "text-yellow-600"} /></div><div><p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>Brightness</p><p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>{brightness}%</p></div></div><input type="range" min="20" max="100" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full" /></div></div>}
        {activeTab === "wallpaper" && <div className="max-w-4xl"><h2 className={cn("text-xl font-semibold mb-6", isDark ? "text-white" : "text-gray-900")}>Wallpaper</h2><div className="grid grid-cols-2 md:grid-cols-3 gap-4">{WALLPAPERS.map((wallpaper) => <button key={wallpaper.id} onClick={() => setCurrentWallpaper(wallpaper.url)} className={cn("relative rounded-xl overflow-hidden aspect-video group", currentWallpaper === wallpaper.url ? "ring-2 ring-blue-500" : "")}><img src={wallpaper.thumbnail} alt={wallpaper.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white font-medium">{wallpaper.name}</span></div></button>)}</div></div>}
        {activeTab === "sound" && <div className="max-w-xl"><h2 className={cn("text-xl font-semibold mb-6", isDark ? "text-white" : "text-gray-900")}>Sound Settings</h2><div className={cn("p-4 rounded-xl", isDark ? "bg-gray-800" : "bg-white")}><div className="flex items-center gap-4 mb-4"><div className={cn("p-3 rounded-lg", isDark ? "bg-pink-500/20" : "bg-pink-100")}>{volume === 0 ? <VolumeX className={isDark ? "text-pink-400" : "text-pink-600" /> : volume < 50 ? <Volume1 className={isDark ? "text-pink-400" : "text-pink-600" /> : <Volume2 className={isDark ? "text-pink-400" : "text-pink-600" />}</div><div><p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>System Volume</p><p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>{volume}%</p></div></div><input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-full" /></div></div>}
      </div>
    </div>
  );
};

const FinderWindow = ({ isDark }: { isDark: boolean }) => (
  <div className={cn("h-full flex", isDark ? "bg-gray-900" : "bg-gray-50")}>
    <div className={cn("w-48 p-4 border-r", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200")}>
      <p className={cn("text-xs font-semibold uppercase tracking-wider mb-3 px-3", isDark ? "text-gray-500" : "text-gray-400")}>Favorites</p>
      {["Desktop", "Documents", "Downloads", "Projects"].map((item) => <button key={item} className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2", isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-200")}><FolderOpen className="w-4 h-4" />{item}</button>)}
    </div>
    <div className="flex-1 p-6">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">{[{ name: "Documents", icon: <FileText className="w-8 h-8 text-blue-500" />, items: 12 }, { name: "Projects", icon: <FolderOpen className="w-8 h-8 text-yellow-500" />, items: 4 }, { name: "Images", icon: <Image className="w-8 h-8 text-purple-500" />, items: 8 }, { name: "Music", icon: <Music className="w-8 h-8 text-pink-500" />, items: 24 }, { name: "Videos", icon: <Video className="w-8 h-8 text-red-500" />, items: 6 }, { name: "Downloads", icon: <Download className="w-8 h-8 text-green-500" />, items: 15 }].map((folder) => <motion.button key={folder.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex flex-col items-center p-4 rounded-xl transition-colors hover:bg-white/5"><div className="mb-2">{folder.icon}</div><span className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-700")}>{folder.name}</span><span className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>{folder.items} items</span></motion.button>)}</div>
    </div>
  </div>
);

const CalculatorWindow = ({ isDark }: { isDark: boolean }) => {
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const calculate = (a: number, b: number, op: string): number => { switch (op) { case '+': return a + b; case '-': return a - b; case '×': return a * b; case '÷': return b !== 0 ? a / b : 0; default: return b; } };
  const inputNumber = (num: string) => { if (waiting) { setDisplay(num); setWaiting(false); } else setDisplay(display === "0" ? num : display + num); };
  const inputOp = (op: string) => { const val = parseFloat(display); if (prevValue === null) setPrevValue(val); else if (operation) { const result = calculate(prevValue, val, operation); setPrevValue(result); setDisplay(String(result)); } setWaiting(true); setOperation(op); };
  const doCalculate = () => { const val = parseFloat(display); if (prevValue !== null && operation) { const result = calculate(prevValue, val, operation); setDisplay(String(result)); setPrevValue(null); setOperation(null); setWaiting(true); } };
  const clear = () => { setDisplay("0"); setPrevValue(null); setOperation(null); setWaiting(false); };
  const buttons = [{ label: "C", onClick: clear, className: "bg-red-500 text-white" }, { label: "±", onClick: () => setDisplay(String(parseFloat(display) * -1)), className: isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900" }, { label: "%", onClick: () => setDisplay(String(parseFloat(display) / 100)), className: isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900" }, { label: "÷", onClick: () => inputOp("÷"), className: "bg-orange-500 text-white" }, { label: "7", onClick: () => inputNumber("7"), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" }, { label: "8", onClick: () => inputNumber("8"), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" }, { label: "9", onClick: () => inputNumber("9"), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" }, { label: "×", onClick: () => inputOp("×"), className: "bg-orange-500 text-white" }, { label: "4", onClick: () => inputNumber("4"), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" }, { label: "5", onClick: () => inputNumber("5"), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" }, { label: "6", onClick: () => inputNumber("6"), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" }, { label: "-", onClick: () => inputOp("-"), className: "bg-orange-500 text-white" }, { label: "1", onClick: () => inputNumber("1"), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" }, { label: "2", onClick: () => inputNumber("2"), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" }, { label: "3", onClick: () => inputNumber("3"), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" }, { label: "+", onClick: () => inputOp("+"), className: "bg-orange-500 text-white" }, { label: "0", onClick: () => inputNumber("0"), className: isDark ? "bg-gray-800 text-white col-span-2" : "bg-white text-gray-900 col-span-2" }, { label: ".", onClick: () => inputNumber("."), className: isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900" }, { label: "=", onClick: doCalculate, className: "bg-orange-500 text-white" }];
  return (
    <div className={cn("h-full flex items-center justify-center p-6", isDark ? "bg-gray-900" : "bg-gray-100")}>
      <div className={cn("w-72 rounded-2xl overflow-hidden shadow-2xl", isDark ? "bg-gray-800" : "bg-gray-200")}>
        <div className={cn("p-4 text-right text-4xl font-light", isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900")}>{display}</div>
        <div className="grid grid-cols-4 gap-px">{buttons.map((btn) => <button key={btn.label} onClick={btn.onClick} className={cn("h-16 text-xl font-medium transition-all hover:opacity-80 active:scale-95", btn.className, btn.label === "0" ? "col-span-2" : "")}>{btn.label}</button>)}</div>
      </div>
    </div>
  );
};

const CalendarWindow = ({ isDark }: { isDark: boolean }) => {
  const [currentDate] = useState(new Date());
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  return (
    <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-gray-900" : "bg-gray-50")}>
      <div className="max-w-md mx-auto">
        <div className={cn("rounded-2xl overflow-hidden shadow-lg", isDark ? "bg-gray-800" : "bg-white")}>
          <div className={cn("p-6 text-center", isDark ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gradient-to-r from-blue-500 to-purple-500")}><h2 className="text-white text-2xl font-bold">{format(currentDate, "MMMM yyyy")}</h2></div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day} className={cn("text-center text-sm font-medium py-2", isDark ? "text-gray-400" : "text-gray-600")}>{day}</div>)}</div>
            <div className="grid grid-cols-7 gap-1">{Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}{days.map((day) => { const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth(); return <div key={day} className={cn("aspect-square flex items-center justify-center rounded-lg text-sm cursor-pointer transition-all", isToday ? "bg-blue-500 text-white font-bold" : isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100")}>{day}</div>; })}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotesWindow = ({ isDark }: { isDark: boolean }) => {
  const [notes, setNotes] = useState([{ id: "1", title: "Project Ideas", content: "1. Network Security Scanner\n2. Password Manager\n3. Vulnerability Assessment Tool", date: "2024-01-15" }, { id: "2", title: "Learning Goals", content: "- Complete CEH certification\n- Learn Rust programming\n- Master cloud security", date: "2024-01-14" }]);
  const [selectedNote, setSelectedNote] = useState(notes[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(selectedNote.content);
  const handleSave = () => { setNotes(notes.map(n => n.id === selectedNote.id ? { ...n, content: editContent } : n)); setSelectedNote({ ...selectedNote, content: editContent }); setIsEditing(false); };
  return (
    <div className={cn("h-full flex", isDark ? "bg-gray-900" : "bg-gray-50")}>
      <div className={cn("w-64 border-r", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200")}>
        <div className="p-4"><button onClick={() => { const newNote = { id: Date.now().toString(), title: "New Note", content: "", date: new Date().toISOString().split("T")[0] }; setNotes([newNote, ...notes]); setSelectedNote(newNote); setEditContent(""); setIsEditing(true); }} className={cn("w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2", isDark ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900" : "bg-yellow-400 hover:bg-yellow-500 text-gray-900")}><Plus className="w-4 h-4" />New Note</button></div>
        <div className="overflow-auto" style={{ maxHeight: "calc(100% - 80px)" }}>{notes.map((note) => <button key={note.id} onClick={() => { setSelectedNote(note); setEditContent(note.content); setIsEditing(false); }} className={cn("w-full text-left p-4 border-b transition-colors", selectedNote.id === note.id ? (isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200") : (isDark ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-200 hover:bg-gray-50"))}><h3 className={cn("font-medium truncate", isDark ? "text-white" : "text-gray-900")}>{note.title}</h3><p className={cn("text-sm truncate mt-1", isDark ? "text-gray-400" : "text-gray-500")}>{note.content || "No additional text"}</p><p className={cn("text-xs mt-2", isDark ? "text-gray-500" : "text-gray-400")}>{note.date}</p></button>)}</div>
      </div>
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4"><h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-gray-900")}>{selectedNote.title}</h2><div className="flex gap-2">{isEditing ? <><button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Save</button><button onClick={() => { setEditContent(selectedNote.content); setIsEditing(false); }} className={cn("px-4 py-2 rounded-lg", isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700")}>Cancel</button></> : <button onClick={() => setIsEditing(true)} className={cn("p-2 rounded-lg", isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700")}><Edit3 className="w-5 h-5" /></button>}</div></div>
        {isEditing ? <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className={cn("w-full h-full p-4 rounded-lg resize-none outline-none", isDark ? "bg-gray-800 text-white border border-gray-700" : "bg-white text-gray-900 border border-gray-200")} style={{ minHeight: "400px" }} /> : <div className={cn("whitespace-pre-wrap", isDark ? "text-gray-300" : "text-gray-700")}>{selectedNote.content || "No content"}</div>}
      </div>
    </div>
  );
};

const HelpWindow = ({ isDark }: { isDark: boolean }) => (
  <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-gray-900" : "bg-gray-50")}>
    <div className="max-w-2xl mx-auto">
      <div className={cn("rounded-2xl overflow-hidden shadow-xl", isDark ? "bg-gray-800" : "bg-white")}>
        <div className={cn("p-6 text-center", isDark ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gradient-to-r from-blue-500 to-purple-500")}><h1 className="text-2xl font-bold text-white">CyberOS Help</h1><p className="text-white/80 mt-2">Built by Aayush Timalsina</p></div>
        <div className="p-6 space-y-6">
          <section><h2 className={cn("text-lg font-semibold mb-3", isDark ? "text-white" : "text-gray-900")}>Quick Start</h2><p className={cn("text-sm leading-relaxed", isDark ? "text-gray-300" : "text-gray-600")}>Welcome to CyberOS, a fully functional OS-style portfolio created entirely by Aayush Timalsina. Use the Dock at the bottom to open applications, or click the Finder icon to access the Launchpad.</p></section>
          <section><h2 className={cn("text-lg font-semibold mb-3", isDark ? "text-white" : "text-gray-900")}>Terminal Features</h2><p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>The terminal includes a real file system, working nano editor, pipes, redirection, environment variables, aliases, and 30+ bash commands. Try: cd, ls, cat, nano, grep, ps, alias</p></section>
        </div>
      </div>
    </div>
  </div>
);

const ShortcutsWindow = ({ isDark }: { isDark: boolean }) => (
  <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-gray-900" : "bg-gray-50")}>
    <div className="max-w-2xl mx-auto">
      <h1 className={cn("text-2xl font-bold mb-6", isDark ? "text-white" : "text-gray-900")}>Keyboard Shortcuts</h1>
      <p className={cn("mb-4", isDark ? "text-gray-400" : "text-gray-600")}>Custom shortcuts designed by Aayush</p>
      {[{ category: "File", items: [{ key: "⌘N", action: "New Terminal" }, { key: "⌘O", action: "Open Launchpad" }, { key: "⌘W", action: "Close Window" }] }, { category: "System", items: [{ key: "F4", action: "Show Launchpad" }, { key: "⌘⌥D", action: "Toggle Dark Mode" }] }].map((cat) => <div key={cat.category} className={cn("rounded-xl overflow-hidden mb-4", isDark ? "bg-gray-800" : "bg-white shadow-sm")}><div className={cn("px-4 py-3 font-semibold", isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900")}>{cat.category}</div><div className="divide-y divide-gray-700/10">{cat.items.map((item, idx) => <div key={idx} className={cn("flex items-center justify-between px-4 py-3", isDark ? "text-gray-300" : "text-gray-700")}><span className="text-sm">{item.action}</span><kbd className={cn("px-2 py-1 rounded text-xs font-mono", isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700")}>{item.key}</kbd></div>)}</div></div>)}
    </div>
  </div>
);

const AboutOSWindow = ({ isDark }: { isDark: boolean }) => (
  <div className={cn("h-full p-6 overflow-auto", isDark ? "bg-gray-900" : "bg-gray-50")}>
    <div className="max-w-xl mx-auto">
      <div className={cn("rounded-2xl overflow-hidden shadow-xl", isDark ? "bg-gray-800" : "bg-white")}>
        <div className={cn("p-8 text-center", isDark ? "bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" : "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500")}>
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center"><Shield className="w-10 h-10 text-white" /></div>
          <h1 className="text-3xl font-bold text-white mb-1">CyberOS</h1>
          <p className="text-white/80 text-sm">Version 3.0 Portfolio Edition</p>
        </div>
        <div className="p-6 space-y-4">
          <p className={cn("text-sm text-center", isDark ? "text-gray-400" : "text-gray-600")}>A fully functional OS-style portfolio built from scratch by <strong>Aayush Timalsina</strong>, a cybersecurity student from Nepal.</p>
          <div className={cn("p-4 rounded-xl", isDark ? "bg-gray-700/50" : "bg-gray-100")}><h3 className={cn("font-semibold mb-2", isDark ? "text-white" : "text-gray-900")}>Developer</h3><p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>Aayush "Type-C" Timalsina</p><p className={cn("text-xs mt-1", isDark ? "text-gray-400" : "text-gray-500")}>Cybersecurity Student | Chitwan, Nepal 🇳🇵</p></div>
          <div className={cn("p-4 rounded-xl", isDark ? "bg-gray-700/50" : "bg-gray-100")}><h3 className={cn("font-semibold mb-2", isDark ? "text-white" : "text-gray-900")}>Technologies</h3><div className="flex flex-wrap gap-2">{["React", "TypeScript", "Tailwind CSS", "Framer Motion"].map((tech) => <span key={tech} className={cn("px-2 py-1 rounded text-xs", isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600")}>{tech}</span>)}</div></div>
          <div className={cn("text-center text-xs pt-4 border-t", isDark ? "text-gray-500 border-gray-700" : "text-gray-400 border-gray-200")}>© 2024 CyberOS. Made with ❤️ by Aayush Timalsina. All rights reserved.</div>
        </div>
      </div>
    </div>
  </div>
);

const ControlCenter = ({ isOpen, onClose, isDark, setIsDark, brightness, setBrightness, volume, setVolume, wifiEnabled, setWifiEnabled, bluetoothEnabled, setBluetoothEnabled }: any) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150]" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} className={cn("fixed top-10 right-4 w-80 rounded-2xl p-4 z-[160] shadow-2xl", isDark ? "bg-gray-800/95 backdrop-blur-xl" : "bg-white/95 backdrop-blur-xl")}>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button onClick={() => setWifiEnabled(!wifiEnabled)} className={cn("p-4 rounded-xl flex flex-col items-center gap-2 transition-all", wifiEnabled ? "bg-blue-500 text-white" : isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600")}>{wifiEnabled ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}<span className="text-sm font-medium">{wifiEnabled ? "Wi-Fi On" : "Wi-Fi Off"}</span></button>
            <button onClick={() => setBluetoothEnabled(!bluetoothEnabled)} className={cn("p-4 rounded-xl flex flex-col items-center gap-2 transition-all", bluetoothEnabled ? "bg-blue-500 text-white" : isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600")}><Bluetooth className="w-6 h-6" /><span className="text-sm font-medium">{bluetoothEnabled ? "Bluetooth On" : "Bluetooth Off"}</span></button>
          </div>
          <div className={cn("p-4 rounded-xl mb-4", isDark ? "bg-gray-700" : "bg-gray-100")}><div className="flex items-center gap-3 mb-3"><Sun className="w-5 h-5" /><span className={cn("text-sm font-medium flex-1", isDark ? "text-white" : "text-gray-900")}>Brightness</span><span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>{brightness}%</span></div><input type="range" min="20" max="100" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full" /></div>
          <div className={cn("p-4 rounded-xl mb-4", isDark ? "bg-gray-700" : "bg-gray-100")}><div className="flex items-center gap-3 mb-3">{volume === 0 ? <VolumeX className="w-5 h-5" /> : volume < 50 ? <Volume1 className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}<span className={cn("text-sm font-medium flex-1", isDark ? "text-white" : "text-gray-900")}>Volume</span><span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>{volume}%</span></div><input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-full" /></div>
          <button onClick={() => setIsDark(!isDark)} className={cn("w-full p-4 rounded-xl flex items-center justify-between transition-all", isDark ? "bg-gray-700" : "bg-gray-100")}><div className="flex items-center gap-3">{isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}<span className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>{isDark ? "Dark Mode" : "Light Mode"}</span></div><div className={cn("w-12 h-6 rounded-full p-1", isDark ? "bg-blue-500" : "bg-gray-300")}><motion.div animate={{ x: isDark ? 24 : 0 }} className="w-4 h-4 rounded-full bg-white" /></div></button>
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
        <motion.div initial={{ opacity: 0, scale: 0.95, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -5 }} className={cn("fixed rounded-lg py-1 min-w-[200px] z-[120] shadow-2xl", isDark ? "bg-gray-800/95 backdrop-blur-xl border border-gray-700" : "bg-white/95 backdrop-blur-xl border border-gray-200")} style={{ left: position.x, top: position.y }}>
          {items.map((item: any, index: number) => item.separator ? <div key={index} className={cn("h-px mx-2 my-1", isDark ? "bg-gray-700" : "bg-gray-200")} /> : <button key={index} onClick={() => { item.action(); onClose(); }} className={cn("w-full px-4 py-1.5 text-left text-sm flex items-center justify-between transition-colors", isDark ? "text-gray-200 hover:bg-blue-600 hover:text-white" : "text-gray-800 hover:bg-blue-500 hover:text-white")}><span>{item.label}</span>{item.shortcut && <span className={cn("text-xs ml-4", isDark ? "text-gray-500" : "text-gray-400")}>{item.shortcut}</span>}</button>)}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const LoginScreen = ({ onLogin, isDark }: { onLogin: () => void; isDark: boolean }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "TYPE-C") { setIsUnlocking(true); setTimeout(() => onLogin(), 800); }
    else { setError(true); setTimeout(() => setError(false), 1000); }
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 30%, #111127 60%, #0a0a14 100%)" }}>
      <div className="absolute inset-0 overflow-hidden"><div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} /><motion.div animate={{ opacity: [0.05, 0.12, 0.05] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} /></div>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", damping: 20, stiffness: 100 }} className="relative z-10 p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4" style={{ background: isDark ? "rgba(15, 15, 25, 0.85)" : "rgba(255, 255, 255, 0.08)", backdropFilter: "blur(24px)", border: "1px solid rgba(99, 102, 241, 0.15)", boxShadow: "0 0 80px rgba(59, 130, 246, 0.06), 0 25px 60px rgba(0,0,0,0.5)" }}>
        <div className="flex flex-col items-center mb-8">
          <motion.div animate={isUnlocking ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }} className="w-28 h-28 rounded-full flex items-center justify-center mb-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))", border: "2px solid rgba(99,102,241,0.3)", boxShadow: "0 0 30px rgba(59,130,246,0.15)" }}><ProfileImage src={PROFILE_IMAGE} size="w-full h-full" rounded="rounded-full" fallbackSize="w-12 h-12" /></motion.div>
          <motion.h2 animate={isUnlocking ? { y: -20, opacity: 0 } : { y: 0, opacity: 1 }} className="text-2xl font-bold text-white">Aayush Timalsina</motion.h2>
          <p className="text-sm mt-1 text-gray-500">Cybersecurity Student | System Architect</p>
        </div>
        <motion.div animate={isUnlocking ? { opacity: 0 } : { opacity: 1 }} className="mb-6 p-4 rounded-xl text-center" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)" }}><p className="text-xs uppercase tracking-wider mb-2 text-gray-600">Password Hint</p><div className="flex items-center justify-center gap-2"><Lock className="w-4 h-4 text-blue-400" /><code className="text-lg font-mono font-bold tracking-wider text-blue-400">TYPE-C</code></div><p className="text-xs mt-2 text-gray-600">Enter this password to unlock my system</p></motion.div>
        <motion.form animate={isUnlocking ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }} onSubmit={handleLogin} className="space-y-4">
          <div className="relative"><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password..." className={cn("w-full px-4 py-3 pr-12 rounded-xl outline-none transition-all text-center font-mono tracking-wider text-white placeholder-gray-600", error ? "animate-shake border-2 border-red-500/50 bg-red-500/5" : "border border-gray-700/50 focus:border-blue-500/50")} style={{ background: error ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.03)" }} autoFocus /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors text-gray-500 hover:text-white">{showPassword ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}</button></div>
          {error && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm text-center">Incorrect password. Try again.</motion.p>}
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-white" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.4), rgba(139,92,246,0.4))", border: "1px solid rgba(99,102,241,0.25)", boxShadow: "0 0 20px rgba(59,130,246,0.1)" }}><Shield className="w-5 h-5" />Unlock System</motion.button>
        </motion.form>
        <AnimatePresence>{isUnlocking && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center rounded-3xl" style={{ background: "rgba(15,15,25,0.9)" }}><motion.div animate={{ scale: [1, 1.5, 2], opacity: [1, 0.5, 0] }} transition={{ duration: 0.8 }} className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.5), rgba(139,92,246,0.5))" }}><Unlock className="w-10 h-10 text-white" /></motion.div></motion.div>}</AnimatePresence>
      </motion.div>
      <motion.div animate={isUnlocking ? { opacity: 0 } : { opacity: 1 }} className="absolute bottom-8 text-center"><p className="text-sm text-gray-700">CyberOS v3.0 — Engineered by Aayush Timalsina</p></motion.div>
      <style>{`@keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } } .animate-shake { animation: shake 0.5s ease-in-out; }`}</style>
    </motion.div>
  );
};

// ============================================
// PART 3 ENDS HERE - Continue to Part 4 (Final)
// ============================================// ============================================
// MAIN APP COMPONENT
// ============================================

function App() {
  const [isDark, setIsDark] = useState(true);
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(70);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [currentWallpaper, setCurrentWallpaper] = useState(DEFAULT_WALLPAPER);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([{
    id: "terminal",
    title: "Terminal",
    type: "terminal",
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: { x: 100, y: 50 },
    size: { width: 800, height: 500 },
  }]);
  const [showLaunchpad, setShowLaunchpad] = useState(false);
  const [zIndexCounter, setZIndexCounter] = useState(2);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 32 });

  useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(timer); }, []);

  const getMenuItems = (menuName: string) => {
    switch (menuName) {
      case "File": return [{ label: "New Terminal", shortcut: "⌘N", action: () => openWindow("terminal", "Terminal") }, { label: "New Finder Window", shortcut: "⌘⇧N", action: () => openWindow("finder", "Finder") }, { separator: true, label: "", action: () => {} }, { label: "Close Window", shortcut: "⌘W", action: () => activeWindow && closeWindow(activeWindow) }, { separator: true, label: "", action: () => {} }, { label: "Exit", shortcut: "⌘Q", action: () => window.location.reload() }];
      case "Edit": return [{ label: "Undo", shortcut: "⌘Z", action: () => {} }, { label: "Redo", shortcut: "⌘⇧Z", action: () => {} }, { separator: true, label: "", action: () => {} }, { label: "Cut", shortcut: "⌘X", action: () => {} }, { label: "Copy", shortcut: "⌘C", action: () => {} }, { label: "Paste", shortcut: "⌘V", action: () => {} }, { separator: true, label: "", action: () => {} }, { label: "Preferences...", shortcut: "⌘,", action: () => openWindow("settings", "Settings") }];
      case "View": return [{ label: "Show Launchpad", shortcut: "F4", action: () => setShowLaunchpad(true) }, { separator: true, label: "", action: () => {} }, { label: "Enter Full Screen", shortcut: "⌃⌘F", action: () => activeWindow && maximizeWindow(activeWindow) }, { separator: true, label: "", action: () => {} }, { label: "Dark Mode", shortcut: "⌘⌥D", action: () => setIsDark(!isDark) }];
      case "Window": return [{ label: "Minimize", shortcut: "⌘M", action: () => activeWindow && minimizeWindow(activeWindow) }, { label: "Zoom", shortcut: "⌘⌥M", action: () => activeWindow && maximizeWindow(activeWindow) }, { separator: true, label: "", action: () => {} }, { label: "Bring All to Front", shortcut: "", action: () => { windows.forEach(w => bringToFront(w.id)); } }];
      case "Help": return [{ label: "CyberOS Help", shortcut: "", action: () => openWindow("help", "CyberOS Help") }, { separator: true, label: "", action: () => {} }, { label: "Keyboard Shortcuts", shortcut: "", action: () => openWindow("shortcuts", "Keyboard Shortcuts") }, { separator: true, label: "", action: () => {} }, { label: "About CyberOS", shortcut: "", action: () => openWindow("about-os", "About CyberOS") }];
      default: return [];
    }
  };

  const handleMenuClick = (menuName: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setMenuPosition({ x: rect.left, y: 32 });
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const openWindow = (type: WindowState["type"], title: string) => {
    const existing = windows.find((w) => w.type === type);
    if (existing) {
      if (existing.isMinimized) setWindows(prev => prev.map(w => w.type === type ? { ...w, isMinimized: false, zIndex: zIndexCounter } : w));
      setActiveWindow(existing.id);
      setZIndexCounter(prev => prev + 1);
    } else {
      const newWindow: WindowState = { id: `${type}-${Date.now()}`, title, type, isOpen: true, isMinimized: false, isMaximized: false, zIndex: zIndexCounter, position: { x: 100 + windows.length * 30, y: 50 + windows.length * 30 }, size: { width: 800, height: 500 } };
      setWindows(prev => [...prev, newWindow]);
      setZIndexCounter(prev => prev + 1);
      setActiveWindow(newWindow.id);
    }
    setShowLaunchpad(false);
  };

  const closeWindow = (id: string) => { setWindows(prev => prev.filter(w => w.id !== id)); if (activeWindow === id) setActiveWindow(null); };
  const minimizeWindow = (id: string) => { setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w)); setActiveWindow(null); };
  const maximizeWindow = (id: string) => { setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)); };
  const bringToFront = (id: string) => { setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: zIndexCounter } : w)); setZIndexCounter(prev => prev + 1); setActiveWindow(id); };

  const getWindowContent = (win: WindowState) => {
    switch (win.type) {
      case "terminal": return <TerminalWindow isDark={isDark} />;
      case "about": return <AboutWindow isDark={isDark} />;
      case "projects": return <ProjectsWindow isDark={isDark} />;
      case "skills": return <SkillsWindow isDark={isDark} />;
      case "contact": return <ContactWindow isDark={isDark} />;
      case "settings": return <SettingsWindow isDark={isDark} setIsDark={setIsDark} brightness={brightness} setBrightness={setBrightness} volume={volume} setVolume={setVolume} currentWallpaper={currentWallpaper} setCurrentWallpaper={setCurrentWallpaper} />;
      case "finder": return <FinderWindow isDark={isDark} />;
      case "calculator": return <CalculatorWindow isDark={isDark} />;
      case "calendar": return <CalendarWindow isDark={isDark} />;
      case "notes": return <NotesWindow isDark={isDark} />;
      case "help": return <HelpWindow isDark={isDark} />;
      case "shortcuts": return <ShortcutsWindow isDark={isDark} />;
      case "about-os": return <AboutOSWindow isDark={isDark} />;
      default: return null;
    }
  };

  const dockItems = [{ id: "finder", icon: <LayoutGrid className="w-6 h-6" />, label: "Finder" }, { id: "terminal", icon: <Terminal className="w-6 h-6" />, label: "Terminal" }, { id: "about", icon: <User className="w-6 h-6" />, label: "About" }, { id: "projects", icon: <FolderOpen className="w-6 h-6" />, label: "Projects" }, { id: "skills", icon: <Code className="w-6 h-6" />, label: "Skills" }, { id: "contact", icon: <Mail className="w-6 h-6" />, label: "Contact" }, { id: "settings", icon: <Settings className="w-6 h-6" />, label: "Settings" }];

  const launchpadItems = [{ id: "finder", icon: <LayoutGrid className="w-8 h-8" />, label: "Finder", color: "from-blue-500 to-blue-600" }, { id: "terminal", icon: <Terminal className="w-8 h-8" />, label: "Terminal", color: "from-gray-700 to-gray-800" }, { id: "about", icon: <User className="w-8 h-8" />, label: "About", color: "from-purple-500 to-purple-600" }, { id: "projects", icon: <FolderOpen className="w-8 h-8" />, label: "Projects", color: "from-yellow-500 to-orange-500" }, { id: "skills", icon: <Code className="w-8 h-8" />, label: "Skills", color: "from-green-500 to-emerald-600" }, { id: "contact", icon: <Mail className="w-8 h-8" />, label: "Contact", color: "from-red-500 to-pink-600" }, { id: "settings", icon: <Settings className="w-8 h-8" />, label: "Settings", color: "from-gray-500 to-gray-600" }, { id: "calculator", icon: <Calculator className="w-8 h-8" />, label: "Calculator", color: "from-orange-500 to-red-500" }, { id: "calendar", icon: <Calendar className="w-8 h-8" />, label: "Calendar", color: "from-red-500 to-red-600" }, { id: "notes", icon: <FileText className="w-8 h-8" />, label: "Notes", color: "from-yellow-400 to-yellow-500" }];

  return (
    <>
      <style>{`.slider-container { position: relative; display: flex; align-items: center; } .cyber-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 3px; outline: none; background: #374151; position: relative; } .cyber-slider::-webkit-slider-runnable-track { height: 6px; border-radius: 3px; } .cyber-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: white; border: none; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4); cursor: pointer; margin-top: -6px; position: relative; z-index: 2; }`}</style>
      <AnimatePresence>
        {!isLoggedIn && <LoginScreen onLogin={() => setIsLoggedIn(true)} isDark={isDark} />}
      </AnimatePresence>
      <div className={cn("min-h-screen w-full overflow-hidden transition-opacity duration-500", isLoggedIn ? "opacity-100" : "opacity-0 pointer-events-none")} style={{ filter: `brightness(${brightness}%)` }}>
        <div className="fixed inset-0 bg-cover bg-center transition-all duration-700" style={{ backgroundImage: `url(${currentWallpaper})` }} />
        <div className={cn("fixed inset-0 transition-opacity duration-500", isDark ? "bg-black/40" : "bg-white/20")} />
        <div className={cn("fixed top-0 left-0 right-0 h-8 flex items-center justify-between px-4 z-[100] backdrop-blur-md", isDark ? "bg-gray-900/80 text-white" : "bg-white/80 text-gray-900")}>
          <div className="flex items-center gap-4">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-sm">CyberOS</span>
            <div className="hidden md:flex items-center gap-3 text-sm">
              {["File", "Edit", "View", "Window", "Help"].map((menuName) => (
                <button key={menuName} onClick={(e) => handleMenuClick(menuName, e)} className={cn("hover:opacity-70 transition-opacity px-2 py-1 rounded", activeMenu === menuName && (isDark ? "bg-white/20" : "bg-black/10"), menuName === "File" && "font-medium")}>{menuName}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowControlCenter(!showControlCenter)} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                {wifiEnabled ? <WifiIcon className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <Battery className="w-4 h-4" />
            </div>
            <span className="font-medium">{format(currentTime, "EEE MMM d")}</span>
            <span className="font-medium">{format(currentTime, "h:mm a")}</span>
          </div>
        </div>
        {activeMenu && <MenuDropdown isOpen={!!activeMenu} onClose={() => setActiveMenu(null)} items={getMenuItems(activeMenu)} isDark={isDark} position={menuPosition} />}
        <ControlCenter isOpen={showControlCenter} onClose={() => setShowControlCenter(false)} isDark={isDark} setIsDark={setIsDark} brightness={brightness} setBrightness={setBrightness} volume={volume} setVolume={setVolume} wifiEnabled={wifiEnabled} setWifiEnabled={setWifiEnabled} bluetoothEnabled={bluetoothEnabled} setBluetoothEnabled={setBluetoothEnabled} />
        <div className="pt-8 h-screen relative">
          <AnimatePresence>
            {windows.map((win) => !win.isMinimized && (
              <Window key={win.id} window={win} isActive={activeWindow === win.id} onClose={() => closeWindow(win.id)} onMinimize={() => minimizeWindow(win.id)} onMaximize={() => maximizeWindow(win.id)} onClick={() => bringToFront(win.id)} isDark={isDark} brightness={brightness}>
                {getWindowContent(win)}
              </Window>
            ))}
          </AnimatePresence>
          <AnimatePresence>
            {showLaunchpad && (
              <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className={cn("fixed inset-0 z-[90] flex items-center justify-center backdrop-blur-xl", isDark ? "bg-gray-950/90" : "bg-white/90")} onClick={() => setShowLaunchpad(false)}>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-8 p-8">
                  {launchpadItems.map((item) => (
                    <motion.button key={item.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); openWindow(item.id as WindowState["type"], item.label); }} className="flex flex-col items-center gap-3">
                      <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br", item.color)}>
                        <div className="text-white">{item.icon}</div>
                      </div>
                      <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>{item.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[80]">
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={cn("flex items-end gap-2 px-4 py-3 rounded-2xl backdrop-blur-xl", isDark ? "bg-gray-900/60 border border-gray-700/50" : "bg-white/60 border border-white/50 shadow-xl")}>
            {dockItems.map((item) => {
              const isActive = activeWindow?.startsWith(item.id);
              return <DockItem key={item.id} icon={item.icon} label={item.label} isActive={isActive || false} onClick={() => item.id === "finder" ? setShowLaunchpad(true) : openWindow(item.id as WindowState["type"], item.label)} isDark={isDark} />;
            })}
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default App;