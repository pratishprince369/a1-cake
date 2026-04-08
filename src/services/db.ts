import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, setDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Order, ChatMessage } from '../types';

export const saveOrderToFirebase = async (order: Order) => {
  if (!db) return null;
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...order,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    // Ignore error and allow local flow to continue primarily if config missing
    return null; 
  }
};

export const saveChatSession = async (sessionId: string, messages: ChatMessage[], orderDetails: Partial<Order>) => {
  if (!db) return;
  try {
    await setDoc(doc(db, "chats", sessionId), {
      sessionId,
      messages,
      orderDetails,
      lastUpdated: Timestamp.now()
    });
  } catch (e) {
    console.error("Error saving chat session: ", e);
  }
};

export const getOldChats = async () => {
  if (!db) return [];
  try {
    // In a real app we'd query by UserId. For anonymous flow, we'll fetch everything 
    // or just fetch chats tied to a specific local device identifier.
    const q = query(collection(db, "chats"), orderBy("lastUpdated", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (e) {
    console.error("Error getting chats: ", e);
    return [];
  }
};
