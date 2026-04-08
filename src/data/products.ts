import type { Category, Product } from '../types';

export const categories: Category[] = [
  { id: 'cat_cookies', name: 'Cookies', icon: '🍪' },
  { id: 'cat_tea_rusk', name: 'Tea Rusk', icon: '🍞' },
  { id: 'cat_eggless_rusk', name: 'Eggless Cake Rusk', icon: '🥖' },
  { id: 'cat_namak_para', name: 'Namak Para', icon: '🥨' },
  { id: 'cat_pound_cakes', name: 'Pound Cakes', icon: '🍞' },
  { id: 'cat_eggless_slice', name: 'Eggless Slice Cakes', icon: '🍰' },
  { id: 'cat_cupcakes', name: 'Cupcakes', icon: '🧁' },
  { id: 'cat_pastries', name: 'Pastries / Cream Rolls', icon: '🥐' },
  { id: 'cat_indian_snacks', name: 'Indian Snacks', icon: '🥟' },
  { id: 'cat_wedding_cakes', name: 'Wedding Custom Cakes', icon: '💒' }
];

export const products: Product[] = [
  // Snacks / Sweets
  { id: 'p_1', name: 'Coconut Rasgulla', description: 'Sweet coconut delicacy', price: 8.00, priceStr: '$8.00', category: 'cat_indian_snacks', image: 'https://images.unsplash.com/photo-1596485600326-80db266e74b7?w=400&q=80' },
  { id: 'p_2', name: 'Besan Burfi', description: 'Traditional Indian sweet', price: 8.00, priceStr: '$8.00', category: 'cat_indian_snacks', image: 'https://images.unsplash.com/photo-1598918451876-00fb47271e8a?w=400&q=80' },
  { id: 'p_3', name: 'A-One Gur & Sesame', description: '700g pack', price: 4.99, priceStr: '$4.99', category: 'cat_indian_snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82de35?w=400&q=80' },
  { id: 'p_4', name: 'A-One Methipara', description: '360g pack', price: 3.00, priceStr: '$3.00', category: 'cat_indian_snacks', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80' },

  // Cupcakes
  { id: 'p_5', name: 'A-One CupCakes Vanilla', description: '6 Pcs Vanilla', price: 4.00, priceStr: '$4.00', category: 'cat_cupcakes', image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&q=80' },
  { id: 'p_6', name: 'A-One CupCakes Sprinklers', description: '6 Pcs Vanilla with Sprinkles', price: 5.00, priceStr: '$5.00', category: 'cat_cupcakes', image: 'https://aonecakes.com/storage/product/429/aonesprinklercupcakesvanilla.jpg' },

  // Pastries & Cookies
  { id: 'p_7', name: 'A-One Punjabi Cookies', description: '2.25 lbs traditional pack', price: 7.00, priceStr: '$7.00', category: 'cat_cookies', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82de35?w=400&q=80' },

  // Cakes
  { id: 'p_8', name: 'Marble Cake (8 Inch)', description: 'Classic 8 inch marble cake', price: 30.00, priceStr: '$30.00', category: 'cat_pound_cakes', image: 'https://aonecakes.com/storage/product/443/bASAPkoy6gnemehxDs3tVYTA2dDzfN1vWB8BiEp0.jpg' },
  { id: 'p_9', name: 'Black Forest (8 Inch)', description: 'Delicious 8 inch Black Forest slice', price: 30.00, priceStr: '$30.00', category: 'cat_pound_cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80' },
  
  // Custom
  { id: 'p_10', name: 'Custom Design Cake', description: 'Custom cake per your requirements', price: 50.00, priceStr: 'Starting at $50.00', category: 'cat_wedding_cakes', image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&q=80' }
];
