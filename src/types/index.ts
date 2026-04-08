export interface Product {
  id: string;
  category: string;
  name: string;
  priceStr: string;
  price: number;
  description: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Order {
  order_id: string;
  date: string;
  time: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  product_category: string;
  product_name: string;
  cake_size?: string;
  cake_flavor?: string;
  custom_message?: string;
  delivery_type: 'Home Delivery' | 'Self Pickup';
  delivery_address: string;
  product_price: number;
  delivery_charge: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
}

export type ChatStep = 
  | 'LANDING'
  | 'GREETING'
  | 'ASK_NAME'
  | 'ASK_PHONE'
  | 'ASK_EMAIL'
  | 'ASK_WHAT_TO_BUY'
  | 'SHOW_CATEGORIES'
  | 'SHOW_PRODUCTS'
  | 'PRODUCT_SELECTION'
  | 'ASK_ADDRESS'
  | 'CUSTOM_CAKE_OPTIONS'
  | 'ORDER_SUMMARY'
  | 'PAYMENT'
  | 'COMPLETED';

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  type?: 'text' | 'category_grid' | 'product_grid' | 'summary' | 'payment_options' | 'delivery_options';
}
