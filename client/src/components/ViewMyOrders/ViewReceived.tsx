import { cld } from "../../Cloudinary/Cloudinary";
import { AdvancedImage } from "@cloudinary/react";
import { Link } from 'react-router-dom';
import { useState } from "react";
import ModalComponent from "./ModelForRating";
import useCustomer from "../../hooks/UseCustomer";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
interface Product {
  description: string;
  name: string;
  price: number;
  product_id: number;
  variation_1?: string;
  variation_2?: string;
  quantity: number;
  sku: string,
  orders_date?: string;
  shipment_created?: string;
  shipment_delivered?: string;
  image_url?: string;
  orders_product_id?: number;
  seller_id: string;
  orders_id: string;
}

interface Props {
  receivedOrders: Product[]
}

const ViewReceived = ({ receivedOrders }: Props) => {
  const axiosPrivateCustomer = useAxiosPrivateCustomer();
  const { customer } = useCustomer();
  const customer_id = customer.customer_id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [order, setOrder] = useState<Product>({} as Product);

  // ...

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (rating: number, comment: string, image_url: string) => {

    axiosPrivateCustomer.post("/addReview", JSON.stringify({ customer_id, product_id: order.product_id, sku: order.sku, rating, comment }),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }).then((response) => {
        axiosPrivateCustomer.post("/addReviewImages", JSON.stringify({ review_id: response.data.response, image_url }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          })
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        setIsModalOpen(false);
      })

  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="mb-8 text-4xl font-bold">Received Orders</h1>
      {receivedOrders.map((order: Product) => (
        <div key={order.sku} className="mb-8 border border-gray-300 rounded p-4 w-4/5">
          <AdvancedImage cldImg={cld.image(order.image_url)} />
          <Link to={`/productDetailsWithReviews/${order.product_id}`} className="text-blue-500 hover:underline">
            {order.name}
          </Link>
          <p className="mb-2">{order.description}</p>
          <p>Price of Product: {order.price}</p>
          <p>Amount Bought: {order.quantity}</p>
          <h2 className="text-2xl">Total Price: {order.price * order.quantity}</h2>
          <div className="mt-4">
            <p className="font-bold">The Variation You Bought</p>
            <p>
              {order.variation_1 && order.variation_2
                ? `${order.variation_1} and ${order.variation_2}`
                : order.variation_1
                  ? order.variation_1
                  : order.variation_2
                    ? order.variation_2
                    : "No Variation"}
            </p>
            <h3 className="mt-2 text-lg">Order was received on {convertUtcToLocal(order.shipment_delivered!)}</h3>
          </div>
          <button
            onClick={() => {
              handleOpenModal()
              setOrder(order)
            }}
            className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Rate
          </button>
          <ModalComponent isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} />
        </div>
      ))}
    </div>

  )
}

export default ViewReceived;

function convertUtcToLocal(utcTime: string): string {
  // Convert UTC time to local time
  const localTime = new Date(utcTime);

  // Get the local date components
  const day = localTime.getDate();
  const month = localTime.getMonth() + 1; // Months are zero-based
  const year = localTime.getFullYear();

  // Format the local time as DD/MM/YYYY
  const formattedLocalTime = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

  return formattedLocalTime;
}

