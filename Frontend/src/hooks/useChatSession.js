import { useEffect, useRef, useState } from 'react';

import { DEFAULT_STATUS } from '../constants/chatContent';
import {
    clearConversationId,
    clearMessages,
    loadConversationId,
    loadMessages,
    saveConversationId,
    saveMessages,
} from '../utils/storage';
import { fetchConversationHistory, sendChatMessage, startConversation } from '../services/chatApi';

function mapHistoryMessage(message) {
    return {
        role: message.role === 'model' ? 'assistant' : 'user',
        content: message.parts,
        timestamp: message.timestamp || new Date().toISOString(),
    };
}

export function useChatSession() {
    const [conversationId, setConversationId] = useState(() => loadConversationId());
    const [messages, setMessages] = useState(() => loadMessages());
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(DEFAULT_STATUS);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        saveConversationId(conversationId);
    }, [conversationId]);

    useEffect(() => {
        saveMessages(messages);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!conversationId) {
            return;
        }

        let cancelled = false;

        async function loadConversation() {
            try {
                const data = await fetchConversationHistory(conversationId);

                if (cancelled || !Array.isArray(data.messages)) {
                    return;
                }

                setConversationId(data.conversationId || conversationId);
                setMessages(data.messages.map(mapHistoryMessage));
                setStatus('Loaded saved chat');
            } catch {
                return;
            }
        }

        loadConversation();

        return () => {
            cancelled = true;
        };
    }, [conversationId]);

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
                const conversation = await startConversation();
                activeConversationId = conversation.conversationId;
                setConversationId(activeConversationId);
            }

            const response = await sendChatMessage({
                conversationId: activeConversationId,
                message: trimmed,
            });

            setConversationId(response.conversationId);

            setMessages((current) => [
                ...current,
                {
                    role: 'assistant',
                    content: response.reply,
                    timestamp: new Date().toISOString(),
                },
            ]);
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
        setStatus(DEFAULT_STATUS);
        clearConversationId();
        clearMessages();
    }

    return {
        conversationId,
        input,
        isLoading,
        messages,
        messagesEndRef,
        resetChat,
        sendMessage,
        setInput,
        status,
    };
}