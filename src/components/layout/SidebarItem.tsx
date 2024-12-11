import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
}

export default function SidebarItem({ 
  icon: Icon, 
  label, 
  href, 
  isActive
}: SidebarItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        'flex items-center justify-center p-3 rounded-lg relative group',
        'transition-all duration-200 ease-in-out',
        isActive
          ? 'bg-gaming-neon text-black font-medium shadow-lg shadow-gaming-neon/20'
          : 'text-gray-400 hover:text-white hover:bg-gaming-dark'
      )}
    >
      <Icon className={cn(
        "w-5 h-5 transition-transform",
        !isActive && "group-hover:scale-110"
      )} />

      {/* Tooltip */}
      <div className="absolute left-full ml-2 px-2 py-1 bg-gaming-dark text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
        {label}
      </div>
    </Link>
  );
}