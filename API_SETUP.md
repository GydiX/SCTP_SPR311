# Настройка API для плейлистов

## Описание
API для сохранения плейлистов было успешно подключено к проекту Spotify Clone. Теперь плейлисты сохраняются в базе данных PostgreSQL вместо локального хранилища браузера.

## Что было добавлено

### Backend (WebWorker)
1. **Сущности базы данных:**
   - `PlaylistEntity` - основная сущность плейлиста
   - `PlaylistTrackEntity` - сущность трека в плейлисте

2. **API контроллер:**
   - `PlaylistsController` - REST API для работы с плейлистами
   - Эндпоинты:
     - `GET /api/playlists` - получить все плейлисты пользователя
     - `GET /api/playlists/{id}` - получить плейлист по ID
     - `POST /api/playlists` - создать новый плейлист
     - `PUT /api/playlists/{id}` - обновить плейлист
     - `DELETE /api/playlists/{id}` - удалить плейлист
     - `POST /api/playlists/{id}/tracks` - добавить трек в плейлист
     - `DELETE /api/playlists/{id}/tracks/{trackId}` - удалить трек из плейлиста

3. **Модели:**
   - `PlaylistModel` - модель для API ответов
   - `CreatePlaylistModel` - модель для создания плейлиста
   - `AddTrackToPlaylistModel` - модель для добавления трека
   - `UpdatePlaylistModel` - модель для обновления плейлиста

4. **Миграция базы данных:**
   - Создана миграция `AddPlaylistsTables` для добавления таблиц плейлистов

### Frontend (React)
1. **API сервис:**
   - `playlistsApi.ts` - сервис для работы с API плейлистов
   - Заменил `playlistsLocal.ts` во всех компонентах

2. **Обновленные компоненты:**
   - `PlaylistsPage.tsx` - теперь использует API вместо localStorage
   - `PlaylistView.tsx` - обновлен для работы с API
   - `AddToPlaylist.tsx` - обновлен для работы с API

## Настройка

### 1. Настройка переменных окружения
Создайте файл `.env` в папке `my-react-app` со следующим содержимым:
```
VITE_API_URL=http://localhost:5000
```

### 2. Применение миграции базы данных
Выполните команду в папке `WebWorker/WebWorker`:
```bash
dotnet ef database update
```

### 3. Запуск приложения
1. Запустите backend:
   ```bash
   cd WebWorker/WebWorker
   dotnet run
   ```

2. Запустите frontend:
   ```bash
   cd my-react-app
   npm run dev
   ```

## Особенности реализации

1. **Аутентификация:** Все API эндпоинты требуют аутентификации через JWT токен
2. **Авторизация:** Пользователи могут работать только со своими плейлистами
3. **Валидация:** Добавлена валидация входных данных
4. **Обработка ошибок:** Реализована обработка ошибок на фронтенде
5. **Уникальность треков:** Трек не может быть добавлен в плейлист дважды

## API Документация

### Создание плейлиста
```http
POST /api/playlists
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "My Playlist"
}
```

### Добавление трека в плейлист
```http
POST /api/playlists/{playlistId}/tracks
Content-Type: application/json
Authorization: Bearer <token>

{
  "trackId": "track123",
  "title": "Song Title",
  "artist": "Artist Name",
  "durationMs": 180000
}
```

### Получение всех плейлистов
```http
GET /api/playlists
Authorization: Bearer <token>
```

## Безопасность

- Все эндпоинты защищены аутентификацией
- Пользователи могут работать только со своими плейлистами
- Валидация входных данных на сервере
- Защита от SQL инъекций через Entity Framework
