declare const config: {
    user: string | undefined;
    password: string | undefined;
    host: string | undefined;
    database: string | undefined;
    connectionLimit: string | undefined;
    accessTokenSecret: string | undefined;
    refreshTokenSecret: string | undefined;
    emailTokenSecret: string | undefined;
    telesignAPIKey: string | undefined;
    telesignCustomerId: string | undefined;
    sendInBlueAPIKey: string | undefined;
    signUpCustomerTokenSecret: string | undefined;
    signUpSellerTokenSecret: string | undefined;
    forgetPasswordCustomerTokenSecret: string | undefined;
    forgetPasswordSellerTokenSecret: string | undefined;
    paypalClientId: string | undefined;
    paypalClientSecret: string | undefined;
    ssl: {
        rejectUnauthorized: boolean;
    };
};
export default config;
