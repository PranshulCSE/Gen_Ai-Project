import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const STORAGE_KEYS = {
    conversationId: 'gen-ai.conversationId',
    messages: 'gen-ai.messages',
};

function formatTime(value) {
    return new Date(value).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
    });
}

function loadStoredMessages() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEYS.messages);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function loadStoredConversationId() {
    return window.localStorage.getItem(STORAGE_KEYS.conversationId) || '';
}

export default function App() {
    const [conversationId, setConversationId] = useState('');
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('Starting fresh chat');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setConversationId(loadStoredConversationId());
        setMessages(loadStoredMessages());
    }, []);

    useEffect(() => {
        const storedConversationId = loadStoredConversationId();

        if (!storedConversationId) {
            return;
        }

        let cancelled = false;

        async function loadConversationHistory() {
            try {
                const response = await fetch(`/api/chat/history/${storedConversationId}`);

                if (!response.ok) {
                    return;
                }

                const data = await response.json();
                if (cancelled || !Array.isArray(data.messages)) {
                    return;
                }

                setConversationId(data.conversationId || storedConversationId);
                setMessages(
                    data.messages.map((message) => ({
                        role: message.role === 'model' ? 'assistant' : 'user',
                        content: message.parts,
                        timestamp: message.timestamp || new Date().toISOString(),
                    })),
                );
                setStatus('Loaded saved chat');
            } catch {
                return;
            }
        }

        loadConversationHistory();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!conversationId) {
            window.localStorage.removeItem(STORAGE_KEYS.conversationId);
            return;
        }

        window.localStorage.setItem(STORAGE_KEYS.conversationId, conversationId);
    }, [conversationId]);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const hasConversation = useMemo(() => Boolean(conversationId), [conversationId]);

    async function startConversation() {
        const response = await fetch('/api/chat/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Failed to start conversation');
        }

        const data = await response.json();
        setConversationId(data.conversationId);
        return data.conversationId;
    }

    async function sendMessage(event) {
        event.preventDefault();

        const trimmed = input.trim();
        if (!trimmed || isLoading) {
            return;
        }

        setIsLoading(true);
        setStatus('Sending message...');
        setInput('');

        const userMessage = {
            role: 'user',
            content: trimmed,
            timestamp: new Date().toISOString(),
        };

        setMessages((current) => [...current, userMessage]);

        try {
            let activeConversationId = conversationId;
            if (!activeConversationId) {
                activeConversationId = await startConversation();
            }

            const response = await fetch('/api/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: activeConversationId,
                    message: trimmed,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Message request failed');
            }

            const data = await response.json();
            setConversationId(data.conversationId);

            const assistantMessage = {
                role: 'assistant',
                content: data.reply,
                timestamp: new Date().toISOString(),
            };

            setMessages((current) => [...current, assistantMessage]);
            setStatus('Ready');
        } catch (error) {
            setMessages((current) => [
                ...current,
                {
                    role: 'assistant',
                    content: error.message || 'Something went wrong while sending the message.',
                    timestamp: new Date().toISOString(),
                    isError: true,
                },
            ]);
            setStatus('Error sending message');
        } finally {
            setIsLoading(false);
        }
    }

    function resetChat() {
        setConversationId('');
        setMessages([]);
        setInput('');
        setStatus('Starting fresh chat');
        window.localStorage.removeItem(STORAGE_KEYS.conversationId);
        window.localStorage.removeItem(STORAGE_KEYS.messages);
    }

    return (
        <main className="app-shell">
            <section className="chat-card">
                <header className="chat-header">
                    <div>
                        <p className="eyebrow">Gen AI Chat</p>
                        <h1>Simple chatbot interface</h1>
                        <p className="subtle">A clean chat UI connected to your Gemini backend.</p>
                    </div>
                    <div className="header-actions">
                        <span className={`status-badge ${isLoading ? 'pending' : 'idle'}`}>{status}</span>
                        <button type="button" className="ghost-button" onClick={resetChat}>
                            New chat
                        </button>
                    </div>
                </header>

                <section className="chat-body" aria-label="Chat messages">
                    {messages.length === 0 ? (
                        <div className="empty-state">
                            <h2>Start the conversation</h2>
                            <p>Ask something and the assistant will reply in the thread below.</p>
                            <div className="chips">
                                <button type="button" onClick={() => setInput('Explain AI in simple terms')}>
                                    Explain AI in simple terms
                                </button>
                                <button type="button" onClick={() => setInput('Write a short summary of machine learning')}>
                                    Write a short summary of machine learning
                                </button>
                            </div>
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <article
                                key={`${message.role}-${message.timestamp}-${index}`}
                                className={`message-row ${message.role === 'user' ? 'user' : 'assistant'}`}
                            >
                                <div className="message-bubble">
                                    <div className="message-meta">
                                        <strong>{message.role === 'user' ? 'You' : 'Assistant'}</strong>
                                        <time>{formatTime(message.timestamp)}</time>
                                    </div>
                                    {message.role === 'assistant' && !message.isError ? (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {message.content}
                                        </ReactMarkdown>
                                    ) : (
                                        <p className={message.isError ? 'message-error' : ''}>{message.content}</p>
                                    )}
                                </div>
                            </article>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </section>

                <form className="composer" onSubmit={sendMessage}>
                    <label className="sr-only" htmlFor="message-input">
                        Type your message
                    </label>
                    <textarea
                        id="message-input"
                        rows="3"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault();
                                event.currentTarget.form?.requestSubmit();
                            }
                        }}
                        placeholder={hasConversation ? 'Type your message...' : 'Start typing to create a new chat...'}
                    />
                    <div className="composer-actions">
                        <p className="hint">Press Enter to send. Use Shift+Enter for a new line.</p>
                        <button type="submit" className="send-button" disabled={isLoading || !input.trim()}>
                            {isLoading ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}