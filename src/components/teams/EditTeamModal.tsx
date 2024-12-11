import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, Globe, Clock } from 'lucide-react';
import { Team } from '../../types';
import { updateTeam } from '../../lib/teams';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const teamSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters'),
  description: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  timezone: z.string().optional(),
  level: z.enum(['Hobbyist', 'Amateur', 'Competitor', 'Pro']).optional(),
  teamMessage: z.string().optional()
});

type TeamFormData = z.infer<typeof teamSchema>;

interface EditTeamModalProps {
  team: Team;
  onClose: () => void;
}

export default function EditTeamModal({ team, onClose }: EditTeamModalProps) {
  const queryClient = useQueryClient();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bgPreview, setBgPreview] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: team.name,
      description: team.description,
      country: team.country,
      region: team.region,
      timezone: team.timezone,
      level: team.level,
      teamMessage: team.teamMessage
    }
  });

  const handleFileChange = (
    file: File | null,
    setFile: (file: File | null) => void,
    setPreview: (preview: string | null) => void
  ) => {
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const onSubmit = async (data: TeamFormData) => {
    try {
      await updateTeam(team.id, {
        ...data,
        logo: logoFile ? await handleImageUpload(logoFile, 'logo') : undefined,
        backgroundImage: bgFile ? await handleImageUpload(bgFile, 'background') : undefined
      });

      queryClient.invalidateQueries({ queryKey: ['team', team.id] });
      toast.success('Team updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating team:', error);
      toast.error('Failed to update team');
    }
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'background'): Promise<string> => {
    // In a real app, implement file upload to storage
    return URL.createObjectURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gaming-card rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-xl font-bold text-white">Edit Team</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Media Upload Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Team Logo
              </label>
              <div className="relative group">
                <img
                  src={logoPreview || team.logo}
                  alt="Team Logo"
                  className="w-full h-32 rounded-lg object-cover"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      handleFileChange(file || null, setLogoFile, setLogoPreview);
                    }}
                  />
                  <Upload className="w-6 h-6 text-white" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Background Image
              </label>
              <div className="relative group">
                <img
                  src={bgPreview || team.backgroundImage}
                  alt="Background"
                  className="w-full h-32 rounded-lg object-cover"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      handleFileChange(file || null, setBgFile, setBgPreview);
                    }}
                  />
                  <Upload className="w-6 h-6 text-white" />
                </label>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Team Name *
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon resize-none"
            />
          </div>

          {/* Location & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                <Globe className="inline-block w-4 h-4 mr-1" />
                Country
              </label>
              <input
                {...register('country')}
                type="text"
                className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Region
              </label>
              <input
                {...register('region')}
                type="text"
                className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                <Clock className="inline-block w-4 h-4 mr-1" />
                Timezone
              </label>
              <input
                {...register('timezone')}
                type="text"
                className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
                placeholder="UTC+0"
              />
            </div>
          </div>

          {/* Team Level */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Team Level
            </label>
            <select
              {...register('level')}
              className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
            >
              <option value="Hobbyist">Hobbyist</option>
              <option value="Amateur">Amateur</option>
              <option value="Competitor">Competitor</option>
              <option value="Pro">Pro</option>
            </select>
          </div>

          {/* Team Message */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Team Message
            </label>
            <textarea
              {...register('teamMessage')}
              rows={3}
              className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon resize-none"
              placeholder="A message for potential members..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gaming-neon text-black rounded-md hover:bg-gaming-neon/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}