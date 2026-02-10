
export const PRODUCT_CATEGORIES = [
    { value: 'groceries', label: 'Groceries' },
    { value: 'fresh_produce', label: 'Fresh Produce' },
    { value: 'dairy', label: 'Dairy & Eggs' },
    { value: 'bakery', label: 'Bakery Items' },

    { value: 'electronics', label: 'Electronics' },
    { value: 'mobile_accessories', label: 'Mobile Accessories' },

    { value: 'clothing', label: 'Clothing' },
    { value: 'footwear', label: 'Footwear' },

    { value: 'beauty_personal_care', label: 'Beauty & Personal Care' },
    { value: 'health_wellness', label: 'Health & Wellness' },

    { value: 'home_kitchen', label: 'Home & Kitchen' },
    { value: 'cleaning_supplies', label: 'Cleaning Supplies' },

    { value: 'stationery', label: 'Stationery' },
    { value: 'toys_games', label: 'Toys & Games' },

    { value: 'pet_supplies', label: 'Pet Supplies' },

    { value: 'hardware', label: 'Hardware & Tools' },

    { value: 'automotive', label: 'Automotive Essentials' }
] as const;

export type ProductCategory =
    (typeof PRODUCT_CATEGORIES)[number]['value']

export const PRODUCT_CATEGORIES_VALUE = PRODUCT_CATEGORIES.map(c => c.value)