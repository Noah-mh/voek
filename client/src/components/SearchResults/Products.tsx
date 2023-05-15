import { useEffect, useState } from "react";
import Loader from "./Loader";
import ProductCard from "./ProductCard";
import axios from "../../api/axios";

interface ProductsProps {
  userInput: string | undefined;
}

const Products = ({ userInput }: ProductsProps) => {
  const [products, setProducts] = useState<Array<object>>([]);
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    console.log("userinput products:", userInput);
    axios
      .post(`/searchResult`, JSON.stringify({ input: userInput }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response: any) => response.data)
      .then((data: Array<object>) => {
        console.log("data: ", data);
        setStatus(true);
        setProducts(data);
      })
      .catch((err: any) => {
        setStatus(false);
      });
  }, [userInput]);

  return (
    <div>
      <div>
        {status ? (
          <div>
            {products.length > 0 ? (
              <div className="flex flex-wrap">
                {products.map((product: any) => {
                  return (
                    <div>
                      <ProductCard product={product} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center items-center">
                no products found for "{userInput}"
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
