export declare const handleGetAllProducts: (sellerId: number) => Promise<any[]>;
export declare const handleGetAllCategories: () => Promise<any[]>;
export declare const handleAddProduct: (sellerId: number, name: string, description: string, category_id: number, variation_1: string, variation_2: string, quantity: number, price: number) => Promise<void>;
export declare const handleUpdateProductVariationActive: (active: boolean, productId: number, sku: string) => Promise<number>;
export declare const handleUpdateProductActive: (active: boolean, productId: number) => Promise<number>;
export declare const handleGetOrderDetails: (ordersId: number) => Promise<Orders>;
export declare const handleLogin: (email: string, password: string) => Promise<Seller | null>;
export declare const handleStoreRefreshToken: (refreshtoken: string, seller_id: number) => Promise<number>;
export declare const handleSendSMSOTP: (phoneNumber: number, seller_id: number) => Promise<number>;
export declare const handleSendEmailOTP: (email: string, seller_id: number) => Promise<any>;
export declare const updateOTP: (OTP: number, seller_id: number) => Promise<number>;
export declare const handleVerifyOTP: (seller_id: number, OTP: number) => Promise<Object[]>;
export declare const handleSendEmailLink: (signUpToken: string, email: string) => Promise<void>;
export declare const handleSignUp: (shopName: string, password: string, email: string, phoneNumber: number) => Promise<number>;
export declare const handleActiveAccount: (seller_id: string) => Promise<number>;
export declare const handleLogOut: (refreshToken: string) => Promise<number>;
export declare const handleForgetPassword: (email: string) => Promise<Object[]>;
export declare const handleSendEmailForgetPassword: (forgetPasswordToken: string, email: string) => Promise<void>;
export declare const handleResetPassword: (password: string, seller_id: string) => Promise<number>;
export declare const handleGetSellerOrders: (seller_id: string) => Promise<Object[]>;
export declare const handleGetSellerShipped: (seller_id: string) => Promise<Object[]>;
export declare const handleGetSellerDelivered: (seller_id: string) => Promise<Object[]>;
export declare const handlePackedAndShipped: (orders_product_id: Array<string>, customer_id: string) => Promise<void>;
export declare const handleGetCustomerOrders: (seller_id: number, orders_id: number) => Promise<Object[]>;
export declare const handleGetSellerDetails: (seller_id: number) => Promise<Object[]>;
export declare const handleUpdateSellerDetails: (password: string, email: string, shop_name: string, phone_number: number, seller_id: number) => Promise<Object | undefined>;
export declare const handleSendEmailChange: (seller_id: number, email: string) => Promise<void>;
export declare const handleChangeEmail: (seller_id: number) => Promise<void>;
export declare const handleDeactivateAccount: (seller_id: number) => Promise<void>;
export declare const handleGetSellerStatus: (seller_id: number) => Promise<any>;
export declare const handleActivateAccount: (seller_id: number) => Promise<void>;
interface Orders {
    customer_username: string;
    customer_email: string;
    total_price: number;
    orders_date: Date;
    shipment_created: Date;
    shipment_delivered: Date;
}
interface Seller {
    seller_id: number;
    phone_number: number;
    email: string;
    shopName: string;
}
export {};
