import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks, experience, projects } from '../data/portfolio';

const portfolioData = { navLinks, experience, projects };

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are Ivan Brilata's personal AI assistant embedded in his portfolio website. You answer questions about Ivan in a friendly, professional, and concise way. Speak as if you know Ivan personally. Always be helpful and positive. Keep responses short and scannable — use line breaks, bullet points (with •), or bold text (**text**) when it helps readability. Never make up information not in the data.

Here is Ivan's portfolio data:
${JSON.stringify(portfolioData, null, 2)}

Guidelines:
- Greet visitors warmly on first message
- Answer questions about Ivan's skills, experience, education, projects, and contact info
- If asked something you don't know from the data, say so honestly
- Suggest relevant questions the user might want to ask
- Keep responses under 100 words unless detail is truly needed
- Format lists with • bullets
- Highlight key terms with **bold**`;

const SUGGESTED_QUESTIONS = [
  "What are Ivan's top skills?",
  "Tell me about his experience",
  "What projects has he built?",
  "How can I contact Ivan?",
];

function renderContent(text: string) {
  return text.split('\n').map((line, i, arr) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((p, j) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={j} style={{ color: '#93c5fd', fontWeight: 600 }}>{p.slice(2, -2)}</strong>
        : p
    );
    return (
      <span key={i}>
        {rendered}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 480px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

// Message bubble icon for the FAB
function MessageIcon({ size = 22, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Close (X) icon
function CloseIcon({ size = 18, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Send icon
function SendIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22 2L11 13" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PortfolioChatbot() {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hi! 👋 I'm Ivan's AI assistant. Ask me anything about his skills, projects, or experience!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Auto-hide tooltip after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open) {
      setHasNotification(false);
      setShowTooltip(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = open ? 'hidden' : '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, isMobile]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      });

      const data = await res.json();
      const reply =
        data.content?.map((b: { text?: string }) => b.text ?? '').join('') ??
        "Sorry, I couldn't get a response right now.";

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString() + '_a',
          role: 'assistant',
          content: reply,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString() + '_err',
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again!',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        bottom: 0,
        right: 0,
        borderRadius: 0,
      }
    : {
        position: 'absolute',
        bottom: 72,
        right: 0,
        width: 320,
        height: 480,
        borderRadius: 16,
      };

  const fabSize = isMobile ? 48 : 52;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
        .cb-root { font-family: 'DM Mono', monospace; }
        .cb-scroll::-webkit-scrollbar { width: 3px; }
        .cb-scroll::-webkit-scrollbar-track { background: transparent; }
        .cb-scroll::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.2); border-radius: 4px; }
        .cb-input::placeholder { color: rgba(96,165,250,0.3); }
        .cb-input:focus { outline: none; }
        .cb-chip { transition: all 0.15s ease; }
        .cb-chip:hover { background: rgba(59,130,246,0.18) !important; border-color: rgba(96,165,250,0.45) !important; }
        .cb-chip:active { transform: scale(0.96); }
        .cb-send:hover:not(:disabled) { background: rgba(37,99,235,0.85) !important; }
        .cb-send:disabled { opacity: 0.35; cursor: not-allowed; }
        .cb-input-area { padding-bottom: max(9px, env(safe-area-inset-bottom)); }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0   rgba(59,130,246,0.45); }
          70%  { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
          100% { box-shadow: 0 0 0 0   rgba(59,130,246,0); }
        }
        .cb-fab-pulse { animation: pulse-ring 2.5s ease-out infinite; }
      `}</style>

      <div
        className="cb-root"
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9998 }}
      >
        {/* Floating tooltip bubble */}
        <AnimatePresence>
          {showTooltip && !open && (
            <motion.div
              key="tooltip"
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                bottom: fabSize + 16,
                right: 0,
                background: '#0c1527',
                border: '1px solid rgba(59,130,246,0.3)',
                borderRadius: '14px 14px 4px 14px',
                padding: '10px 14px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                pointerEvents: 'auto',
              }}
              onClick={() => setOpen(true)}
            >
              {/* Tail */}
              <div style={{
                position: 'absolute',
                bottom: -7,
                right: 18,
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderTop: '7px solid rgba(59,130,246,0.3)',
              }} />
              <div style={{
                position: 'absolute',
                bottom: -6,
                right: 19,
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderTop: '6px solid #0c1527',
                zIndex: 1,
              }} />
              <p style={{
                margin: 0,
                fontSize: 12,
                color: 'rgba(203,213,225,0.9)',
                fontFamily: 'inherit',
                lineHeight: 1.5,
              }}>
                Want to know more about Ivan?
              </p>
              <p style={{
                margin: '2px 0 0',
                fontSize: 10,
                color: 'rgba(96,165,250,0.6)',
                fontFamily: 'inherit',
              }}>
                Ask me anything
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB */}
        <motion.button
          className={!open ? 'cb-fab-pulse' : ''}
          onClick={() => setOpen(o => !o)}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.07 }}
          aria-label={open ? 'Close chat' : 'Open chat with Ivan'}
          style={{
            width: fabSize,
            height: fabSize,
            borderRadius: '50%',
            border: 'none',
            background: open
              ? 'linear-gradient(135deg, #0c1527 0%, #1e3a5f 100%)'
              : 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
            cursor: 'pointer',
            padding: 0,
            overflow: 'visible',
            position: 'relative',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.25s ease',
          }}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <CloseIcon size={18} color="white" />
              </motion.span>
            ) : (
              <motion.span
                key="msg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <MessageIcon size={22} color="white" />
              </motion.span>
            )}
          </AnimatePresence>

          {/* Notification dot */}
          {hasNotification && !open && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 11,
                height: 11,
                borderRadius: '50%',
                background: '#22d3ee',
                border: '2px solid #04040e',
                boxShadow: '0 0 6px rgba(34,211,238,0.7)',
              }}
            />
          )}
        </motion.button>

        {/* Chat panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="cb-panel"
              initial={isMobile
                ? { opacity: 0, y: '100%' }
                : { opacity: 0, y: 14, scale: 0.96 }}
              animate={isMobile
                ? { opacity: 1, y: 0 }
                : { opacity: 1, y: 0, scale: 1 }}
              exit={isMobile
                ? { opacity: 0, y: '100%' }
                : { opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{
                ...panelStyle,
                background: '#04040e',
                border: isMobile ? 'none' : '1px solid rgba(59,130,246,0.18)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(59,130,246,0.06), inset 0 1px 0 rgba(59,130,246,0.08)',
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: isMobile ? '14px 16px' : '10px 14px',
                  paddingTop: isMobile ? 'max(14px, env(safe-area-inset-top))' : '10px',
                  borderBottom: '1px solid rgba(59,130,246,0.1)',
                  background: 'rgba(8,8,24,0.98)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  flexShrink: 0,
                }}
              >
                {/* Avatar: message icon circle */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: isMobile ? 36 : 32,
                    height: isMobile ? 36 : 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                    border: '1px solid rgba(59,130,246,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <MessageIcon size={isMobile ? 16 : 14} color="white" />
                  </div>
                  {/* Online dot */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#22d3ee',
                    border: '2px solid #04040e',
                    boxShadow: '0 0 5px rgba(34,211,238,0.65)',
                  }} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: isMobile ? 13 : 12,
                    fontWeight: 500,
                    color: '#dbeafe',
                    letterSpacing: '0.03em',
                  }}>
                    Ivan's Assistant
                  </div>
                  <div style={{
                    fontSize: 9,
                    color: 'rgba(96,165,250,0.45)',
                    letterSpacing: '0.1em',
                    marginTop: 1,
                  }}>
                    AI ASSISTANT · ONLINE
                  </div>
                </div>

                {/* Close button on mobile */}
                {isMobile && (
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close chat"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: '1px solid rgba(59,130,246,0.2)',
                      background: 'rgba(59,130,246,0.08)',
                      color: '#60a5fa',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <CloseIcon size={16} color="#60a5fa" />
                  </button>
                )}

                {/* Decorative bars on desktop */}
                {!isMobile && (
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[0.4, 0.22, 0.1].map((o, i) => (
                      <div
                        key={i}
                        style={{
                          width: 2.5,
                          height: 12,
                          borderRadius: 2,
                          background: `rgba(59,130,246,${o})`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Messages */}
              <div
                className="cb-scroll"
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  overscrollBehavior: 'contain',
                  WebkitOverflowScrolling: 'touch',
                  padding: isMobile ? '14px 12px' : '12px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      display: 'flex',
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                      gap: 6,
                    }}
                  >
                    {msg.role === 'assistant' && (
                      <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                        border: '1px solid rgba(59,130,246,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <MessageIcon size={11} color="white" />
                      </div>
                    )}
                    <div
                      style={{
                        maxWidth: isMobile ? '82%' : '80%',
                        padding: isMobile ? '10px 13px' : '8px 11px',
                        borderRadius:
                          msg.role === 'user'
                            ? '14px 4px 14px 14px'
                            : '4px 14px 14px 14px',
                        background:
                          msg.role === 'user'
                            ? 'linear-gradient(135deg, rgba(29,78,216,0.75) 0%, rgba(37,99,235,0.65) 100%)'
                            : 'rgba(12,12,30,0.95)',
                        border:
                          msg.role === 'user'
                            ? '1px solid rgba(59,130,246,0.35)'
                            : '1px solid rgba(59,130,246,0.1)',
                        fontSize: isMobile ? 13 : 11.5,
                        lineHeight: 1.65,
                        color:
                          msg.role === 'user'
                            ? '#dbeafe'
                            : 'rgba(203,213,225,0.9)',
                        letterSpacing: '0.01em',
                      }}
                    >
                      {renderContent(msg.content)}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}
                  >
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                      border: '1px solid rgba(59,130,246,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <MessageIcon size={11} color="white" />
                    </div>
                    <div
                      style={{
                        padding: '10px 13px',
                        background: 'rgba(12,12,30,0.95)',
                        border: '1px solid rgba(59,130,246,0.1)',
                        borderRadius: '4px 14px 14px 14px',
                        display: 'flex',
                        gap: 4,
                        alignItems: 'center',
                      }}
                    >
                      {[0, 0.16, 0.32].map((delay, i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0], opacity: [0.35, 1, 0.35] }}
                          transition={{ duration: 0.65, repeat: Infinity, delay, ease: 'easeInOut' }}
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            background: '#3b82f6',
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Suggested questions */}
                {messages.length === 1 && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}
                  >
                    {SUGGESTED_QUESTIONS.map(q => (
                      <button
                        key={q}
                        className="cb-chip"
                        onClick={() => sendMessage(q)}
                        style={{
                          padding: isMobile ? '7px 12px' : '5px 9px',
                          background: 'rgba(29,78,216,0.08)',
                          border: '1px solid rgba(59,130,246,0.22)',
                          borderRadius: 20,
                          color: 'rgba(147,197,253,0.8)',
                          fontSize: isMobile ? 12 : 10.5,
                          cursor: 'pointer',
                          letterSpacing: '0.02em',
                          fontFamily: 'inherit',
                          minHeight: isMobile ? 36 : 'auto',
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </motion.div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input area */}
              <div
                className="cb-input-area"
                style={{
                  padding: '9px 10px',
                  borderTop: '1px solid rgba(59,130,246,0.08)',
                  background: 'rgba(4,4,14,0.99)',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(12,12,36,0.85)',
                    border: '1px solid rgba(59,130,246,0.18)',
                    borderRadius: 12,
                    padding: isMobile ? '8px 8px 8px 14px' : '6px 6px 6px 12px',
                  }}
                >
                  <input
                    ref={inputRef}
                    className="cb-input"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Ask about Ivan..."
                    disabled={loading}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      color: '#dbeafe',
                      fontSize: isMobile ? 16 : 11.5,
                      fontFamily: 'inherit',
                      letterSpacing: '0.02em',
                    }}
                  />
                  <button
                    className="cb-send"
                    onClick={() => sendMessage(input)}
                    disabled={loading || !input.trim()}
                    aria-label="Send message"
                    style={{
                      width: isMobile ? 38 : 30,
                      height: isMobile ? 38 : 30,
                      borderRadius: 8,
                      background: 'rgba(37,99,235,0.65)',
                      border: '1px solid rgba(59,130,246,0.35)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.15s ease',
                      flexShrink: 0,
                    }}
                  >
                    <SendIcon />
                  </button>
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: 6,
                    fontSize: 8.5,
                    color: 'rgba(59,130,246,0.2)',
                    letterSpacing: '0.1em',
                  }}
                >
                  POWERED BY CLAUDE AI
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}