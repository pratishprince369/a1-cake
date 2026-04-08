import { useState, useEffect } from 'react';
import { Send, MessageSquarePlus, Clock } from 'lucide-react';
import { useChatFlow } from '../hooks/useChatFlow';
import { categories, products } from '../data/products';
import { getOldChats } from '../services/db';
import type { ChatMessage as ChatMessageType } from '../types';

export default function ChatApp() {
  const {
    step,
    messages,
    inputValue,
    setInputValue,
    currentOrder,
    bottomRef,
    sessionId,
    handleUserInput,
    handleCategorySelection,
    handleProductSelection,
    proceedToPayment,
    handlePayment,
    setMessages,
    setStep
  } = useChatFlow();

  const [pastSessions, setPastSessions] = useState<any[]>([]);

  useEffect(() => {
    // Load chat history from Firebase
    getOldChats().then(res => {
      setPastSessions(res.filter(r => r.messages && r.messages.length > 0));
    });
  }, [sessionId, messages.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleUserInput(inputValue);
  };

  const loadPastSession = (sessionData: any) => {
    setMessages(sessionData.messages || []);
    setStep('COMPLETED'); // Lock chat to prevent continuing old flow
  };

  const handleNewChat = () => {
    window.location.reload(); // Quick way to get a new session for now
  };

  const renderMessageContent = (msg: ChatMessageType) => {
    if (msg.type === 'category_grid') {
      if (step !== 'SHOW_CATEGORIES' && step !== 'PRODUCT_SELECTION' && step !== 'COMPLETED') return null;
      return (
        <div className="choices-grid">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              className="choice-btn text-sm" 
              onClick={() => handleCategorySelection(cat.id, cat.name)}
              disabled={step === 'COMPLETED'}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      );
    }

    if (msg.type === 'product_grid') {
      const catProducts = products.filter(p => currentOrder.product_category === p.category || p.name.includes(currentOrder.product_category || ''));
      const itemsToDisplay = catProducts.length > 0 ? catProducts : products.slice(0, 4);

      return (
        <div className="product-carousel">
          {itemsToDisplay.map(p => (
            <div key={p.id} className="product-card">
              {p.image && (
                <div className="product-img-wrapper">
                  <img src={p.image} alt={p.name} className="product-img" />
                </div>
              )}
              <div className="product-title">{p.name}</div>
              <div className="product-desc">{p.description}</div>
              <div className="product-price">{p.priceStr}</div>
              <button 
                className="product-btn" 
                onClick={() => handleProductSelection(p)}
                disabled={step === 'COMPLETED'}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      );
    }

    if (msg.type === 'summary') {
      return (
        <div className="order-summary">
          <div className="summary-title">🧾 ORDER DETAILS</div>
          <div className="summary-row"><span>Name:</span> <span>{currentOrder.customer_name}</span></div>
          <div className="summary-row"><span>Item:</span> <span>{currentOrder.product_name}</span></div>
          {currentOrder.custom_message && (
            <div className="summary-row"><span>Custom text:</span> <span>{currentOrder.custom_message}</span></div>
          )}
          <div className="summary-row"><span>Total:</span> <span style={{fontWeight: 'bold'}}>${currentOrder.total_amount?.toFixed(2)}</span></div>
          
          {step === 'ORDER_SUMMARY' && (
            <button className="product-btn mt-4 bg-primary-dark" onClick={proceedToPayment}>Confirm & Proceed</button>
          )}
        </div>
      );
    }

    if (msg.type === 'payment_options') {
      return (
        <div className="choices-grid">
          <button className="choice-btn" onClick={() => handlePayment('Credit/Debit Card')} disabled={step === 'COMPLETED'}>💳 Credit/Debit Card</button>
          <button className="choice-btn" onClick={() => handlePayment('Cash on Delivery')} disabled={step === 'COMPLETED'}>💵 Cash</button>
        </div>
      );
    }

    return null;
  };

  const logoUrl = "https://aonecakes.com/themes/cake/imgaes/a-one-logo.png";

  const renderMainContent = () => {
    if (step === 'LANDING' && messages.length === 0) {
      return (
        <div className="landing-container" style={{ flex: 1, height: '100%' }}>
          <div className="landing-content">
            <img src={logoUrl} alt="A-One Cakes Logo" className="landing-logo" />
            <h1 className="landing-title">What are you craving today? 🎂</h1>
            <div className="landing-input-wrapper">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Mia..."
                autoFocus
              />
              <button 
                onClick={() => handleUserInput(inputValue)}
                disabled={!inputValue.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="chat-container">
        <div className="chat-header" style={{ justifyContent: 'center' }}>
          <img src={logoUrl} alt="A-One Cakes Logo" style={{ height: '36px', animation: 'fadeIn 0.5s ease' }} />
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.sender === 'bot' ? 'message-bot' : 'message-user'}`}>
              {msg.sender === 'bot' && (
                 <div className="chat-header-avatar" style={{width: 32, height: 32, fontSize: 14, marginRight: 8, marginTop: 4, background: '#f0f0f0'}}>👩🏻‍🍳</div>
              )}
              <div className={`bubble ${msg.sender === 'bot' ? 'bubble-bot' : 'bubble-user'}`}>
                {msg.text && <div className="whitespace-pre-line text-sm">{msg.text}</div>}
                {renderMessageContent(msg)}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {step !== 'COMPLETED' && (
          <div className="chat-input-area" style={{ borderTop: 'none', paddingBottom: '30px' }}>
            <div className="landing-input-wrapper" style={{ margin: '0 auto', maxWidth: '800px', width: '100%' }}>
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Reply to Mia..."
                autoFocus
              />
              <button 
                onClick={() => handleUserInput(inputValue)}
                disabled={!inputValue.trim()}
                style={{ background: inputValue.trim() ? 'var(--color-primary)' : 'var(--color-border)', margin: '4px' }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app-wrapper">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header flex justify-between items-center cursor-pointer" onClick={handleNewChat}>
          <span>A-One Chats</span>
          <MessageSquarePlus size={20} />
        </div>
        <div className="chat-sidebar-history">
          <div className="text-xs text-gray-500 mb-4 font-semibold px-1">Order History</div>
          {pastSessions.map((session, idx) => (
            <div key={idx} className="history-item" onClick={() => loadPastSession(session)}>
              <div className="flex items-center">
                <Clock size={14} className="mr-2 text-gray-400" />
                <span className="truncate flex-1">
                  {session.orderDetails?.customer_name ? 
                    `Order: ${session.orderDetails.product_name || 'Cake'}` : 
                    "Conversation"}
                </span>
              </div>
              <div className="history-item-date">
                {session.lastUpdated?.toDate ? session.lastUpdated.toDate().toLocaleDateString() : 'Recent'}
              </div>
            </div>
          ))}
          {pastSessions.length === 0 && (
            <div className="text-sm text-gray-400 text-center mt-10">No past orders</div>
          )}
        </div>
      </div>
      {renderMainContent()}
    </div>
  );
}
