export declare const handleGetCustomerOrders: (customer_id: number) => Promise<Object[]>;
export declare const handleGetCustomerDeliveredOrders: (customer_id: number) => Promise<Object[]>;
export declare const handleGetCustomerReceivedOrders: (customer_id: number) => Promise<Object[]>;
export declare const handleOrderReceived: (orders_id: number, seller_id: number) => Promise<number>;