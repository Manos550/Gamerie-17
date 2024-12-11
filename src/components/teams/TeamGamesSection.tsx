import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Team } from '../../types';
import { updateTeam } from '../../lib/teams';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import AddGameModal from './AddGameModal';

interface TeamGamesSectionProps {
  team: Team;
  isTeamOwner: boolean;
}

interface EditingGame {
  id: string;
  name: string;
  platforms: string[];
}

export default function TeamGamesSection({ team, isTeamOwner }: TeamGamesSectionProps) {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGame, setEditingGame] = useState<EditingGame | null>(null);
  const [editedPlatforms, setEditedPlatforms] = useState<string[]>([]);

  const handleEditGame = (game: EditingGame) => {
    setEditingGame(game);
    setEditedPlatforms(game.platforms);
  };

  const handleSaveEdit = async () => {
    if (!editingGame) return;

    try {
      const updatedGames = team.games.map(game => 
        game.id === editingGame.id
          ? { ...game, platforms: editedPlatforms }
          : game
      );

      await updateTeam(team.id, { games: updatedGames });
      queryClient.invalidateQueries({ queryKey: ['team', team.id] });
      toast.success('Game updated successfully');
      setEditingGame(null);
    } catch (error) {
      console.error('Error updating game:', error);
      toast.error('Failed to update game');
    }
  };

  const handleDeleteGame = async (gameId: string, gameName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${gameName}?`)) return;

    try {
      const updatedGames = team.games.filter(game => game.id !== gameId);
      await updateTeam(team.id, { games: updatedGames });
      queryClient.invalidateQueries({ queryKey: ['team', team.id] });
      toast.success('Game removed successfully');
    } catch (error) {
      console.error('Error removing game:', error);
      toast.error('Failed to remove game');
    }
  };

  return (
    <div className="bg-gaming-card rounded-lg p-6 border border-gaming-neon/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-white">Games</h2>
        {isTeamOwner && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3 py-1 bg-gaming-neon/10 text-gaming-neon rounded-md hover:bg-gaming-neon/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Game
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {team.games.map((game) => (
          <div
            key={game.id}
            className="p-4 rounded-lg bg-gaming-dark/50"
          >
            {editingGame?.id === game.id ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-white mb-2">{game.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {['PC', 'PS5', 'XBOX', 'Switch', 'Mobile'].map((platform) => (
                      <label
                        key={platform}
                        className="flex items-center gap-2 p-2 rounded-lg bg-gaming-dark/50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={editedPlatforms.includes(platform)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditedPlatforms([...editedPlatforms, platform]);
                            } else {
                              setEditedPlatforms(editedPlatforms.filter(p => p !== platform));
                            }
                          }}
                          className="rounded border-gaming-neon/20 text-gaming-neon focus:ring-gaming-neon bg-gaming-dark"
                        />
                        <span className="text-white">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingGame(null)}
                    className="p-2 text-gray-400 hover:text-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="p-2 text-gaming-neon hover:bg-gaming-neon/10 rounded-full"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white mb-2">{game.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {game.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="px-2 py-1 rounded-full bg-gaming-neon/10 text-gaming-neon text-xs"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                {isTeamOwner && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditGame(game)}
                      className="p-2 text-gray-400 hover:text-gaming-neon rounded-full"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGame(game.id, game.name)}
                      className="p-2 text-gray-400 hover:text-gaming-accent rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {team.games.length === 0 && (
          <p className="text-center py-4 text-gray-400">No games added yet</p>
        )}
      </div>

      {showAddModal && (
        <AddGameModal
          team={team}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}