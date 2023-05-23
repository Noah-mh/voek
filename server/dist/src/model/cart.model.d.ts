export declare const handlesGetCartDetails: (customer_id: string) => Promise<CartItem[]>;
export declare const handleAlterQuantCart: (customer_id: number, sku: string, quantity: number) => Promise<any>;
export declare const handleInsertPayment: (customer_id: number, amount: number) => Promise<any>;
export declare const handleInsertOrder: (customer_id: number, payment_id: number, discount_applied: string, coins_redeemed: number, address_id: number) => Promise<any>;
export declare const handleInsertOrderProduct: (sku: string, orders_id: number, product_id: number, totalPrice: number, quantity: number) => Promise<any>;
export declare const handleUpdateProductStock: (quantityDeduct: number, sku: string) => Promise<any>;
export declare const handleAlterCustomerCoins: (customer_id: Number, coins: Number) => Promise<any>;
export declare const handleInsertShipment: (orders_product_id: number, customer_id: number) => Promise<any>;
export declare const handleClearCart: (customer_id: number) => Promise<any>;
export declare const handlesInsertCart: (quantity: number, customerId: number, productId: number, SKU: string) => Promise<number | undefined>;
interface Product {
    product_id: number;
    name: string;
    price: number;
    image_url: string;
}
interface ProductVariation {
    variation_1: string;
    variation_2: string;
    quantity: number;
}
interface CartItem {
    product: Product;
    quantity: number;
    variations: ProductVariation;
    stock: number;
}
export interface CartDetails extends Array<CartItem> {
}
export interface CartItemUpdate {
    customer_id: number;
    sku: string;
    quantity: number;
    new_sku?: string;
    product_id?: number;
}
export {};
