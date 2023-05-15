interface CustomerData {
    customer_id: number;
    username: string;
}
interface SellerData {
    seller_id: number;
    shop_name: string;
}
export declare const handleRefreshTokenCustomer: (refreshToken: string) => Promise<CustomerData[]>;
export declare const handleRefreshTokenSeller: (refreshToken: string) => Promise<SellerData[]>;
export {};
