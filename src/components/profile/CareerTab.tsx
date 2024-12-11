import React from 'react';
import { User } from '../../types';
import { Trophy, Star, Medal, Award, Calendar, Briefcase, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import TournamentHistory from './TournamentHistory';
import { useAuthStore } from '../../lib/store';

interface CareerTabProps {
  user: User;
}

export default function CareerTab({ user }: CareerTabProps) {
  const { user: currentUser } = useAuthStore();
  const isOwnProfile = currentUser?.id === user.id;
  
  // Calculate total achievements
  const totalAchievements = user.achievements.length;
  
  // Calculate total tournament earnings (if available)
  const totalEarnings = user.stats.tournamentWins * 1000; // Example calculation

  // Calculate career highlights
  const highlights = [
    {
      date: new Date('2023-12-15'),
      title: 'Reached Professional Level',
      description: 'Achieved professional status in competitive gaming',
      icon: <Star className="w-5 h-5 text-gaming-neon" />
    },
    {
      date: new Date('2023-10-01'),
      title: 'Team Leadership',
      description: 'Became team captain of GamerieBest',
      icon: <Trophy className="w-5 h-5 text-gaming-neon" />
    },
    {
      date: new Date('2023-08-15'),
      title: 'Tournament Victory',
      description: 'Won first major tournament',
      icon: <Medal className="w-5 h-5 text-gaming-neon" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Career Overview */}
      <div className="bg-gaming-card rounded-lg border border-gaming-neon/20 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="w-6 h-6 text-gaming-neon" />
          <h2 className="font-display text-xl font-bold text-white">Career Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gaming-dark/50 rounded-lg p-4 text-center">
            <Trophy className="w-8 h-8 text-gaming-neon mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">{user.stats.tournamentWins}</div>
            <div className="text-sm text-gray-400">Tournament Victories</div>
          </div>

          <div className="bg-gaming-dark/50 rounded-lg p-4 text-center">
            <Award className="w-8 h-8 text-gaming-neon mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">{totalAchievements}</div>
            <div className="text-sm text-gray-400">Achievements Earned</div>
          </div>

          <div className="bg-gaming-dark/50 rounded-lg p-4 text-center">
            <TrendingUp className="w-8 h-8 text-gaming-neon mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">${totalEarnings}</div>
            <div className="text-sm text-gray-400">Total Earnings</div>
          </div>
        </div>
      </div>

      {/* Tournament History */}
      <TournamentHistory
        userId={user.id}
        isEditable={isOwnProfile}
        tournaments={user.tournaments || []}
      />

      {/* Career Timeline */}
      <div className="bg-gaming-card rounded-lg border border-gaming-neon/20 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-6 h-6 text-gaming-neon" />
          <h2 className="font-display text-xl font-bold text-white">Career Timeline</h2>
        </div>

        <div className="space-y-6">
          {highlights.map((highlight, index) => (
            <div key={index} className="relative pl-6 pb-6 last:pb-0">
              {/* Timeline line */}
              {index !== highlights.length - 1 && (
                <div className="absolute left-[11px] top-7 bottom-0 w-0.5 bg-gaming-neon/20" />
              )}
              
              {/* Timeline content */}
              <div className="relative flex items-start gap-4">
                <div className="absolute left-[-24px] mt-1 w-6 h-6 rounded-full bg-gaming-dark border-2 border-gaming-neon flex items-center justify-center">
                  {highlight.icon}
                </div>
                <div className="flex-1 bg-gaming-dark/50 rounded-lg p-4">
                  <div className="text-sm text-gaming-neon mb-1">
                    {format(highlight.date, 'MMM d, yyyy')}
                  </div>
                  <h3 className="font-bold text-white mb-1">{highlight.title}</h3>
                  <p className="text-gray-400 text-sm">{highlight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}