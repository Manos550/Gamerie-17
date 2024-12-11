import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Image, X, Smile, Hash } from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { createPost } from '../../lib/posts';
import { useQueryClient } from '@tanstack/react-query';

const postSchema = z.object({
  content: z.string().min(1, 'Post content is required'),
  media: z.instanceof(FileList).optional()
});

type PostFormData = z.infer<typeof postSchema>;

export default function CreatePost() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<PostFormData>({
    resolver: zodResolver(postSchema)
  });

  const mediaFiles = watch('media');

  React.useEffect(() => {
    if (mediaFiles?.length) {
      const urls = Array.from(mediaFiles).map(file => URL.createObjectURL(file));
      setPreview(urls);
      return () => urls.forEach(url => URL.revokeObjectURL(url));
    }
  }, [mediaFiles]);

  const onSubmit = async (data: PostFormData) => {
    try {
      await createPost(data.content, Array.from(data.media || []));
      reset();
      setPreview([]);
      // Invalidate and refetch both feed and wall posts
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['feed'] }),
        queryClient.invalidateQueries({ queryKey: ['wall-posts'] })
      ]);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gaming-card rounded-lg border border-gaming-neon/20 p-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-1">
          <textarea
            {...register('content')}
            placeholder="Share your gaming moments..."
            className="w-full bg-gaming-dark/50 rounded-lg p-2.5 text-white placeholder-gray-400 border border-gaming-neon/20 focus:border-gaming-neon focus:ring-0 resize-none min-h-[60px]"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-gaming-accent">{errors.content.message}</p>
          )}

          {preview.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {preview.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt=""
                    className="rounded-lg w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(prev => prev.filter((_, i) => i !== index));
                      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                      if (input) input.value = '';
                    }}
                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-gaming-neon/20 pt-2">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-gray-400 hover:text-gaming-neon cursor-pointer transition-colors">
              <Image className="w-4 h-4" />
              <span className="text-xs font-medium">Media</span>
              <input
                type="file"
                {...register('media')}
                className="hidden"
                accept="image/*"
                multiple
              />
            </label>
            <button
              type="button"
              className="flex items-center gap-1.5 text-gray-400 hover:text-gaming-neon transition-colors"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="w-4 h-4" />
              <span className="text-xs font-medium">Emoji</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 text-gray-400 hover:text-gaming-neon transition-colors"
            >
              <Hash className="w-4 h-4" />
              <span className="text-xs font-medium">Tags</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-3 py-1 bg-gaming-neon text-black rounded-full text-xs font-medium hover:bg-gaming-neon/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Posting...' : 'Share'}
          </button>
        </div>
      </form>
    </div>
  );
}