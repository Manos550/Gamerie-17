import { collection, addDoc, doc, updateDoc, arrayUnion, arrayRemove, serverTimestamp, getDocs, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { useAuthStore } from './store';
import { toast } from 'react-toastify';
import { Post } from '../types';

// In-memory store for posts in demo mode
let userPosts: Post[] = [
  // Admin posts
  {
    id: 'admin-post-1',
    authorId: 'admin',
    authorName: 'Gamerie',
    authorImage: '/logo.svg',
    content: '🎮 Welcome to Gamerie! We\'re excited to announce our platform launch. Join our growing community of gamers, connect with teammates, and participate in tournaments. Stay tuned for upcoming features and events! #GamerieOfficial #GamingCommunity',
    media: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80'],
    likes: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'],
    comments: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 'admin-post-2',
    authorId: 'admin',
    authorName: 'Gamerie',
    authorImage: '/logo.svg',
    content: '🏆 Exciting news! Our first official tournament series starts next month. Get your teams ready for epic battles across multiple games. Registration opens next week! #GamingTournament #Esports',
    media: [],
    likes: ['user-1', 'user-3', 'user-5'],
    comments: [],
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  // User posts - Manos550
  {
    id: 'post-1',
    authorId: 'user-1',
    authorName: 'Manos550',
    authorImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200',
    content: 'Just hit Immortal rank in Valorant! The grind was real but totally worth it. Thanks to my amazing team for the support! 🎮🏆',
    media: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80'],
    likes: ['user-2', 'user-3', 'user-4'],
    comments: [],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  // NightStalker's posts
  {
    id: 'post-2',
    authorId: 'user-2',
    authorName: 'NightStalker',
    authorImage: 'https://images.unsplash.com/photo-1566411520896-01e7ca4726af?auto=format&fit=crop&q=80&w=200',
    content: 'New streaming setup is finally complete! Ready for some epic League of Legends action. Come hang out at twitch.tv/nightstalker 🎥',
    media: ['https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80'],
    likes: ['user-1', 'user-5'],
    comments: [],
    createdAt: new Date('2024-02-09'),
    updatedAt: new Date('2024-02-09')
  },
  // SakuraPro's posts
  {
    id: 'post-3',
    authorId: 'user-3',
    authorName: 'SakuraPro',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    content: 'Another tournament victory with the team! 🏆 The coordination and teamwork were on point today. GGs to all competitors!',
    media: [],
    likes: ['user-1', 'user-2', 'user-4', 'user-5'],
    comments: [],
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-08')
  },
  // ArcticWolf's posts
  {
    id: 'post-4',
    authorId: 'user-4',
    authorName: 'ArcticWolf',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    content: 'Looking for a CS2 coach to help improve my gameplay. Currently Global Elite but want to take it to the next level. DM if interested! 🎯',
    media: [],
    likes: ['user-1'],
    comments: [],
    createdAt: new Date('2024-02-07'),
    updatedAt: new Date('2024-02-07')
  },
  // PixelQueen's posts
  {
    id: 'post-5',
    authorId: 'user-5',
    authorName: 'PixelQueen',
    authorImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    content: 'New YouTube video is up! Check out my latest Valorant guide on advanced movement techniques. Link in bio! 🎮✨',
    media: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80'],
    likes: ['user-1', 'user-2', 'user-3'],
    comments: [],
    createdAt: new Date('2024-02-06'),
    updatedAt: new Date('2024-02-06')
  }
];

export const createPost = async (content: string, mediaFiles: File[] = []): Promise<void> => {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('User must be logged in to create a post');

  try {
    let mediaUrls: string[] = [];

    if (import.meta.env.MODE === 'development') {
      // Handle media files in demo mode
      mediaUrls = mediaFiles.map(file => URL.createObjectURL(file));

      const newPost: Post = {
        id: `post-${Date.now()}`,
        authorId: user.id,
        authorName: user.username,
        authorImage: user.profileImage,
        content,
        media: mediaUrls,
        likes: [],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      userPosts.unshift(newPost);
      toast.success('Post created successfully');
      return;
    }

    // Upload media files in production
    if (mediaFiles.length > 0) {
      mediaUrls = await Promise.all(
        mediaFiles.map(async (file) => {
          const fileRef = ref(storage, `posts/${Date.now()}-${file.name}`);
          await uploadBytes(fileRef, file);
          return getDownloadURL(fileRef);
        })
      );
    }

    // Create post in Firestore
    await addDoc(collection(db, 'posts'), {
      authorId: user.id,
      authorName: user.username,
      authorImage: user.profileImage,
      content,
      media: mediaUrls,
      likes: [],
      comments: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    toast.success('Post created successfully');
  } catch (error) {
    console.error('Error creating post:', error);
    toast.error('Failed to create post');
    throw error;
  }
};

export const getFeedPosts = async (): Promise<Post[]> => {
  if (import.meta.env.MODE === 'development') {
    return userPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
};

export const getWallPosts = async (userId: string): Promise<Post[]> => {
  if (import.meta.env.MODE === 'development') {
    return userPosts
      .filter(post => post.authorId === userId || (userId === 'admin' && post.authorId === 'admin'))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  const q = query(
    collection(db, 'posts'),
    where('authorId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
};

export const likePost = async (postId: string): Promise<void> => {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('User must be logged in to like a post');

  try {
    if (import.meta.env.MODE === 'development') {
      const post = userPosts.find(p => p.id === postId);
      if (post && !post.likes.includes(user.id)) {
        post.likes.push(user.id);
      }
      return;
    }

    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: arrayUnion(user.id)
    });
  } catch (error) {
    console.error('Error liking post:', error);
    toast.error('Failed to like post');
    throw error;
  }
};

export const unlikePost = async (postId: string): Promise<void> => {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('User must be logged in to unlike a post');

  try {
    if (import.meta.env.MODE === 'development') {
      const post = userPosts.find(p => p.id === postId);
      if (post) {
        post.likes = post.likes.filter(id => id !== user.id);
      }
      return;
    }

    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: arrayRemove(user.id)
    });
  } catch (error) {
    console.error('Error unliking post:', error);
    toast.error('Failed to unlike post');
    throw error;
  }
};

export const addComment = async (postId: string, content: string): Promise<void> => {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('User must be logged in to comment');

  try {
    const comment = {
      id: crypto.randomUUID(),
      authorId: user.id,
      authorName: user.username,
      authorImage: user.profileImage,
      content,
      likes: [],
      createdAt: new Date()
    };

    if (import.meta.env.MODE === 'development') {
      const post = userPosts.find(p => p.id === postId);
      if (post) {
        post.comments.push(comment);
      }
      toast.success('Comment added successfully');
      return;
    }

    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      comments: arrayUnion(comment)
    });
    toast.success('Comment added successfully');
  } catch (error) {
    console.error('Error adding comment:', error);
    toast.error('Failed to add comment');
    throw error;
  }
};

export const likeComment = async (postId: string, commentId: string): Promise<void> => {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('User must be logged in to like a comment');

  try {
    if (import.meta.env.MODE === 'development') {
      const post = userPosts.find(p => p.id === postId);
      if (post) {
        const comment = post.comments.find(c => c.id === commentId);
        if (comment) {
          if (comment.likes.includes(user.id)) {
            comment.likes = comment.likes.filter(id => id !== user.id);
          } else {
            comment.likes.push(user.id);
          }
        }
      }
      return;
    }

    const postRef = doc(db, 'posts', postId);
    const post = (await getDocs(query(collection(db, 'posts'), where('id', '==', postId)))).docs[0].data() as Post;
    const updatedComments = post.comments.map(comment => {
      if (comment.id === commentId) {
        const likes = comment.likes.includes(user.id)
          ? comment.likes.filter(id => id !== user.id)
          : [...comment.likes, user.id];
        return { ...comment, likes };
      }
      return comment;
    });

    await updateDoc(postRef, { comments: updatedComments });
  } catch (error) {
    console.error('Error liking comment:', error);
    toast.error('Failed to like comment');
    throw error;
  }
};