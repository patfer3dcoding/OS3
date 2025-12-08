import {
  Users,
  Briefcase,
  Calendar,
  MessageSquare,
  BarChart3,
  FileText,
  Settings,
  Building2,
  Target,
  TrendingUp,
  Mail,
  DollarSign,
  Video,
} from "lucide-react";

export const desktopApps = [
  {
    id: "candidates",
    name: "Candidates",
    icon: Users,
    iconUrl:
      "https://raw.createusercontent.com/1ae52865-7e7c-4d35-9567-95be1c49f683/",
    color: "from-blue-500 to-cyan-500",
    description: "Manage candidate database",
  },
  {
    id: "jobs",
    name: "Job Postings",
    icon: Briefcase,
    iconUrl:
      "https://raw.createusercontent.com/45df16f8-1bf1-4c91-bda3-5e53101df454/",
    color: "from-purple-500 to-pink-500",
    description: "Create and manage job listings",
  },
  {
    id: "interviews",
    name: "Interviews",
    icon: Calendar,
    iconUrl:
      "https://raw.createusercontent.com/c4c5a835-8389-4ad1-a8ce-0db715600d61/",
    color: "from-green-500 to-emerald-500",
    description: "Schedule and track interviews",
  },
  {
    id: "live-interview",
    name: "Live Interview",
    icon: Video,
    color: "from-pink-500 to-rose-500",
    description: "Conduct live video interviews with AI assistance",
  },
  {
    id: "messages",
    name: "Messages",
    icon: MessageSquare,
    iconUrl:
      "https://raw.createusercontent.com/2749258d-318a-4a07-a9da-6cd00e58ecb1/",
    color: "from-orange-500 to-red-500",
    description: "Communication center",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: BarChart3,
    iconUrl:
      "https://raw.createusercontent.com/f3908019-41de-4ed8-84f7-d134e5caa788/",
    color: "from-indigo-500 to-purple-500",
    description: "Recruiting metrics & insights",
  },
  {
    id: "reports",
    name: "Reports",
    icon: FileText,
    iconUrl:
      "https://raw.createusercontent.com/c24506e6-e7fe-4c71-a5f1-1fd1ce609e90/",
    color: "from-yellow-500 to-orange-500",
    description: "Generate reports",
  },
  {
    id: "clients",
    name: "Clients",
    icon: Building2,
    iconUrl:
      "https://raw.createusercontent.com/370130c1-b368-4d92-b2fe-0eb8d0bacfc4/",
    color: "from-teal-500 to-cyan-500",
    description: "Client management",
  },
  {
    id: "pipeline",
    name: "Pipeline",
    icon: Target,
    iconUrl:
      "https://raw.createusercontent.com/a46ff722-7a06-44bb-a272-4c7dc60e8f80/",
    color: "from-rose-500 to-pink-500",
    description: "Recruitment pipeline",
  },
  {
    id: "performance",
    name: "Performance",
    icon: TrendingUp,
    iconUrl:
      "https://raw.createusercontent.com/d12a0e88-c111-4eb7-bc68-785acaf38c43/",
    color: "from-violet-500 to-purple-500",
    description: "Team performance metrics",
  },
  {
    id: "revenue",
    name: "Revenue",
    icon: DollarSign,
    iconUrl:
      "https://raw.createusercontent.com/bf4b25a9-2cc4-454d-b2b5-740a576ed1f6/",
    color: "from-green-600 to-emerald-600",
    description: "Financial tracking",
  },
  {
    id: "email",
    name: "Email Center",
    icon: Mail,
    iconUrl:
      "https://raw.createusercontent.com/66db1034-13b6-4248-b2f1-d24b0038d52d/",
    color: "from-blue-600 to-indigo-600",
    description: "Email campaigns",
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    iconUrl:
      "https://raw.createusercontent.com/23f8411f-5d36-42cf-91b0-21d09eef79a7/",
    color: "from-gray-500 to-slate-600",
    description: "System settings",
  },
];

export const quickActions = [
  { name: "New Candidate", icon: Users, color: "bg-blue-500" },
  { name: "Post Job", icon: Briefcase, color: "bg-purple-500" },
  { name: "Schedule Interview", icon: Calendar, color: "bg-green-500" },
  { name: "View Analytics", icon: BarChart3, color: "bg-indigo-500" },
];
