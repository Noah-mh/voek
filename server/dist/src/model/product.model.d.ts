export declare const handlesGetProductDetails: (productId: number) => Promise<ProductDetails[]>;
export declare const handlesGetCartDetails: (customerId: number) => Promise<ProductDetails[]>;
export declare const handleAddToCart: (quantity: number, customer_id: number, product_id: number, sku: string) => Promise<number>;
export declare const handlesGetRecommendedProductsBasedOnCat: (category_id: number) => Promise<Product[]>;
export declare const handlesGetRecommendedProductsBasedOnCatWishlist: (category_id: number) => Promise<Product[]>;
export declare const handlesGetWishlistItems: (customer_id: number) => Promise<Product[]>;
export declare const handlesGetLastViewedProductExistence: (customer_id: number, product_id: number, timezone: string, date_viewed: string) => Promise<Object[]>;
export declare const handlesGetLastViewed: (customer_id: number, timezone: string, date_viewed: string) => Promise<Product[]>;
export declare const handlesTopProducts: () => Promise<Product[]>;
export declare const handlesSearchBarPredictions: () => Promise<Product[]>;
export declare const handlesSearchResult: (input: string) => Promise<Product[]>;
export declare const handlesProductsBasedOnCategory: (category_id: number) => Promise<Product[]>;
export declare const handlesInsertingWishlistedProduct: (customer_id: number, product_id: number) => Promise<number>;
export declare const handlesDeletingWishlistedProduct: (customer_id: number, product_id: number) => Promise<number>;
export declare const handleProductDetailsWithoutReviews: (product_id: number) => Promise<ProductWithImages[]>;
export declare const handleProductReviews: (product_id: number) => Promise<Review[]>;
export declare const handlesCheckWishlistProductExistence: (customer_id: number, product_id: number) => Promise<Object[]>;
export declare const handlesGetAllListedProducts: () => Promise<Object[]>;
export declare const handlesGetProductVariations: (productId: number) => Promise<Object[]>;
export declare const handlesGetProductVariationsPricing: (productId: number) => Promise<Object[]>;
export declare const handlesGetProductImage: (productId: number) => Promise<Object[]>;
export declare const handlesGetProductVariationImage: (sku: string) => Promise<Object[]>;
export declare const handlesGetProductCat: (productId: number) => Promise<Category[]>;
export declare const handlesInsertLastViewedProduct: (productId: number, customerId: number, currentDate: string, timezone: string) => Promise<{
    categoryId: number;
    customerId: number;
}[]>;
export declare const handlesGetProductsUsingCategory: (categoryId: number) => Promise<Object[]>;
export declare const handleCartDetails: (customer_id: number, sku: string) => Promise<CartItem[]>;
interface Product {
    product_id: number;
    name: string;
    price: number;
    description: string;
}
interface ProductDetails extends Product {
    variation_1: string;
    variation_2: string;
    rating: number;
    comment: string;
}
interface ProductWithImages extends Product {
    image_urls: string[];
}
interface Review {
    customerName: string;
    comment: string;
}
interface Category {
    categoryId: number;
}
interface CartItem {
    cart_id: number;
    quantity: number;
    customer_id: number;
    product_id: number;
    sku: string;
}
export {};
