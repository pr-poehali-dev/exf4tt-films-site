const API_URL = 'https://functions.poehali.dev/cc53ba28-c157-46d4-b1a6-7d38285ce1d4';

export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string[];
  rating: number;
  votes: number;
  description: string;
  image_url: string;
  video_url?: string;
  hashtags?: string[];
  is_saved?: boolean;
}

export interface User {
  id: number;
  username: string;
  password?: string;
  role: 'user' | 'admin';
}

export const api = {
  async getMovies(userId?: number): Promise<Movie[]> {
    const url = userId 
      ? `${API_URL}?action=getMovies&userId=${userId}`
      : `${API_URL}?action=getMovies`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch movies');
    return response.json();
  },

  async addMovie(movie: Omit<Movie, 'id' | 'votes' | 'is_saved'>): Promise<Movie> {
    const response = await fetch(`${API_URL}?action=addMovie`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: movie.title,
        year: movie.year,
        genre: movie.genre,
        rating: movie.rating,
        description: movie.description,
        imageUrl: movie.image_url,
        videoUrl: movie.video_url,
        hashtags: movie.hashtags
      })
    });
    if (!response.ok) throw new Error('Failed to add movie');
    return response.json();
  },

  async updateMovie(id: number, updates: Partial<Movie>): Promise<Movie> {
    const response = await fetch(`${API_URL}?action=updateMovie`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        title: updates.title,
        year: updates.year,
        genre: updates.genre,
        rating: updates.rating,
        description: updates.description,
        imageUrl: updates.image_url,
        videoUrl: updates.video_url,
        hashtags: updates.hashtags
      })
    });
    if (!response.ok) throw new Error('Failed to update movie');
    return response.json();
  },

  async deleteMovie(id: number): Promise<void> {
    const response = await fetch(`${API_URL}?action=deleteMovie`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!response.ok) throw new Error('Failed to delete movie');
  },

  async toggleSaved(userId: number, movieId: number, isSaved: boolean): Promise<void> {
    const response = await fetch(`${API_URL}?action=toggleSaved`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, movieId, isSaved })
    });
    if (!response.ok) throw new Error('Failed to toggle saved');
  },

  async login(username: string, password: string): Promise<User> {
    const response = await fetch(`${API_URL}?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to login');
    }
    return response.json();
  },

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}?action=getUsers`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async addUser(user: { username: string; password: string; role: 'user' | 'admin' }): Promise<User> {
    const response = await fetch(`${API_URL}?action=addUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add user');
    }
    return response.json();
  },

  async deleteUser(username: string): Promise<void> {
    const response = await fetch(`${API_URL}?action=deleteUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    if (!response.ok) throw new Error('Failed to delete user');
  }
};
