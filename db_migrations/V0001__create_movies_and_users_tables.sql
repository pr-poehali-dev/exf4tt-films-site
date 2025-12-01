CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    year INTEGER NOT NULL,
    genre TEXT[] NOT NULL,
    rating DECIMAL(3,1) DEFAULT 0.0,
    votes INTEGER DEFAULT 0,
    description TEXT,
    image_url TEXT,
    video_url TEXT,
    hashtags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_saved_movies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    movie_id INTEGER NOT NULL REFERENCES movies(id),
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, movie_id)
);

INSERT INTO users (username, password, role) VALUES 
    ('admin', 'admin', 'admin'),
    ('user', 'user', 'user')
ON CONFLICT (username) DO NOTHING;

INSERT INTO movies (title, year, genre, rating, votes, description, image_url, hashtags) VALUES 
    ('Темный рыцарь', 2008, ARRAY['Боевик', 'Драма', 'Криминал'], 9.0, 2456, 'Бэтмен поднимает ставки в войне с криминалом. С помощью лейтенанта Джима Гордона и прокурора Харви Дента он намерен очистить улицы Готэма от преступности.', 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500', ARRAY['супергерои', 'классика', 'готэм']),
    ('Начало', 2010, ARRAY['Фантастика', 'Триллер'], 8.8, 1893, 'Кобб — талантливый вор, лучший из лучших в опасном искусстве извлечения: он крадет ценные секреты из глубин подсознания во время сна.', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500', ARRAY['ноланомания', 'сны', 'интеллектуальное']),
    ('Матрица', 1999, ARRAY['Фантастика', 'Боевик'], 8.7, 1678, 'Жизнь Томаса Андерсона разделена на две части: днём он — самый обычный офисный работник, получающий нагоняи от начальства, а ночью превращается в хакера по имени Нео.', 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=500', ARRAY['киберпанк', 'философия', 'культовое']),
    ('Интерстеллар', 2014, ARRAY['Фантастика', 'Драма'], 8.6, 1523, 'Когда засуха приводит человечество к продовольственному кризису, коллектив исследователей и учёных отправляется сквозь червоточину в путешествие, чтобы превзойти прежние ограничения для космических путешествий человека.', 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500', ARRAY['космос', 'наука', 'ноланомания']),
    ('Побег из Шоушенка', 1994, ARRAY['Драма'], 9.3, 3021, 'Успешный банкир Энди Дюфрейн обвинён в убийстве собственной жены и её любовника. Оказавшись в тюрьме под названием Шоушенк, он сталкивается с жестокостью и беззаконием.', 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=500', ARRAY['надежда', 'дружба', 'лучший-фильм']),
    ('Форрест Гамп', 1994, ARRAY['Драма', 'Мелодрама'], 8.8, 1834, 'От лица главного героя Форреста Гампа, слабоумного безобидного человека с благородным и открытым сердцем, рассказывается история его необыкновенной жизни.', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500', ARRAY['вдохновляющее', 'америка', 'история']);
