export declare const handleGetAllProducts: (sellerId: number) => Promise<Product[]>;
export declare const handleLogin: (email: string, password: string) => Promise<Seller | null>;
export declare const handleStoreRefreshToken: (refreshtoken: string, seller_id: number) => Promise<number>;
export declare const handleSendSMSOTP: (phoneNumber: number, seller_id: number) => Promise<number>;
export declare const handleSendEmailOTP: (email: string, seller_id: number) => Promise<void>;
export declare const updateOTP: (OTP: number, seller_id: number) => Promise<number>;
export declare const handleVerifyOTP: (seller_id: number, OTP: number) => Promise<Object[]>;
export declare const handleSendEmailLink: (signUpToken: string, email: string) => Promise<void>;
export declare const handleSignUp: (shopName: string, password: string, email: string, phoneNumber: number) => Promise<number>;
export declare const handleLogOut: (refreshToken: string) => Promise<number>;
interface Product {
    name: string;
    description: string;
    price: number;
    image_url: string;
}
interface Seller {
    seller_id: number;
    phone_number: number;
    email: string;
    shopName: string;
}
export {};
