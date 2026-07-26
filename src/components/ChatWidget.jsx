import { useEffect, useRef, useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { api } from '../api/client';

const GREETING =
  "Hey! I'm an assistant for this portfolio — ask me about the projects, skills, or background here, or ask a general web dev question.";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const priorHistory = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/chat', { message: text, history: priorHistory });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-panel">
          <div className="chat-panel-bar">
            <span className="path">assistant@portfolio: ~</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat" data-cursor="pointer">
              <X size={15} />
            </button>
          </div>

          <div className="chat-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div className={`chat-msg ${m.role}`} key={i}>
                <span className="chat-msg-prompt">{m.role === 'user' ? 'you>' : 'bot>'}</span>
                <span className="chat-msg-text">{m.content}</span>
              </div>
            ))}
            {loading && (
              <div className="chat-msg assistant">
                <span className="chat-msg-prompt">bot&gt;</span>
                <span className="chat-msg-text chat-typing">thinking...</span>
              </div>
            )}
            {error && <div className="chat-error">{error}</div>}
          </div>

          <form className="chat-input-row" onSubmit={send}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              maxLength={800}
              disabled={loading}
              aria-label="Chat message"
            />
            <button type="submit" aria-label="Send message" disabled={loading || !input.trim()} data-cursor="pointer">
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      <button
        className="chat-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        data-cursor="pointer"
      >
        {open ? <X size={22} /> : <MessageSquare size={22} />}
      </button>
    </div>
  );
}
