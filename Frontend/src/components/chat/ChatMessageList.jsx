import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { STARTER_PROMPTS } from '../../constants/chatContent';
import { formatTime } from '../../utils/formatTime';

function EmptyChatState({ onPromptSelect }) {
    return (
        <div className="empty-state">
            <h2>Start the conversation</h2>
            <p>Ask something and the assistant will reply in the thread below.</p>
            <div className="chips">
                {STARTER_PROMPTS.map((prompt) => (
                    <button key={prompt} type="button" onClick={() => onPromptSelect(prompt)}>
                        {prompt}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function ChatMessageList({ messages, messagesEndRef, onPromptSelect }) {
    return (
        <section className="chat-body" aria-label="Chat messages">
            {messages.length === 0 ? (
                <EmptyChatState onPromptSelect={onPromptSelect} />
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
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                            ) : (
                                <p className={message.isError ? 'message-error' : ''}>{message.content}</p>
                            )}
                        </div>
                    </article>
                ))
            )}
            <div ref={messagesEndRef} />
        </section>
    );
}