export declare const handleLogin: (email: string, password: string) => Promise<LoginResult | null>;
export declare const handleStoreRefreshToken: (refreshtoken: string, customer_id: number) => Promise<number>;
export declare const handleSendSMSOTP: (phoneNumber: number, customer_id: number) => Promise<number>;
export declare const handleSendEmailOTP: (email: string, customer_id: number) => Promise<any>;
export declare const updateOTP: (OTP: number, customer_id: number) => Promise<number>;
export declare const handleVerifyOTP: (customer_id: number, OTP: number) => Promise<Object[]>;
export declare const handleSendEmailLink: (signUpToken: string, email: string) => Promise<void>;
export declare const handleSignUp: (username: string, password: string, email: string, phoneNumber: number) => Promise<number>;
export declare const handleActiveAccount: (customer_id: string) => Promise<number>;
export declare const handleLogOut: (refreshToken: string) => Promise<number>;
export declare const handlesCustLastViewdCat: (cat_id: number, customer_id: number) => Promise<number>;
export declare const handleForgetPassword: (email: string) => Promise<Object[]>;
export declare const handleSendEmailForgetPassword: (forgetPasswordToken: string, email: string) => Promise<void>;
export declare const handleResetPassword: (password: string, customer_id: string) => Promise<number>;
interface LoginResult {
    customer_id: number;
    username: string;
    phone_number: number;
    email: string;
}
export {};
