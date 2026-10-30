import ChatComposer from './components/chat/ChatComposer';
import ChatHeader from './components/chat/ChatHeader';
import ChatMessageList from './components/chat/ChatMessageList';
import { useChatSession } from './hooks/useChatSession';

export default function App() {
    const {
        conversationId,
        messages,
        input,
        isLoading,
        messagesEndRef,
        resetChat,
        sendMessage,
        setInput,
        status,
    } = useChatSession();

    return (
        <main className="app-shell">
            <section className="chat-card">
                <ChatHeader status={status} isLoading={isLoading} onNewChat={resetChat} />
                <ChatMessageList
                    messages={messages}
                    messagesEndRef={messagesEndRef}
                    onPromptSelect={setInput}
                />
                <ChatComposer
                    input={input}
                    isLoading={isLoading}
                    hasConversation={Boolean(conversationId)}
                    onInputChange={setInput}
                    onSubmit={sendMessage}
                />
            </section>
        </main>
    );
}