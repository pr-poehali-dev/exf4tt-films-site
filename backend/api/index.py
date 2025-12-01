import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from decimal import Decimal
from datetime import datetime

def json_serial(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError(f"Type {type(obj)} not serializable")

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для работы с фильмами и пользователями
    Args: event с httpMethod, body, queryStringParameters
    Returns: HTTP response с данными
    '''
    method: str = event.get('httpMethod', 'GET')
    query_params = event.get('queryStringParameters') or {}
    action = query_params.get('action', '')
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
    }
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if action == 'getMovies':
            cur.execute('SELECT * FROM movies ORDER BY created_at DESC')
            movies = cur.fetchall()
            
            user_id = query_params.get('userId')
            if user_id:
                cur.execute(
                    'SELECT movie_id FROM user_saved_movies WHERE user_id = %s',
                    (int(user_id),)
                )
                saved_ids = [row['movie_id'] for row in cur.fetchall()]
                for movie in movies:
                    movie['is_saved'] = movie['id'] in saved_ids
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps([dict(m) for m in movies], ensure_ascii=False, default=json_serial),
                'isBase64Encoded': False
            }
        
        elif action == 'addMovie' and method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            cur.execute(
                '''INSERT INTO movies (title, year, genre, rating, description, image_url, video_url, hashtags)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING *''',
                (
                    body_data['title'],
                    body_data['year'],
                    body_data['genre'],
                    body_data.get('rating', 0),
                    body_data['description'],
                    body_data.get('imageUrl', ''),
                    body_data.get('videoUrl', ''),
                    body_data.get('hashtags', [])
                )
            )
            new_movie = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(dict(new_movie), ensure_ascii=False, default=json_serial),
                'isBase64Encoded': False
            }
        
        elif action == 'updateMovie' and method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            movie_id = body_data['id']
            
            update_fields = []
            values = []
            
            if 'title' in body_data:
                update_fields.append('title = %s')
                values.append(body_data['title'])
            if 'year' in body_data:
                update_fields.append('year = %s')
                values.append(body_data['year'])
            if 'genre' in body_data:
                update_fields.append('genre = %s')
                values.append(body_data['genre'])
            if 'rating' in body_data:
                update_fields.append('rating = %s')
                values.append(body_data['rating'])
            if 'description' in body_data:
                update_fields.append('description = %s')
                values.append(body_data['description'])
            if 'imageUrl' in body_data:
                update_fields.append('image_url = %s')
                values.append(body_data['imageUrl'])
            if 'videoUrl' in body_data:
                update_fields.append('video_url = %s')
                values.append(body_data['videoUrl'])
            if 'hashtags' in body_data:
                update_fields.append('hashtags = %s')
                values.append(body_data['hashtags'])
            
            update_fields.append('updated_at = CURRENT_TIMESTAMP')
            values.append(int(movie_id))
            
            query = f"UPDATE movies SET {', '.join(update_fields)} WHERE id = %s RETURNING *"
            cur.execute(query, tuple(values))
            updated_movie = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(dict(updated_movie), ensure_ascii=False, default=json_serial),
                'isBase64Encoded': False
            }
        
        elif action == 'deleteMovie' and method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            movie_id = body_data['id']
            
            cur.execute('DELETE FROM movies WHERE id = %s', (int(movie_id),))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        elif action == 'toggleSaved' and method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            user_id = body_data['userId']
            movie_id = body_data['movieId']
            is_saved = body_data.get('isSaved', False)
            
            if is_saved:
                cur.execute(
                    'INSERT INTO user_saved_movies (user_id, movie_id) VALUES (%s, %s) ON CONFLICT DO NOTHING',
                    (user_id, movie_id)
                )
            else:
                cur.execute(
                    'DELETE FROM user_saved_movies WHERE user_id = %s AND movie_id = %s',
                    (user_id, movie_id)
                )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        elif action == 'login' and method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            cur.execute(
                'SELECT * FROM users WHERE username = %s AND password = %s',
                (body_data['username'], body_data['password'])
            )
            user = cur.fetchone()
            
            if user:
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps(dict(user), ensure_ascii=False, default=json_serial),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'Invalid credentials'}),
                    'isBase64Encoded': False
                }
        
        elif action == 'getUsers':
            cur.execute('SELECT id, username, role, created_at FROM users ORDER BY created_at')
            users = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps([dict(u) for u in users], ensure_ascii=False, default=json_serial),
                'isBase64Encoded': False
            }
        
        elif action == 'addUser' and method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                'SELECT id FROM users WHERE username = %s',
                (body_data['username'],)
            )
            existing = cur.fetchone()
            
            if existing:
                return {
                    'statusCode': 409,
                    'headers': headers,
                    'body': json.dumps({'error': 'User already exists'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                'INSERT INTO users (username, password, role) VALUES (%s, %s, %s) RETURNING id, username, role',
                (body_data['username'], body_data['password'], body_data.get('role', 'user'))
            )
            new_user = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(dict(new_user), ensure_ascii=False, default=json_serial),
                'isBase64Encoded': False
            }
        
        elif action == 'deleteUser' and method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            username = body_data['username']
            
            cur.execute('DELETE FROM users WHERE username = %s', (username,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'error': 'Not found'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()