export declare const handlesGetCartDetails: (customerId: number) => Promise<CartItem[]>;
export declare const handleAlterCart: (customer_id: number, sku: string, quantity: number, new_sku: string, product_id: number) => Promise<any>;
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
