import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ChatStep, ChatMessage, Order, Product } from '../types';
import { saveOrderToFirebase, saveChatSession } from '../services/db';

export function useChatFlow() {
  const [sessionId] = useState(() => {
    let id = localStorage.getItem('sessionId');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('sessionId', id);
    }
    return id;
  });

  const [step, setStep] = useState<ChatStep>('LANDING');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const [currentOrder, setCurrentOrder] = useState<Partial<Order>>({
    order_id: `ORD-${Math.floor(Math.random() * 10000)}`,
    order_status: 'Pending',
    date: new Date().toISOString(),
    delivery_type: 'Home Delivery', // Default
    delivery_charge: 5 // Default delivery charge
  });

  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
    if (messages.length > 0) {
      saveChatSession(sessionId, messages, currentOrder);
    }
  }, [messages, step, currentOrder, sessionId]);

  const handleUserInput = (text: string) => {
    if (!text.trim()) return;
    
    addMessage({ sender: 'user', text });
    setInputValue('');
    
    setTimeout(() => {
      processNextStep(text);
    }, 500);
  };

  const addMessage = (msg: Omit<ChatMessage, 'id'>) => {
    setMessages(prev => [...prev, { ...msg, id: Date.now().toString() + Math.random() }]);
  };

  const addBotMessage = (text: string, type?: ChatMessage['type']) => {
    addMessage({ sender: 'bot', text, type });
  };

  const processNextStep = (userInput: string) => {
    switch (step) {
      case 'LANDING':
        addBotMessage("Hello! Welcome to A-One Cakes & Pastries 🎂 How may I help you today? Could I get your name first?");
        setStep('ASK_NAME');
        break;

      case 'ASK_NAME':
        setCurrentOrder(prev => ({ ...prev, customer_name: userInput }));
        addBotMessage(`Thanks, ${userInput}! Could you please provide your mobile number so we can link your order?`);
        setStep('ASK_PHONE');
        break;

      case 'ASK_PHONE':
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(userInput.replace(/\D/g, ''))) {
          addBotMessage("Hmm, that doesn't look like a valid 10-digit number. Could you please check and type it again?");
          return;
        }
        setCurrentOrder(prev => ({ ...prev, customer_phone: userInput }));
        addBotMessage("Got it! And your email ID please?");
        setStep('ASK_EMAIL');
        break;

      case 'ASK_EMAIL':
        if (!userInput.includes('@')) {
          addBotMessage("Please enter a valid email address containing an '@' symbol.");
          return;
        }
        setCurrentOrder(prev => ({ ...prev, customer_email: userInput }));
        addBotMessage("Perfect! What would you like to buy today? We have freshly baked Cakes, Pastries, Cookies, Tea Rusk, and more. Here are our categories:", 'category_grid');
        setStep('SHOW_CATEGORIES');
        break;

      case 'SHOW_CATEGORIES':
        addBotMessage("Great! You can type what you want or select from the options above.");
        // We'll mostly rely on category clicks from here, handled differently. 
        break;

      case 'CUSTOM_CAKE_OPTIONS':
        setCurrentOrder(prev => ({ ...prev, custom_message: userInput }));
        addBotMessage("Here is your Order Summary:", 'summary');
        setStep('ORDER_SUMMARY');
        break;

      default:
        // Generic fallback
        if (['ORDER_SUMMARY', 'PAYMENT', 'COMPLETED'].includes(step)) {
           addBotMessage("Your order is being processed. Thank you!");
        } else {
           addBotMessage("I am still learning to understand free text! Please select from the menu icons if you can.");
        }
    }
  };

  const handleCategorySelection = (_categoryId: string, categoryName: string) => {
    addMessage({ sender: 'user', text: categoryName });
    setCurrentOrder(prev => ({ ...prev, product_category: categoryName }));
    
    setTimeout(() => {
      addBotMessage(`Awesome choice! Here are our available ${categoryName}:`, 'product_grid');
      setStep('PRODUCT_SELECTION');
    }, 500);
  };

  const handleProductSelection = (product: Product) => {
    addMessage({ sender: 'user', text: `Selected: ${product.name}` });
    
    setCurrentOrder(prev => ({ 
      ...prev, 
      product_name: product.name,
      product_price: product.price,
      total_amount: product.price + (prev.delivery_charge || 5)
    }));

    setTimeout(() => {
      if (product.category === 'cat_wedding_cakes') {
         addBotMessage('Would you like to add a custom message on the cake? Type it below, or type "No" if not needed.');
         setStep('CUSTOM_CAKE_OPTIONS');
      } else {
         addBotMessage("Here is your Order Summary:", 'summary');
         setStep('ORDER_SUMMARY');
      }
    }, 500);
  };

  const proceedToPayment = () => {
    addMessage({ sender: 'user', text: 'Looks good. Proceed to payment.' });
    setTimeout(() => {
      addBotMessage("How would you like to pay today? Please select an option:", 'payment_options');
      setStep('PAYMENT');
    }, 500);
  };

  const handlePayment = async (method: string) => {
    addMessage({ sender: 'user', text: `Pay via ${method}` });
    
    setTimeout(async () => {
      addBotMessage("Processing payment... ↺");
      
      const finalOrder = { ...currentOrder, payment_method: method, order_status: 'Completed' } as Order;
      setCurrentOrder(finalOrder);

      // Save to Firebase Storage/Firestore via db.ts
      await saveOrderToFirebase(finalOrder);

      // Also still save to localStorage for the AdminDashboard backward compatibility
      const existing = localStorage.getItem('bakery_orders');
      const allOrders = existing ? JSON.parse(existing) : [];
      localStorage.setItem('bakery_orders', JSON.stringify([...allOrders, finalOrder]));

      setTimeout(() => {
        addBotMessage(`Payment successful! 🎉 Your order #${finalOrder.order_id} has been confirmed. Thank you for shopping with A-One Cakes!`);
        setStep('COMPLETED');
      }, 1500);
      
    }, 500);
  };

  return {
    step,
    messages,
    inputValue,
    setInputValue,
    currentOrder,
    bottomRef,
    sessionId, // Exposed for Sidebar access
    handleUserInput,
    handleCategorySelection,
    handleProductSelection,
    proceedToPayment,
    handlePayment,
    setMessages, // Needed for history loading
    setStep // Needed for history loading
  };
}
