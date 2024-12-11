import React from 'react';
import { User } from '../../types';
import { Gamepad2 } from 'lucide-react';

interface GameHistoryProps {
  user: User;
}

export default function GameHistory({ user }: GameHistoryProps) {
  return (
    <div className="bg-gaming-card rounded-lg border border-gaming-neon/20 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Gamepad2 className="w-6 h-6 text-gaming-neon" />
        <h2 className="font-display text-xl font-bold text-white">Game History</h2>
      </div>

      <div className="space-y-4">
        {user.gamesPlayed.map((game) => (
          <div key={game.id} className="bg-gaming-dark/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-white">{game.name}</h3>
              <span className="text-gaming-neon">{game.skillLevel}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-gray-400">
                Hours Played: <span className="text-white">{game.hoursPlayed}</span>
              </div>
              {game.rank && (
                <div className="text-gray-400">
                  Peak Rank: <span className="text-white">{game.rank}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {user.gamesPlayed.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            No game history available
          </div>
        )}
      </div>
    </div>
  );
}