export const STORAGE_KEYS = {
    conversationId: 'gen-ai.conversationId',
    messages: 'gen-ai.messages',
};

function readStorage(key, fallback) {
    if (typeof window === 'undefined') {
        return fallback;
    }

    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) {
            return fallback;
        }

        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

function writeStorage(key, value) {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadConversationId() {
    if (typeof window === 'undefined') {
        return '';
    }

    return window.localStorage.getItem(STORAGE_KEYS.conversationId) || '';
}

export function loadMessages() {
    const messages = readStorage(STORAGE_KEYS.messages, []);
    return Array.isArray(messages) ? messages : [];
}

export function saveConversationId(conversationId) {
    if (!conversationId) {
        clearConversationId();
        return;
    }

    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(STORAGE_KEYS.conversationId, conversationId);
}

export function clearConversationId() {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.removeItem(STORAGE_KEYS.conversationId);
}

export function saveMessages(messages) {
    writeStorage(STORAGE_KEYS.messages, messages);
}

export function clearMessages() {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.removeItem(STORAGE_KEYS.messages);
}