import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Search } from 'lucide-react';
import { Team } from '../../types';
import { updateTeam } from '../../lib/teams';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDemoGame } from '../../lib/search';
import { toast } from 'react-toastify';

const gameSchema = z.object({
  id: z.string().min(1, 'Game selection is required'),
  name: z.string(),
  platforms: z.array(z.enum(['PC', 'XBOX', 'PS5', 'Switch', 'Mobile']))
});

type GameFormData = z.infer<typeof gameSchema>;

interface AddGameModalProps {
  team: Team;
  onClose: () => void;
}

export default function AddGameModal({ team, onClose }: AddGameModalProps) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch available games
  const { data: availableGames } = useQuery({
    queryKey: ['available-games'],
    queryFn: async () => {
      if (import.meta.env.MODE === 'development') {
        const gameIds = ['cs2', 'lol', 'valorant', 'dota2', 'fifa', 'cod', 'wow'];
        const games = await Promise.all(
          gameIds.map(id => getDemoGame(id))
        );
        return games.filter(Boolean);
      }
      return [];
    }
  });

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<GameFormData>({
    resolver: zodResolver(gameSchema)
  });

  const selectedGameId = watch('id');
  const selectedGame = availableGames?.find(game => game.id === selectedGameId);

  // Update name when game is selected
  React.useEffect(() => {
    if (selectedGame) {
      setValue('name', selectedGame.name);
    }
  }, [selectedGame, setValue]);

  const onSubmit = async (data: GameFormData) => {
    try {
      // Check if game is already added
      if (team.games.some(game => game.id === data.id)) {
        toast.error('This game is already added to the team');
        return;
      }

      const updatedGames = [...team.games, {
        id: data.id,
        name: data.name,
        platforms: data.platforms
      }];

      await updateTeam(team.id, { games: updatedGames });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['team', team.id] });
      
      toast.success('Game added successfully');
      onClose();
    } catch (error) {
      console.error('Error adding game:', error);
      toast.error('Failed to add game');
    }
  };

  // Filter out already added games
  const filteredGames = availableGames?.filter(game => 
    !team.games.some(teamGame => teamGame.id === game.id) &&
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gaming-card rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-xl font-bold text-white">Add Game</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Game Search & Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Game
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search games..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-gaming-dark border border-gaming-neon/20 text-white placeholder-gray-400 focus:outline-none focus:border-gaming-neon"
              />
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 mb-4">
              {filteredGames?.map((game) => (
                <label
                  key={game.id}
                  className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gaming-dark/50"
                >
                  <input
                    type="radio"
                    value={game.id}
                    {...register('id')}
                    className="hidden"
                  />
                  <div className={`flex items-center gap-3 w-full p-2 rounded-lg ${
                    selectedGameId === game.id ? 'bg-gaming-neon/20 text-gaming-neon' : 'text-white'
                  }`}>
                    <img
                      src={game.wallPhoto}
                      alt={game.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <div className="font-medium">{game.name}</div>
                      <div className="text-sm text-gray-400">{game.gameType}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.id && (
              <p className="mt-1 text-sm text-gaming-accent">{errors.id.message}</p>
            )}
          </div>

          {selectedGame && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Platforms
              </label>
              <div className="grid grid-cols-2 gap-2">
                {selectedGame.platforms.map((platform) => (
                  <label
                    key={platform}
                    className="flex items-center gap-2 p-2 rounded-lg bg-gaming-dark/50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={platform}
                      {...register('platforms')}
                      className="rounded border-gaming-neon/20 text-gaming-neon focus:ring-gaming-neon bg-gaming-dark"
                    />
                    <span className="text-white">{platform}</span>
                  </label>
                ))}
              </div>
              {errors.platforms && (
                <p className="mt-1 text-sm text-gaming-accent">{errors.platforms.message}</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedGame}
              className="px-4 py-2 bg-gaming-neon text-black rounded-md hover:bg-gaming-neon/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}