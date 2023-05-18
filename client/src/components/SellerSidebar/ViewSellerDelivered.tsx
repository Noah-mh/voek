
interface Order {
  orders_id: number;
  customer_id: number;
  username: string;
  email: string;
  quantity: number;
  product_id: number;
  orders_product_id: number;
  variation_1?: string;
  variation2?: string;
  orders_date?: string;
  shipment_created?: string;
  shipment_delivered?: string;
  total_price: number;
  name: string;
}

interface Props {
  deliveredOrders: Order[];
}

const ViewSellerDelivered = ({ deliveredOrders }: Props) => {
  return (
    <div>ViewSellerDelivered</div>
  )
}

export default ViewSellerDelivered