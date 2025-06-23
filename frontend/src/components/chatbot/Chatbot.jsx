import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiMaximize2, FiMinimize2, FiCopy, FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Draggable from 'react-draggable';
import useChat from '../../hooks/useChat';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [input, setInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const draggableRef = useRef(null);
  
  const {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  } = useChat();
  
  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderMessageContent = (text) => {
    if (!text) return null;

    return (
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const code = String(children).replace(/\n$/, '');
            const index = Math.random().toString(36).substr(2, 9);

            if (!inline && language) {
              return (
                <div className="relative group">
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopyCode(code, index)}
                      className="p-1.5 rounded-lg bg-base-300/50 hover:bg-base-300 text-base-content/70 hover:text-base-content"
                      title="Copy code"
                    >
                      {copiedCode === index ? <FiCheck size={16} /> : <FiCopy size={16} />}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      borderRadius: '0.5rem',
                      background: 'hsl(var(--b2))',
                    }}
                    {...props}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              );
            }

            return (
              <code className="px-1.5 py-0.5 rounded bg-base-300/50 text-base-content/90" {...props}>
                {children}
              </code>
            );
          },
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-2 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 last:mb-0">{children}</ol>,
          li: ({ children }) => <li className="mb-1 last:mb-0">{children}</li>,
          a: ({ href, children }) => (
            <a href={href} className="text-primary hover:text-primary/80 underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-base-300 pl-4 italic my-2">
              {children}
            </blockquote>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    );
  };
  
  const handleClearChat = () => {
    if (window.confirm(t('chat.confirmClear', 'Are you sure you want to clear the chat history?'))) {
      clearMessages();
    }
  };
  
  const handleDrag = (e, ui) => {
    setPosition({
      x: ui.x,
      y: ui.y
    });
  };
  
  const handleStart = () => {
    setIsDragging(true);
  };
  
  const handleStop = () => {
    setIsDragging(false);
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (input.trim() === '') return;
    
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const chatWindowClass = `
    w-80 sm:w-96 md:w-[420px]
    ${isExpanded ? 'h-[80vh]' : 'h-[500px]'}
    bg-base-100/95 backdrop-blur-xl
    rounded-xl shadow-xl
    flex flex-col
    border border-base-300/50
    transition-all duration-300
  `;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Chat Window */}
      {isOpen ? (
        <Draggable
          handle=".chat-header"
          defaultPosition={{ x: 0, y: 0 }}
          position={position}
          onStart={handleStart}
          onStop={handleStop}
          onDrag={handleDrag}
          bounds="parent"
          nodeRef={draggableRef}
        >
          <div 
            ref={draggableRef}
            className={chatWindowClass}
            style={{
              position: 'absolute',
              right: '20px',
              bottom: '20px',
              pointerEvents: 'auto',
              cursor: isDragging ? 'grabbing' : 'default'
            }}
          >
            {/* Header */}
            <div className="chat-header p-3 bg-gradient-to-r from-primary to-secondary text-white rounded-t-xl flex justify-between items-center">
              <h3 className="font-medium flex items-center gap-2">
                <FiMessageSquare size={18} />
                <span className="truncate">{t('chat.title', 'Chat Assistant')}</span>
              </h3>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={toggleExpand}
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-all duration-200"
                  title={isExpanded ? t('chat.minimize', 'Minimize') : t('chat.maximize', 'Maximize')}
                >
                  {isExpanded ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
                </button>
                <button 
                  onClick={handleClearChat}
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-all duration-200"
                  title={t('chat.clear', 'Clear chat')}
                  disabled={messages.length === 0}
                >
                  {t('chat.clear', 'Clear')}
                </button>
                <button 
                  onClick={toggleChat}
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-all duration-200"
                  title={t('chat.close', 'Close chat')}
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-base-200/50">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center p-4">
                  <div>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <FiMessageSquare size={28} className="text-primary" />
                    </div>
                    <h3 className="font-medium text-base-content mb-2">{t('chat.welcome', 'How can I help you today?')}</h3>
                    <p className="text-sm text-base-content/60 mb-6">{t('chat.welcomeSubtitle', 'Ask me anything about our services')}</p>
                    <div className="grid gap-2">
                      {[
                        t('chat.suggestions.getStarted', 'How do I get started?'),
                        t('chat.suggestions.plans', 'What are your plans?'),
                        t('chat.suggestions.support', 'Contact support')
                      ].map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => setInput(suggestion)}
                          className="text-sm bg-base-100 hover:bg-base-200 text-base-content/70 hover:text-primary px-4 py-2 rounded-lg border border-base-300/50 transition-all duration-200"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div 
                      key={msg.id || index} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender === 'user' 
                            ? 'bg-primary hover:bg-primary/90 text-primary-content rounded-br-none' 
                            : 'bg-base-100 border border-base-300/50 rounded-bl-none'
                        }`}
                      >
                        <div className="break-words prose prose-sm max-w-none dark:prose-invert">
                          {renderMessageContent(msg.text) || (isLoading && '...')}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-base-100 border border-base-300/50 p-3 rounded-lg rounded-bl-none">
                        <span className="loading loading-dots loading-sm text-primary"></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-base-300/50 bg-base-100">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('chat.placeholder', 'Type a message...')}
                  className="input input-bordered w-full pr-12 focus:border-none focus:ring-0 focus:outline-primary"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80 disabled:text-base-content/30 transition-colors duration-200"
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>
          </div>
        </Draggable>
      ) : (
        <div 
          className="fixed bottom-5 right-5"
          style={{ pointerEvents: 'auto' }}
        >
          <button 
            onClick={toggleChat}
            className="btn btn-circle bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/20 border-0 transition-all duration-300 transform hover:scale-105"
            aria-label={t('chat.open', 'Open chat')}
          >
            <FiMessageSquare size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;