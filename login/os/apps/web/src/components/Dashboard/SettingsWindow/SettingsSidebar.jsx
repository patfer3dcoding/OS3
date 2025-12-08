import { User, Bell, Shield, Palette, Zap } from "lucide-react";

const sections = [
  {
    id: "profile",
    name: "Profile",
    icon: User,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: Bell,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    id: "appearance",
    name: "Appearance",
    icon: Palette,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: "advanced",
    name: "Advanced",
    icon: Zap,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

export function SettingsSidebar({ activeSection, onSectionChange }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Settings</h2>
      <div className="space-y-1">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeSection === section.id
                  ? `${section.bgColor} ${section.color}`
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{section.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
