export default function ChatComposer({ input, isLoading, hasConversation, onInputChange, onSubmit }) {
    return (
        <form className="composer" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="message-input">
                Type your message
            </label>
            <textarea
                id="message-input"
                rows="3"
                value={input}
                onChange={(event) => onInputChange(event.target.value)}
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
    );
}