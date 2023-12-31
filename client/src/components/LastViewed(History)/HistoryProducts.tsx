import { useEffect, useState, useContext } from "react";
import tz from "moment-timezone";
import ProductCard from "../Result/ProductCard";
import Loader from "../Loader/Loader";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import CustomerContext from "../../context/CustomerProvider";

interface HistoryProductsProps {
  selected: string;
}

const timezone = tz.tz.guess();

const HistoryProducts = ({ selected }: HistoryProductsProps) => {
  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  const [products, setProducts] = useState<Array<object>>([]);
  const [status, setStatus] = useState<boolean>(false);

  const { customer } = useContext(CustomerContext);
  const customerId = customer.customer_id;

  useEffect(() => {
    // fetch products from selected date
    axiosPrivateCustomer
      .get(
        `/getLastViewed/?customerId=${customerId}&dateViewed=${selected}&timezone=${timezone}`
      )
      .then((response) => response.data)
      .then((data) => {
        setStatus(true);
        setProducts(data);
      })
      .catch((err: any) => {
        setStatus(false);
      });
  }, [selected]);

  const showProducts = () => {
    if (products.length === 0) {
      return (
        <div className="p-2 mx-2">
          {selected === "" ? (
            <h1>Select a date to view your history</h1>
          ) : (
            <h1>No items viewed on this date</h1>
          )}
        </div>
      );
    }

    return products.map((product: any, index: number) => {
      return <ProductCard product={product} key={index} />;
    });
  };

  return (
    <div className="flex justify-center items-center">
      {status ? (
        <div className="flex justify-center items-center flex-wrap">
          {showProducts()}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default HistoryProducts;
