import { APP_COPY } from '../../constants/chatContent';

export default function ChatHeader({ status, isLoading, onNewChat }) {
    return (
        <header className="chat-header">
            <div>
                <p className="eyebrow">{APP_COPY.eyebrow}</p>
                <h1>{APP_COPY.title}</h1>
                <p className="subtle">{APP_COPY.subtitle}</p>
            </div>
            <div className="header-actions">
                <span className={`status-badge ${isLoading ? 'pending' : 'idle'}`}>{status}</span>
                <button type="button" className="ghost-button" onClick={onNewChat}>
                    New chat
                </button>
            </div>
        </header>
    );
}