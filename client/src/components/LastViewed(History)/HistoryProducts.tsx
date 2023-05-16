import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Loader from "../Loader/Loader";
import axios from "../../api/axios";

interface HistoryProductsProps {
  selected: string;
}

const HistoryProducts = ({ selected }: HistoryProductsProps) => {
  const [products, setProducts] = useState<Array<object>>([]);
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    // fetch products from selected date
    console.log("selected: ", selected);
    axios
      .post(
        `/getLastViewed`,
        JSON.stringify({ customerId: 1, dateViewed: selected }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
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
        <div className="p-2">
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
      {status ? <div>{showProducts()}</div> : <Loader />}
    </div>
  );
};

export default HistoryProducts;
