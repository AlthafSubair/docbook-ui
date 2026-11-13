import React from "react";
import {
  UserCheck,
  Heart,
  Baby,
  Shield,
  Users,
  Sparkles,
  User,
} from "lucide-react";

interface RelationshipBadgeProps {
  relationship?: string;
  className?: string;
  showIcon?: boolean;
}

interface RelationshipConfig {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badgeClass: string;
  iconClass: string;
}

const RELATIONSHIP_CONFIGS: Record<string, RelationshipConfig> = {
  Self: {
    icon: UserCheck,
    label: "Self",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200/90",
    iconClass: "text-blue-600",
  },
  Spouse: {
    icon: Heart,
    label: "Spouse",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200/90",
    iconClass: "text-rose-500 fill-rose-500/20",
  },
  Child: {
    icon: Baby,
    label: "Child",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/90",
    iconClass: "text-emerald-600",
  },
  Parent: {
    icon: Shield,
    label: "Parent",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200/90",
    iconClass: "text-amber-600",
  },
  Sibling: {
    icon: Users,
    label: "Sibling",
    badgeClass: "bg-cyan-50 text-cyan-700 border-cyan-200/90",
    iconClass: "text-cyan-600",
  },
  Family: {
    icon: Users,
    label: "Family",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200/90",
    iconClass: "text-indigo-600",
  },
  Friend: {
    icon: Sparkles,
    label: "Friend",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200/90",
    iconClass: "text-purple-600",
  },
  Other: {
    icon: User,
    label: "Other",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    iconClass: "text-slate-500",
  },
};

const DEFAULT_CONFIG: RelationshipConfig = {
  icon: User,
  label: "Patient",
  badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
  iconClass: "text-slate-500",
};

export const RelationshipBadge: React.FC<RelationshipBadgeProps> = ({
  relationship,
  className = "",
  showIcon = true,
}) => {
  if (!relationship) return null;

  const key = Object.keys(RELATIONSHIP_CONFIGS).find(
    (k) => k.toLowerCase() === relationship.trim().toLowerCase()
  );

  const config = key ? RELATIONSHIP_CONFIGS[key] : { ...DEFAULT_CONFIG, label: relationship };
  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center justify-center gap-1 text-[10px] leading-none font-bold uppercase tracking-wider px-2 py-1 rounded-md border transition-colors shadow-2xs ${config.badgeClass} ${className}`.trim()}
    >
      {showIcon && <IconComponent className={`size-3 shrink-0 ${config.iconClass}`} />}
      <span className="leading-none pt-[0.5px]">{config.label}</span>
    </span>
  );
};

export default RelationshipBadge;
