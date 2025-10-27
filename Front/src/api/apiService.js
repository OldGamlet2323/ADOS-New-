// Front/src/api/apiService.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Універсальна функція-обгортка для fetch
const request = async (endpoint, method = 'GET', body = null, headers = {}) => {
    const token = localStorage.getItem('authToken');

    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            // Можна додати глобальну обробку помилок 401/403 тут
            if (response.status === 401) {
                // Наприклад, видалити токен і перезавантажити сторінку
                localStorage.removeItem('authToken');
                localStorage.removeItem('role');
                window.location.href = '/admin';
            }
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        // Повертаємо пустий результат для запитів DELETE або інших, що не мають тіла відповіді
        if (response.status === 204 || response.headers.get("content-length") === "0") {
            return;
        }

        return await response.json();
    } catch (error) {
        console.error(`API request failed: ${error}`);
        throw error;
    }
};

// Експортуємо функції для кожного ендпоінту
export const apiService = {
    // Auth
    login: (credentials) => request('/auth/login', 'POST', credentials),

    // Events
    getEvents: () => request('/api/events'),
    addEvent: (eventData) => request('/api/events', 'POST', eventData),
    deleteEvent: (id) => request(`/api/events/${id}`, 'DELETE'),

    // Instructions
    getInstructions: () => request('/api/instructions'),
    addInstruction: (instructionData) => request('/api/instructions', 'POST', instructionData),
    deleteInstruction: (id) => request(`/api/instructions/${id}`, 'DELETE'),

    // Signals
    getSignals: () => request('/api/signals'),
    addSignal: (signalData) => request('/api/signals', 'POST', signalData),
    deleteSignal: (id) => request(`/api/signals/${id}`, 'DELETE'),

    // Reports
    getReports: () => request('/api/reports'),
    addReport: (reportData) => request('/api/reports', 'POST', reportData),
    deleteReport: (id) => request(`/api/reports/${id}`, 'DELETE'),
    markReportAsDone: (id) => request(`/api/reports/${id}/done`, 'PUT'),

    // Documents
    getDocuments: (role) => request(`/api/documents?sendTo=${role}`),
    // Додайте тут інші методи, наприклад, для завантаження файлів, якщо потрібно
};