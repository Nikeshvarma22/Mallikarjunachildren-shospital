// Service Worker for Mallikarjuna Children Hospital
// Provides offline functionality and advanced caching

const CACHE_NAME = 'mallikarjuna-hospital-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles-minified.css',
    '/script-optimized.js',
    '/images/logo.jpg.png',
    '/images/dr-gopathi.jpg.png',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500;600&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Error caching static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                // Return cached version if available
                if (cachedResponse) {
                    console.log('Serving from cache:', request.url);
                    return cachedResponse;
                }

                // Otherwise fetch from network
                return fetch(request)
                    .then(response => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Cache dynamic content
                        caches.open(DYNAMIC_CACHE)
                            .then(cache => {
                                // Only cache images, CSS, JS, and HTML
                                if (request.url.match(/\.(css|js|png|jpg|jpeg|gif|svg|webp|html)$/)) {
                                    console.log('Caching dynamic content:', request.url);
                                    cache.put(request, responseToCache);
                                }
                            });

                        return response;
                    })
                    .catch(error => {
                        console.log('Network request failed:', request.url, error);
                        
                        // Return offline page for navigation requests
                        if (request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                        
                        // Return a fallback for images
                        if (request.destination === 'image') {
                            return new Response(
                                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Image not available</text></svg>',
                                { headers: { 'Content-Type': 'image/svg+xml' } }
                            );
                        }
                        
                        throw error;
                    });
            })
    );
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'appointment-sync') {
        console.log('Background sync for appointments');
        event.waitUntil(
            // Handle offline appointment submissions
            handleOfflineAppointments()
        );
    }
});

// Handle offline appointment submissions
async function handleOfflineAppointments() {
    try {
        // Get stored offline appointments
        const offlineAppointments = await getOfflineAppointments();
        
        for (const appointment of offlineAppointments) {
            try {
                // Try to submit appointment
                const response = await fetch('/api/appointments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(appointment)
                });
                
                if (response.ok) {
                    // Remove from offline storage
                    await removeOfflineAppointment(appointment.id);
                    console.log('Offline appointment synced:', appointment.id);
                }
            } catch (error) {
                console.log('Failed to sync appointment:', appointment.id, error);
            }
        }
    } catch (error) {
        console.error('Error handling offline appointments:', error);
    }
}

// Store appointment offline
async function storeOfflineAppointment(appointment) {
    try {
        const db = await openDB();
        const transaction = db.transaction(['appointments'], 'readwrite');
        const store = transaction.objectStore('appointments');
        
        appointment.id = Date.now(); // Simple ID generation
        appointment.timestamp = new Date().toISOString();
        
        await store.add(appointment);
        console.log('Appointment stored offline:', appointment.id);
    } catch (error) {
        console.error('Error storing appointment offline:', error);
    }
}

// Get offline appointments
async function getOfflineAppointments() {
    try {
        const db = await openDB();
        const transaction = db.transaction(['appointments'], 'readonly');
        const store = transaction.objectStore('appointments');
        
        return await store.getAll();
    } catch (error) {
        console.error('Error getting offline appointments:', error);
        return [];
    }
}

// Remove offline appointment
async function removeOfflineAppointment(id) {
    try {
        const db = await openDB();
        const transaction = db.transaction(['appointments'], 'readwrite');
        const store = transaction.objectStore('appointments');
        
        await store.delete(id);
    } catch (error) {
        console.error('Error removing offline appointment:', error);
    }
}

// Open IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('MallikarjunaHospitalDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create appointments store
            if (!db.objectStoreNames.contains('appointments')) {
                const store = db.createObjectStore('appointments', { keyPath: 'id' });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
    });
}

// Push notification handling
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/images/logo.jpg.png',
            badge: '/images/logo.jpg.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey
            },
            actions: [
                {
                    action: 'explore',
                    title: 'View Details',
                    icon: '/images/logo.jpg.png'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: '/images/logo.jpg.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

console.log('Service Worker loaded successfully');
