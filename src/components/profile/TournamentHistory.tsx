import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trophy, Plus, X, Calendar, Edit2 } from 'lucide-react';
import { Tournament } from '../../types';
import { format } from 'date-fns';
import { updateProfile } from '../../lib/profile';
import { useAuthStore } from '../../lib/store';
import { toast } from 'react-toastify';

// Schema and types remain the same...
const tournamentSchema = z.object({
  name: z.string().min(1, 'Tournament name is required'),
  game: z.string().min(1, 'Game is required'),
  date: z.string().min(1, 'Date is required'),
  placement: z.number().min(0, 'Placement must be 0 or greater').optional(),
  totalParticipants: z.number().min(1, 'Total participants must be at least 1'),
  prizePool: z.string().optional(),
  organizer: z.string().min(1, 'Organizer is required'),
  url: z.string().url().optional(),
  status: z.enum(['upcoming', 'completed']).default('upcoming')
});

type TournamentFormData = z.infer<typeof tournamentSchema>;

interface TournamentHistoryProps {
  userId: string;
  isEditable: boolean;
  tournaments: Tournament[];
}

export default function TournamentHistory({ userId, isEditable, tournaments }: TournamentHistoryProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { user } = useAuthStore();

  const { register, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting } } = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      status: 'upcoming'
    }
  });

  const tournamentStatus = watch('status');

  const handleEdit = (tournament: Tournament, index: number) => {
    setValue('name', tournament.name);
    setValue('game', tournament.game);
    setValue('date', format(new Date(tournament.date), 'yyyy-MM-dd'));
    setValue('placement', tournament.placement);
    setValue('totalParticipants', tournament.totalParticipants);
    setValue('prizePool', tournament.prizePool || '');
    setValue('organizer', tournament.organizer);
    setValue('url', tournament.url || '');
    setValue('status', new Date(tournament.date) > new Date() ? 'upcoming' : 'completed');
    setEditingIndex(index);
    setShowModal(true);
  };

  const onSubmit = async (data: TournamentFormData) => {
    if (!user) return;

    try {
      // Validate that the user has the selected game in their profile
      const hasGame = user.gamesPlayed.some(game => game.name === data.game);
      if (!hasGame) {
        toast.error('You can only add tournaments for games in your profile');
        return;
      }

      let updatedTournaments = [...tournaments];
      if (editingIndex !== null) {
        // Update existing tournament
        updatedTournaments[editingIndex] = data;
      } else {
        // Add new tournament
        updatedTournaments.push(data);
      }

      await updateProfile(userId, { tournaments: updatedTournaments });
      toast.success(editingIndex !== null ? 'Tournament updated successfully' : 'Tournament added successfully');
      reset();
      setShowModal(false);
      setEditingIndex(null);
    } catch (error) {
      console.error('Error saving tournament:', error);
      toast.error('Failed to save tournament');
    }
  };

  // Filter tournaments into upcoming and past
  const now = new Date();
  const upcomingTournaments = tournaments.filter(t => new Date(t.date) > now);
  const pastTournaments = tournaments.filter(t => new Date(t.date) <= now);

  const renderTournamentCard = (tournament: Tournament, index: number) => (
    <div
      key={index}
      className="bg-gaming-dark/50 rounded-lg p-4 space-y-2"
    >
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-white">{tournament.name}</h4>
        <div className="flex items-center gap-2">
          <span className="text-gaming-neon">{tournament.game}</span>
          {isEditable && (
            <button
              onClick={() => handleEdit(tournament, index)}
              className="p-1 text-gray-400 hover:text-gaming-neon rounded-full transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Calendar className="w-4 h-4" />
        <span>{format(new Date(tournament.date), 'MMM d, yyyy')}</span>
      </div>
      {tournament.placement && (
        <div className="text-sm text-gray-400">
          Placement: {tournament.placement}/{tournament.totalParticipants}
        </div>
      )}
      {tournament.prizePool && (
        <div className="text-sm text-gray-400">
          Prize Pool: {tournament.prizePool}
        </div>
      )}
      <div className="text-sm text-gray-400">
        Organized by: {tournament.organizer}
      </div>
      {tournament.url && (
        <a
          href={tournament.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gaming-neon hover:underline"
        >
          Tournament Details
        </a>
      )}
    </div>
  );

  return (
    <div className="bg-gaming-card rounded-lg border border-gaming-neon/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-gaming-neon" />
          <h2 className="font-display text-xl font-bold text-white">Tournament History</h2>
        </div>
        {isEditable && (
          <button
            onClick={() => {
              reset({ status: 'upcoming' });
              setEditingIndex(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-3 py-1 bg-gaming-neon/10 text-gaming-neon rounded-md hover:bg-gaming-neon/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Tournament
          </button>
        )}
      </div>

      {/* Upcoming Tournaments */}
      {upcomingTournaments.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Upcoming Tournaments</h3>
          <div className="space-y-4">
            {upcomingTournaments.map((tournament, index) => 
              renderTournamentCard(tournament, index)
            )}
          </div>
        </div>
      )}

      {/* Past Tournaments */}
      {pastTournaments.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Past Tournaments</h3>
          <div className="space-y-4">
            {pastTournaments.map((tournament, index) => 
              renderTournamentCard(tournament, tournaments.indexOf(tournament))
            )}
          </div>
        </div>
      )}

      {tournaments.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No tournament history available</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gaming-card rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center sticky top-0 bg-gaming-card z-10 pb-4 mb-4 border-b border-gaming-neon/20">
              <h3 className="font-display text-xl font-bold text-white">
                {editingIndex !== null ? 'Edit Tournament' : 'Add Tournament'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingIndex(null);
                  reset();
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Form fields remain the same... */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tournament Status *
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
                >
                  <option value="upcoming">Upcoming Tournament</option>
                  <option value="completed">Completed Tournament</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tournament Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-gaming-accent">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Game *
                </label>
                <select
                  {...register('game')}
                  className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
                >
                  <option value="">Select game</option>
                  {user?.gamesPlayed.map((game) => (
                    <option key={game.id} value={game.name}>
                      {game.name}
                    </option>
                  ))}
                </select>
                {errors.game && (
                  <p className="mt-1 text-sm text-gaming-accent">{errors.game.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Date *
                </label>
                <input
                  {...register('date')}
                  type="date"
                  className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-gaming-accent">{errors.date.message}</p>
                )}
              </div>

              {tournamentStatus === 'completed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Placement *
                  </label>
                  <input
                    {...register('placement', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
                  />
                  {errors.placement && (
                    <p className="mt-1 text-sm text-gaming-accent">{errors.placement.message}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Total Participants *
                </label>
                <input
                  {...register('totalParticipants', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
                />
                {errors.totalParticipants && (
                  <p className="mt-1 text-sm text-gaming-accent">{errors.totalParticipants.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Prize Pool (Optional)
                </label>
                <input
                  {...register('prizePool')}
                  type="text"
                  placeholder="e.g., $1,000"
                  className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Organizer *
                </label>
                <input
                  {...register('organizer')}
                  type="text"
                  className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
                />
                {errors.organizer && (
                  <p className="mt-1 text-sm text-gaming-accent">{errors.organizer.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tournament URL (Optional)
                </label>
                <input
                  {...register('url')}
                  type="url"
                  placeholder="https://"
                  className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
                />
                {errors.url && (
                  <p className="mt-1 text-sm text-gaming-accent">{errors.url.message}</p>
                )}
              </div>

              <div className="sticky bottom-0 bg-gaming-card pt-4 border-t border-gaming-neon/20 mt-4">
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingIndex(null);
                      reset();
                    }}
                    className="px-4 py-2 text-gray-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gaming-neon text-black rounded-md hover:bg-gaming-neon/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : editingIndex !== null ? 'Save Changes' : 'Add Tournament'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}