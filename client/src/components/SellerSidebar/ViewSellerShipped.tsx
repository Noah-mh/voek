
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
}

interface Props {
  shippedOrders: Order[];
}

const ViewSellerShipped = ({ shippedOrders }: Props) => {
  return (
    <div>ViewSellerShipped</div>
  )
}

export default ViewSellerShipped