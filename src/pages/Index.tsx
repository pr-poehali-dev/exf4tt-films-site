import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  isSaved: boolean;
}

const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Темный рыцарь',
    year: 2008,
    genre: ['Боевик', 'Драма', 'Криминал'],
    rating: 9.0,
    votes: 2456,
    description: 'Бэтмен поднимает ставки в войне с криминалом. С помощью лейтенанта Джима Гордона и прокурора Харви Дента он намерен очистить улицы Готэма от преступности.',
    imageUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500',
    isSaved: false
  },
  {
    id: 2,
    title: 'Начало',
    year: 2010,
    genre: ['Фантастика', 'Триллер'],
    rating: 8.8,
    votes: 1893,
    description: 'Кобб — талантливый вор, лучший из лучших в опасном искусстве извлечения: он крадет ценные секреты из глубин подсознания во время сна.',
    imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500',
    isSaved: false
  },
  {
    id: 3,
    title: 'Матрица',
    year: 1999,
    genre: ['Фантастика', 'Боевик'],
    rating: 8.7,
    votes: 1678,
    description: 'Жизнь Томаса Андерсона разделена на две части: днём он — самый обычный офисный работник, получающий нагоняи от начальства, а ночью превращается в хакера по имени Нео.',
    imageUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=500',
    isSaved: true
  },
  {
    id: 4,
    title: 'Интерстеллар',
    year: 2014,
    genre: ['Фантастика', 'Драма'],
    rating: 8.6,
    votes: 1523,
    description: 'Когда засуха приводит человечество к продовольственному кризису, коллектив исследователей и учёных отправляется сквозь червоточину в путешествие, чтобы превзойти прежние ограничения для космических путешествий человека.',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500',
    isSaved: false
  },
  {
    id: 5,
    title: 'Побег из Шоушенка',
    year: 1994,
    genre: ['Драма'],
    rating: 9.3,
    votes: 3021,
    description: 'Успешный банкир Энди Дюфрейн обвинён в убийстве собственной жены и её любовника. Оказавшись в тюрьме под названием Шоушенк, он сталкивается с жестокостью и беззаконием.',
    imageUrl: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=500',
    isSaved: true
  },
  {
    id: 6,
    title: 'Форрест Гамп',
    year: 1994,
    genre: ['Драма', 'Мелодрама'],
    rating: 8.8,
    votes: 1834,
    description: 'От лица главного героя Форреста Гампа, слабоумного безобидного человека с благородным и открытым сердцем, рассказывается история его необыкновенной жизни.',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500',
    isSaved: false
  }
];

const genres = ['Все', 'Боевик', 'Драма', 'Фантастика', 'Криминал', 'Триллер', 'Мелодрама'];

