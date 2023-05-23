export declare const handleAddingReview: (product_id: number, customer_id: number, rating: number, comment: string, sku: string) => Promise<number>;
export declare const handleAddingReviewImages: (review_id: number, image_url: string) => Promise<number>;
export declare const handleDeleteReview: (review_id: number, sku: string) => Promise<number>;
