const API_BASE = '/api/chat';

async function requestJson(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
    }

    return data;
}

export function startConversation() {
    return requestJson('/start', { method: 'POST' });
}

export function sendChatMessage({ conversationId, message }) {
    return requestJson('/message', {
        method: 'POST',
        body: JSON.stringify({ conversationId, message }),
    });
}

export function fetchConversationHistory(conversationId) {
    return requestJson(`/history/${conversationId}`);
}

export function deleteConversation(conversationId) {
    return requestJson(`/${conversationId}`, { method: 'DELETE' });
}