export default function Index() {
  const [movies, setMovies] = useState<Movie[]>(mockMovies);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Все');
  const [activeTab, setActiveTab] = useState('home');

  const toggleSaved = (id: number) => {
    setMovies(movies.map(m => m.id === id ? { ...m, isSaved: !m.isSaved } : m));
  };

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'Все' || movie.genre.includes(selectedGenre);
    const matchesTab = activeTab === 'home' || (activeTab === 'saved' && movie.isSaved);
    return matchesSearch && matchesGenre && matchesTab;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold font-montserrat text-shadow-red gradient-red bg-clip-text text-transparent">
              EXF4TT FILMS
            </h1>
            
            <div className="flex items-center gap-4 flex-1 max-w-2xl mx-8">
              <div className="relative flex-1">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Поиск по названию, жанру или актёрам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hover:text-primary transition-colors">
                <Icon name="Bell" size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary transition-colors">
                <Icon name="User" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="container mx-auto px-4 py-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-card">
          <TabsTrigger value="home" className="data-[state=active]:bg-primary">
            <Icon name="Home" size={18} className="mr-2" />
            Главная
          </TabsTrigger>
          <TabsTrigger value="catalog" className="data-[state=active]:bg-primary">
            <Icon name="Grid3x3" size={18} className="mr-2" />
            Каталог
          </TabsTrigger>
          <TabsTrigger value="saved" className="data-[state=active]:bg-primary">
            <Icon name="Bookmark" size={18} className="mr-2" />
            Сохранённые
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="space-y-8">
          <section className="relative h-[600px] rounded-xl overflow-hidden animate-fade-in">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: 'url(https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1200)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            </div>
            <div className="relative h-full flex flex-col justify-end p-12 space-y-4">
              <Badge className="w-fit bg-primary text-primary-foreground">🔥 В тренде</Badge>
              <h2 className="text-6xl font-bold font-montserrat text-shadow-red">Темный рыцарь</h2>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>2008</span>
                <span>•</span>
                <span>Боевик, Драма, Криминал</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Icon name="Star" size={18} className="text-primary fill-primary" />
                  <span className="text-foreground font-semibold">9.0</span>
                </div>
              </div>
              <p className="max-w-2xl text-lg">
                Бэтмен поднимает ставки в войне с криминалом. С помощью лейтенанта Джима Гордона и прокурора Харви Дента он намерен очистить улицы Готэма от преступности.
              </p>
              <div className="flex gap-4">
                <Button className="gradient-red hover:opacity-90 text-lg px-8 py-6">
                  <Icon name="Play" size={20} className="mr-2" />
                  Смотреть
                </Button>
                <Button variant="outline" className="text-lg px-8 py-6 border-primary hover:bg-primary/10">
                  <Icon name="Info" size={20} className="mr-2" />
                  Подробнее
                </Button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold font-montserrat">Новинки</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMovies.slice(0, 4).map((movie, index) => (
                <Card 
                  key={movie.id} 
                  className="group hover-lift bg-card border-border overflow-hidden cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img 
                      src={movie.imageUrl} 
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm hover:bg-black/80"
                      onClick={() => toggleSaved(movie.id)}
                    >
                      <Icon 
                        name="Bookmark" 
                        size={18} 
                        className={movie.isSaved ? 'fill-primary text-primary' : 'text-white'}
                      />
                    </Button>
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <Button className="w-full gradient-red">
                        <Icon name="Play" size={18} className="mr-2" />
                        Смотреть
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold font-montserrat mb-2 line-clamp-1">{movie.title}</h4>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{movie.year}</span>
                      <div className="flex items-center gap-1">
                        <Icon name="Star" size={14} className="text-primary fill-primary" />
                        <span className="text-foreground font-medium">{movie.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="catalog" className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? 'default' : 'outline'}
                onClick={() => setSelectedGenre(genre)}
                className={selectedGenre === genre ? 'gradient-red' : 'hover:border-primary'}
              >
                {genre}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie, index) => (
              <Card 
                key={movie.id} 
                className="group hover-lift bg-card border-border overflow-hidden cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img 
                    src={movie.imageUrl} 
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm hover:bg-black/80"
                    onClick={() => toggleSaved(movie.id)}
                  >
                    <Icon 
                      name="Bookmark" 
                      size={18} 
                      className={movie.isSaved ? 'fill-primary text-primary' : 'text-white'}
                    />
                  </Button>
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button className="w-full gradient-red">
                      <Icon name="Play" size={18} className="mr-2" />
                      Смотреть
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
                    <Icon name="Star" size={14} className="text-primary fill-primary" />
                    <span className="text-sm font-semibold">{movie.rating}</span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold font-montserrat mb-1 line-clamp-1">{movie.title}</h4>
                  <p className="text-sm text-muted-foreground">{movie.year}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          {filteredMovies.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <Icon name="Bookmark" size={64} className="mx-auto text-muted-foreground" />
              <h3 className="text-2xl font-bold font-montserrat">Нет сохранённых фильмов</h3>
              <p className="text-muted-foreground">Добавьте фильмы в избранное, чтобы они появились здесь</p>
              <Button onClick={() => setActiveTab('catalog')} className="gradient-red">
                Перейти в каталог
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredMovies.map((movie, index) => (
                <Card 
                  key={movie.id} 
                  className="group hover-lift bg-card border-border overflow-hidden cursor-pointer animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img 
                      src={movie.imageUrl} 
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm hover:bg-black/80"
                      onClick={() => toggleSaved(movie.id)}
                    >
                      <Icon 
                        name="Bookmark" 
                        size={18} 
                        className="fill-primary text-primary"
                      />
                    </Button>
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <Button className="w-full gradient-red">
                        <Icon name="Play" size={18} className="mr-2" />
                        Смотреть
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
                      <Icon name="Star" size={14} className="text-primary fill-primary" />
                      <span className="text-sm font-semibold">{movie.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold font-montserrat mb-1 line-clamp-1">{movie.title}</h4>
                    <p className="text-sm text-muted-foreground">{movie.year}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
