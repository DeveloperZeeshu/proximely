export const SHOP_CATEGORIES = [
  { value: 'general_store', label: 'General Store' },
  { value: 'supermarket', label: 'Supermarket' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'fashion_apparel', label: 'Fashion & Apparel' },
  { value: 'beauty_personal_care', label: 'Beauty & Personal Care' },
  { value: 'home_kitchen', label: 'Home & Kitchen' },
  { value: 'pet_supplies', label: 'Pet Supplies' },
  { value: 'hardware_diy', label: 'Hardware & DIY' },
  { value: 'sports_fitness', label: 'Sports & Fitness' },
  { value: 'stationery', label: 'Stationery' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'toy_store', label: 'Toy Store' }
] as const;

export type ShopCategory =
  (typeof SHOP_CATEGORIES)[number]['value'];

export const SHOP_CATEGORIES_VALUE = SHOP_CATEGORIES.map(c => c.value)