import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Trophy, Users, Calendar, ExternalLink } from 'lucide-react';
import { GameTeam } from '../../types';

interface TeamCardProps {
  team: GameTeam;
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="bg-gaming-card rounded-lg border border-gaming-neon/20 hover:border-gaming-neon transition-colors overflow-hidden">
      <div className="p-6">
        {/* Team Header */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={team.logo}
            alt={team.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <Link
              to={`/teams/${team.id}`}
              className="text-xl font-display font-bold text-white hover:text-gaming-neon transition-colors"
            >
              {team.name}
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{team.region}</span>
              <span>•</span>
              <span>Rank #{team.ranking}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gaming-neon">
            {team.stats.winRate.toFixed(1)}%
          </div>
        </div>

        {/* Team Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {team.description}
        </p>

        {/* Active Roster */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Active Roster</h4>
          <div className="flex flex-wrap gap-2">
            {team.roster.slice(0, 5).map((member) => (
              <Link
                key={member.userId}
                to={`/profile/${member.userId}`}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-gaming-dark/50 text-xs text-white hover:bg-gaming-dark transition-colors"
              >
                <span>{member.position}</span>
                <span className="text-gaming-neon">•</span>
                <span>{member.role}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Matches */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Recent Matches</h4>
          <div className="flex gap-1">
            {team.recentMatches.map((match) => (
              <div
                key={match.id}
                className={`flex-1 h-1.5 rounded-full ${
                  match.result === 'win'
                    ? 'bg-gaming-neon'
                    : match.result === 'loss'
                    ? 'bg-gaming-accent'
                    : 'bg-gray-500'
                }`}
                title={`${match.opponent} (${match.score}) - ${formatDistanceToNow(match.date, { addSuffix: true })}`}
              />
            ))}
          </div>
        </div>

        {/* Upcoming Match */}
        {team.upcomingMatches.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Next Match</h4>
            <div className="p-3 rounded-lg bg-gaming-dark/50">
              <div className="text-white">vs {team.upcomingMatches[0].opponent}</div>
              <div className="text-sm text-gray-400">
                {formatDistanceToNow(team.upcomingMatches[0].date, { addSuffix: true })}
                {' • '}
                {team.upcomingMatches[0].tournament}
              </div>
            </div>
          </div>
        )}

        {/* Social Links */}
        <div className="flex gap-2">
          {team.socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-gaming-dark/50 text-gaming-neon hover:bg-gaming-dark transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}