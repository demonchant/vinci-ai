/**
 * components/ui/icons.tsx
 *
 * Single source of truth for every icon used in Vinci AI. No other file
 * should `import ... from "lucide-react"` directly — import from here
 * instead (or from Icon.tsx / icon-components.tsx, which build on this).
 * This keeps the icon language consistent and makes a library swap a
 * one-file change.
 */
export {
  // AI / intelligence
  Brain,
  Bot,
  Sparkles,
  ScanSearch,
  Cpu,
  Network,
  Waypoints,
  Orbit,
  Fingerprint,

  // Navigation
  LayoutDashboard,
  MessageSquare,
  MessagesSquare,
  FolderOpen,
  Folder,
  Database,
  FileText,
  Files,
  Crown,
  Compass,
  BookOpen,
  Award,
  TrendingDown,
  TrendingUp,
  Settings,
  Home,

  // People / identity
  User,
  Users,

  // Status / feedback
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  CircleCheck,
  CheckCircle2,
  AlertCircle,
  Info,
  Loader2,
  Check,

  // Achievements
  Medal,
  Trophy,
  BadgeCheck,
  Gem,
  Diamond,
  Star,
  Target,

  // Content / data
  Image,
  Camera,
  Activity,
  Clock,
  History,
  Calendar,
  BarChart3,
  LineChart,
  PieChart,
  Layers,
  Wallet,
  ScrollText,
  Watch,

  // Actions
  Search,
  Upload,
  Download,
  ExternalLink,
  Share2,
  Copy,
  Trash2,
  Pencil,
  Edit3,
  RefreshCw,
  RotateCcw,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Plus,
  Minus,
  X,
  Send,
  Mail,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  FlipHorizontal,
  Move,
  GitBranch,
  GitCommit,
  Columns,
  SearchCode,

  // UI chrome
  Bell,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Bookmark,
  Tag,
  Pin,
  Heart,
  Filter,
  SlidersHorizontal,
  Grid2X2,
  List,

  // Directional
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,

  // Misc
  Lightbulb,
  Map,
  Globe,
  Archive,
  Zap,
  CheckCircle2 as CheckCircle,
} from "lucide-react";

export type { LucideIcon, LucideProps } from "lucide-react";
