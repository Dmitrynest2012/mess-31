const CACHE_NAME = 'my-site-v1';

const ASSETS = [
  './', 
  'index.html',
  'styles.css',
  'script.js',
  'time.js',
  'sw.js',
  'data.js',
  'config.js',
  'settings.js',
  'xlsx.full.min.js',
  'message_love.ico',
  'data-message.xlsx',
  'img/message-base-1.png',
  'img/message-random-1.jpg',
  'music/in_message_music.mp3',
  'sound_of_a_bell_2.wav',
  'sound_of_a_bell.mp3',
  'sound_of_interval_end.mp3',
  'warning.mp3',
  'sound_of_notification.mp3',
  'quatrains_about_the_message.xlsx',
  // КРИТИЧЕСКИ ВАЖНО: Добавляем иконки из manifest.json для валидации PWA
  'images/icon-192.png',
  'images/icon-512.png'
];

const EXCEL_FILES = ['data-message.xlsx', 'quatrains_about_the_message.xlsx'];
const ONE_DAY = 24 * 60 * 60 * 1000;

// 1. Установка: фоновая загрузка ядра сайта (ИСПРАВЛЕНО)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Используем Promise.all для контроля полной загрузки всех ресурсов
      return Promise.all(
        ASSETS.map(url => {
          return cache.add(url).catch(err => {
            console.warn(`Не удалось закэшировать при установке: ${url}`, err);
          });
        })
      );
    })
  );
});

// 2. Активация: очистка старых версий кэша (БЕЗ ИЗМЕНЕНИЙ)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : null)
    )).then(() => self.clients.claim())
  );
});

// 3. Обработка запросов (Fetch)
self.addEventListener('fetch', (event) => {
  // Игнорируем запросы к чужим сервисам (расширения, метрика и т.д.)
  if (!event.request.url.startsWith(self.location.origin)) return;

  const url = new URL(event.request.url);
  const isExcel = EXCEL_FILES.some(path => url.pathname.endsWith(path));

  // --- ЛОГИКА ДЛЯ EXCEL (ИСПРАВЛЕНО) ---
  if (isExcel) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);
        const now = Date.now();
        const lastChecked = cachedResponse ? parseInt(cachedResponse.headers.get('date-cached') || 0) : 0;

        // ИСПРАВЛЕНО: Если файл свежий (меньше суток), СРАЗУ отдаем его из кэша, не дергая сеть
        if (cachedResponse && (now - lastChecked < ONE_DAY)) {
          return cachedResponse;
        }

        // Если прошло > 24 часов или файла нет — идем в сеть и обновляем кэш
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.ok) {
            const newHeaders = new Headers(networkResponse.headers);
            newHeaders.append('date-cached', now.toString());
            
            const responseToSave = new Response(await networkResponse.blob(), {
              status: networkResponse.status,
              statusText: networkResponse.statusText,
              headers: newHeaders
            });

            await cache.put(event.request, responseToSave.clone());
            return responseToSave;
          }
          return cachedResponse || networkResponse;
        } catch (err) {
          return cachedResponse; // Оффлайн режим
        }
      })()
    );
    return;
  }

  // --- ОБЩАЯ ЛОГИКА (Сначала Кэш, Фоновое обновление - БЕЗ ИЗМЕНЕНИЙ) ---
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);

      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse.ok) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(() => {});

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. Принудительное обновление из основного JS (БЕЗ ИЗМЕНЕНИЙ)
self.addEventListener('message', (event) => {
  if (event.data === 'FORCE_UPDATE_EXCEL') {
    caches.open(CACHE_NAME).then((cache) => {
      EXCEL_FILES.forEach(file => {
        cache.keys().then(keys => {
          keys.forEach(request => {
            if (request.url.includes(file)) cache.delete(request);
          });
        });
      });
    });
  }
});

