import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Bell, Eye, Lock, Globe } from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { updateProfile } from '../../lib/profile';
import { toast } from 'react-toastify';

const settingsSchema = z.object({
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']),
    showOnlineStatus: z.boolean(),
    showGameActivity: z.boolean(),
    allowFriendRequests: z.boolean()
  }),
  notifications: z.object({
    emailNotifications: z.boolean(),
    pushNotifications: z.boolean(),
    matchReminders: z.boolean(),
    teamUpdates: z.boolean(),
    friendActivity: z.boolean(),
    marketingEmails: z.boolean()
  }),
  language: z.string(),
  timezone: z.string()
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'privacy' | 'notifications' | 'preferences'>('privacy');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      privacy: {
        profileVisibility: 'public',
        showOnlineStatus: true,
        showGameActivity: true,
        allowFriendRequests: true
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        matchReminders: true,
        teamUpdates: true,
        friendActivity: true,
        marketingEmails: false
      },
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  });

  const onSubmit = async (data: SettingsFormData) => {
    if (!user) return;

    try {
      await updateProfile(user.id, {
        settings: data
      });
      toast.success('Settings updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gaming-card rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'privacy'
                ? 'bg-gaming-neon text-black'
                : 'bg-gaming-dark text-white hover:bg-gaming-neon/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Privacy
            </div>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'notifications'
                ? 'bg-gaming-neon text-black'
                : 'bg-gaming-dark text-white hover:bg-gaming-neon/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </div>
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'preferences'
                ? 'bg-gaming-neon text-black'
                : 'bg-gaming-dark text-white hover:bg-gaming-neon/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Preferences
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Visibility
                </label>
                <select
                  {...register('privacy.profileVisibility')}
                  className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('privacy.showOnlineStatus')}
                    className="rounded border-gaming-neon/20 text-gaming-neon focus:ring-gaming-neon bg-gaming-dark"
                  />
                  <span className="text-white">Show Online Status</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('privacy.showGameActivity')}
                    className="rounded border-gaming-neon/20 text-gaming-neon focus:ring-gaming-neon bg-gaming-dark"
                  />
                  <span className="text-white">Show Game Activity</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('privacy.allowFriendRequests')}
                    className="rounded border-gaming-neon/20 text-gaming-neon focus:ring-gaming-neon bg-gaming-dark"
                  />
                  <span className="text-white">Allow Friend Requests</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('notifications.emailNotifications')}
                    className="rounded border-gaming-neon/20 text-gaming-neon focus:ring-gaming-neon bg-gaming-dark"
                  />
                  <span className="text-white">Email Notifications</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('notifications.pushNotifications')}
                    className="rounded border-gaming-neon/20 text-gaming-neon focus:ring-gaming-neon bg-gaming-dark"
                  />
                  <span className="text-white">Push Notifications</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('notifications.matchReminders')}
                    className="rounded border-gaming-neon/20 text-gaming-neon focus:ring-gaming-neon bg-gaming-dark"
                  />
                  <span className="text-white">Match Reminders</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('notifications.teamUpdates')}
                    className="rounded border-gaming-neon/20 text-gaming-neon focus:ring-gaming-neon bg-gaming-dark"
                  />
                  <span className="text-white">Team Updates</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('notifications.friendActivity')}
                    className="rounded border-gaming-neon/20 text-gaming-neon focus:ring-gaming-neon bg-gaming-dark"
                  />
                  <span className="text-white">Friend Activity</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('notifications.marketingEmails')}
                    className="rounded border-gaming-neon/20 text-gaming-neon focus:ring-gaming-neon bg-gaming-dark"
                  />
                  <span className="text-white">Marketing Emails</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Language
                </label>
                <select
                  {...register('language')}
                  className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                  <option value="pt">Português</option>
                  <option value="ru">Русский</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                  <option value="zh">中文</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  {...register('timezone')}
                  className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
                >
                  {Intl.supportedValuesOf('timeZone').map((timezone) => (
                    <option key={timezone} value={timezone}>
                      {timezone}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t border-gaming-neon/20">
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