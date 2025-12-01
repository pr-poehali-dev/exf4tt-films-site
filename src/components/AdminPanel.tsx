import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string[];
  rating: number;
  votes: number;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  hashtags?: string[];
  isSaved: boolean;
}

interface User {
  username: string;
  password: string;
  role: 'user' | 'admin';
}

interface AdminPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movies: Movie[];
  users: User[];
  onAddMovie: (movie: Omit<Movie, 'id' | 'votes' | 'isSaved'>) => void;
  onUpdateMovie: (id: number, movie: Partial<Movie>) => void;
  onDeleteMovie: (id: number) => void;
  onAddUser: (user: User) => void;
  onDeleteUser: (username: string) => void;
}

export default function AdminPanel({ 
  open, 
  onOpenChange, 
  movies, 
  users,
  onAddMovie, 
  onUpdateMovie, 
  onDeleteMovie,
  onAddUser,
  onDeleteUser
}: AdminPanelProps) {
  const [newMovie, setNewMovie] = useState({
    title: '',
    year: new Date().getFullYear(),
    genre: '',
    rating: 0,
    description: '',
    imageUrl: '',
    videoUrl: '',
    hashtags: ''
  });

  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' as 'user' | 'admin' });

  const handleAddMovie = () => {
    if (newMovie.title && newMovie.description) {
      onAddMovie({
        title: newMovie.title,
        year: newMovie.year,
        genre: newMovie.genre.split(',').map(g => g.trim()),
        rating: newMovie.rating,
        description: newMovie.description,
        imageUrl: newMovie.imageUrl || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500',
        videoUrl: newMovie.videoUrl,
        hashtags: newMovie.hashtags ? newMovie.hashtags.split(',').map(h => h.trim()) : []
      });
      setNewMovie({
        title: '',
        year: new Date().getFullYear(),
        genre: '',
        rating: 0,
        description: '',
        imageUrl: '',
        videoUrl: '',
        hashtags: ''
      });
    }
  };

  const handleUpdateMovie = () => {
    if (editingMovie) {
      onUpdateMovie(editingMovie.id, editingMovie);
      setEditingMovie(null);
    }
  };

  const handleAddUser = () => {
    if (newUser.username && newUser.password) {
      onAddUser(newUser);
      setNewUser({ username: '', password: '', role: 'user' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-3xl font-montserrat gradient-red bg-clip-text text-transparent">
            Панель администратора
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="movies" className="mt-4">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="movies" className="data-[state=active]:bg-primary">
              <Icon name="Film" size={18} className="mr-2" />
              Фильмы
            </TabsTrigger>
            <TabsTrigger value="add-movie" className="data-[state=active]:bg-primary">
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить фильм
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary">
              <Icon name="Users" size={18} className="mr-2" />
              Пользователи
            </TabsTrigger>
          </TabsList>

          <TabsContent value="movies" className="space-y-4 mt-4">
            <div className="grid gap-4">
              {movies.map(movie => (
                <Card key={movie.id} className="bg-muted border-border">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="font-montserrat">{movie.title}</CardTitle>
                        <div className="flex gap-2 flex-wrap">
                          {movie.genre.map(g => (
                            <Badge key={g} variant="secondary">{g}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingMovie(movie)}
                        >
                          <Icon name="Edit" size={16} className="mr-2" />
                          Изменить
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => onDeleteMovie(movie.id)}
                        >
                          <Icon name="Trash2" size={16} className="mr-2" />
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Год:</span> {movie.year}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Рейтинг:</span> {movie.rating}
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Описание:</span> {movie.description}
                      </div>
                      {movie.hashtags && movie.hashtags.length > 0 && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Хэштеги:</span> {movie.hashtags.join(', ')}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add-movie" className="space-y-4 mt-4">
            <Card className="bg-muted border-border">
              <CardHeader>
                <CardTitle className="font-montserrat">
                  {editingMovie ? 'Редактировать фильм' : 'Добавить новый фильм'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Название</Label>
                    <Input
                      value={editingMovie ? editingMovie.title : newMovie.title}
                      onChange={(e) => editingMovie 
                        ? setEditingMovie({...editingMovie, title: e.target.value})
                        : setNewMovie({...newMovie, title: e.target.value})
                      }
                      placeholder="Название фильма"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Год выпуска</Label>
                    <Input
                      type="number"
                      value={editingMovie ? editingMovie.year : newMovie.year}
                      onChange={(e) => editingMovie
                        ? setEditingMovie({...editingMovie, year: parseInt(e.target.value)})
                        : setNewMovie({...newMovie, year: parseInt(e.target.value)})
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Жанры (через запятую)</Label>
                    <Input
                      value={editingMovie ? editingMovie.genre.join(', ') : newMovie.genre}
                      onChange={(e) => editingMovie
                        ? setEditingMovie({...editingMovie, genre: e.target.value.split(',').map(g => g.trim())})
                        : setNewMovie({...newMovie, genre: e.target.value})
                      }
                      placeholder="Боевик, Драма, Триллер"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Рейтинг (0-10)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={editingMovie ? editingMovie.rating : newMovie.rating}
                      onChange={(e) => editingMovie
                        ? setEditingMovie({...editingMovie, rating: parseFloat(e.target.value)})
                        : setNewMovie({...newMovie, rating: parseFloat(e.target.value)})
                      }
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>Описание</Label>
                    <Textarea
                      value={editingMovie ? editingMovie.description : newMovie.description}
                      onChange={(e) => editingMovie
                        ? setEditingMovie({...editingMovie, description: e.target.value})
                        : setNewMovie({...newMovie, description: e.target.value})
                      }
                      placeholder="Описание фильма"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>URL обложки</Label>
                    <Input
                      value={editingMovie ? editingMovie.imageUrl : newMovie.imageUrl}
                      onChange={(e) => editingMovie
                        ? setEditingMovie({...editingMovie, imageUrl: e.target.value})
                        : setNewMovie({...newMovie, imageUrl: e.target.value})
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>URL видео</Label>
                    <Input
                      value={editingMovie ? (editingMovie.videoUrl || '') : newMovie.videoUrl}
                      onChange={(e) => editingMovie
                        ? setEditingMovie({...editingMovie, videoUrl: e.target.value})
                        : setNewMovie({...newMovie, videoUrl: e.target.value})
                      }
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>Хэштеги (через запятую)</Label>
                    <Input
                      value={editingMovie ? (editingMovie.hashtags?.join(', ') || '') : newMovie.hashtags}
                      onChange={(e) => editingMovie
                        ? setEditingMovie({...editingMovie, hashtags: e.target.value.split(',').map(h => h.trim())})
                        : setNewMovie({...newMovie, hashtags: e.target.value})
                      }
                      placeholder="триллер, детектив, классика"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={editingMovie ? handleUpdateMovie : handleAddMovie} 
                    className="gradient-red"
                  >
                    <Icon name={editingMovie ? "Save" : "Plus"} size={18} className="mr-2" />
                    {editingMovie ? 'Сохранить изменения' : 'Добавить фильм'}
                  </Button>
                  {editingMovie && (
                    <Button 
                      onClick={() => setEditingMovie(null)} 
                      variant="outline"
                    >
                      Отмена
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4 mt-4">
            <Card className="bg-muted border-border">
              <CardHeader>
                <CardTitle className="font-montserrat">Создать пользователя</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Имя пользователя</Label>
                    <Input
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      placeholder="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Пароль</Label>
                    <Input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      placeholder="password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Роль</Label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value as 'user' | 'admin'})}
                      className="w-full h-10 px-3 rounded-md bg-background border border-border"
                    >
                      <option value="user">Пользователь</option>
                      <option value="admin">Администратор</option>
                    </select>
                  </div>
                </div>
                <Button onClick={handleAddUser} className="gradient-red">
                  <Icon name="UserPlus" size={18} className="mr-2" />
                  Создать пользователя
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold font-montserrat">Список пользователей</h3>
              {users.map(user => (
                <Card key={user.username} className="bg-muted border-border">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Icon name="User" size={24} className="text-primary" />
                      <div>
                        <p className="font-semibold">{user.username}</p>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                        </Badge>
                      </div>
                    </div>
                    {user.role !== 'admin' && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => onDeleteUser(user.username)}
                      >
                        <Icon name="Trash2" size={16} className="mr-2" />
                        Удалить
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
