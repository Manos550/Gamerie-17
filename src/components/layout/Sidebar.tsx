import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Gamepad2, Users, Shield, Trophy, Medal, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';
import SidebarProfile from './SidebarProfile';
import SidebarItem from './SidebarItem';
import SettingsModal from '../settings/SettingsModal';

const navigationItems = [
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Gamepad2, label: 'Games', href: '/games' },
  { icon: Users, label: 'Users', href: '/users' },
  { icon: Shield, label: 'Teams', href: '/teams' },
  { icon: Trophy, label: 'Tournaments', href: '/tournaments' },
  { icon: Medal, label: 'Leaderboard', href: '/leaderboard' },
];

export default function Sidebar() {
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <aside className="fixed top-16 left-0 bottom-0 z-40 w-[70px] bg-gaming-card border-r border-gaming-neon/20">
        <div className="flex flex-col h-full">
          <SidebarProfile />

          {/* Navigation Items */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={location.pathname === item.href}
              />
            ))}
          </nav>

          {/* Settings Button */}
          <div className="px-2 pb-4">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center justify-center p-3 rounded-lg relative group text-gray-400 hover:text-white hover:bg-gaming-dark transition-all"
            >
              <Settings className="w-5 h-5 transition-transform group-hover:scale-110" />
              <div className="absolute left-full ml-2 px-2 py-1 bg-gaming-dark text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                Settings
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}